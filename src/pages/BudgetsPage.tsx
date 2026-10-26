import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../lib/dataService';
import { Budget, Category } from '../types/database';
import { formatINR } from '../lib/currency';
import { BudgetCard } from '../components/budgets/BudgetCard';
import { BudgetModal } from '../components/budgets/BudgetModal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { PlusIcon, RefreshIcon, AlertTriangleIcon } from '../components/ui/Icons';

export const BudgetsPage: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id || 'demo-user';

  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budgetToEdit, setBudgetToEdit] = useState<Budget | null>(null);
  const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null);

  const loadBudgets = async () => {
    setIsLoading(true);
    try {
      const [cats, bList] = await Promise.all([
        dataService.getCategories(userId),
        dataService.getBudgets(userId),
      ]);
      setCategories(cats);
      setBudgets(bList);
    } catch (err) {
      console.warn('Failed to load budgets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBudgets();
  }, [userId]);

  const handleSaveBudget = async (values: any) => {
    if (budgetToEdit) {
      // update
      await dataService.deleteBudget(userId, budgetToEdit.id);
      await dataService.addBudget(userId, values);
    } else {
      await dataService.addBudget(userId, values);
    }
    await loadBudgets();
  };

  const handleDeleteBudget = async () => {
    if (budgetToDelete) {
      await dataService.deleteBudget(userId, budgetToDelete.id);
      setBudgetToDelete(null);
      await loadBudgets();
    }
  };

  // Overall calculations across all active budgets
  const totalBudgetLimit = budgets.reduce((sum, b) => sum + b.limit_amount, 0);
  const totalBudgetSpent = budgets.reduce((sum, b) => sum + (b.spent_amount || 0), 0);
  const exceededCount = budgets.filter((b) => (b.spent_amount || 0) > b.limit_amount).length;

  return (
    <div className="space-y-6">
      {/* Editorial Folio */}
      <div className="editorial-masthead">
        <div>FOLIO № 12 • APPROPRIATIONS & BUDGETARY CEILINGS</div>
        <div className="hidden md:block">MONITORING CYCLE: MONTHLY RUN-RATE</div>
        <div>DISCIPLINE DISPATCH</div>
      </div>

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b-2 border-ink-950 dark:border-zinc-700 pb-4">
        <div>
          <span className="editorial-kicker">CONTROL MECHANISMS</span>
          <h2 className="editorial-headline text-2xl sm:text-3xl">
            Category Spending Limits & Capital Burn
          </h2>
          <p className="text-xs font-mono text-ink-500 dark:text-zinc-400 mt-1">
            Automated threshold monitoring against actual transaction records
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadBudgets}
            className="p-2 border-2 border-ink-950 dark:border-zinc-600 bg-white dark:bg-zinc-800 shadow-brutal-sm hover:bg-cream-200"
            title="Refresh budget figures"
          >
            <RefreshIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => {
              setBudgetToEdit(null);
              setIsModalOpen(true);
            }}
            className="brutal-btn-primary"
          >
            <PlusIcon className="w-4 h-4 mr-1.5" />
            <span>Create Budget</span>
          </button>
        </div>
      </div>

      {/* Aggregate Financial Control Bar */}
      <div className="brutal-card p-0 grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x-2 divide-ink-950 dark:divide-zinc-700 bg-cream-50 dark:bg-brutal-darkCard">
        <div className="p-4">
          <span className="text-[10px] font-mono font-bold uppercase text-ink-500 dark:text-zinc-400 block mb-1">
            Budgeted Ceiling
          </span>
          <span className="text-xl font-black font-mono tabular-nums text-ink-950 dark:text-zinc-100">
            {formatINR(totalBudgetLimit)}
          </span>
        </div>

        <div className="p-4">
          <span className="text-[10px] font-mono font-bold uppercase text-ink-500 dark:text-zinc-400 block mb-1">
            Current Spend
          </span>
          <span className="text-xl font-black font-mono tabular-nums text-ink-950 dark:text-zinc-100">
            {formatINR(totalBudgetSpent)}
          </span>
        </div>

        <div className="p-4">
          <span className="text-[10px] font-mono font-bold uppercase text-ink-500 dark:text-zinc-400 block mb-1">
            Remaining Buffer
          </span>
          <span className="text-xl font-black font-mono tabular-nums text-cobalt dark:text-blue-400">
            {formatINR(Math.max(0, totalBudgetLimit - totalBudgetSpent))}
          </span>
        </div>

        <div className="p-4 bg-cream-100 dark:bg-zinc-800/50">
          <span className="text-[10px] font-mono font-bold uppercase text-ink-500 dark:text-zinc-400 block mb-1">
            Threshold Status
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            {exceededCount > 0 ? (
              <span className="text-xs font-bold font-mono text-brutal-red flex items-center gap-1">
                <AlertTriangleIcon className="w-3.5 h-3.5" />
                {exceededCount} LIMITS EXCEEDED
              </span>
            ) : (
              <span className="text-xs font-bold font-mono text-brutal-green">
                ALL BUDGETS WITHIN BOUNDS
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Budgets Grid */}
      {budgets.length === 0 ? (
        <EmptyState
          title="No Budgets Active"
          description="Establish monthly spending caps for groceries, utilities, or entertainment to automate alert thresholds."
          actionLabel="Create Budget"
          onAction={() => {
            setBudgetToEdit(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {budgets.map((b) => (
            <BudgetCard
              key={b.id}
              budget={b}
              onEdit={(target) => {
                setBudgetToEdit(target);
                setIsModalOpen(true);
              }}
              onDelete={(target) => setBudgetToDelete(target)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setBudgetToEdit(null);
        }}
        onSubmit={handleSaveBudget}
        budgetToEdit={budgetToEdit}
        categories={categories}
      />

      <ConfirmDialog
        isOpen={Boolean(budgetToDelete)}
        onClose={() => setBudgetToDelete(null)}
        onConfirm={handleDeleteBudget}
        title="Delete Budget Target"
        message={`Are you sure you want to delete budget "${budgetToDelete?.name}"? Historical transaction records will remain untouched.`}
        confirmLabel="Delete Budget"
      />
    </div>
  );
};
