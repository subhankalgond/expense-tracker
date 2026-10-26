import React from 'react';
import { Link } from 'react-router-dom';
import { Budget } from '../../types/database';
import { formatINR } from '../../lib/currency';
import { AlertTriangleIcon, ArrowRightIcon, PieChartIcon } from '../ui/Icons';

interface BudgetOverviewWidgetProps {
  budgets: Budget[];
}

export const BudgetOverviewWidget: React.FC<BudgetOverviewWidgetProps> = ({ budgets }) => {
  if (budgets.length === 0) {
    return (
      <div className="bg-[#FCFAF6] dark:bg-[#171A21] p-5 rounded-xl border border-[#E6E1D8] dark:border-[#222733] shadow-xs">
        <div className="flex items-center justify-between mb-3 border-b border-[#EFECE5] dark:border-[#222733] pb-2.5">
          <div className="flex items-center gap-2">
            <PieChartIcon className="w-4 h-4 text-[#1E40AF] dark:text-blue-400" />
            <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Budget Usage
            </h3>
          </div>
          <Link
            to="/budgets"
            className="text-xs font-sans text-[#1E40AF] dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
          >
            Create <ArrowRightIcon className="w-3 h-3" />
          </Link>
        </div>
        <p className="text-xs font-sans text-zinc-500 dark:text-zinc-400 py-6 text-center">
          No monthly category budgets configured yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#FCFAF6] dark:bg-[#171A21] p-5 rounded-xl border border-[#E6E1D8] dark:border-[#222733] shadow-xs">
      <div className="flex items-center justify-between mb-4 border-b border-[#EFECE5] dark:border-[#222733] pb-2.5">
        <div className="flex items-center gap-2">
          <PieChartIcon className="w-4 h-4 text-[#1E40AF] dark:text-blue-400" />
          <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
            Budget Usage
          </h3>
        </div>
        <Link
          to="/budgets"
          className="text-xs font-sans text-[#1E40AF] dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
        >
          View All <ArrowRightIcon className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-4">
        {budgets.slice(0, 4).map((b) => {
          const spent = b.spent_amount || 0;
          const limit = b.limit_amount;
          const pct = Math.min(Math.round((spent / limit) * 100), 100);
          const rawPct = Math.round((spent / limit) * 100);
          const isOver = spent > limit;
          const isWarning = rawPct >= 80 && !isOver;

          return (
            <div key={b.id} className="space-y-2">
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-[170px]">
                  {b.name}
                </span>
                <span className="font-semibold tabular-nums text-zinc-800 dark:text-zinc-200">
                  {formatINR(spent, { showDecimals: false })}{' '}
                  <span className="text-zinc-400 font-normal">/ {formatINR(limit, { showDecimals: false })}</span>
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-[#EAE5DC] dark:bg-zinc-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isOver
                      ? 'bg-[#DC2626]'
                      : isWarning
                      ? 'bg-amber-500'
                      : 'bg-[#1E40AF] dark:bg-blue-500'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-sans">
                <span className="text-zinc-500 dark:text-zinc-400 font-medium">
                  {rawPct}% used
                </span>
                {isOver ? (
                  <span className="text-[#DC2626] font-semibold flex items-center gap-1 text-[10px] px-1.5 py-0.2 rounded bg-red-50 dark:bg-red-950/40">
                    <AlertTriangleIcon className="w-2.5 h-2.5" /> Over by {formatINR(spent - limit, { showDecimals: false })}
                  </span>
                ) : isWarning ? (
                  <span className="text-amber-700 dark:text-amber-400 font-medium text-[10px] px-1.5 py-0.2 rounded bg-amber-50 dark:bg-amber-950/40">
                    {formatINR(limit - spent, { showDecimals: false })} remaining
                  </span>
                ) : (
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {formatINR(limit - spent, { showDecimals: false })} remaining
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

