import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { formatINR } from '../../lib/currency';
export const SavingsMovementModal = ({ isOpen, onClose, goal, onConfirm, }) => {
    const [movementType, setMovementType] = useState('deposit');
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    if (!goal)
        return null;
    const handleSubmit = async (e) => {
        e.preventDefault();
        const numAmount = typeof amount === 'number' ? amount : parseFloat(amount);
        if (!numAmount || numAmount <= 0) {
            setError('Please provide a valid contribution amount greater than ₹0');
            return;
        }
        if (movementType === 'withdrawal' && numAmount > goal.current_amount) {
            setError(`Cannot withdraw ${formatINR(numAmount)}. Current saved balance is only ${formatINR(goal.current_amount)}.`);
            return;
        }
        setError(null);
        setIsSubmitting(true);
        try {
            await onConfirm(goal.id, numAmount, movementType, note);
            onClose();
            setAmount('');
            setNote('');
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : 'Movement failed';
            setError(msg);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsx(Modal, { isOpen: isOpen, onClose: onClose, title: `Record Capital Movement: ${goal.name}`, maxWidth: "sm", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsx("button", { type: "button", onClick: () => {
                                setMovementType('deposit');
                                setError(null);
                            }, className: `py-2 text-xs font-mono font-bold uppercase border-2 transition-all ${movementType === 'deposit'
                                ? 'bg-brutal-green text-white border-ink-950 dark:border-white shadow-brutal-sm'
                                : 'bg-cream-100 dark:bg-zinc-800 text-ink-800 dark:text-zinc-300 border-ink-950 dark:border-zinc-600'}`, children: "Deposit (+)" }), _jsx("button", { type: "button", onClick: () => {
                                setMovementType('withdrawal');
                                setError(null);
                            }, className: `py-2 text-xs font-mono font-bold uppercase border-2 transition-all ${movementType === 'withdrawal'
                                ? 'bg-brutal-red text-white border-ink-950 dark:border-white shadow-brutal-sm'
                                : 'bg-cream-100 dark:bg-zinc-800 text-ink-800 dark:text-zinc-300 border-ink-950 dark:border-zinc-600'}`, children: "Withdrawal (-)" })] }), _jsxs("div", { className: "p-2.5 bg-cream-200 dark:bg-zinc-800 border border-ink-950 dark:border-zinc-600 text-xs font-mono flex items-center justify-between", children: [_jsx("span", { className: "text-ink-600 dark:text-zinc-400", children: "Current Capital:" }), _jsx("span", { className: "font-bold text-ink-950 dark:text-zinc-100 tabular-nums", children: formatINR(goal.current_amount) })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "movement_amount", className: "brutal-label", children: "Movement Amount (\u20B9 INR) *" }), _jsx("input", { id: "movement_amount", type: "number", step: "0.01", min: "1", placeholder: "e.g. 5000", value: amount, onChange: (e) => {
                                setAmount(e.target.value === '' ? '' : parseFloat(e.target.value));
                                setError(null);
                            }, className: "brutal-input font-mono font-bold text-base" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "movement_note", className: "brutal-label", children: "Ledger Note / Allocation Reference" }), _jsx("input", { id: "movement_note", type: "text", placeholder: "e.g. Monthly dividend reinvestment or emergency repair withdrawal", value: note, onChange: (e) => setNote(e.target.value), className: "brutal-input text-xs" })] }), error && (_jsx("p", { className: "p-2 border-2 border-brutal-red bg-red-50 text-brutal-red text-[11px] font-mono font-bold", children: error })), _jsxs("div", { className: "flex items-center justify-end gap-3 pt-3 border-t border-ink-200 dark:border-zinc-700", children: [_jsx("button", { type: "button", onClick: onClose, disabled: isSubmitting, className: "brutal-btn-secondary", children: "Cancel" }), _jsx("button", { type: "submit", disabled: isSubmitting, className: "brutal-btn-primary", children: isSubmitting ? 'Posting...' : 'Commit Movement' })] })] }) }));
};
