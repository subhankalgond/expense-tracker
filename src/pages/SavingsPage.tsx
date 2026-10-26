import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../lib/dataService';
import { SavingsGoal } from '../types/database';
import { formatINR } from '../lib/currency';
import { SavingsGoalCard } from '../components/savings/SavingsGoalCard';
import { SavingsGoalModal } from '../components/savings/SavingsGoalModal';
import { SavingsMovementModal } from '../components/savings/SavingsMovementModal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { PlusIcon, RefreshIcon, TargetIcon } from '../components/ui/Icons';

export const SavingsPage: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id || 'demo-user';

  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState<SavingsGoal | null>(null);
  const [goalToDelete, setGoalToDelete] = useState<SavingsGoal | null>(null);
  const [goalForMovement, setGoalForMovement] = useState<SavingsGoal | null>(null);

  const loadSavingsGoals = async () => {
    setIsLoading(true);
    try {
      const list = await dataService.getSavingsGoals(userId);
      setGoals(list);
    } catch (err) {
      console.warn('Failed to load savings goals:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSavingsGoals();
  }, [userId]);

  const handleSaveGoal = async (values: any) => {
    if (goalToEdit) {
      // update
      await dataService.deleteSavingsGoal(userId, goalToEdit.id);
      await dataService.addSavingsGoal(userId, values);
    } else {
      await dataService.addSavingsGoal(userId, values);
    }
    await loadSavingsGoals();
  };

  const handleDeleteGoal = async () => {
    if (goalToDelete) {
      await dataService.deleteSavingsGoal(userId, goalToDelete.id);
      setGoalToDelete(null);
      await loadSavingsGoals();
    }
  };

  const handleRecordMovement = async (
    goalId: string,
    amount: number,
    type: 'deposit' | 'withdrawal',
    note?: string
  ) => {
    await dataService.recordSavingsMovement(userId, goalId, amount, type, note);
    await loadSavingsGoals();
  };

  const totalTargetCapital = goals.reduce((sum, g) => sum + g.target_amount, 0);
  const totalSavedCapital = goals.reduce((sum, g) => sum + g.current_amount, 0);
  const overallFundedPct =
    totalTargetCapital > 0 ? Math.round((totalSavedCapital / totalTargetCapital) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Editorial Folio */}
      <div className="editorial-masthead">
        <div>FOLIO № 18 • CAPITAL RESERVES & TARGET ACCUMULATION</div>
        <div className="hidden md:block">LEDGER PROTECTION: ATOMIC RPC PERSISTENCE</div>
        <div>FUTURE DISPATCH</div>
      </div>

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b-2 border-ink-950 dark:border-zinc-700 pb-4">
        <div>
          <span className="editorial-kicker">CAPITAL FORMATION</span>
          <h2 className="editorial-headline text-2xl sm:text-3xl">
            Capital Reserves & Savings Milestones
          </h2>
          <p className="text-xs font-mono text-ink-500 dark:text-zinc-400 mt-1">
            Target capital accumulation with atomic contribution accounting
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadSavingsGoals}
            className="p-2 border-2 border-ink-950 dark:border-zinc-600 bg-white dark:bg-zinc-800 shadow-brutal-sm hover:bg-cream-200"
            title="Refresh goals"
          >
            <RefreshIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => {
              setGoalToEdit(null);
              setIsGoalModalOpen(true);
            }}
            className="brutal-btn-primary"
          >
            <PlusIcon className="w-4 h-4 mr-1.5" />
            <span>New Savings Target</span>
          </button>
        </div>
      </div>

      {/* Aggregate Capital Control Bar */}
      <div className="brutal-card p-0 grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x-2 divide-ink-950 dark:divide-zinc-700 bg-cream-50 dark:bg-brutal-darkCard">
        <div className="p-4">
          <span className="text-[10px] font-mono font-bold uppercase text-ink-500 dark:text-zinc-400 block mb-1">
            Capital Accumulated
          </span>
          <span className="text-xl font-black font-mono tabular-nums text-cobalt dark:text-blue-400">
            {formatINR(totalSavedCapital)}
          </span>
        </div>

        <div className="p-4">
          <span className="text-[10px] font-mono font-bold uppercase text-ink-500 dark:text-zinc-400 block mb-1">
            Milestone Target
          </span>
          <span className="text-xl font-black font-mono tabular-nums text-ink-950 dark:text-zinc-100">
            {formatINR(totalTargetCapital)}
          </span>
        </div>

        <div className="p-4">
          <span className="text-[10px] font-mono font-bold uppercase text-ink-500 dark:text-zinc-400 block mb-1">
            Capital Gap Remaining
          </span>
          <span className="text-xl font-black font-mono tabular-nums text-ink-950 dark:text-zinc-100">
            {formatINR(Math.max(0, totalTargetCapital - totalSavedCapital))}
          </span>
        </div>

        <div className="p-4 bg-cream-100 dark:bg-zinc-800/50">
          <span className="text-[10px] font-mono font-bold uppercase text-ink-500 dark:text-zinc-400 block mb-1">
            Portfolio Funded Ratio
          </span>
          <span className="text-xl font-black font-mono tabular-nums text-brutal-green">
            {overallFundedPct}%
          </span>
        </div>
      </div>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <EmptyState
          title="No Capital Targets Established"
          description="Provision an emergency liquid reserve, vehicle fund, or house down-payment target."
          actionLabel="Create Savings Target"
          onAction={() => {
            setGoalToEdit(null);
            setIsGoalModalOpen(true);
          }}
          icon={<TargetIcon className="w-8 h-8" />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {goals.map((goal) => (
            <SavingsGoalCard
              key={goal.id}
              goal={goal}
              onEdit={(target) => {
                setGoalToEdit(target);
                setIsGoalModalOpen(true);
              }}
              onDelete={(target) => setGoalToDelete(target)}
              onMovement={(target) => setGoalForMovement(target)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <SavingsGoalModal
        isOpen={isGoalModalOpen}
        onClose={() => {
          setIsGoalModalOpen(false);
          setGoalToEdit(null);
        }}
        onSubmit={handleSaveGoal}
        goalToEdit={goalToEdit}
      />

      <SavingsMovementModal
        isOpen={Boolean(goalForMovement)}
        onClose={() => setGoalForMovement(null)}
        goal={goalForMovement}
        onConfirm={handleRecordMovement}
      />

      <ConfirmDialog
        isOpen={Boolean(goalToDelete)}
        onClose={() => setGoalToDelete(null)}
        onConfirm={handleDeleteGoal}
        title="Delete Savings Target"
        message={`Are you sure you want to permanently delete goal "${goalToDelete?.name}"? Saved capital figures will be removed from your portfolio overview.`}
        confirmLabel="Confirm Delete"
      />
    </div>
  );
};
