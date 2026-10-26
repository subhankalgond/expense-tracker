import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '../ui/Modal';
const budgetSchema = z.object({
    name: z.string().trim().min(2, 'Name must have at least 2 characters').max(60),
    category_id: z.string().min(1, 'Please select a category'),
    limit_amount: z.number().positive('Limit must be > ₹0'),
    period: z.enum(['monthly', 'weekly', 'yearly']),
    alert_threshold_75: z.boolean(),
    alert_threshold_90: z.boolean(),
    alert_threshold_100: z.boolean(),
});
export const BudgetModal = ({ isOpen, onClose, onSubmit, budgetToEdit, categories, }) => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting }, } = useForm({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(budgetSchema),
        defaultValues: {
            name: '',
            category_id: '',
            limit_amount: undefined,
            period: 'monthly',
            alert_threshold_75: true,
            alert_threshold_90: true,
            alert_threshold_100: true,
        },
    });
    useEffect(() => {
        if (budgetToEdit) {
            reset({
                name: budgetToEdit.name,
                category_id: budgetToEdit.category_id,
                limit_amount: budgetToEdit.limit_amount,
                period: budgetToEdit.period,
                alert_threshold_75: budgetToEdit.alert_threshold_75,
                alert_threshold_90: budgetToEdit.alert_threshold_90,
                alert_threshold_100: budgetToEdit.alert_threshold_100,
            });
        }
        else {
            reset({
                name: '',
                category_id: categories[0]?.id || '',
                limit_amount: undefined,
                period: 'monthly',
                alert_threshold_75: true,
                alert_threshold_90: true,
                alert_threshold_100: true,
            });
        }
    }, [budgetToEdit, isOpen, reset, categories]);
    const handleFormSubmit = async (data) => {
        await onSubmit(data);
        onClose();
    };
    return (_jsx(Modal, { isOpen: isOpen, onClose: onClose, title: budgetToEdit ? 'Edit Budget Target' : 'Create Expenditure Budget', maxWidth: "md", children: _jsxs("form", { onSubmit: handleSubmit(handleFormSubmit), className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "budget_name", className: "brutal-label", children: "Budget Name *" }), _jsx("input", { id: "budget_name", type: "text", placeholder: "e.g. Monthly Grocery Cap or Commute Allowance", ...register('name'), className: "brutal-input text-xs" }), errors.name && (_jsx("p", { className: "mt-1 text-[11px] font-mono text-brutal-red font-bold", children: errors.name.message }))] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "budget_category", className: "brutal-label", children: "Category *" }), _jsxs("select", { id: "budget_category", ...register('category_id'), className: "brutal-input text-xs font-mono", children: [_jsx("option", { value: "", children: "Select Category" }), categories.map((c) => (_jsx("option", { value: c.id, children: c.name }, c.id)))] }), errors.category_id && (_jsx("p", { className: "mt-1 text-[11px] font-mono text-brutal-red font-bold", children: errors.category_id.message }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "budget_period", className: "brutal-label", children: "Period" }), _jsxs("select", { id: "budget_period", ...register('period'), className: "brutal-input text-xs font-mono", children: [_jsx("option", { value: "monthly", children: "Monthly" }), _jsx("option", { value: "weekly", children: "Weekly" }), _jsx("option", { value: "yearly", children: "Yearly" })] })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "limit_amount", className: "brutal-label", children: "Spending Limit (\u20B9 INR) *" }), _jsx("input", { id: "limit_amount", type: "number", step: "1", placeholder: "e.g. 20000", ...register('limit_amount', { valueAsNumber: true }), className: "brutal-input font-mono font-bold" }), errors.limit_amount && (_jsx("p", { className: "mt-1 text-[11px] font-mono text-brutal-red font-bold", children: errors.limit_amount.message }))] }), _jsxs("div", { className: "pt-2 border-t border-ink-200 dark:border-zinc-700", children: [_jsx("span", { className: "brutal-label mb-2", children: "Warning Threshold Notifications" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "flex items-center gap-2 text-xs font-mono cursor-pointer select-none", children: [_jsx("input", { type: "checkbox", ...register('alert_threshold_75'), className: "w-4 h-4 border-2 border-ink-950 accent-cobalt rounded-none" }), _jsx("span", { children: "Trigger warning at 75% limit reached" })] }), _jsxs("label", { className: "flex items-center gap-2 text-xs font-mono cursor-pointer select-none", children: [_jsx("input", { type: "checkbox", ...register('alert_threshold_90'), className: "w-4 h-4 border-2 border-ink-950 accent-cobalt rounded-none" }), _jsx("span", { children: "Trigger critical alert at 90% limit reached" })] }), _jsxs("label", { className: "flex items-center gap-2 text-xs font-mono cursor-pointer select-none", children: [_jsx("input", { type: "checkbox", ...register('alert_threshold_100'), className: "w-4 h-4 border-2 border-ink-950 accent-cobalt rounded-none" }), _jsx("span", { children: "Trigger alarm when 100% threshold exceeded" })] })] })] }), _jsxs("div", { className: "flex items-center justify-end gap-3 pt-3 border-t border-ink-200 dark:border-zinc-700", children: [_jsx("button", { type: "button", onClick: onClose, disabled: isSubmitting, className: "brutal-btn-secondary", children: "Cancel" }), _jsx("button", { type: "submit", disabled: isSubmitting, className: "brutal-btn-primary", children: isSubmitting ? 'Saving...' : budgetToEdit ? 'Update Budget' : 'Commit Budget' })] })] }) }));
};
