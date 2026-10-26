import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../lib/dataService';
import { Modal } from '../components/ui/Modal';
import { PlusIcon, TrashIcon, CheckIcon } from '../components/ui/Icons';
import { formatINR } from '../lib/currency';
export const SettingsPage = () => {
    const { user, profile, updateProfileState, signOut } = useAuth();
    const userId = user?.id || 'demo-user';
    const [categories, setCategories] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [openingBalance, setOpeningBalance] = useState(profile?.opening_balance || 0);
    // Notifications
    const [budgetAlerts, setBudgetAlerts] = useState(true);
    const [billReminders, setBillReminders] = useState(true);
    // Category Add Modal
    const [isCatModalOpen, setIsCatModalOpen] = useState(false);
    const [newCatName, setNewCatName] = useState('');
    const [newCatType, setNewCatType] = useState('expense');
    // Payment Method Modal
    const [isPmModalOpen, setIsPmModalOpen] = useState(false);
    const [newPmName, setNewPmName] = useState('');
    const [newPmType, setNewPmType] = useState('upi');
    // Deletion modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
    const [saveMessage, setSaveMessage] = useState(null);
    const loadSettingsData = async () => {
        try {
            const [cats, pms] = await Promise.all([
                dataService.getCategories(userId),
                dataService.getPaymentMethods(userId),
            ]);
            setCategories(cats);
            setPaymentMethods(pms);
            if (profile) {
                setOpeningBalance(profile.opening_balance || 0);
            }
        }
        catch (err) {
            console.warn('Failed to load settings data:', err);
        }
    };
    useEffect(() => {
        loadSettingsData();
    }, [userId, profile]);
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        await updateProfileState({
            opening_balance: openingBalance,
        });
        setSaveMessage('Profile and balance preferences saved.');
        setTimeout(() => setSaveMessage(null), 3000);
    };
    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCatName.trim())
            return;
        await dataService.addCategory(userId, {
            name: newCatName.trim(),
            type: newCatType,
            color: newCatType === 'income' ? '#047857' : '#C2410C',
            icon: 'tag',
            is_archived: false,
        });
        setNewCatName('');
        setIsCatModalOpen(false);
        await loadSettingsData();
    };
    const handleAddPaymentMethod = async (e) => {
        e.preventDefault();
        if (!newPmName.trim())
            return;
        await dataService.addPaymentMethod(userId, {
            name: newPmName.trim(),
            type: newPmType,
            is_archived: false,
        });
        setNewPmName('');
        setIsPmModalOpen(false);
        await loadSettingsData();
    };
    const handleExportFullAccountBackup = async () => {
        const tx = await dataService.getTransactions(userId);
        const budgets = await dataService.getBudgets(userId);
        const goals = await dataService.getSavingsGoals(userId);
        const recurring = await dataService.getRecurringTransactions(userId);
        const fullBackup = {
            user_id: userId,
            export_timestamp: new Date().toISOString(),
            profile,
            categories,
            payment_methods: paymentMethods,
            transactions: tx.data,
            budgets,
            savings_goals: goals,
            recurring_schedules: recurring,
        };
        const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ledger_backup_${userId}_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };
    const handleConfirmAccountDeletion = async () => {
        if (deleteConfirmationText !== 'DELETE')
            return;
        await dataService.deleteUserAccountData(userId);
        setIsDeleteModalOpen(false);
        await signOut();
    };
    return (_jsxs("div", { className: "space-y-6 max-w-4xl", children: [_jsxs("div", { className: "border-b-2 border-ink-950 dark:border-zinc-700 pb-4", children: [_jsx("h2", { className: "text-base font-black font-mono uppercase tracking-wider text-ink-950 dark:text-zinc-100", children: "Ledger Configuration & Data Sovereignty" }), _jsx("p", { className: "text-xs font-mono text-ink-500 dark:text-zinc-400", children: "Accounting currency, opening reserves, custom categories, and data erasure" })] }), saveMessage && (_jsxs("div", { className: "p-3 bg-emerald-100 dark:bg-emerald-950/40 border-2 border-emerald-800 text-emerald-900 dark:text-emerald-300 font-mono text-xs flex items-center gap-2", children: [_jsx(CheckIcon, { className: "w-4 h-4 text-emerald-700" }), _jsx("span", { children: saveMessage })] })), _jsxs("div", { className: "brutal-card p-5", children: [_jsx("h3", { className: "text-xs font-mono font-bold uppercase tracking-wider text-ink-950 dark:text-zinc-100 mb-4 border-b-2 border-ink-950 dark:border-zinc-700 pb-2", children: "Fiscal Profile & Balances" }), _jsxs("form", { onSubmit: handleUpdateProfile, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "brutal-label", children: "Account Identification" }), _jsx("input", { type: "text", disabled: true, value: user?.email || 'auditor@ledgerbrutalist.internal', className: "brutal-input bg-cream-200 dark:bg-zinc-800 cursor-not-allowed font-mono text-xs" })] }), _jsxs("div", { children: [_jsx("label", { className: "brutal-label", children: "Ledger Currency Format" }), _jsxs("div", { className: "p-2 bg-cream-100 dark:bg-zinc-800 border-2 border-ink-950 dark:border-zinc-600 font-mono text-xs font-bold flex justify-between items-center", children: [_jsx("span", { children: "Indian Rupee (INR - \u20B9)" }), _jsx("span", { className: "text-[10px] bg-cobalt text-white px-1.5 py-0.5", children: "MANDATED" })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "opening_bal", className: "brutal-label", children: "Initial Opening Balance (\u20B9 INR)" }), _jsx("input", { id: "opening_bal", type: "number", step: "0.01", min: "0", value: openingBalance, onChange: (e) => setOpeningBalance(parseFloat(e.target.value) || 0), className: "brutal-input font-mono font-bold text-sm" }), _jsxs("span", { className: "text-[10px] font-mono text-ink-500 mt-1 block", children: ["Calculated balance preview: ", formatINR(openingBalance)] })] }), _jsxs("div", { children: [_jsx("label", { className: "brutal-label", children: "Accounting Timezone" }), _jsx("input", { type: "text", disabled: true, value: profile?.timezone || 'Asia/Kolkata (IST +05:30)', className: "brutal-input bg-cream-200 dark:bg-zinc-800 cursor-not-allowed font-mono text-xs" })] })] }), _jsx("button", { type: "submit", className: "brutal-btn-primary", children: "Save Preferences" })] })] }), _jsxs("div", { className: "brutal-card p-5", children: [_jsx("h3", { className: "text-xs font-mono font-bold uppercase tracking-wider text-ink-950 dark:text-zinc-100 mb-4 border-b-2 border-ink-950 dark:border-zinc-700 pb-2", children: "Notification Directives" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("label", { className: "flex items-center gap-3 text-xs font-mono cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: budgetAlerts, onChange: (e) => setBudgetAlerts(e.target.checked), className: "w-4 h-4 border-2 border-ink-950 accent-cobalt rounded-none" }), _jsx("span", { children: "Broadcast in-app alert when category spending reaches 75% or 90% threshold" })] }), _jsxs("label", { className: "flex items-center gap-3 text-xs font-mono cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: billReminders, onChange: (e) => setBillReminders(e.target.checked), className: "w-4 h-4 border-2 border-ink-950 accent-cobalt rounded-none" }), _jsx("span", { children: "Highlight upcoming recurring liabilities due within 7 days" })] })] })] }), _jsxs("div", { className: "brutal-card p-5", children: [_jsxs("div", { className: "flex items-center justify-between mb-4 border-b-2 border-ink-950 dark:border-zinc-700 pb-2", children: [_jsxs("h3", { className: "text-xs font-mono font-bold uppercase tracking-wider text-ink-950 dark:text-zinc-100", children: ["Accounting Categories (", categories.length, ")"] }), _jsxs("button", { type: "button", onClick: () => setIsCatModalOpen(true), className: "brutal-btn-secondary py-1 text-xs flex items-center gap-1", children: [_jsx(PlusIcon, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Add Category" })] })] }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-2", children: categories.map((c) => (_jsxs("div", { className: "p-2 border border-ink-950/30 dark:border-zinc-700 bg-cream-100 dark:bg-zinc-800 text-xs font-mono flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2 truncate pr-2", children: [_jsx("span", { className: "w-2.5 h-2.5 border border-ink-950 shrink-0", style: { backgroundColor: c.color } }), _jsx("span", { className: "truncate", children: c.name })] }), _jsx("span", { className: "text-[9px] uppercase font-bold text-ink-500", children: c.type })] }, c.id))) })] }), _jsxs("div", { className: "brutal-card p-5", children: [_jsxs("div", { className: "flex items-center justify-between mb-4 border-b-2 border-ink-950 dark:border-zinc-700 pb-2", children: [_jsxs("h3", { className: "text-xs font-mono font-bold uppercase tracking-wider text-ink-950 dark:text-zinc-100", children: ["Settlement Instruments (", paymentMethods.length, ")"] }), _jsxs("button", { type: "button", onClick: () => setIsPmModalOpen(true), className: "brutal-btn-secondary py-1 text-xs flex items-center gap-1", children: [_jsx(PlusIcon, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Add Instrument" })] })] }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-2", children: paymentMethods.map((pm) => (_jsxs("div", { className: "p-2 border border-ink-950/30 dark:border-zinc-700 bg-cream-100 dark:bg-zinc-800 text-xs font-mono flex items-center justify-between", children: [_jsx("span", { className: "truncate", children: pm.name }), _jsx("span", { className: "text-[9px] uppercase font-bold text-ink-500", children: pm.type })] }, pm.id))) })] }), _jsxs("div", { className: "brutal-card p-5 border-2 border-ink-950 dark:border-zinc-700 bg-red-50/20 dark:bg-red-950/20 space-y-4", children: [_jsxs("div", { children: [_jsx("div", { className: "flex items-center gap-2 mb-1", children: _jsx("span", { className: "px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-red-100 text-brutal-red border border-brutal-red dark:bg-red-950/60 dark:text-red-300 dark:border-red-800", children: "IRREVERSIBLE DATA ACTIONS" }) }), _jsx("h3", { className: "text-xs font-mono font-bold uppercase tracking-wider text-brutal-red mb-1", children: "Data Sovereignty & Permanent Erasure" }), _jsx("p", { className: "text-xs font-mono text-ink-600 dark:text-zinc-400", children: "Export a full JSON archive of your transactions and accounting rules, or purge all database records under GDPR standards." })] }), _jsxs("div", { className: "flex flex-wrap gap-3 pt-2", children: [_jsx("button", { type: "button", onClick: handleExportFullAccountBackup, className: "brutal-btn-secondary", children: "Export Complete JSON Ledger" }), _jsxs("button", { type: "button", onClick: () => {
                                    setDeleteConfirmationText('');
                                    setIsDeleteModalOpen(true);
                                }, className: "brutal-btn-danger", children: [_jsx(TrashIcon, { className: "w-3.5 h-3.5 mr-1.5" }), _jsx("span", { children: "Delete Account & Purge Records" })] })] })] }), _jsx(Modal, { isOpen: isCatModalOpen, onClose: () => setIsCatModalOpen(false), title: "Add Ledger Category", children: _jsxs("form", { onSubmit: handleAddCategory, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "brutal-label", children: "Category Name" }), _jsx("input", { type: "text", required: true, placeholder: "e.g. Pet Care, Software Subscriptions", value: newCatName, onChange: (e) => setNewCatName(e.target.value), className: "brutal-input text-xs" })] }), _jsxs("div", { children: [_jsx("label", { className: "brutal-label", children: "Classification" }), _jsxs("select", { value: newCatType, onChange: (e) => setNewCatType(e.target.value), className: "brutal-input text-xs font-mono", children: [_jsx("option", { value: "expense", children: "Expense (-)" }), _jsx("option", { value: "income", children: "Income (+)" }), _jsx("option", { value: "both", children: "Both Inflows & Outflows" })] })] }), _jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [_jsx("button", { type: "button", onClick: () => setIsCatModalOpen(false), className: "brutal-btn-secondary", children: "Cancel" }), _jsx("button", { type: "submit", className: "brutal-btn-primary", children: "Add Category" })] })] }) }), _jsx(Modal, { isOpen: isPmModalOpen, onClose: () => setIsPmModalOpen(false), title: "Add Settlement Instrument", children: _jsxs("form", { onSubmit: handleAddPaymentMethod, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "brutal-label", children: "Instrument Label" }), _jsx("input", { type: "text", required: true, placeholder: "e.g. HDFC Salary Account, Axis Forex Card", value: newPmName, onChange: (e) => setNewPmName(e.target.value), className: "brutal-input text-xs" })] }), _jsxs("div", { children: [_jsx("label", { className: "brutal-label", children: "Instrument Type" }), _jsxs("select", { value: newPmType, onChange: (e) => setNewPmType(e.target.value), className: "brutal-input text-xs font-mono", children: [_jsx("option", { value: "upi", children: "UPI" }), _jsx("option", { value: "cash", children: "Cash" }), _jsx("option", { value: "debit_card", children: "Debit Card" }), _jsx("option", { value: "credit_card", children: "Credit Card" }), _jsx("option", { value: "bank_transfer", children: "Bank Transfer" }), _jsx("option", { value: "other", children: "Other" })] })] }), _jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [_jsx("button", { type: "button", onClick: () => setIsPmModalOpen(false), className: "brutal-btn-secondary", children: "Cancel" }), _jsx("button", { type: "submit", className: "brutal-btn-primary", children: "Add Instrument" })] })] }) }), _jsx(Modal, { isOpen: isDeleteModalOpen, onClose: () => setIsDeleteModalOpen(false), title: "Permanent Account Deletion (GDPR)", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("p", { className: "text-xs font-mono text-ink-700 dark:text-zinc-300 leading-relaxed", children: ["This action will permanently delete all transactions, budgets, capital savings goals, categories, and account profiles associated with user ID ", _jsx("code", { className: "bg-cream-200 dark:bg-zinc-800 px-1", children: userId }), "."] }), _jsxs("div", { className: "p-3 bg-red-100 dark:bg-red-950/60 border border-brutal-red text-brutal-red font-mono text-xs", children: ["To proceed, type ", _jsx("strong", { className: "underline", children: "DELETE" }), " below:"] }), _jsx("input", { type: "text", value: deleteConfirmationText, onChange: (e) => setDeleteConfirmationText(e.target.value), placeholder: "Type DELETE", className: "brutal-input text-center font-mono font-bold tracking-widest uppercase" }), _jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [_jsx("button", { type: "button", onClick: () => setIsDeleteModalOpen(false), className: "brutal-btn-secondary", children: "Abort" }), _jsx("button", { type: "button", disabled: deleteConfirmationText !== 'DELETE', onClick: handleConfirmAccountDeletion, className: "brutal-btn-danger", children: "Purge All Data & Exit" })] })] }) })] }));
};
