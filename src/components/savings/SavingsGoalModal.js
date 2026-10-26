import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '../ui/Modal';
const goalSchema = z.object({
    name: z.string().trim().min(2, 'Name must have at least 2 characters').max(60),
    target_amount: z
        .number()
        .positive('Target must be greater than ₹0'),
    target_date: z.string().optional().nullable(),
    description: z.string().max(250, 'Description cannot exceed 250 characters').optional().nullable(),
});
export const SavingsGoalModal = ({ isOpen, onClose, onSubmit, goalToEdit, }) => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting }, } = useForm({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(goalSchema),
        defaultValues: {
            name: '',
            target_amount: undefined,
            target_date: '',
            description: '',
        },
    });
    useEffect(() => {
        if (goalToEdit) {
            reset({
                name: goalToEdit.name,
                target_amount: goalToEdit.target_amount,
                target_date: goalToEdit.target_date || '',
                description: goalToEdit.description || '',
            });
        }
        else {
            reset({
                name: '',
                target_amount: undefined,
                target_date: '',
                description: '',
            });
        }
    }, [goalToEdit, isOpen, reset]);
    const handleFormSubmit = async (data) => {
        await onSubmit(data);
        onClose();
    };
    return (_jsx(Modal, { isOpen: isOpen, onClose: onClose, title: goalToEdit ? 'Edit Capital Savings Goal' : 'Establish New Savings Goal', maxWidth: "md", children: _jsxs("form", { onSubmit: handleSubmit(handleFormSubmit), className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "goal_name", className: "brutal-label", children: "Goal Name *" }), _jsx("input", { id: "goal_name", type: "text", placeholder: "e.g. 6-Month Emergency Liquidity or Home Down Payment", ...register('name'), className: "brutal-input text-xs" }), errors.name && (_jsx("p", { className: "mt-1 text-[11px] font-mono text-brutal-red font-bold", children: errors.name.message }))] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "target_amount", className: "brutal-label", children: "Target Capital (\u20B9 INR) *" }), _jsx("input", { id: "target_amount", type: "number", step: "100", placeholder: "e.g. 300000", ...register('target_amount', { valueAsNumber: true }), className: "brutal-input font-mono font-bold" }), errors.target_amount && (_jsx("p", { className: "mt-1 text-[11px] font-mono text-brutal-red font-bold", children: errors.target_amount.message }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "target_date", className: "brutal-label", children: "Target Horizon Date" }), _jsx("input", { id: "target_date", type: "date", ...register('target_date'), className: "brutal-input text-xs font-mono" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "goal_description", className: "brutal-label", children: "Target Purpose / Description" }), _jsx("textarea", { id: "goal_description", rows: 2, placeholder: "Strategy notes, allocated liquid fund ticker, or purpose...", ...register('description'), className: "brutal-input text-xs" }), errors.description && (_jsx("p", { className: "mt-1 text-[11px] font-mono text-brutal-red font-bold", children: errors.description.message }))] }), _jsxs("div", { className: "flex items-center justify-end gap-3 pt-3 border-t border-ink-200 dark:border-zinc-700", children: [_jsx("button", { type: "button", onClick: onClose, disabled: isSubmitting, className: "brutal-btn-secondary", children: "Cancel" }), _jsx("button", { type: "submit", disabled: isSubmitting, className: "brutal-btn-primary", children: isSubmitting ? 'Saving...' : goalToEdit ? 'Update Goal' : 'Create Goal' })] })] }) }));
};
