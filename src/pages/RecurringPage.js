import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../lib/dataService';
import { formatINR } from '../lib/currency';
import { formatDisplayDate } from '../lib/date';
import { RecurringModal } from '../components/recurring/RecurringModal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { Badge } from '../components/ui/Badge';
import { PlusIcon, RepeatIcon, EditIcon, TrashIcon, CheckIcon, AlertTriangleIcon, } from '../components/ui/Icons';
export const RecurringPage = () => {
    const { user } = useAuth();
    const userId = user?.id || 'demo-user';
    const [recurring, setRecurring] = useState([]);
    const [categories, setCategories] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processNotification, setProcessNotification] = useState(null);
    // Modals
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [recurringToEdit, setRecurringToEdit] = useState(null);
    const [recurringToDelete, setRecurringToDelete] = useState(null);
    const loadRecurring = async () => {
        setIsLoading(true);
        try {
            const [cats, pms, list] = await Promise.all([
                dataService.getCategories(userId),
                dataService.getPaymentMethods(userId),
                dataService.getRecurringTransactions(userId),
            ]);
            setCategories(cats);
            setPaymentMethods(pms);
            setRecurring(list);
        }
        catch (err) {
            console.warn('Failed to load recurring list:', err);
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        loadRecurring();
    }, [userId]);
    const handleSaveRecurring = async (values) => {
        if (recurringToEdit) {
            await dataService.deleteRecurringTransaction(userId, recurringToEdit.id);
            await dataService.addRecurringTransaction(userId, {
                ...values,
                next_occurrence: values.start_date,
            });
        }
        else {
            await dataService.addRecurringTransaction(userId, {
                ...values,
                next_occurrence: values.start_date,
            });
        }
        await loadRecurring();
    };
    const handleToggleStatus = async (item) => {
        const nextStatus = item.status === 'active' ? 'paused' : 'active';
        await dataService.toggleRecurringStatus(userId, item.id, nextStatus);
        await loadRecurring();
    };
    const handleDelete = async () => {
        if (recurringToDelete) {
            await dataService.deleteRecurringTransaction(userId, recurringToDelete.id);
            setRecurringToDelete(null);
            await loadRecurring();
        }
    };
    const handleTriggerProcessor = async () => {
        setIsProcessing(true);
        setProcessNotification(null);
        try {
            const res = await dataService.triggerRecurringRun(userId);
            setProcessNotification(res.processed > 0
                ? `Successfully processed and committed ${res.processed} scheduled transaction(s) to the ledger.`
                : 'All active schedules are currently up to date. Zero due occurrences.');
            await loadRecurring();
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : 'Processing failed';
            setProcessNotification(`Error: ${msg}`);
        }
        finally {
            setIsProcessing(false);
        }
    };
    const todayStr = new Date().toISOString().split('T')[0];
    const totalMonthlyCommitment = recurring
        .filter((r) => r.status === 'active' && r.type === 'expense')
        .reduce((sum, r) => sum + r.amount, 0);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "editorial-masthead", children: [_jsx("div", { children: "FOLIO \u2116 31 \u2022 SCHEDULED OUTLAYS & RECURRENT OBLIGATIONS" }), _jsx("div", { className: "hidden md:block", children: "IDEMPOTENT ATOMICITY: RFC 4122 PROTECTED" }), _jsx("div", { children: "PERIODIC REGISTER" })] }), _jsxs("div", { className: "flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-[#E6E1D8] dark:border-[#222733] pb-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl sm:text-2xl font-serif font-bold text-[#121826] dark:text-zinc-100 tracking-tight", children: "Recurring Bills & Subscriptions" }), _jsx("p", { className: "text-xs font-sans text-zinc-500 dark:text-zinc-400 mt-0.5", children: "Automated recurring schedules and upcoming liabilities" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("button", { type: "button", onClick: handleTriggerProcessor, disabled: isProcessing, className: "inline-flex items-center justify-center font-sans font-semibold text-xs px-3.5 py-2 bg-white dark:bg-[#1A1F29] text-[#121826] dark:text-zinc-200 border border-[#DDD7CE] dark:border-[#2D3442] rounded-lg shadow-sm hover:bg-[#F2EFE8] dark:hover:bg-[#222936] transition-all disabled:opacity-50", title: "Execute due recurring transactions idempotently", children: [_jsx(RepeatIcon, { className: `w-3.5 h-3.5 mr-1.5 ${isProcessing ? 'animate-spin' : ''}` }), _jsx("span", { children: isProcessing ? 'Processing...' : 'Run Due Engine' })] }), _jsxs("button", { type: "button", onClick: () => {
                                    setRecurringToEdit(null);
                                    setIsModalOpen(true);
                                }, className: "inline-flex items-center justify-center font-sans font-semibold text-xs px-3.5 py-2 bg-[#1E40AF] text-white rounded-lg shadow-sm hover:bg-[#1D3694] transition-all", children: [_jsx(PlusIcon, { className: "w-4 h-4 mr-1.5" }), _jsx("span", { children: "Add Schedule" })] })] })] }), processNotification && (_jsxs("div", { className: "p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs font-sans text-[#1E40AF] dark:text-blue-300 flex items-center justify-between shadow-xs", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(CheckIcon, { className: "w-4 h-4 text-[#1E40AF]" }), _jsx("span", { children: processNotification })] }), _jsx("button", { type: "button", onClick: () => setProcessNotification(null), className: "text-[11px] font-semibold underline ml-2", children: "Dismiss" })] })), _jsxs("div", { className: "rounded-xl border border-[#E6E1D8] dark:border-[#222733] bg-[#FCFAF6] dark:bg-[#171A21] shadow-xs grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E6E1D8] dark:divide-[#222733] overflow-hidden", children: [_jsxs("div", { className: "p-4", children: [_jsx("span", { className: "text-[11px] font-sans font-medium uppercase text-zinc-500 dark:text-zinc-400 block mb-1", children: "Active Commitments" }), _jsxs("span", { className: "text-xl font-bold font-serif tabular-nums text-zinc-900 dark:text-zinc-100", children: [recurring.filter((r) => r.status === 'active').length, " Schedules"] })] }), _jsxs("div", { className: "p-4", children: [_jsx("span", { className: "text-[11px] font-sans font-medium uppercase text-zinc-500 dark:text-zinc-400 block mb-1", children: "Monthly Committed Outflow" }), _jsx("span", { className: "text-xl font-bold font-serif tabular-nums text-[#DC2626]", children: formatINR(totalMonthlyCommitment) })] }), _jsxs("div", { className: "p-4", children: [_jsx("span", { className: "text-[11px] font-sans font-medium uppercase text-zinc-500 dark:text-zinc-400 block mb-1", children: "Annualized Impact" }), _jsx("span", { className: "text-xl font-bold font-serif tabular-nums text-zinc-900 dark:text-zinc-100", children: formatINR(totalMonthlyCommitment * 12) })] }), _jsxs("div", { className: "p-4 bg-[#F8F5EE] dark:bg-[#141720]", children: [_jsx("span", { className: "text-[11px] font-sans font-medium uppercase text-zinc-500 dark:text-zinc-400 block mb-1", children: "Scheduler Protection" }), _jsx("span", { className: "text-xs font-semibold text-[#1E40AF] dark:text-blue-400 block mt-1", children: "Idempotent Atomic Execution" })] })] }), recurring.length === 0 ? (_jsx(EmptyState, { title: "No Recurring Commitments Scheduled", description: "Schedule automated monthly utilities, rent, streaming subscriptions, or recurring client retainer fees.", actionLabel: "Create Schedule", onAction: () => {
                    setRecurringToEdit(null);
                    setIsModalOpen(true);
                }, icon: _jsx(RepeatIcon, { className: "w-8 h-8" }) })) : (_jsx("div", { className: "rounded-xl border border-[#E6E1D8] dark:border-[#222733] bg-[#FCFAF6] dark:bg-[#171A21] shadow-xs overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-[#F5F2EA] dark:bg-[#1A1E29] border-b border-[#E6E1D8] dark:border-[#222733] text-[11px] font-sans font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400", children: [_jsx("th", { className: "py-3 px-4", children: "Description" }), _jsx("th", { className: "py-3 px-4", children: "Type" }), _jsx("th", { className: "py-3 px-4", children: "Frequency" }), _jsx("th", { className: "py-3 px-4", children: "Next Due Date" }), _jsx("th", { className: "py-3 px-4", children: "Category / Method" }), _jsx("th", { className: "py-3 px-4 text-right", children: "Amount (INR)" }), _jsx("th", { className: "py-3 px-4 text-center", children: "Status" }), _jsx("th", { className: "py-3 px-4 text-center", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-[#EFECE5] dark:divide-[#1E2330]", children: recurring.map((item) => {
                                    const isDue = item.status === 'active' && item.next_occurrence <= todayStr;
                                    const isExpense = item.type === 'expense';
                                    return (_jsxs("tr", { className: "hover:bg-[#F8F5EE] dark:hover:bg-[#1C202B] transition-colors text-xs font-sans", children: [_jsx("td", { className: "py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100", children: item.description }), _jsx("td", { className: "py-3 px-4", children: _jsx(Badge, { variant: isExpense ? 'expense' : 'income', children: item.type }) }), _jsx("td", { className: "py-3 px-4 capitalize text-zinc-600 dark:text-zinc-400", children: item.frequency }), _jsx("td", { className: "py-3 px-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center gap-1.5", children: [isDue && (_jsx("span", { className: "text-amber-600 dark:text-amber-400", title: "Schedule is currently due for generation", children: _jsx(AlertTriangleIcon, { className: "w-3.5 h-3.5" }) })), _jsx("span", { className: isDue ? 'font-semibold text-amber-700 dark:text-amber-400' : 'text-zinc-600 dark:text-zinc-300', children: formatDisplayDate(item.next_occurrence) })] }) }), _jsxs("td", { className: "py-3 px-4 text-zinc-600 dark:text-zinc-400", children: [item.category?.name || 'Category', " \u2022 ", item.payment_method?.name || 'Cash'] }), _jsxs("td", { className: `py-3 px-4 text-right font-bold tabular-nums ${isExpense ? 'text-[#DC2626]' : 'text-[#16A34A]'}`, children: [isExpense ? '- ' : '+ ', formatINR(item.amount)] }), _jsx("td", { className: "py-3 px-4 text-center", children: _jsx("button", { type: "button", onClick: () => handleToggleStatus(item), className: `text-[10px] font-sans font-semibold uppercase px-2.5 py-0.5 rounded-full border transition-colors ${item.status === 'active'
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                                                        : 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'}`, title: "Click to toggle status", children: item.status }) }), _jsx("td", { className: "py-3 px-4 text-center whitespace-nowrap", children: _jsxs("div", { className: "flex items-center justify-center gap-1.5", children: [_jsx("button", { type: "button", onClick: () => {
                                                                setRecurringToEdit(item);
                                                                setIsModalOpen(true);
                                                            }, className: "p-1.5 rounded-md border border-[#E0DBD0] dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-[#F2EFE8] text-zinc-700 dark:text-zinc-300 shadow-xs", title: "Edit", children: _jsx(EditIcon, { className: "w-3.5 h-3.5" }) }), _jsx("button", { type: "button", onClick: () => setRecurringToDelete(item), className: "p-1.5 rounded-md border border-[#E0DBD0] dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-red-50 text-[#DC2626] shadow-xs", title: "Delete", children: _jsx(TrashIcon, { className: "w-3.5 h-3.5" }) })] }) })] }, item.id));
                                }) })] }) }) })), _jsxs("div", { className: "p-3 border border-ink-950/20 dark:border-zinc-700 bg-cream-100/50 dark:bg-zinc-900/30 text-[10px] font-mono text-ink-500 dark:text-zinc-400", children: [_jsx("span", { className: "font-bold uppercase text-ink-800 dark:text-zinc-300 block mb-1", children: "Backend Automation Architecture:" }), "Recurring schedules generate actual transaction journal rows using unique compound keys (`recurring_id_date`) to ensure total idempotency. Scheduler retries will never generate duplicate transaction records."] }), _jsx(RecurringModal, { isOpen: isModalOpen, onClose: () => {
                    setIsModalOpen(false);
                    setRecurringToEdit(null);
                }, onSubmit: handleSaveRecurring, recurringToEdit: recurringToEdit, categories: categories, paymentMethods: paymentMethods }), _jsx(ConfirmDialog, { isOpen: Boolean(recurringToDelete), onClose: () => setRecurringToDelete(null), onConfirm: handleDelete, title: "Delete Recurring Schedule", message: `Delete schedule "${recurringToDelete?.description}"? Previously generated transactions in the journal remain unchanged.`, confirmLabel: "Confirm Delete" })] }));
};
