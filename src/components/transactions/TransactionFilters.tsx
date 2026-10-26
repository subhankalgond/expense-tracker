import React from 'react';
import { TransactionFiltersState, DateRangePreset } from '../../types/filters';
import { Category, PaymentMethod } from '../../types/database';
import { getDateRangeFromPreset } from '../../lib/date';
import { SearchIcon, FilterIcon, RefreshIcon } from '../ui/Icons';

interface TransactionFiltersProps {
  filters: TransactionFiltersState;
  onChange: (updated: Partial<TransactionFiltersState>) => void;
  onReset: () => void;
  categories: Category[];
  paymentMethods: PaymentMethod[];
  totalResults: number;
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  filters,
  onChange,
  onReset,
  categories,
  paymentMethods,
  totalResults,
}) => {
  return (
    <div className="brutal-card p-4 space-y-3 mb-6">
      {/* Top row: Search and Quick Type Toggle */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink-400">
            <SearchIcon className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search descriptions, notes, payees..."
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value, page: 1 })}
            className="brutal-input pl-9 text-xs"
          />
        </div>

        {/* Type pills */}
        <div className="flex items-center gap-1 border-2 border-ink-950 dark:border-zinc-600 p-0.5 bg-cream-100 dark:bg-zinc-800">
          {(['all', 'expense', 'income'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onChange({ type: t, page: 1 })}
              className={`px-3 py-1.5 text-xs font-mono font-bold uppercase transition-all ${
                filters.type === t
                  ? 'bg-ink-950 dark:bg-zinc-200 text-white dark:text-ink-950'
                  : 'text-ink-700 dark:text-zinc-300 hover:bg-cream-200 dark:hover:bg-zinc-700'
              }`}
            >
              {t === 'all' ? 'All Types' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Second row: Dropdowns for Category, Payment Method, Date Preset, and Amounts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
        {/* Category */}
        <div>
          <label className="text-[10px] font-mono font-bold uppercase text-ink-600 dark:text-zinc-400 block mb-1">
            Category
          </label>
          <select
            value={filters.categoryId}
            onChange={(e) => onChange({ categoryId: e.target.value, page: 1 })}
            className="brutal-input text-xs py-1.5 font-mono"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Method */}
        <div>
          <label className="text-[10px] font-mono font-bold uppercase text-ink-600 dark:text-zinc-400 block mb-1">
            Method
          </label>
          <select
            value={filters.paymentMethodId}
            onChange={(e) => onChange({ paymentMethodId: e.target.value, page: 1 })}
            className="brutal-input text-xs py-1.5 font-mono"
          >
            <option value="all">All Methods</option>
            {paymentMethods.map((pm) => (
              <option key={pm.id} value={pm.id}>
                {pm.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Preset */}
        <div>
          <label className="text-[10px] font-mono font-bold uppercase text-ink-600 dark:text-zinc-400 block mb-1">
            Period
          </label>
          <select
            value={filters.dateRange.preset}
            onChange={(e) => {
              const preset = e.target.value as DateRangePreset;
              onChange({ dateRange: getDateRangeFromPreset(preset), page: 1 });
            }}
            className="brutal-input text-xs py-1.5 font-mono"
          >
            <option value="this_month">This Month</option>
            <option value="this_week">This Week</option>
            <option value="last_month">Last Month</option>
            <option value="this_year">This Year</option>
            <option value="all">All Time</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {/* Min Amount */}
        <div>
          <label className="text-[10px] font-mono font-bold uppercase text-ink-600 dark:text-zinc-400 block mb-1">
            Min Amount (₹)
          </label>
          <input
            type="number"
            placeholder="Min ₹"
            value={filters.minAmount ?? ''}
            onChange={(e) =>
              onChange({
                minAmount: e.target.value ? parseFloat(e.target.value) : null,
                page: 1,
              })
            }
            className="brutal-input text-xs py-1.5 font-mono"
          />
        </div>

        {/* Max Amount */}
        <div>
          <label className="text-[10px] font-mono font-bold uppercase text-ink-600 dark:text-zinc-400 block mb-1">
            Max Amount (₹)
          </label>
          <input
            type="number"
            placeholder="Max ₹"
            value={filters.maxAmount ?? ''}
            onChange={(e) =>
              onChange({
                maxAmount: e.target.value ? parseFloat(e.target.value) : null,
                page: 1,
              })
            }
            className="brutal-input text-xs py-1.5 font-mono"
          />
        </div>

        {/* Reset & Status */}
        <div className="flex items-end">
          <button
            type="button"
            onClick={onReset}
            className="w-full brutal-btn-secondary py-1.5 text-xs flex items-center justify-center gap-1.5"
            title="Reset all filters"
          >
            <RefreshIcon className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Custom dates bar if custom range selected */}
      {filters.dateRange.preset === 'custom' && (
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-ink-200 dark:border-zinc-700">
          <div>
            <label className="text-[10px] font-mono font-bold uppercase text-ink-600 dark:text-zinc-400 block mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={filters.dateRange.startDate}
              onChange={(e) =>
                onChange({
                  dateRange: {
                    ...filters.dateRange,
                    startDate: e.target.value,
                  },
                  page: 1,
                })
              }
              className="brutal-input text-xs font-mono"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono font-bold uppercase text-ink-600 dark:text-zinc-400 block mb-1">
              End Date
            </label>
            <input
              type="date"
              value={filters.dateRange.endDate}
              onChange={(e) =>
                onChange({
                  dateRange: {
                    ...filters.dateRange,
                    endDate: e.target.value,
                  },
                  page: 1,
                })
              }
              className="brutal-input text-xs font-mono"
            />
          </div>
        </div>
      )}

      {/* Result metrics bar */}
      <div className="flex items-center justify-between text-[11px] font-mono text-ink-500 dark:text-zinc-400 pt-1">
        <div className="flex items-center gap-1.5">
          <FilterIcon className="w-3 h-3 text-cobalt" />
          <span>
            MATCHING ENTRIES: <strong className="text-ink-950 dark:text-zinc-100">{totalResults}</strong>
          </span>
        </div>
        <div>
          <span>
            DATE WINDOW: <strong>{filters.dateRange.startDate}</strong> TO <strong>{filters.dateRange.endDate}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
