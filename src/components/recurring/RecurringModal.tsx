import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '../ui/Modal';
import { RecurringTransaction, Category, PaymentMethod } from '../../types/database';

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

type RecurringFormValues = z.infer<typeof recurringSchema>;

interface RecurringModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: RecurringFormValues) => Promise<void>;
  recurringToEdit?: RecurringTransaction | null;
  categories: Category[];
  paymentMethods: PaymentMethod[];
}

export const RecurringModal: React.FC<RecurringModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  recurringToEdit,
  categories,
  paymentMethods,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RecurringFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(recurringSchema) as any,
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
    } else {
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

  const handleFormSubmit = async (data: RecurringFormValues) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={recurringToEdit ? 'Edit Scheduled Commitment' : 'Add Recurring Schedule'}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Type toggle */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setValue('type', 'expense')}
            className={`py-2 text-xs font-mono font-bold uppercase border-2 transition-all ${
              selectedType === 'expense'
                ? 'bg-brutal-red text-white border-ink-950 dark:border-white shadow-brutal-sm'
                : 'bg-cream-100 dark:bg-zinc-800 text-ink-800 dark:text-zinc-300 border-ink-950 dark:border-zinc-600'
            }`}
          >
            Recurring Expense (-)
          </button>
          <button
            type="button"
            onClick={() => setValue('type', 'income')}
            className={`py-2 text-xs font-mono font-bold uppercase border-2 transition-all ${
              selectedType === 'income'
                ? 'bg-brutal-green text-white border-ink-950 dark:border-white shadow-brutal-sm'
                : 'bg-cream-100 dark:bg-zinc-800 text-ink-800 dark:text-zinc-300 border-ink-950 dark:border-zinc-600'
            }`}
          >
            Recurring Income (+)
          </button>
        </div>

        <div>
          <label htmlFor="recurring_desc" className="brutal-label">
            Schedule Description *
          </label>
          <input
            id="recurring_desc"
            type="text"
            placeholder="e.g. Netflix Subscription, Apartment Rent, or Monthly Salary"
            {...register('description')}
            className="brutal-input text-xs"
          />
          {errors.description && (
            <p className="mt-1 text-[11px] font-mono text-brutal-red font-bold">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="recurring_amount" className="brutal-label">
              Amount (₹ INR) *
            </label>
            <input
              id="recurring_amount"
              type="number"
              step="0.01"
              placeholder="e.g. 1499"
              {...register('amount', { valueAsNumber: true })}
              className="brutal-input font-mono font-bold"
            />
            {errors.amount && (
              <p className="mt-1 text-[11px] font-mono text-brutal-red font-bold">
                {errors.amount.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="recurring_freq" className="brutal-label">
              Frequency *
            </label>
            <select
              id="recurring_freq"
              {...register('frequency')}
              className="brutal-input text-xs font-mono"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="recurring_cat" className="brutal-label">
              Category *
            </label>
            <select
              id="recurring_cat"
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
            <label htmlFor="recurring_pm" className="brutal-label">
              Payment Method *
            </label>
            <select
              id="recurring_pm"
              {...register('payment_method_id')}
              className="brutal-input text-xs font-mono"
            >
              <option value="">Select Method</option>
              {paymentMethods.map((pm) => (
                <option key={pm.id} value={pm.id}>
                  {pm.name}
                </option>
              ))}
            </select>
            {errors.payment_method_id && (
              <p className="mt-1 text-[11px] font-mono text-brutal-red font-bold">
                {errors.payment_method_id.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="recurring_start" className="brutal-label">
              Start Date *
            </label>
            <input
              id="recurring_start"
              type="date"
              {...register('start_date')}
              className="brutal-input text-xs font-mono"
            />
            {errors.start_date && (
              <p className="mt-1 text-[11px] font-mono text-brutal-red font-bold">
                {errors.start_date.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="recurring_end" className="brutal-label">
              Optional End Date
            </label>
            <input
              id="recurring_end"
              type="date"
              {...register('end_date')}
              className="brutal-input text-xs font-mono"
            />
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
            {isSubmitting ? 'Saving...' : recurringToEdit ? 'Update Schedule' : 'Activate Schedule'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
