import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '../ui/Modal';
const recurringSchema = z.object({
    type: z.enum(['income', 'expense']),
    amount: z.number().positive('Amount must be > ₹0'),
    category_id: z.string().min(1, 'Category is required'),
    payment_method_id: z.string().min(1, 'Payment method is required'),
    description: z.string().trim().min(2, 'Description must have at least 2 characters').max(100),
    frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
    start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Valid start date required'),
    end_date: z.string().optional().nullable(),
    status: z.enum(['active', 'paused']),
});
export const RecurringModal = ({ isOpen, onClose, onSubmit, recurringToEdit, categories, paymentMethods, }) => {
    const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting }, } = useForm({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(recurringSchema),
        defaultValues: {
            type: 'expense',
            amount: undefined,
            category_id: '',
            payment_method_id: '',
            description: '',
            frequency: 'monthly',
            start_date: new Date().toISOString().split('T')[0],
            end_date: '',
            status: 'active',
        },
    });
    const selectedType = watch('type');
    useEffect(() => {
        if (recurringToEdit) {
            reset({
                type: recurringToEdit.type,
                amount: recurringToEdit.amount,
                category_id: recurringToEdit.category_id || '',
                payment_method_id: recurringToEdit.payment_method_id || '',
                description: recurringToEdit.description,
                frequency: recurringToEdit.frequency,
                start_date: recurringToEdit.start_date,
                end_date: recurringToEdit.end_date || '',
                status: recurringToEdit.status === 'paused' ? 'paused' : 'active',
            });
        }
        else {
            reset({
                type: 'expense',
                amount: undefined,
                category_id: categories[0]?.id || '',
                payment_method_id: paymentMethods[0]?.id || '',
                description: '',
                frequency: 'monthly',
                start_date: new Date().toISOString().split('T')[0],
                end_date: '',
                status: 'active',
            });
        }
    }, [recurringToEdit, isOpen, reset, categories, paymentMethods]);
    const handleFormSubmit = async (data) => {
        await onSubmit(data);
        onClose();
    };
    return (_jsx(Modal, { isOpen: isOpen, onClose: onClose, title: recurringToEdit ? 'Edit Scheduled Commitment' : 'Add Recurring Schedule', maxWidth: "md", children: _jsxs("form", { onSubmit: handleSubmit(handleFormSubmit), className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsx("button", { type: "button", onClick: () => setValue('type', 'expense'), className: `py-2 text-xs font-mono font-bold uppercase border-2 transition-all ${selectedType === 'expense'
                                ? 'bg-brutal-red text-white border-ink-950 dark:border-white shadow-brutal-sm'
                                : 'bg-cream-100 dark:bg-zinc-800 text-ink-800 dark:text-zinc-300 border-ink-950 dark:border-zinc-600'}`, children: "Recurring Expense (-)" }), _jsx("button", { type: "button", onClick: () => setValue('type', 'income'), className: `py-2 text-xs font-mono font-bold uppercase border-2 transition-all ${selectedType === 'income'
                                ? 'bg-brutal-green text-white border-ink-950 dark:border-white shadow-brutal-sm'
                                : 'bg-cream-100 dark:bg-zinc-800 text-ink-800 dark:text-zinc-300 border-ink-950 dark:border-zinc-600'}`, children: "Recurring Income (+)" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "recurring_desc", className: "brutal-label", children: "Schedule Description *" }), _jsx("input", { id: "recurring_desc", type: "text", placeholder: "e.g. Netflix Subscription, Apartment Rent, or Monthly Salary", ...register('description'), className: "brutal-input text-xs" }), errors.description && (_jsx("p", { className: "mt-1 text-[11px] font-mono text-brutal-red font-bold", children: errors.description.message }))] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "recurring_amount", className: "brutal-label", children: "Amount (\u20B9 INR) *" }), _jsx("input", { id: "recurring_amount", type: "number", step: "0.01", placeholder: "e.g. 1499", ...register('amount', { valueAsNumber: true }), className: "brutal-input font-mono font-bold" }), errors.amount && (_jsx("p", { className: "mt-1 text-[11px] font-mono text-brutal-red font-bold", children: errors.amount.message }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "recurring_freq", className: "brutal-label", children: "Frequency *" }), _jsxs("select", { id: "recurring_freq", ...register('frequency'), className: "brutal-input text-xs font-mono", children: [_jsx("option", { value: "daily", children: "Daily" }), _jsx("option", { value: "weekly", children: "Weekly" }), _jsx("option", { value: "monthly", children: "Monthly" }), _jsx("option", { value: "yearly", children: "Yearly" })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "recurring_cat", className: "brutal-label", children: "Category *" }), _jsxs("select", { id: "recurring_cat", ...register('category_id'), className: "brutal-input text-xs font-mono", children: [_jsx("option", { value: "", children: "Select Category" }), categories.map((c) => (_jsx("option", { value: c.id, children: c.name }, c.id)))] }), errors.category_id && (_jsx("p", { className: "mt-1 text-[11px] font-mono text-brutal-red font-bold", children: errors.category_id.message }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "recurring_pm", className: "brutal-label", children: "Payment Method *" }), _jsxs("select", { id: "recurring_pm", ...register('payment_method_id'), className: "brutal-input text-xs font-mono", children: [_jsx("option", { value: "", children: "Select Method" }), paymentMethods.map((pm) => (_jsx("option", { value: pm.id, children: pm.name }, pm.id)))] }), errors.payment_method_id && (_jsx("p", { className: "mt-1 text-[11px] font-mono text-brutal-red font-bold", children: errors.payment_method_id.message }))] })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "recurring_start", className: "brutal-label", children: "Start Date *" }), _jsx("input", { id: "recurring_start", type: "date", ...register('start_date'), className: "brutal-input text-xs font-mono" }), errors.start_date && (_jsx("p", { className: "mt-1 text-[11px] font-mono text-brutal-red font-bold", children: errors.start_date.message }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "recurring_end", className: "brutal-label", children: "Optional End Date" }), _jsx("input", { id: "recurring_end", type: "date", ...register('end_date'), className: "brutal-input text-xs font-mono" })] })] }), _jsxs("div", { className: "flex items-center justify-end gap-3 pt-3 border-t border-ink-200 dark:border-zinc-700", children: [_jsx("button", { type: "button", onClick: onClose, disabled: isSubmitting, className: "brutal-btn-secondary", children: "Cancel" }), _jsx("button", { type: "submit", disabled: isSubmitting, className: "brutal-btn-primary", children: isSubmitting ? 'Saving...' : recurringToEdit ? 'Update Schedule' : 'Activate Schedule' })] })] }) }));
};
