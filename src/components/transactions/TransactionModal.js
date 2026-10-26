import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '../ui/Modal';
const transactionSchema = z.object({
    type: z.enum(['income', 'expense']),
    amount: z
        .number()
        .positive('Amount must be strictly greater than ₹0')
        .max(1000000000, 'Amount exceeds ledger limits'),
    category_id: z.string().min(1, 'Please select a category'),
    payment_method_id: z.string().min(1, 'Please select a payment method'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Please enter a valid date (YYYY-MM-DD)'),
    description: z
        .string()
        .trim()
        .min(2, 'Description must have at least 2 characters')
        .max(120, 'Description cannot exceed 120 characters'),
    notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional().nullable(),
});
export const TransactionModal = ({ isOpen, onClose, onSubmit, transactionToEdit, initialType = 'expense', categories, paymentMethods, }) => {
    const { register, handleSubmit, watch, setValue, reset, formState: { errors, isSubmitting }, } = useForm({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            type: initialType,
            amount: undefined,
            category_id: '',
            payment_method_id: '',
            date: new Date().toISOString().split('T')[0],
            description: '',
            notes: '',
        },
    });
    const selectedType = watch('type');
    useEffect(() => {
        if (transactionToEdit) {
            reset({
                type: transactionToEdit.type,
                amount: transactionToEdit.amount,
                category_id: transactionToEdit.category_id || '',
                payment_method_id: transactionToEdit.payment_method_id || '',
                date: transactionToEdit.date,
                description: transactionToEdit.description,
                notes: transactionToEdit.notes || '',
            });
        }
        else {
            const targetType = initialType;
            reset({
                type: targetType,
                amount: undefined,
                category_id: categories.find((c) => c.type === targetType || c.type === 'both')?.id || '',
                payment_method_id: paymentMethods[0]?.id || '',
                date: new Date().toISOString().split('T')[0],
                description: '',
                notes: '',
            });
        }
    }, [transactionToEdit, initialType, isOpen, reset, categories, paymentMethods]);
    const filteredCategories = categories.filter((c) => c.type === selectedType || c.type === 'both');
    const handleFormSubmit = async (data) => {
        await onSubmit(data);
        onClose();
    };
    return (_jsx(Modal, { isOpen: isOpen, onClose: onClose, title: transactionToEdit ? 'Edit Transaction Record' : 'Record New Transaction', maxWidth: "md", children: _jsxs("form", { onSubmit: handleSubmit(handleFormSubmit), className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "brutal-label", children: "Transaction Type" }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsx("button", { type: "button", onClick: () => {
                                        setValue('type', 'expense');
                                        const firstExp = categories.find((c) => c.type === 'expense' || c.type === 'both');
                                        if (firstExp)
                                            setValue('category_id', firstExp.id);
                                    }, className: `py-2 px-3 text-xs font-mono font-bold uppercase border-2 transition-all ${selectedType === 'expense'
                                        ? 'bg-brutal-red text-white border-ink-950 dark:border-zinc-200 shadow-brutal-sm'
                                        : 'bg-cream-100 dark:bg-zinc-800 text-ink-800 dark:text-zinc-300 border-ink-950 dark:border-zinc-600'}`, children: "Expense (-)" }), _jsx("button", { type: "button", onClick: () => {
                                        setValue('type', 'income');
                                        const firstInc = categories.find((c) => c.type === 'income' || c.type === 'both');
                                        if (firstInc)
                                            setValue('category_id', firstInc.id);
                                    }, className: `py-2 px-3 text-xs font-mono font-bold uppercase border-2 transition-all ${selectedType === 'income'
                                        ? 'bg-brutal-green text-white border-ink-950 dark:border-zinc-200 shadow-brutal-sm'
                                        : 'bg-cream-100 dark:bg-zinc-800 text-ink-800 dark:text-zinc-300 border-ink-950 dark:border-zinc-600'}`, children: "Income (+)" })] })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "amount", className: "brutal-label", children: "Amount (\u20B9 INR) *" }), _jsx("input", { id: "amount", type: "number", step: "0.01", placeholder: "e.g. 1500", ...register('amount', { valueAsNumber: true }), className: "brutal-input font-mono font-bold" }), errors.amount && (_jsx("p", { className: "mt-1 text-[11px] font-mono text-brutal-red font-bold", children: errors.amount.message }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "date", className: "brutal-label", children: "Transaction Date *" }), _jsx("input", { id: "date", type: "date", ...register('date'), className: "brutal-input font-mono text-xs" }), errors.date && (_jsx("p", { className: "mt-1 text-[11px] font-mono text-brutal-red font-bold", children: errors.date.message }))] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "description", className: "brutal-label", children: "Description / Payee *" }), _jsx("input", { id: "description", type: "text", placeholder: "e.g. Reliance Smart Groceries or Client Retainer", ...register('description'), className: "brutal-input text-xs" }), errors.description && (_jsx("p", { className: "mt-1 text-[11px] font-mono text-brutal-red font-bold", children: errors.description.message }))] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "category_id", className: "brutal-label", children: "Category *" }), _jsxs("select", { id: "category_id", ...register('category_id'), className: "brutal-input text-xs font-mono", children: [_jsx("option", { value: "", children: "Select Category" }), filteredCategories.map((c) => (_jsx("option", { value: c.id, children: c.name }, c.id)))] }), errors.category_id && (_jsx("p", { className: "mt-1 text-[11px] font-mono text-brutal-red font-bold", children: errors.category_id.message }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "payment_method_id", className: "brutal-label", children: "Payment Method *" }), _jsxs("select", { id: "payment_method_id", ...register('payment_method_id'), className: "brutal-input text-xs font-mono", children: [_jsx("option", { value: "", children: "Select Method" }), paymentMethods.map((pm) => (_jsx("option", { value: pm.id, children: pm.name }, pm.id)))] }), errors.payment_method_id && (_jsx("p", { className: "mt-1 text-[11px] font-mono text-brutal-red font-bold", children: errors.payment_method_id.message }))] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "notes", className: "brutal-label", children: "Optional Notes / Audit Trail" }), _jsx("textarea", { id: "notes", rows: 2, placeholder: "Tax invoice ref, UPI reference ID, or additional notes...", ...register('notes'), className: "brutal-input text-xs" }), errors.notes && (_jsx("p", { className: "mt-1 text-[11px] font-mono text-brutal-red font-bold", children: errors.notes.message }))] }), _jsxs("div", { className: "flex items-center justify-end gap-3 pt-3 border-t border-ink-200 dark:border-zinc-700", children: [_jsx("button", { type: "button", onClick: onClose, disabled: isSubmitting, className: "brutal-btn-secondary", children: "Cancel" }), _jsx("button", { type: "submit", disabled: isSubmitting, className: "brutal-btn-primary", children: isSubmitting ? 'Recording...' : transactionToEdit ? 'Save Changes' : 'Commit Entry' })] })] }) }));
};
