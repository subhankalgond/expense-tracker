import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '../ui/Modal';
import { SavingsGoal } from '../../types/database';

const goalSchema = z.object({
  name: z.string().trim().min(2, 'Name must have at least 2 characters').max(60),
  target_amount: z
    .number()
    .positive('Target must be greater than ₹0'),
  target_date: z.string().optional().nullable(),
  description: z.string().max(250, 'Description cannot exceed 250 characters').optional().nullable(),
});

type GoalFormValues = z.infer<typeof goalSchema>;

interface SavingsGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: GoalFormValues) => Promise<void>;
  goalToEdit?: SavingsGoal | null;
}

export const SavingsGoalModal: React.FC<SavingsGoalModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  goalToEdit,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GoalFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(goalSchema) as any,
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
    } else {
      reset({
        name: '',
        target_amount: undefined,
        target_date: '',
        description: '',
      });
    }
  }, [goalToEdit, isOpen, reset]);

  const handleFormSubmit = async (data: GoalFormValues) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={goalToEdit ? 'Edit Capital Savings Goal' : 'Establish New Savings Goal'}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <label htmlFor="goal_name" className="brutal-label">
            Goal Name *
          </label>
          <input
            id="goal_name"
            type="text"
            placeholder="e.g. 6-Month Emergency Liquidity or Home Down Payment"
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
            <label htmlFor="target_amount" className="brutal-label">
              Target Capital (₹ INR) *
            </label>
            <input
              id="target_amount"
              type="number"
              step="100"
              placeholder="e.g. 300000"
              {...register('target_amount', { valueAsNumber: true })}
              className="brutal-input font-mono font-bold"
            />
            {errors.target_amount && (
              <p className="mt-1 text-[11px] font-mono text-brutal-red font-bold">
                {errors.target_amount.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="target_date" className="brutal-label">
              Target Horizon Date
            </label>
            <input
              id="target_date"
              type="date"
              {...register('target_date')}
              className="brutal-input text-xs font-mono"
            />
          </div>
        </div>

        <div>
          <label htmlFor="goal_description" className="brutal-label">
            Target Purpose / Description
          </label>
          <textarea
            id="goal_description"
            rows={2}
            placeholder="Strategy notes, allocated liquid fund ticker, or purpose..."
            {...register('description')}
            className="brutal-input text-xs"
          />
          {errors.description && (
            <p className="mt-1 text-[11px] font-mono text-brutal-red font-bold">
              {errors.description.message}
            </p>
          )}
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
            {isSubmitting ? 'Saving...' : goalToEdit ? 'Update Goal' : 'Create Goal'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
