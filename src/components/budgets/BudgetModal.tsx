import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '../ui/Modal';
import { Budget, Category } from '../../types/database';

const budgetSchema = z.object({
  name: z.string().trim().min(2, 'Name must have at least 2 characters').max(60),
  category_id: z.string().min(1, 'Please select a category'),
  limit_amount: z.number().positive('Limit must be > ₹0'),
  period: z.enum(['monthly', 'weekly', 'yearly']),
  alert_threshold_75: z.boolean(),
  alert_threshold_90: z.boolean(),
  alert_threshold_100: z.boolean(),
});

type BudgetFormValues = z.infer<typeof budgetSchema>;

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: BudgetFormValues) => Promise<void>;
  budgetToEdit?: Budget | null;
  categories: Category[];
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  budgetToEdit,
  categories,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BudgetFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(budgetSchema) as any,
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
    } else {
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

  const handleFormSubmit = async (data: BudgetFormValues) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={budgetToEdit ? 'Edit Budget Target' : 'Create Expenditure Budget'}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <label htmlFor="budget_name" className="brutal-label">
            Budget Name *
          </label>
          <input
            id="budget_name"
            type="text"
            placeholder="e.g. Monthly Grocery Cap or Commute Allowance"
            {...register('name')}
            className="brutal-input text-xs"
          />
          {errors.name && (
            <p className="mt-1 text-[11px] font-mono text-brutal-red font-bold">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="budget_category" className="brutal-label">
              Category *
            </label>
            <select
              id="budget_category"
              {...register('category_id')}
              className="brutal-input text-xs font-mono"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="mt-1 text-[11px] font-mono text-brutal-red font-bold">
                {errors.category_id.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="budget_period" className="brutal-label">
              Period
            </label>
            <select
              id="budget_period"
              {...register('period')}
              className="brutal-input text-xs font-mono"
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="limit_amount" className="brutal-label">
            Spending Limit (₹ INR) *
          </label>
          <input
            id="limit_amount"
            type="number"
            step="1"
            placeholder="e.g. 20000"
            {...register('limit_amount', { valueAsNumber: true })}
            className="brutal-input font-mono font-bold"
          />
          {errors.limit_amount && (
            <p className="mt-1 text-[11px] font-mono text-brutal-red font-bold">
              {errors.limit_amount.message}
            </p>
          )}
        </div>

        <div className="pt-2 border-t border-ink-200 dark:border-zinc-700">
          <span className="brutal-label mb-2">Warning Threshold Notifications</span>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-mono cursor-pointer select-none">
              <input
                type="checkbox"
                {...register('alert_threshold_75')}
                className="w-4 h-4 border-2 border-ink-950 accent-cobalt rounded-none"
              />
              <span>Trigger warning at 75% limit reached</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-mono cursor-pointer select-none">
              <input
                type="checkbox"
                {...register('alert_threshold_90')}
                className="w-4 h-4 border-2 border-ink-950 accent-cobalt rounded-none"
              />
              <span>Trigger critical alert at 90% limit reached</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-mono cursor-pointer select-none">
              <input
                type="checkbox"
                {...register('alert_threshold_100')}
                className="w-4 h-4 border-2 border-ink-950 accent-cobalt rounded-none"
              />
              <span>Trigger alarm when 100% threshold exceeded</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-ink-200 dark:border-zinc-700">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="brutal-btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="brutal-btn-primary"
          >
            {isSubmitting ? 'Saving...' : budgetToEdit ? 'Update Budget' : 'Commit Budget'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
