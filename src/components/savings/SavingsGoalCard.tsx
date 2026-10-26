import React from 'react';
import { SavingsGoal } from '../../types/database';
import { formatINR } from '../../lib/currency';
import { formatDisplayDate } from '../../lib/date';
import { Badge } from '../ui/Badge';
import { EditIcon, TrashIcon, PlusIcon, TrendingDownIcon, CheckIcon } from '../ui/Icons';

interface SavingsGoalCardProps {
  goal: SavingsGoal;
  onEdit: (goal: SavingsGoal) => void;
  onDelete: (goal: SavingsGoal) => void;
  onMovement: (goal: SavingsGoal) => void;
}

export const SavingsGoalCard: React.FC<SavingsGoalCardProps> = ({
  goal,
  onEdit,
  onDelete,
  onMovement,
}) => {
  const percentage = Math.min(
    Math.round((goal.current_amount / (goal.target_amount || 1)) * 100),
    100
  );
  const isCompleted = goal.current_amount >= goal.target_amount;
  const remaining = Math.max(0, goal.target_amount - goal.current_amount);

  return (
    <div className="p-5 rounded-xl border border-[#E6E1D8] dark:border-[#222733] bg-[#FCFAF6] dark:bg-[#171A21] shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant={isCompleted ? 'income' : 'cobalt'}>
                {isCompleted ? 'Completed' : 'Accumulating'}
              </Badge>
              {goal.target_date && (
                <span className="text-[11px] font-sans text-zinc-500 dark:text-zinc-400">
                  Target: {formatDisplayDate(goal.target_date)}
                </span>
              )}
            </div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 font-sans">
              {goal.name}
            </h3>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onEdit(goal)}
              className="p-1.5 rounded-md border border-[#E0DBD0] dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-[#F2EFE8] text-zinc-700 dark:text-zinc-300 shadow-xs"
              title="Edit goal"
            >
              <EditIcon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(goal)}
              className="p-1.5 rounded-md border border-[#E0DBD0] dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-red-50 text-[#DC2626] shadow-xs"
              title="Delete goal"
            >
              <TrashIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {goal.description && (
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3 font-sans">
            {goal.description}
          </p>
        )}

        {/* Financial Numbers */}
        <div className="flex items-baseline justify-between mb-2.5 font-sans">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase block font-medium">Accumulated</span>
            <span className="text-xl font-bold tabular-nums font-serif text-[#1E40AF] dark:text-blue-400">
              {formatINR(goal.current_amount)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-zinc-500 uppercase block font-medium">Target</span>
            <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 tabular-nums">
              {formatINR(goal.target_amount)}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-[#EAE5DC] dark:bg-zinc-800 overflow-hidden mb-2.5">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isCompleted ? 'bg-[#16A34A]' : 'bg-[#1E40AF] dark:bg-blue-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs font-sans mb-3">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            {percentage}% saved
          </span>
          {isCompleted ? (
            <span className="text-[#16A34A] font-semibold flex items-center gap-1 text-[11px]">
              <CheckIcon className="w-3.5 h-3.5" /> Goal Achieved
            </span>
          ) : (
            <span className="text-zinc-500 dark:text-zinc-400 text-[11px]">
              {formatINR(remaining, { showDecimals: false })} needed
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-[#EFECE5] dark:border-[#222733] flex gap-2">
        <button
          type="button"
          onClick={() => onMovement(goal)}
          className="flex-1 py-1.5 px-3 rounded-lg text-xs font-sans font-semibold bg-[#16A34A] hover:bg-emerald-700 text-white shadow-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          <span>Deposit</span>
        </button>
        <button
          type="button"
          onClick={() => onMovement(goal)}
          className="py-1.5 px-3 rounded-lg text-xs font-sans font-semibold bg-white dark:bg-zinc-800 border border-[#E0DBD0] dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-[#F2EFE8] dark:hover:bg-zinc-700 shadow-xs flex items-center justify-center gap-1.5 transition-colors"
          title="Withdraw funds"
        >
          <TrendingDownIcon className="w-3.5 h-3.5 text-[#DC2626]" />
          <span>Withdraw</span>
        </button>
      </div>
    </div>
  );
};

