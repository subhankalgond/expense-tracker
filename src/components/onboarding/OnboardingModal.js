import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { formatINR } from '../../lib/currency';
import { ShieldIcon, CheckIcon } from '../ui/Icons';
export const OnboardingModal = ({ isOpen, onComplete, userName = 'Auditor', }) => {
    const [openingBalance, setOpeningBalance] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onComplete(openingBalance);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsx(Modal, { isOpen: isOpen, onClose: () => { }, title: "Onboarding: Initialize Financial Ledger", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "p-3 bg-cobalt-subtle dark:bg-blue-950/40 border-2 border-cobalt text-cobalt-dark dark:text-blue-300 text-xs font-mono", children: [_jsxs("div", { className: "flex items-center gap-2 font-bold mb-1", children: [_jsx(ShieldIcon, { className: "w-4 h-4 text-cobalt" }), _jsxs("span", { children: ["WELCOME TO LEDGER BRUTALIST, ", userName.toUpperCase()] })] }), _jsx("p", { className: "leading-relaxed", children: "Your private financial database has been provisioned with PostgreSQL Row Level Security (RLS) and default accounting categories." })] }), _jsxs("div", { children: [_jsx("label", { className: "brutal-label", children: "Standard Accounting Currency" }), _jsxs("div", { className: "p-2.5 bg-cream-200 dark:bg-zinc-800 border-2 border-ink-950 dark:border-zinc-600 font-mono text-xs font-bold flex items-center justify-between", children: [_jsx("span", { children: "Indian Rupee (INR - \u20B9)" }), _jsx("span", { className: "text-[10px] bg-ink-950 text-white dark:bg-zinc-200 dark:text-ink-950 px-2 py-0.5", children: "DEFAULT" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "opening_balance", className: "brutal-label", children: "Opening Account Balance (\u20B9 INR)" }), _jsx("p", { className: "text-[11px] text-ink-500 dark:text-zinc-400 mb-1.5 font-mono", children: "Initial funds available across cash, bank deposits, and liquid accounts." }), _jsx("input", { id: "opening_balance", type: "number", step: "0.01", min: "0", value: openingBalance || '', onChange: (e) => setOpeningBalance(parseFloat(e.target.value) || 0), placeholder: "0.00", className: "brutal-input font-mono font-bold text-base" }), _jsxs("div", { className: "mt-1 text-[11px] font-mono text-ink-600 dark:text-zinc-400", children: ["Preview: ", _jsx("strong", { className: "text-ink-950 dark:text-zinc-100", children: formatINR(openingBalance) })] })] }), _jsxs("div", { className: "space-y-2 pt-2 border-t border-ink-200 dark:border-zinc-700", children: [_jsx("span", { className: "text-xs font-mono font-bold uppercase text-ink-700 dark:text-zinc-300 block", children: "Included Default Ledger Categories:" }), _jsx("div", { className: "flex flex-wrap gap-1.5 text-[10px] font-mono", children: [
                                'Food & Groceries',
                                'Transport',
                                'Housing & Utilities',
                                'Healthcare',
                                'Salary',
                                'Investments',
                                'Shopping',
                            ].map((cat) => (_jsx("span", { className: "px-2 py-0.5 border border-ink-950 dark:border-zinc-600 bg-white dark:bg-zinc-800", children: cat }, cat))) })] }), _jsx("div", { className: "pt-4", children: _jsxs("button", { type: "submit", disabled: isSubmitting, className: "w-full brutal-btn-primary py-3 text-sm flex items-center justify-center gap-2", children: [_jsx(CheckIcon, { className: "w-4 h-4" }), _jsx("span", { children: isSubmitting ? 'Initializing...' : 'Confirm & Enter Dashboard' })] }) })] }) }));
};
