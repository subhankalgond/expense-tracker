import React from 'react';
import { Transaction } from '../../types/database';
import { SortField, SortOrder } from '../../types/filters';
import { formatINR } from '../../lib/currency';
import { formatDisplayDate } from '../../lib/date';
import { Badge } from '../ui/Badge';
import { EditIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon } from '../ui/Icons';
import { EmptyState } from '../ui/EmptyState';

interface TransactionTableProps {
  transactions: Transaction[];
  totalCount: number;
  page: number;
  pageSize: number;
  sortField: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField) => void;
  onPageChange: (newPage: number) => void;
  onEdit: (tx: Transaction) => void;
  onDelete: (tx: Transaction) => void;
  onAddNew: () => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  totalCount,
  page,
  pageSize,
  sortField,
  sortOrder,
  onSortChange,
  onPageChange,
  onEdit,
  onDelete,
  onAddNew,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) return <span className="opacity-30 ml-1 text-xs">↕</span>;
    return <span className="ml-1 text-[#1E40AF] font-bold text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>;
  };

  if (transactions.length === 0) {
    return (
      <EmptyState
        title="No Transactions Found"
        description="No financial ledger entries match your filter criteria or date range."
        actionLabel="Record Transaction"
        onAction={onAddNew}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block rounded-xl border border-[#E6E1D8] dark:border-[#222733] bg-[#FCFAF6] dark:bg-[#171A21] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F5F2EA] dark:bg-[#1A1E29] border-b border-[#E6E1D8] dark:border-[#222733]">
                <th
                  onClick={() => onSortChange('date')}
                  className="py-3 px-4 text-[11px] font-sans font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 cursor-pointer select-none hover:text-zinc-900 dark:hover:text-zinc-200"
                >
                  Date {renderSortIndicator('date')}
                </th>
                <th className="py-3 px-4 text-[11px] font-sans font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                  Type
                </th>
                <th
                  onClick={() => onSortChange('description')}
                  className="py-3 px-4 text-[11px] font-sans font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 cursor-pointer select-none hover:text-zinc-900 dark:hover:text-zinc-200"
                >
                  Description / Payee {renderSortIndicator('description')}
                </th>
                <th className="py-3 px-4 text-[11px] font-sans font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                  Category
                </th>
                <th className="py-3 px-4 text-[11px] font-sans font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                  Method
                </th>
                <th
                  onClick={() => onSortChange('amount')}
                  className="py-3 px-4 text-[11px] font-sans font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 text-right cursor-pointer select-none hover:text-zinc-900 dark:hover:text-zinc-200"
                >
                  Amount (INR) {renderSortIndicator('amount')}
                </th>
                <th className="py-3 px-4 text-[11px] font-sans font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE5] dark:divide-[#1E2330]">
              {transactions.map((tx) => {
                const isIncome = tx.type === 'income';
                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-[#F8F5EE] dark:hover:bg-[#1C202B] transition-colors"
                  >
                    <td className="py-3 px-4 text-xs font-sans text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                      {formatDisplayDate(tx.date)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge variant={isIncome ? 'income' : 'expense'}>
                        {tx.type}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate">
                      <div className="font-sans font-semibold text-xs text-[#121826] dark:text-zinc-100">
                        {tx.description}
                      </div>
                      {tx.notes && (
                        <div className="text-[11px] font-sans text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                          {tx.notes}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs font-sans whitespace-nowrap">
                      {tx.category ? (
                        <span className="inline-flex items-center gap-1.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: tx.category.color }}
                          />
                          <span className="text-zinc-800 dark:text-zinc-200">{tx.category.name}</span>
                        </span>
                      ) : (
                        <span className="text-zinc-400">Uncategorized</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs font-sans text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                      {tx.payment_method?.name || 'Cash'}
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-sans font-bold tabular-nums whitespace-nowrap text-xs ${
                        isIncome ? 'text-[#16A34A] dark:text-emerald-400' : 'text-[#121826] dark:text-zinc-100'
                      }`}
                    >
                      {isIncome ? '+ ' : '- '}
                      {formatINR(tx.amount)}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onEdit(tx)}
                          aria-label={`Edit ${tx.description}`}
                          className="p-1.5 rounded-md border border-[#E0DBD0] dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-[#F2EFE8] dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors shadow-xs"
                          title="Edit transaction"
                        >
                          <EditIcon className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(tx)}
                          aria-label={`Delete ${tx.description}`}
                          className="p-1.5 rounded-md border border-[#E0DBD0] dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-[#DC2626] transition-colors shadow-xs"
                          title="Delete transaction"
                        >
                          <TrashIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {transactions.map((tx) => {
          const isIncome = tx.type === 'income';
          return (
            <div
              key={tx.id}
              className="p-4 rounded-xl border border-[#E6E1D8] dark:border-[#222733] bg-[#FCFAF6] dark:bg-[#171A21] shadow-xs flex flex-col justify-between space-y-2.5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge variant={isIncome ? 'income' : 'expense'}>
                      {tx.type}
                    </Badge>
                    <span className="text-[11px] font-sans text-zinc-500 dark:text-zinc-400">
                      {formatDisplayDate(tx.date)}
                    </span>
                  </div>
                  <h4 className="font-sans font-semibold text-sm text-[#121826] dark:text-zinc-100">
                    {tx.description}
                  </h4>
                </div>

                <div
                  className={`text-right font-sans font-bold text-sm tabular-nums ${
                    isIncome ? 'text-[#16A34A] dark:text-emerald-400' : 'text-[#121826] dark:text-zinc-100'
                  }`}
                >
                  {isIncome ? '+ ' : '- '}
                  {formatINR(tx.amount)}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-sans text-zinc-600 dark:text-zinc-400 pt-2 border-t border-[#EFECE5] dark:border-[#1E2330]">
                <span className="truncate max-w-[170px]">
                  {tx.category?.name || 'General'} • {tx.payment_method?.name || 'Cash'}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onEdit(tx)}
                    className="p-1.5 rounded-md border border-[#E0DBD0] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    title="Edit"
                  >
                    <EditIcon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(tx)}
                    className="p-1.5 rounded-md border border-[#E0DBD0] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[#DC2626]"
                    title="Delete"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Bar */}
      <div className="flex items-center justify-between px-2 pt-2 text-xs font-sans">
        <span className="text-zinc-600 dark:text-zinc-400">
          Showing <strong className="text-zinc-900 dark:text-zinc-100">{(page - 1) * pageSize + 1}</strong> to{' '}
          <strong className="text-zinc-900 dark:text-zinc-100">{Math.min(page * pageSize, totalCount)}</strong> of{' '}
          <strong className="text-zinc-900 dark:text-zinc-100">{totalCount}</strong> entries
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="p-1.5 rounded-lg border border-[#E0DBD0] dark:border-zinc-700 bg-white dark:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed shadow-xs hover:bg-[#F2EFE8] dark:hover:bg-zinc-700 transition-colors"
            title="Previous page"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          <span className="px-2 font-semibold text-zinc-900 dark:text-zinc-100">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="p-1.5 rounded-lg border border-[#E0DBD0] dark:border-zinc-700 bg-white dark:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed shadow-xs hover:bg-[#F2EFE8] dark:hover:bg-zinc-700 transition-colors"
            title="Next page"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

