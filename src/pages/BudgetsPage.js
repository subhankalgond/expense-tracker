import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../lib/dataService';
import { formatINR } from '../lib/currency';
import { BudgetCard } from '../components/budgets/BudgetCard';
import { BudgetModal } from '../components/budgets/BudgetModal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { PlusIcon, RefreshIcon, AlertTriangleIcon } from '../components/ui/Icons';
export const BudgetsPage = () => {
    const { user } = useAuth();
    const userId = user?.id || 'demo-user';
    const [budgets, setBudgets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [budgetToEdit, setBudgetToEdit] = useState(null);
    const [budgetToDelete, setBudgetToDelete] = useState(null);
    const loadBudgets = async () => {
        setIsLoading(true);
        try {
            const [cats, bList] = await Promise.all([
                dataService.getCategories(userId),
                dataService.getBudgets(userId),
            ]);
            setCategories(cats);
            setBudgets(bList);
        }
        catch (err) {
            console.warn('Failed to load budgets:', err);
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        loadBudgets();
    }, [userId]);
    const handleSaveBudget = async (values) => {
        if (budgetToEdit) {
            // update
            await dataService.deleteBudget(userId, budgetToEdit.id);
            await dataService.addBudget(userId, values);
        }
        else {
            await dataService.addBudget(userId, values);
        }
        await loadBudgets();
    };
    const handleDeleteBudget = async () => {
        if (budgetToDelete) {
            await dataService.deleteBudget(userId, budgetToDelete.id);
            setBudgetToDelete(null);
            await loadBudgets();
        }
    };
    // Overall calculations across all active budgets
    const totalBudgetLimit = budgets.reduce((sum, b) => sum + b.limit_amount, 0);
    const totalBudgetSpent = budgets.reduce((sum, b) => sum + (b.spent_amount || 0), 0);
    const exceededCount = budgets.filter((b) => (b.spent_amount || 0) > b.limit_amount).length;
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "editorial-masthead", children: [_jsx("div", { children: "FOLIO \u2116 12 \u2022 APPROPRIATIONS & BUDGETARY CEILINGS" }), _jsx("div", { className: "hidden md:block", children: "MONITORING CYCLE: MONTHLY RUN-RATE" }), _jsx("div", { children: "DISCIPLINE DISPATCH" })] }), _jsxs("div", { className: "flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b-2 border-ink-950 dark:border-zinc-700 pb-4", children: [_jsxs("div", { children: [_jsx("span", { className: "editorial-kicker", children: "CONTROL MECHANISMS" }), _jsx("h2", { className: "editorial-headline text-2xl sm:text-3xl", children: "Category Spending Limits & Capital Burn" }), _jsx("p", { className: "text-xs font-mono text-ink-500 dark:text-zinc-400 mt-1", children: "Automated threshold monitoring against actual transaction records" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { type: "button", onClick: loadBudgets, className: "p-2 border-2 border-ink-950 dark:border-zinc-600 bg-white dark:bg-zinc-800 shadow-brutal-sm hover:bg-cream-200", title: "Refresh budget figures", children: _jsx(RefreshIcon, { className: `w-4 h-4 ${isLoading ? 'animate-spin' : ''}` }) }), _jsxs("button", { type: "button", onClick: () => {
                                    setBudgetToEdit(null);
                                    setIsModalOpen(true);
                                }, className: "brutal-btn-primary", children: [_jsx(PlusIcon, { className: "w-4 h-4 mr-1.5" }), _jsx("span", { children: "Create Budget" })] })] })] }), _jsxs("div", { className: "brutal-card p-0 grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x-2 divide-ink-950 dark:divide-zinc-700 bg-cream-50 dark:bg-brutal-darkCard", children: [_jsxs("div", { className: "p-4", children: [_jsx("span", { className: "text-[10px] font-mono font-bold uppercase text-ink-500 dark:text-zinc-400 block mb-1", children: "Budgeted Ceiling" }), _jsx("span", { className: "text-xl font-black font-mono tabular-nums text-ink-950 dark:text-zinc-100", children: formatINR(totalBudgetLimit) })] }), _jsxs("div", { className: "p-4", children: [_jsx("span", { className: "text-[10px] font-mono font-bold uppercase text-ink-500 dark:text-zinc-400 block mb-1", children: "Current Spend" }), _jsx("span", { className: "text-xl font-black font-mono tabular-nums text-ink-950 dark:text-zinc-100", children: formatINR(totalBudgetSpent) })] }), _jsxs("div", { className: "p-4", children: [_jsx("span", { className: "text-[10px] font-mono font-bold uppercase text-ink-500 dark:text-zinc-400 block mb-1", children: "Remaining Buffer" }), _jsx("span", { className: "text-xl font-black font-mono tabular-nums text-cobalt dark:text-blue-400", children: formatINR(Math.max(0, totalBudgetLimit - totalBudgetSpent)) })] }), _jsxs("div", { className: "p-4 bg-cream-100 dark:bg-zinc-800/50", children: [_jsx("span", { className: "text-[10px] font-mono font-bold uppercase text-ink-500 dark:text-zinc-400 block mb-1", children: "Threshold Status" }), _jsx("div", { className: "flex items-center gap-1.5 mt-1", children: exceededCount > 0 ? (_jsxs("span", { className: "text-xs font-bold font-mono text-brutal-red flex items-center gap-1", children: [_jsx(AlertTriangleIcon, { className: "w-3.5 h-3.5" }), exceededCount, " LIMITS EXCEEDED"] })) : (_jsx("span", { className: "text-xs font-bold font-mono text-brutal-green", children: "ALL BUDGETS WITHIN BOUNDS" })) })] })] }), budgets.length === 0 ? (_jsx(EmptyState, { title: "No Budgets Active", description: "Establish monthly spending caps for groceries, utilities, or entertainment to automate alert thresholds.", actionLabel: "Create Budget", onAction: () => {
                    setBudgetToEdit(null);
                    setIsModalOpen(true);
                } })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5", children: budgets.map((b) => (_jsx(BudgetCard, { budget: b, onEdit: (target) => {
                        setBudgetToEdit(target);
                        setIsModalOpen(true);
                    }, onDelete: (target) => setBudgetToDelete(target) }, b.id))) })), _jsx(BudgetModal, { isOpen: isModalOpen, onClose: () => {
                    setIsModalOpen(false);
                    setBudgetToEdit(null);
                }, onSubmit: handleSaveBudget, budgetToEdit: budgetToEdit, categories: categories }), _jsx(ConfirmDialog, { isOpen: Boolean(budgetToDelete), onClose: () => setBudgetToDelete(null), onConfirm: handleDeleteBudget, title: "Delete Budget Target", message: `Are you sure you want to delete budget "${budgetToDelete?.name}"? Historical transaction records will remain untouched.`, confirmLabel: "Delete Budget" })] }));
};
