import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../lib/dataService';
import { formatINR } from '../lib/currency';
import { SavingsGoalCard } from '../components/savings/SavingsGoalCard';
import { SavingsGoalModal } from '../components/savings/SavingsGoalModal';
import { SavingsMovementModal } from '../components/savings/SavingsMovementModal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { PlusIcon, RefreshIcon, TargetIcon } from '../components/ui/Icons';
export const SavingsPage = () => {
    const { user } = useAuth();
    const userId = user?.id || 'demo-user';
    const [goals, setGoals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // Modals
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
    const [goalToEdit, setGoalToEdit] = useState(null);
    const [goalToDelete, setGoalToDelete] = useState(null);
    const [goalForMovement, setGoalForMovement] = useState(null);
    const loadSavingsGoals = async () => {
        setIsLoading(true);
        try {
            const list = await dataService.getSavingsGoals(userId);
            setGoals(list);
        }
        catch (err) {
            console.warn('Failed to load savings goals:', err);
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        loadSavingsGoals();
    }, [userId]);
    const handleSaveGoal = async (values) => {
        if (goalToEdit) {
            // update
            await dataService.deleteSavingsGoal(userId, goalToEdit.id);
            await dataService.addSavingsGoal(userId, values);
        }
        else {
            await dataService.addSavingsGoal(userId, values);
        }
        await loadSavingsGoals();
    };
    const handleDeleteGoal = async () => {
        if (goalToDelete) {
            await dataService.deleteSavingsGoal(userId, goalToDelete.id);
            setGoalToDelete(null);
            await loadSavingsGoals();
        }
    };
    const handleRecordMovement = async (goalId, amount, type, note) => {
        await dataService.recordSavingsMovement(userId, goalId, amount, type, note);
        await loadSavingsGoals();
    };
    const totalTargetCapital = goals.reduce((sum, g) => sum + g.target_amount, 0);
    const totalSavedCapital = goals.reduce((sum, g) => sum + g.current_amount, 0);
    const overallFundedPct = totalTargetCapital > 0 ? Math.round((totalSavedCapital / totalTargetCapital) * 100) : 0;
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "editorial-masthead", children: [_jsx("div", { children: "FOLIO \u2116 18 \u2022 CAPITAL RESERVES & TARGET ACCUMULATION" }), _jsx("div", { className: "hidden md:block", children: "LEDGER PROTECTION: ATOMIC RPC PERSISTENCE" }), _jsx("div", { children: "FUTURE DISPATCH" })] }), _jsxs("div", { className: "flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b-2 border-ink-950 dark:border-zinc-700 pb-4", children: [_jsxs("div", { children: [_jsx("span", { className: "editorial-kicker", children: "CAPITAL FORMATION" }), _jsx("h2", { className: "editorial-headline text-2xl sm:text-3xl", children: "Capital Reserves & Savings Milestones" }), _jsx("p", { className: "text-xs font-mono text-ink-500 dark:text-zinc-400 mt-1", children: "Target capital accumulation with atomic contribution accounting" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { type: "button", onClick: loadSavingsGoals, className: "p-2 border-2 border-ink-950 dark:border-zinc-600 bg-white dark:bg-zinc-800 shadow-brutal-sm hover:bg-cream-200", title: "Refresh goals", children: _jsx(RefreshIcon, { className: `w-4 h-4 ${isLoading ? 'animate-spin' : ''}` }) }), _jsxs("button", { type: "button", onClick: () => {
                                    setGoalToEdit(null);
                                    setIsGoalModalOpen(true);
                                }, className: "brutal-btn-primary", children: [_jsx(PlusIcon, { className: "w-4 h-4 mr-1.5" }), _jsx("span", { children: "New Savings Target" })] })] })] }), _jsxs("div", { className: "brutal-card p-0 grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x-2 divide-ink-950 dark:divide-zinc-700 bg-cream-50 dark:bg-brutal-darkCard", children: [_jsxs("div", { className: "p-4", children: [_jsx("span", { className: "text-[10px] font-mono font-bold uppercase text-ink-500 dark:text-zinc-400 block mb-1", children: "Capital Accumulated" }), _jsx("span", { className: "text-xl font-black font-mono tabular-nums text-cobalt dark:text-blue-400", children: formatINR(totalSavedCapital) })] }), _jsxs("div", { className: "p-4", children: [_jsx("span", { className: "text-[10px] font-mono font-bold uppercase text-ink-500 dark:text-zinc-400 block mb-1", children: "Milestone Target" }), _jsx("span", { className: "text-xl font-black font-mono tabular-nums text-ink-950 dark:text-zinc-100", children: formatINR(totalTargetCapital) })] }), _jsxs("div", { className: "p-4", children: [_jsx("span", { className: "text-[10px] font-mono font-bold uppercase text-ink-500 dark:text-zinc-400 block mb-1", children: "Capital Gap Remaining" }), _jsx("span", { className: "text-xl font-black font-mono tabular-nums text-ink-950 dark:text-zinc-100", children: formatINR(Math.max(0, totalTargetCapital - totalSavedCapital)) })] }), _jsxs("div", { className: "p-4 bg-cream-100 dark:bg-zinc-800/50", children: [_jsx("span", { className: "text-[10px] font-mono font-bold uppercase text-ink-500 dark:text-zinc-400 block mb-1", children: "Portfolio Funded Ratio" }), _jsxs("span", { className: "text-xl font-black font-mono tabular-nums text-brutal-green", children: [overallFundedPct, "%"] })] })] }), goals.length === 0 ? (_jsx(EmptyState, { title: "No Capital Targets Established", description: "Provision an emergency liquid reserve, vehicle fund, or house down-payment target.", actionLabel: "Create Savings Target", onAction: () => {
                    setGoalToEdit(null);
                    setIsGoalModalOpen(true);
                }, icon: _jsx(TargetIcon, { className: "w-8 h-8" }) })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5", children: goals.map((goal) => (_jsx(SavingsGoalCard, { goal: goal, onEdit: (target) => {
                        setGoalToEdit(target);
                        setIsGoalModalOpen(true);
                    }, onDelete: (target) => setGoalToDelete(target), onMovement: (target) => setGoalForMovement(target) }, goal.id))) })), _jsx(SavingsGoalModal, { isOpen: isGoalModalOpen, onClose: () => {
                    setIsGoalModalOpen(false);
                    setGoalToEdit(null);
                }, onSubmit: handleSaveGoal, goalToEdit: goalToEdit }), _jsx(SavingsMovementModal, { isOpen: Boolean(goalForMovement), onClose: () => setGoalForMovement(null), goal: goalForMovement, onConfirm: handleRecordMovement }), _jsx(ConfirmDialog, { isOpen: Boolean(goalToDelete), onClose: () => setGoalToDelete(null), onConfirm: handleDeleteGoal, title: "Delete Savings Target", message: `Are you sure you want to permanently delete goal "${goalToDelete?.name}"? Saved capital figures will be removed from your portfolio overview.`, confirmLabel: "Confirm Delete" })] }));
};
