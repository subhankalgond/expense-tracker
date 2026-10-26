import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { formatINR } from '../../lib/currency';
import { ShieldIcon, CheckIcon } from '../ui/Icons';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (openingBalance: number) => Promise<void>;
  userName?: string;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  userName = 'Auditor',
}) => {
  const [openingBalance, setOpeningBalance] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onComplete(openingBalance);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} title="Onboarding: Initialize Financial Ledger">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 bg-cobalt-subtle dark:bg-blue-950/40 border-2 border-cobalt text-cobalt-dark dark:text-blue-300 text-xs font-mono">
          <div className="flex items-center gap-2 font-bold mb-1">
            <ShieldIcon className="w-4 h-4 text-cobalt" />
            <span>WELCOME TO LEDGER BRUTALIST, {userName.toUpperCase()}</span>
          </div>
          <p className="leading-relaxed">
            Your private financial database has been provisioned with PostgreSQL Row Level Security (RLS) and default accounting categories.
          </p>
        </div>

        <div>
          <label className="brutal-label">Standard Accounting Currency</label>
          <div className="p-2.5 bg-cream-200 dark:bg-zinc-800 border-2 border-ink-950 dark:border-zinc-600 font-mono text-xs font-bold flex items-center justify-between">
            <span>Indian Rupee (INR - ₹)</span>
            <span className="text-[10px] bg-ink-950 text-white dark:bg-zinc-200 dark:text-ink-950 px-2 py-0.5">
              DEFAULT
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="opening_balance" className="brutal-label">
            Opening Account Balance (₹ INR)
          </label>
          <p className="text-[11px] text-ink-500 dark:text-zinc-400 mb-1.5 font-mono">
            Initial funds available across cash, bank deposits, and liquid accounts.
          </p>
          <input
            id="opening_balance"
            type="number"
            step="0.01"
            min="0"
            value={openingBalance || ''}
            onChange={(e) => setOpeningBalance(parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            className="brutal-input font-mono font-bold text-base"
          />
          <div className="mt-1 text-[11px] font-mono text-ink-600 dark:text-zinc-400">
            Preview: <strong className="text-ink-950 dark:text-zinc-100">{formatINR(openingBalance)}</strong>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-ink-200 dark:border-zinc-700">
          <span className="text-xs font-mono font-bold uppercase text-ink-700 dark:text-zinc-300 block">
            Included Default Ledger Categories:
          </span>
          <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
            {[
              'Food & Groceries',
              'Transport',
              'Housing & Utilities',
              'Healthcare',
              'Salary',
              'Investments',
              'Shopping',
            ].map((cat) => (
              <span
                key={cat}
                className="px-2 py-0.5 border border-ink-950 dark:border-zinc-600 bg-white dark:bg-zinc-800"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full brutal-btn-primary py-3 text-sm flex items-center justify-center gap-2"
          >
            <CheckIcon className="w-4 h-4" />
            <span>{isSubmitting ? 'Initializing...' : 'Confirm & Enter Dashboard'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
