import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../lib/dataService';
import { getDateRangeFromPreset } from '../lib/date';
import { formatINR, safeSubtract } from '../lib/currency';
import { exportTransactionsToCSV, exportReportToPDF } from '../lib/export';
import { DateRangeSelector } from '../components/dashboard/DateRangeSelector';
import { CategoryPieChart } from '../components/dashboard/CategoryPieChart';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, } from 'recharts';
import { DownloadIcon, RefreshIcon, TrendingUpIcon } from '../components/ui/Icons';
import { useTheme } from '../context/ThemeContext';
export const ReportsPage = () => {
    const { user } = useAuth();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const userId = user?.id || 'demo-user';
    const [dateRange, setDateRange] = useState(() => getDateRangeFromPreset('this_month'));
    const [transactions, setTransactions] = useState([]);
    const [allTransactions, setAllTransactions] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const loadReportData = async () => {
        setIsLoading(true);
        try {
            const [cats, pms, filteredTxRes, allTxRes, bList] = await Promise.all([
                dataService.getCategories(userId),
                dataService.getPaymentMethods(userId),
                dataService.getTransactions(userId, {
                    search: '',
                    type: 'all',
                    categoryId: 'all',
                    paymentMethodId: 'all',
                    minAmount: null,
                    maxAmount: null,
                    dateRange,
                    sortField: 'date',
                    sortOrder: 'asc',
                    page: 1,
                    pageSize: 5000,
                }),
                dataService.getTransactions(userId),
                dataService.getBudgets(userId, dateRange),
            ]);
            setCategories(cats);
            setPaymentMethods(pms);
            setTransactions(filteredTxRes.data);
            setAllTransactions(allTxRes.data);
            setBudgets(bList);
        }
        catch (err) {
            console.warn('Failed to load report data:', err);
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        loadReportData();
    }, [userId, dateRange]);
    // Aggregate Figures for Selected Period
    const totalIncome = transactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    const netCashFlow = safeSubtract(totalIncome, totalExpense);
    // Category Breakdown
    const categoryMap = {};
    transactions
        .filter((t) => t.type === 'expense')
        .forEach((t) => {
        const name = t.category?.name || 'Uncategorized';
        if (!categoryMap[name]) {
            categoryMap[name] = { name, amount: 0, color: t.category?.color };
        }
        categoryMap[name].amount += t.amount;
    });
    const categorySpending = Object.values(categoryMap)
        .map((c) => ({
        category: c.name,
        amount: c.amount,
        percentage: totalExpense > 0 ? Math.round((c.amount / totalExpense) * 100) : 0,
        color: c.color,
    }))
        .sort((a, b) => b.amount - a.amount);
    // Payment Method Breakdown
    const methodMap = {};
    transactions
        .filter((t) => t.type === 'expense')
        .forEach((t) => {
        const pmName = t.payment_method?.name || 'Cash';
        methodMap[pmName] = (methodMap[pmName] || 0) + t.amount;
    });
    // Cumulative Spending Trend over Selected Period
    const cumulativeSpendingMap = {};
    transactions
        .filter((t) => t.type === 'expense')
        .forEach((t) => {
        cumulativeSpendingMap[t.date] = (cumulativeSpendingMap[t.date] || 0) + t.amount;
    });
    const datesSorted = Object.keys(cumulativeSpendingMap).sort();
    let runningTotal = 0;
    const spendingTrendData = datesSorted.map((d) => {
        runningTotal += cumulativeSpendingMap[d];
        return {
            date: d.slice(5),
            spent: runningTotal,
        };
    });
    // Export handlers
    const handleExportCSV = () => {
        exportTransactionsToCSV(transactions, `ledger_report_${dateRange.preset}`);
    };
    const handleExportPDF = () => {
        exportReportToPDF({
            title: 'Periodic Accounting & Financial Audit Report',
            periodLabel: dateRange.label,
            totalIncome,
            totalExpense,
            netCashFlow,
            categorySpending,
            transactions,
        });
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "editorial-masthead", children: [_jsx("div", { children: "FOLIO \u2116 44 \u2022 AUDIT INTELLIGENCE & FISCAL DISPATCH" }), _jsx("div", { className: "hidden md:block", children: "STANDARD: FORMULA-INJECTION PROTECTED CSV / VECTOR PDF" }), _jsx("div", { children: "REPORTING BUREAU" })] }), _jsxs("div", { className: "flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-[#E6E1D8] dark:border-[#222733] pb-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl sm:text-2xl font-serif font-bold text-[#121826] dark:text-zinc-100 tracking-tight", children: "Financial Intelligence & Reports" }), _jsx("p", { className: "text-xs font-sans text-zinc-500 dark:text-zinc-400 mt-0.5", children: "Exportable fiscal statements and multi-dimensional expenditure metrics" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { type: "button", onClick: loadReportData, className: "p-2 rounded-lg border border-[#E0DBD0] dark:border-zinc-700 bg-white dark:bg-[#181C26] hover:bg-[#F2EFE8] text-zinc-700 dark:text-zinc-200 shadow-xs", title: "Refresh", children: _jsx(RefreshIcon, { className: `w-4 h-4 ${isLoading ? 'animate-spin' : ''}` }) }), _jsxs("button", { type: "button", onClick: handleExportCSV, disabled: transactions.length === 0, className: "inline-flex items-center justify-center font-sans font-semibold text-xs px-3.5 py-2 bg-white dark:bg-[#1A1F29] text-[#121826] dark:text-zinc-200 border border-[#DDD7CE] dark:border-[#2D3442] rounded-lg shadow-sm hover:bg-[#F2EFE8] dark:hover:bg-[#222936] transition-all disabled:opacity-50", title: "Export CSV", children: [_jsx(DownloadIcon, { className: "w-3.5 h-3.5 mr-1.5" }), _jsx("span", { children: "CSV Export" })] }), _jsxs("button", { type: "button", onClick: handleExportPDF, disabled: transactions.length === 0, className: "inline-flex items-center justify-center font-sans font-semibold text-xs px-3.5 py-2 bg-[#1E40AF] text-white rounded-lg shadow-sm hover:bg-[#1D3694] transition-all disabled:opacity-50", title: "Generate Audit PDF", children: [_jsx(DownloadIcon, { className: "w-3.5 h-3.5 mr-1.5" }), _jsx("span", { children: "Generate PDF" })] })] })] }), _jsx(DateRangeSelector, { currentRange: dateRange, onChange: setDateRange }), _jsxs("div", { className: "rounded-xl border border-[#E6E1D8] dark:border-[#222733] bg-[#FCFAF6] dark:bg-[#171A21] shadow-xs grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E6E1D8] dark:divide-[#222733] overflow-hidden", children: [_jsxs("div", { className: "p-4", children: [_jsx("span", { className: "text-[11px] font-sans font-medium uppercase text-zinc-500 dark:text-zinc-400 block mb-1", children: "Total Revenue Inflow" }), _jsx("span", { className: "text-xl font-bold font-serif tabular-nums text-[#16A34A]", children: formatINR(totalIncome) })] }), _jsxs("div", { className: "p-4", children: [_jsx("span", { className: "text-[11px] font-sans font-medium uppercase text-zinc-500 dark:text-zinc-400 block mb-1", children: "Total Outflow Deductions" }), _jsx("span", { className: "text-xl font-bold font-serif tabular-nums text-[#DC2626]", children: formatINR(totalExpense) })] }), _jsxs("div", { className: "p-4", children: [_jsx("span", { className: "text-[11px] font-sans font-medium uppercase text-zinc-500 dark:text-zinc-400 block mb-1", children: "Net Surplus / Deficit" }), _jsx("span", { className: `text-xl font-bold font-serif tabular-nums ${netCashFlow >= 0 ? 'text-[#16A34A]' : 'text-[#DC2626]'}`, children: formatINR(netCashFlow) })] }), _jsxs("div", { className: "p-4 bg-[#F8F5EE] dark:bg-[#141720]", children: [_jsx("span", { className: "text-[11px] font-sans font-medium uppercase text-zinc-500 dark:text-zinc-400 block mb-1", children: "Capital Retention Ratio" }), _jsxs("span", { className: "text-xl font-bold font-serif tabular-nums text-zinc-900 dark:text-zinc-100", children: [totalIncome > 0 ? Math.round((netCashFlow / totalIncome) * 100) : 0, "%"] })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-6", children: [_jsxs("div", { className: "lg:col-span-7 bg-[#FCFAF6] dark:bg-[#171A21] p-5 rounded-xl border border-[#E6E1D8] dark:border-[#222733] shadow-xs", children: [_jsx("div", { className: "flex items-center justify-between mb-4 border-b border-[#EFECE5] dark:border-[#222733] pb-2.5", children: _jsxs("div", { children: [_jsxs("h3", { className: "text-xs font-sans font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5", children: [_jsx(TrendingUpIcon, { className: "w-3.5 h-3.5 text-[#1E40AF]" }), "Cumulative Expense Run-Rate"] }), _jsxs("p", { className: "text-[11px] font-sans text-zinc-500 dark:text-zinc-400", children: ["Daily cumulative capital burn during ", dateRange.label] })] }) }), _jsx("div", { className: "h-64", children: spendingTrendData.length === 0 ? (_jsx("div", { className: "h-full flex items-center justify-center text-xs font-sans text-zinc-400", children: "No expense data recorded in this period" })) : (_jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(AreaChart, { data: spendingTrendData, margin: { top: 10, right: 10, left: -10, bottom: 0 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: isDark ? '#262C38' : '#EDE8DF', vertical: false }), _jsx(XAxis, { dataKey: "date", stroke: isDark ? '#8A92A6' : '#6B7280', fontSize: 10, tickLine: false, fontFamily: "sans-serif" }), _jsx(YAxis, { stroke: isDark ? '#8A92A6' : '#6B7280', fontSize: 10, tickLine: false, tickFormatter: (val) => `₹${val >= 1000 ? `${Math.round(val / 1000)}k` : val}`, fontFamily: "sans-serif" }), _jsx(Tooltip
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            , { 
                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                formatter: (val) => [formatINR(Number(val)), 'Cumulative Spend'], contentStyle: {
                                                    backgroundColor: isDark ? '#1A1E29' : '#FFFFFF',
                                                    border: `1px solid ${isDark ? '#2E3545' : '#E5E0D6'}`,
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                                                    fontFamily: 'sans-serif',
                                                    fontSize: '12px',
                                                } }), _jsx(Area, { type: "monotone", dataKey: "spent", stroke: "#1E40AF", strokeWidth: 2, fill: "#1E40AF", fillOpacity: 0.12 })] }) })) })] }), _jsxs("div", { className: "lg:col-span-5 bg-[#FCFAF6] dark:bg-[#171A21] p-5 rounded-xl border border-[#E6E1D8] dark:border-[#222733] shadow-xs", children: [_jsx("div", { className: "flex items-center justify-between mb-4 border-b border-[#EFECE5] dark:border-[#222733] pb-2.5", children: _jsxs("div", { children: [_jsx("h3", { className: "text-xs font-sans font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100", children: "Category Distribution" }), _jsxs("p", { className: "text-[11px] font-sans text-zinc-500 dark:text-zinc-400", children: ["Outflow allocation for ", dateRange.label] })] }) }), _jsx(CategoryPieChart, { data: categorySpending })] })] }), _jsxs("div", { className: "bg-[#FCFAF6] dark:bg-[#171A21] p-5 rounded-xl border border-[#E6E1D8] dark:border-[#222733] shadow-xs", children: [_jsx("h3", { className: "text-xs font-sans font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-3 border-b border-[#EFECE5] dark:border-[#222733] pb-2.5", children: "Settlement Instruments & Payment Channel Breakdown" }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3", children: Object.entries(methodMap).map(([method, amount]) => (_jsxs("div", { className: "p-3 rounded-lg bg-[#FAF8F4] dark:bg-[#1C202B] border border-[#EBE6DD] dark:border-[#262D3D]", children: [_jsx("span", { className: "text-[10px] font-sans font-medium uppercase text-zinc-500 dark:text-zinc-400 block mb-1 truncate", children: method }), _jsx("span", { className: "text-sm font-bold font-serif tabular-nums text-zinc-900 dark:text-zinc-100", children: formatINR(amount) }), _jsx("span", { className: "block text-[10px] font-sans text-zinc-400 mt-0.5", children: totalExpense > 0 ? `${Math.round((amount / totalExpense) * 100)}% share` : '0%' })] }, method))) })] })] }));
};
