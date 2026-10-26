import React from 'react';
import { DateRange, DateRangePreset } from '../../types/filters';
import { getDateRangeFromPreset } from '../../lib/date';
import { CalendarIcon } from '../ui/Icons';

interface DateRangeSelectorProps {
  currentRange: DateRange;
  onChange: (range: DateRange) => void;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  currentRange,
  onChange,
}) => {
  const presets: Array<{ key: DateRangePreset; label: string }> = [
    { key: 'this_week', label: 'This Week' },
    { key: 'this_month', label: 'This Month' },
    { key: 'last_month', label: 'Last Month' },
    { key: 'this_year', label: 'This Year' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-2.5 p-2.5 bg-cream-50 dark:bg-brutal-darkCard border-2 border-ink-950 dark:border-zinc-700 shadow-brutal-sm">
      <div className="flex items-center gap-2">
        <div className="p-1.5 border border-ink-950 dark:border-zinc-600 bg-cream-200 dark:bg-zinc-800">
          <CalendarIcon className="w-3.5 h-3.5 text-cobalt" />
        </div>
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink-950 dark:text-zinc-100">
          Period: <span className="text-cobalt dark:text-blue-400">{currentRange.label}</span>
        </span>
        <span className="hidden sm:inline text-[11px] font-mono text-ink-500 dark:text-zinc-400">
          ({currentRange.startDate} — {currentRange.endDate})
        </span>
      </div>

      <div className="flex items-center gap-1">
        {presets.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => onChange(getDateRangeFromPreset(p.key))}
            className={`px-2.5 py-1 text-[11px] font-mono font-bold uppercase border-2 transition-all ${
              currentRange.preset === p.key
                ? 'bg-ink-950 dark:bg-white text-white dark:text-ink-950 border-ink-950 dark:border-white shadow-brutal-sm'
                : 'bg-white dark:bg-zinc-800 text-ink-800 dark:text-zinc-300 border-ink-950 dark:border-zinc-600 hover:bg-cream-200 dark:hover:bg-zinc-700'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
};
