import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { SavingsGoal } from '../../types/database';
import { formatINR } from '../../lib/currency';

interface SavingsMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: SavingsGoal | null;
  onConfirm: (
    goalId: string,
    amount: number,
    type: 'deposit' | 'withdrawal',
    note?: string
  ) => Promise<void>;
}

export const SavingsMovementModal: React.FC<SavingsMovementModalProps> = ({
  isOpen,
  onClose,
  goal,
  onConfirm,
}) => {
  const [movementType, setMovementType] = useState<'deposit' | 'withdrawal'>('deposit');
  const [amount, setAmount] = useState<number | ''>('');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!goal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Movement failed';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Record Capital Movement: ${goal.name}`}
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type toggle */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              setMovementType('deposit');
              setError(null);
            }}
            className={`py-2 text-xs font-mono font-bold uppercase border-2 transition-all ${
              movementType === 'deposit'
                ? 'bg-brutal-green text-white border-ink-950 dark:border-white shadow-brutal-sm'
                : 'bg-cream-100 dark:bg-zinc-800 text-ink-800 dark:text-zinc-300 border-ink-950 dark:border-zinc-600'
            }`}
          >
            Deposit (+)
          </button>
          <button
            type="button"
            onClick={() => {
              setMovementType('withdrawal');
              setError(null);
            }}
            className={`py-2 text-xs font-mono font-bold uppercase border-2 transition-all ${
              movementType === 'withdrawal'
                ? 'bg-brutal-red text-white border-ink-950 dark:border-white shadow-brutal-sm'
                : 'bg-cream-100 dark:bg-zinc-800 text-ink-800 dark:text-zinc-300 border-ink-950 dark:border-zinc-600'
            }`}
          >
            Withdrawal (-)
          </button>
        </div>

        {/* Current status display */}
        <div className="p-2.5 bg-cream-200 dark:bg-zinc-800 border border-ink-950 dark:border-zinc-600 text-xs font-mono flex items-center justify-between">
          <span className="text-ink-600 dark:text-zinc-400">Current Capital:</span>
          <span className="font-bold text-ink-950 dark:text-zinc-100 tabular-nums">
            {formatINR(goal.current_amount)}
          </span>
        </div>

        <div>
          <label htmlFor="movement_amount" className="brutal-label">
            Movement Amount (₹ INR) *
          </label>
          <input
            id="movement_amount"
            type="number"
            step="0.01"
            min="1"
            placeholder="e.g. 5000"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value === '' ? '' : parseFloat(e.target.value));
              setError(null);
            }}
            className="brutal-input font-mono font-bold text-base"
          />
        </div>

        <div>
          <label htmlFor="movement_note" className="brutal-label">
            Ledger Note / Allocation Reference
          </label>
          <input
            id="movement_note"
            type="text"
            placeholder="e.g. Monthly dividend reinvestment or emergency repair withdrawal"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="brutal-input text-xs"
          />
        </div>

        {error && (
          <p className="p-2 border-2 border-brutal-red bg-red-50 text-brutal-red text-[11px] font-mono font-bold">
            {error}
          </p>
        )}

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
            {isSubmitting ? 'Posting...' : 'Commit Movement'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
