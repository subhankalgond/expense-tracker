import React from 'react';
import { Link } from 'react-router-dom';
import { SavingsGoal } from '../../types/database';
import { formatINR } from '../../lib/currency';
import { formatDisplayDate } from '../../lib/date';
import { TargetIcon, ArrowRightIcon } from '../ui/Icons';

interface SavingsOverviewWidgetProps {
  savingsGoals: SavingsGoal[];
}

export const SavingsOverviewWidget: React.FC<SavingsOverviewWidgetProps> = ({ savingsGoals }) => {
  const activeGoals = savingsGoals.slice(0, 3);

  if (activeGoals.length === 0) {
    return (
      <div className="bg-[#FCFAF6] dark:bg-[#171A21] p-5 rounded-xl border border-[#E6E1D8] dark:border-[#222733] shadow-xs">
        <div className="flex items-center justify-between mb-3 border-b border-[#EFECE5] dark:border-[#222733] pb-2.5">
          <div className="flex items-center gap-2">
            <TargetIcon className="w-4 h-4 text-[#1E40AF] dark:text-blue-400" />
            <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Savings Goals
            </h3>
          </div>
          <Link
            to="/savings"
            className="text-xs font-sans text-[#1E40AF] dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
          >
            Create <ArrowRightIcon className="w-3 h-3" />
          </Link>
        </div>
        <p className="text-xs font-sans text-zinc-500 dark:text-zinc-400 py-6 text-center">
          No savings goals established yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#FCFAF6] dark:bg-[#171A21] p-5 rounded-xl border border-[#E6E1D8] dark:border-[#222733] shadow-xs">
      <div className="flex items-center justify-between mb-4 border-b border-[#EFECE5] dark:border-[#222733] pb-2.5">
        <div className="flex items-center gap-2">
          <TargetIcon className="w-4 h-4 text-[#1E40AF] dark:text-blue-400" />
          <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
            Savings Goals
          </h3>
        </div>
        <Link
          to="/savings"
          className="text-xs font-sans text-[#1E40AF] dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
        >
          Manage <ArrowRightIcon className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-4">
        {activeGoals.map((goal) => {
          const current = goal.current_amount;
          const target = goal.target_amount;
          const pct = Math.min(Math.round((current / (target || 1)) * 100), 100);

          return (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-[160px]">
                  {goal.name}
                </span>
                <span className="font-semibold tabular-nums text-zinc-800 dark:text-zinc-200">
                  {formatINR(current, { showDecimals: false })}{' '}
                  <span className="text-zinc-400 font-normal">/ {formatINR(target, { showDecimals: false })}</span>
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-[#EAE5DC] dark:bg-zinc-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#16A34A] transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-sans text-zinc-500 dark:text-zinc-400">
                <span className="font-medium text-emerald-700 dark:text-emerald-400">{pct}% saved</span>
                {goal.target_date && (
                  <span>Target: {formatDisplayDate(goal.target_date)}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
