import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Transaction, Category } from '../../types/database';
import { formatINR } from '../../lib/currency';
import { formatDisplayDate } from '../../lib/date';
import { Badge } from '../ui/Badge';
import {
  EditIcon,
  TrashIcon,
  SearchIcon,
  PlusIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '../ui/Icons';
import { EmptyState } from '../ui/EmptyState';

interface RecentTransactionsWidgetProps {
  transactions: Transaction[];
  categories: Category[];
  onEdit: (tx: Transaction) => void;
  onDelete: (tx: Transaction) => void;
  onAddIncome: () => void;
  onAddExpense: () => void;
}

export const RecentTransactionsWidget: React.FC<RecentTransactionsWidgetProps> = ({
  transactions,
  categories,
  onEdit,
  onDelete,
  onAddIncome,
  onAddExpense,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Filter and sort transactions
  const filteredList = useMemo(() => {
    return transactions
      .filter((tx) => {
        if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
        if (selectedCategory !== 'all' && tx.category_id !== selectedCategory) return false;
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchDesc = tx.description.toLowerCase().includes(q);
          const matchCat = tx.category?.name.toLowerCase().includes(q) || false;
          const matchMethod = tx.payment_method?.name.toLowerCase().includes(q) || false;
          if (!matchDesc && !matchCat && !matchMethod) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortOrder === 'desc') return b.date.localeCompare(a.date);
        return a.date.localeCompare(b.date);
      });
  }, [transactions, typeFilter, selectedCategory, searchTerm, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredList.length / pageSize));
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredList.slice(start, start + pageSize);
  }, [filteredList, currentPage]);

  return (
    <div className="bg-[#FCFAF6] dark:bg-[#171A21] p-5 rounded-xl border border-[#E6E1D8] dark:border-[#222733] shadow-xs flex flex-col justify-between">
      <div>
        {/* Top Header & Quick Add Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-[#EFECE5] dark:border-[#222733] pb-3">
          <div>
            <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Recent Transactions
            </h3>
            <p className="text-[11px] font-sans text-zinc-500 dark:text-zinc-400">
              Latest financial activity recorded in current cycle
            </p>
          </div>

          {/* Add Income and Add Expense Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onAddIncome}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-sans font-semibold bg-[#16A34A] hover:bg-emerald-700 text-white shadow-xs transition-colors"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              <span>Add Income</span>
            </button>
            <button
              type="button"
              onClick={onAddExpense}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-sans font-semibold bg-[#DC2626] hover:bg-red-700 text-white shadow-xs transition-colors"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              <span>Add Expense</span>
            </button>
            <Link
              to="/transactions"
              className="text-xs font-sans text-[#1E40AF] dark:text-blue-400 font-semibold hover:underline flex items-center gap-0.5 ml-1"
            >
              View All <ArrowRightIcon className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
          {/* Search Input */}
          <div className="relative sm:col-span-1">
            <SearchIcon className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Filter entries..."
              className="w-full pl-8 pr-2.5 py-1.5 text-xs font-sans rounded-lg border border-[#E0DBD0] dark:border-[#2A303F] bg-white dark:bg-[#181C26] text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#1E40AF]"
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 text-xs font-sans rounded-lg border border-[#E0DBD0] dark:border-[#2A303F] bg-white dark:bg-[#181C26] text-zinc-800 dark:text-zinc-200 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="income">Income Only</option>
            <option value="expense">Expenses Only</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 text-xs font-sans rounded-lg border border-[#E0DBD0] dark:border-[#2A303F] bg-white dark:bg-[#181C26] text-zinc-800 dark:text-zinc-200 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Transactions Table / List */}
        {paginatedList.length === 0 ? (
          <div className="py-8 text-center text-xs font-sans text-zinc-400">
            No transactions matching current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#EFECE5] dark:border-[#222733] text-[10px] font-sans font-semibold uppercase tracking-wider text-zinc-500">
                  <th
                    className="py-2 cursor-pointer select-none"
                    onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
                  >
                    Date {sortOrder === 'desc' ? '↓' : '↑'}
                  </th>
                  <th className="py-2">Description</th>
                  <th className="py-2">Category</th>
                  <th className="py-2">Method</th>
                  <th className="py-2 text-right">Amount</th>
                  <th className="py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFECE5] dark:divide-[#1E2330]">
                {paginatedList.map((tx) => {
                  const isIncome = tx.type === 'income';
                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-[#F8F5EE] dark:hover:bg-[#1C202B] transition-colors text-xs font-sans"
                    >
                      <td className="py-2.5 text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                        {formatDisplayDate(tx.date)}
                      </td>
                      <td className="py-2.5 font-medium text-zinc-900 dark:text-zinc-100 max-w-[140px] truncate">
                        {tx.description}
                      </td>
                      <td className="py-2.5 whitespace-nowrap">
                        {tx.category ? (
                          <span className="inline-flex items-center gap-1.5">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: tx.category.color }}
                            />
                            <span className="text-zinc-700 dark:text-zinc-300">{tx.category.name}</span>
                          </span>
                        ) : (
                          <span className="text-zinc-400">Uncategorized</span>
                        )}
                      </td>
                      <td className="py-2.5 text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                        {tx.payment_method?.name || 'Cash'}
                      </td>
                      <td
                        className={`py-2.5 text-right font-bold tabular-nums whitespace-nowrap ${
                          isIncome ? 'text-[#16A34A] dark:text-emerald-400' : 'text-[#DC2626] dark:text-red-400'
                        }`}
                      >
                        {isIncome ? '+ ' : '- '}
                        {formatINR(tx.amount)}
                      </td>
                      <td className="py-2.5 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => onEdit(tx)}
                            aria-label={`Edit ${tx.description}`}
                            className="p-1 rounded border border-[#E0DBD0] dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-[#F2EFE8] text-zinc-700 dark:text-zinc-300"
                            title="Edit"
                          >
                            <EditIcon className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(tx)}
                            aria-label={`Delete ${tx.description}`}
                            className="p-1 rounded border border-[#E0DBD0] dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-red-50 text-[#DC2626]"
                            title="Delete"
                          >
                            <TrashIcon className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#EFECE5] dark:border-[#222733] text-xs font-sans text-zinc-500">
        <span>
          Showing {filteredList.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}-
          {Math.min(currentPage * pageSize, filteredList.length)} of {filteredList.length}
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="p-1 rounded-md border border-[#E0DBD0] dark:border-zinc-700 bg-white dark:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#F2EFE8]"
          >
            <ChevronLeftIcon className="w-3.5 h-3.5" />
          </button>
          <span className="px-1.5 font-medium text-zinc-800 dark:text-zinc-200">
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="p-1 rounded-md border border-[#E0DBD0] dark:border-zinc-700 bg-white dark:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#F2EFE8]"
          >
            <ChevronRightIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
