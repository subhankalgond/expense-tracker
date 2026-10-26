import React from 'react';
import { Link } from 'react-router-dom';
import { RecurringTransaction } from '../../types/database';
import { formatINR } from '../../lib/currency';
import { formatDisplayDate } from '../../lib/date';
import { RepeatIcon, ArrowRightIcon } from '../ui/Icons';

interface UpcomingBillsWidgetProps {
  recurring: RecurringTransaction[];
}

export const UpcomingBillsWidget: React.FC<UpcomingBillsWidgetProps> = ({ recurring }) => {
  const activeSchedules = recurring
    .filter((r) => r.status === 'active')
    .sort((a, b) => a.next_occurrence.localeCompare(b.next_occurrence))
    .slice(0, 4);

  if (activeSchedules.length === 0) {
    return (
      <div className="bg-[#FCFAF6] dark:bg-[#171A21] p-5 rounded-xl border border-[#E6E1D8] dark:border-[#222733] shadow-xs">
        <div className="flex items-center justify-between mb-3 border-b border-[#EFECE5] dark:border-[#222733] pb-2.5">
          <div className="flex items-center gap-2">
            <RepeatIcon className="w-4 h-4 text-[#1E40AF] dark:text-blue-400" />
            <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Upcoming Bills
            </h3>
          </div>
          <Link
            to="/recurring"
            className="text-xs font-sans text-[#1E40AF] dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
          >
            Add <ArrowRightIcon className="w-3 h-3" />
          </Link>
        </div>
        <p className="text-xs font-sans text-zinc-500 dark:text-zinc-400 py-6 text-center">
          No recurring bills scheduled.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#FCFAF6] dark:bg-[#171A21] p-5 rounded-xl border border-[#E6E1D8] dark:border-[#222733] shadow-xs">
      <div className="flex items-center justify-between mb-4 border-b border-[#EFECE5] dark:border-[#222733] pb-2.5">
        <div className="flex items-center gap-2">
          <RepeatIcon className="w-4 h-4 text-[#1E40AF] dark:text-blue-400" />
          <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
            Upcoming Bills
          </h3>
        </div>
        <Link
          to="/recurring"
          className="text-xs font-sans text-[#1E40AF] dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
        >
          Manage <ArrowRightIcon className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-2.5">
        {activeSchedules.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 rounded-lg bg-[#FAF8F4] dark:bg-[#1C202B] border border-[#EBE6DD] dark:border-[#262D3D] hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
          >
            <div className="truncate pr-3">
              <span className="block text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                {item.description}
              </span>
              <span className="block text-[11px] font-sans text-zinc-500 dark:text-zinc-400 mt-0.5">
                Due: <strong className="font-medium text-zinc-700 dark:text-zinc-300">{formatDisplayDate(item.next_occurrence)}</strong>{' '}
                <span className="text-zinc-400 capitalize">({item.frequency})</span>
              </span>
            </div>

            <div className="text-right shrink-0 font-sans font-bold text-xs text-[#DC2626] dark:text-red-400">
              {formatINR(item.amount)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

