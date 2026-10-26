import React from 'react';
import { Budget } from '../../types/database';
import { formatINR } from '../../lib/currency';
import { EditIcon, TrashIcon, AlertTriangleIcon } from '../ui/Icons';

interface BudgetCardProps {
  budget: Budget;
  onEdit: (budget: Budget) => void;
  onDelete: (budget: Budget) => void;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({
  budget,
  onEdit,
  onDelete,
}) => {
  const spent = budget.spent_amount || 0;
  const limit = budget.limit_amount;
  const percentage = Math.min(Math.round((spent / limit) * 100), 100);
  const rawPct = Math.round((spent / limit) * 100);
  const isOver = spent > limit;
  const isWarning = rawPct >= 80 && !isOver;

  return (
    <div
      className={`p-5 rounded-xl border bg-[#FCFAF6] dark:bg-[#171A21] shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all ${
        isOver
          ? 'border-red-300 dark:border-red-900/60'
          : 'border-[#E6E1D8] dark:border-[#222733]'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3.5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-sans font-semibold uppercase px-2 py-0.5 rounded-full bg-[#EFECE5] dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
              {budget.period}
            </span>
            <span className="text-xs font-sans text-zinc-500 dark:text-zinc-400">
              {budget.category?.name || 'Category'}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 font-sans">
            {budget.name}
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(budget)}
            className="p-1.5 rounded-md border border-[#E0DBD0] dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-[#F2EFE8] text-zinc-700 dark:text-zinc-300 shadow-xs"
            title="Edit budget"
          >
            <EditIcon className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(budget)}
            className="p-1.5 rounded-md border border-[#E0DBD0] dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-red-50 text-[#DC2626] shadow-xs"
            title="Delete budget"
          >
            <TrashIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Numerical Stats */}
      <div className="flex items-baseline justify-between mb-2.5 font-sans">
        <div>
          <span className="text-[10px] text-zinc-500 uppercase block font-medium">Spent</span>
          <span
            className={`text-xl font-bold tabular-nums font-serif ${
              isOver ? 'text-[#DC2626]' : 'text-zinc-900 dark:text-zinc-100'
            }`}
          >
            {formatINR(spent)}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-zinc-500 uppercase block font-medium">Limit</span>
          <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 tabular-nums">
            {formatINR(limit)}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 rounded-full bg-[#EAE5DC] dark:bg-zinc-800 overflow-hidden mb-2.5">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isOver
              ? 'bg-[#DC2626]'
              : isWarning
              ? 'bg-amber-500'
              : 'bg-[#1E40AF] dark:bg-blue-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Status Details */}
      <div className="flex items-center justify-between text-xs font-sans pt-1">
        <span className="font-medium text-zinc-600 dark:text-zinc-300">
          {rawPct}% used
        </span>

        {isOver ? (
          <span className="text-[#DC2626] font-semibold flex items-center gap-1 text-[11px] px-1.5 py-0.2 rounded bg-red-50 dark:bg-red-950/40">
            <AlertTriangleIcon className="w-3 h-3" />
            Over by {formatINR(spent - limit, { showDecimals: false })}
          </span>
        ) : (
          <span className="text-zinc-500 dark:text-zinc-400 text-[11px]">
            {formatINR(limit - spent, { showDecimals: false })} remaining
          </span>
        )}
      </div>
    </div>
  );
};

