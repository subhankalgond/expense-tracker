import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../lib/dataService';
import { getDateRangeFromPreset } from '../lib/date';
import { safeSubtract } from '../lib/currency';
import { MetricCard } from '../components/dashboard/MetricCard';
import { DateRangeSelector } from '../components/dashboard/DateRangeSelector';
import { IncomeExpenseChart } from '../components/dashboard/IncomeExpenseChart';
import { CategoryPieChart } from '../components/dashboard/CategoryPieChart';
import { BudgetOverviewWidget } from '../components/dashboard/BudgetOverviewWidget';
import { UpcomingBillsWidget } from '../components/dashboard/UpcomingBillsWidget';
import { SavingsOverviewWidget } from '../components/dashboard/SavingsOverviewWidget';
import { InsightsOverviewWidget } from '../components/dashboard/InsightsOverviewWidget';
import { RecentTransactionsWidget } from '../components/dashboard/RecentTransactionsWidget';
import { TransactionModal } from '../components/transactions/TransactionModal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { OnboardingModal } from '../components/onboarding/OnboardingModal';
import { PlusIcon, RefreshIcon } from '../components/ui/Icons';
export const DashboardPage = () => {
    const { user, profile, updateProfileState } = useAuth();
    const [dateRange, setDateRange] = useState(() => getDateRangeFromPreset('this_month'));
    // Data states
    const [allTransactions, setAllTransactions] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [savingsGoals, setSavingsGoals] = useState([]);
    const [recurring, setRecurring] = useState([]);
    const [categories, setCategories] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // Modal states
    const [isTxModalOpen, setIsTxModalOpen] = useState(false);
    const [txToEdit, setTxToEdit] = useState(null);
    const [txToDelete, setTxToDelete] = useState(null);
    const [modalInitialType, setModalInitialType] = useState('expense');
    const userId = user?.id || 'demo-user';
    // Load all data
    const loadDashboardData = async () => {
        setIsLoading(true);
        try {
            const [cats, pms, allTxRes, bList, sList, rList] = await Promise.all([
                dataService.getCategories(userId),
                dataService.getPaymentMethods(userId),
                dataService.getTransactions(userId),
                dataService.getBudgets(userId, dateRange),
                dataService.getSavingsGoals(userId),
                dataService.getRecurringTransactions(userId),
            ]);
            setCategories(cats);
            setPaymentMethods(pms);
            setAllTransactions(allTxRes.data);
            setBudgets(bList);
            setSavingsGoals(sList);
            setRecurring(rList);
        }
        catch (err) {
            console.warn('Failed to load dashboard data:', err);
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        loadDashboardData();
    }, [userId, dateRange]);
    // Aggregate Metrics for Selected Period
    const periodTransactions = useMemo(() => {
        return allTransactions.filter((t) => t.date >= dateRange.startDate && t.date <= dateRange.endDate);
    }, [allTransactions, dateRange]);
    const periodIncome = useMemo(() => {
        return periodTransactions
            .filter((t) => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
    }, [periodTransactions]);
    const periodExpense = useMemo(() => {
        return periodTransactions
            .filter((t) => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
    }, [periodTransactions]);
    const netCashFlow = safeSubtract(periodIncome, periodExpense);
    // Lifetime Balance: Opening Balance + All Lifetime Income - All Lifetime Expense
    const openingBalance = profile?.opening_balance || 0;
    const lifetimeIncome = useMemo(() => {
        return allTransactions
            .filter((t) => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
    }, [allTransactions]);
    const lifetimeExpense = useMemo(() => {
        return allTransactions
            .filter((t) => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
    }, [allTransactions]);
    const availableBalance = openingBalance + lifetimeIncome - lifetimeExpense;
    // Real period comparisons when sufficient data exists
    const { incomeComparisonText, incomeBadgeType, expenseComparisonText, expenseBadgeType } = useMemo(() => {
        const currentStart = new Date(dateRange.startDate);
        const currentEnd = new Date(dateRange.endDate);
        const durationMs = Math.max(86400000, currentEnd.getTime() - currentStart.getTime());
        const prevEnd = new Date(currentStart.getTime() - 86400000);
        const prevStart = new Date(prevEnd.getTime() - durationMs);
        const prevStartStr = prevStart.toISOString().split('T')[0];
        const prevEndStr = prevEnd.toISOString().split('T')[0];
        const prevTx = allTransactions.filter((t) => t.date >= prevStartStr && t.date <= prevEndStr);
        const prevInc = prevTx.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const prevExp = prevTx.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        let incText;
        let incBadge = 'neutral';
        if (prevInc > 0) {
            const diff = Math.round(((periodIncome - prevInc) / prevInc) * 100);
            incText = `${diff >= 0 ? '+' : ''}${diff}% vs prev period`;
            incBadge = diff >= 0 ? 'success' : 'danger';
        }
        let expText;
        let expBadge = 'neutral';
        if (prevExp > 0) {
            const diff = Math.round(((periodExpense - prevExp) / prevExp) * 100);
            expText = `${diff >= 0 ? '+' : ''}${diff}% vs prev period`;
            expBadge = diff <= 0 ? 'success' : 'danger';
        }
        return {
            incomeComparisonText: incText,
            incomeBadgeType: incBadge,
            expenseComparisonText: expText,
            expenseBadgeType: expBadge,
        };
    }, [allTransactions, dateRange, periodIncome, periodExpense]);
    // Category breakdown for donut chart
    const categorySpendingList = useMemo(() => {
        const map = {};
        periodTransactions
            .filter((t) => t.type === 'expense')
            .forEach((t) => {
            const catName = t.category?.name || 'Uncategorized';
            if (!map[catName]) {
                map[catName] = {
                    name: catName,
                    amount: 0,
                    color: t.category?.color,
                };
            }
            map[catName].amount += t.amount;
        });
        return Object.values(map)
            .map((c) => ({
            category: c.name,
            amount: c.amount,
            percentage: periodExpense > 0 ? Math.round((c.amount / periodExpense) * 100) : 0,
            color: c.color,
        }))
            .sort((a, b) => b.amount - a.amount);
    }, [periodTransactions, periodExpense]);
    // Monthly trends for bar chart (last 6 months)
    const monthlyCashFlow = useMemo(() => {
        const map = {};
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            const label = `${months[d.getMonth()]} ${String(d.getFullYear()).slice(-2)}`;
            map[key] = { month: label, income: 0, expense: 0 };
        }
        allTransactions.forEach((t) => {
            const key = t.date.slice(0, 7);
            if (map[key]) {
                if (t.type === 'income')
                    map[key].income += t.amount;
                if (t.type === 'expense')
                    map[key].expense += t.amount;
            }
        });
        return Object.values(map);
    }, [allTransactions]);
    // Transaction Handlers
    const handleSaveTransaction = async (values) => {
        if (txToEdit) {
            await dataService.updateTransaction(userId, txToEdit.id, values);
        }
        else {
            await dataService.addTransaction(userId, values);
        }
        await loadDashboardData();
    };
    const handleDeleteTransaction = async () => {
        if (txToDelete) {
            await dataService.deleteTransaction(userId, txToDelete.id);
            setTxToDelete(null);
            await loadDashboardData();
        }
    };
    const handleCompleteOnboarding = async (initialBalance) => {
        await updateProfileState({
            opening_balance: initialBalance,
            has_completed_onboarding: true,
        });
        await loadDashboardData();
    };
    const openAddIncome = () => {
        setTxToEdit(null);
        setModalInitialType('income');
        setIsTxModalOpen(true);
    };
    const openAddExpense = () => {
        setTxToEdit(null);
        setModalInitialType('expense');
        setIsTxModalOpen(true);
    };
    return (_jsxs("div", { className: "space-y-6", children: [profile && !profile.has_completed_onboarding && (_jsx(OnboardingModal, { isOpen: true, onComplete: handleCompleteOnboarding, userName: profile.full_name || 'User' })), _jsxs("div", { className: "flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-1 border-b border-[#E6E1D8] dark:border-[#222733]", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl sm:text-2xl font-serif font-bold text-[#121826] dark:text-zinc-100 tracking-tight", children: "Financial Overview" }), _jsx("p", { className: "text-xs font-sans text-zinc-500 dark:text-zinc-400 mt-0.5", children: "Real-time cash flow, category budgets, and savings tracking" })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-2.5", children: [_jsx(DateRangeSelector, { currentRange: dateRange, onChange: setDateRange }), _jsx("button", { type: "button", onClick: loadDashboardData, "aria-label": "Refresh dashboard metrics", className: "p-2 rounded-lg border border-[#E0DBD0] dark:border-zinc-700 bg-white dark:bg-[#181C26] text-zinc-700 dark:text-zinc-200 hover:bg-[#F2EFE8] dark:hover:bg-[#222838] shadow-xs transition-colors", title: "Refresh Ledger", children: _jsx(RefreshIcon, { className: `w-4 h-4 ${isLoading ? 'animate-spin' : ''}` }) }), _jsxs("button", { type: "button", onClick: openAddIncome, className: "inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-sans font-semibold bg-[#16A34A] hover:bg-emerald-700 text-white shadow-xs transition-colors", children: [_jsx(PlusIcon, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Add Income" })] }), _jsxs("button", { type: "button", onClick: openAddExpense, className: "inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-sans font-semibold bg-[#DC2626] hover:bg-red-700 text-white shadow-xs transition-colors", children: [_jsx(PlusIcon, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Add Expense" })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5", children: [_jsx(MetricCard, { label: "Available Balance", amount: availableBalance, type: "balance", subtext: `Opening balance: ₹${openingBalance.toLocaleString('en-IN')}` }), _jsx(MetricCard, { label: `Total Income (${dateRange.label})`, amount: periodIncome, type: "income", trendText: incomeComparisonText, badgeType: incomeBadgeType, subtext: `${periodTransactions.filter((t) => t.type === 'income').length} income records this cycle` }), _jsx(MetricCard, { label: `Total Expenses (${dateRange.label})`, amount: periodExpense, type: "expense", trendText: expenseComparisonText, badgeType: expenseBadgeType, subtext: `${periodTransactions.filter((t) => t.type === 'expense').length} expense deductions this cycle` }), _jsx(MetricCard, { label: "Net Cash Flow", amount: netCashFlow, type: "net", trendText: periodIncome > 0 ? `${Math.round((netCashFlow / periodIncome) * 100)}% margin` : undefined, subtext: netCashFlow >= 0 ? 'Operating cash surplus' : 'Operating cash deficit' })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-6 items-start", children: [_jsxs("div", { className: "lg:col-span-8 space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: [_jsxs("div", { className: "bg-[#FCFAF6] dark:bg-[#171A21] p-5 rounded-xl border border-[#E6E1D8] dark:border-[#222733] shadow-xs", children: [_jsx("div", { className: "flex items-center justify-between mb-4 border-b border-[#EFECE5] dark:border-[#222733] pb-2.5", children: _jsxs("div", { children: [_jsx("h3", { className: "text-xs font-sans font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100", children: "Income vs Expenses" }), _jsx("p", { className: "text-[11px] font-sans text-zinc-500 dark:text-zinc-400", children: "6-month comparative cash flow" })] }) }), _jsx(IncomeExpenseChart, { data: monthlyCashFlow })] }), _jsxs("div", { className: "bg-[#FCFAF6] dark:bg-[#171A21] p-5 rounded-xl border border-[#E6E1D8] dark:border-[#222733] shadow-xs", children: [_jsx("div", { className: "flex items-center justify-between mb-4 border-b border-[#EFECE5] dark:border-[#222733] pb-2.5", children: _jsxs("div", { children: [_jsx("h3", { className: "text-xs font-sans font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100", children: "Spending by Category" }), _jsxs("p", { className: "text-[11px] font-sans text-zinc-500 dark:text-zinc-400", children: ["Distribution for ", dateRange.label] })] }) }), _jsx(CategoryPieChart, { data: categorySpendingList })] })] }), _jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-12 gap-5 items-start", children: [_jsx("div", { className: "xl:col-span-7", children: _jsx(RecentTransactionsWidget, { transactions: periodTransactions, categories: categories, onEdit: (tx) => {
                                                setTxToEdit(tx);
                                                setModalInitialType(tx.type);
                                                setIsTxModalOpen(true);
                                            }, onDelete: (tx) => setTxToDelete(tx), onAddIncome: openAddIncome, onAddExpense: openAddExpense }) }), _jsx("div", { className: "xl:col-span-5", children: _jsx(BudgetOverviewWidget, { budgets: budgets }) })] })] }), _jsxs("div", { className: "lg:col-span-4 space-y-6", children: [_jsx(InsightsOverviewWidget, { periodLabel: dateRange.label, totalIncome: periodIncome, totalExpense: periodExpense, netCashFlow: netCashFlow, categorySpending: categorySpendingList }), _jsx(SavingsOverviewWidget, { savingsGoals: savingsGoals }), _jsx(UpcomingBillsWidget, { recurring: recurring })] })] }), _jsx(TransactionModal, { isOpen: isTxModalOpen, onClose: () => {
                    setIsTxModalOpen(false);
                    setTxToEdit(null);
                }, onSubmit: handleSaveTransaction, transactionToEdit: txToEdit, initialType: modalInitialType, categories: categories, paymentMethods: paymentMethods }), _jsx(ConfirmDialog, { isOpen: Boolean(txToDelete), onClose: () => setTxToDelete(null), onConfirm: handleDeleteTransaction, title: "Delete Transaction", message: `Are you sure you want to permanently delete transaction "${txToDelete?.description}" for ₹${txToDelete?.amount}? This action immediately updates your calculations.`, confirmLabel: "Delete Transaction" })] }));
};
