import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../lib/dataService';
import { RecurringTransaction, Category, PaymentMethod } from '../types/database';
import { formatINR } from '../lib/currency';
import { formatDisplayDate } from '../lib/date';
import { RecurringModal } from '../components/recurring/RecurringModal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { Badge } from '../components/ui/Badge';
import {
  PlusIcon,
  RefreshIcon,
  RepeatIcon,
  EditIcon,
  TrashIcon,
  CheckIcon,
  AlertTriangleIcon,
} from '../components/ui/Icons';

export const RecurringPage: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id || 'demo-user';

  const [recurring, setRecurring] = useState<RecurringTransaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processNotification, setProcessNotification] = useState<string | null>(null);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recurringToEdit, setRecurringToEdit] = useState<RecurringTransaction | null>(null);
  const [recurringToDelete, setRecurringToDelete] = useState<RecurringTransaction | null>(null);

  const loadRecurring = async () => {
    setIsLoading(true);
    try {
      const [cats, pms, list] = await Promise.all([
        dataService.getCategories(userId),
        dataService.getPaymentMethods(userId),
        dataService.getRecurringTransactions(userId),
      ]);
      setCategories(cats);
      setPaymentMethods(pms);
      setRecurring(list);
    } catch (err) {
      console.warn('Failed to load recurring list:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRecurring();
  }, [userId]);

  const handleSaveRecurring = async (values: any) => {
    if (recurringToEdit) {
      await dataService.deleteRecurringTransaction(userId, recurringToEdit.id);
      await dataService.addRecurringTransaction(userId, {
        ...values,
        next_occurrence: values.start_date,
      });
    } else {
      await dataService.addRecurringTransaction(userId, {
        ...values,
        next_occurrence: values.start_date,
      });
    }
    await loadRecurring();
  };

  const handleToggleStatus = async (item: RecurringTransaction) => {
    const nextStatus = item.status === 'active' ? 'paused' : 'active';
    await dataService.toggleRecurringStatus(userId, item.id, nextStatus);
    await loadRecurring();
  };

  const handleDelete = async () => {
    if (recurringToDelete) {
      await dataService.deleteRecurringTransaction(userId, recurringToDelete.id);
      setRecurringToDelete(null);
      await loadRecurring();
    }
  };

  const handleTriggerProcessor = async () => {
    setIsProcessing(true);
    setProcessNotification(null);
    try {
      const res = await dataService.triggerRecurringRun(userId);
      setProcessNotification(
        res.processed > 0
          ? `Successfully processed and committed ${res.processed} scheduled transaction(s) to the ledger.`
          : 'All active schedules are currently up to date. Zero due occurrences.'
      );
      await loadRecurring();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Processing failed';
      setProcessNotification(`Error: ${msg}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const totalMonthlyCommitment = recurring
    .filter((r) => r.status === 'active' && r.type === 'expense')
    .reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-6">
      {/* Editorial Folio */}
      <div className="editorial-masthead">
        <div>FOLIO № 31 • SCHEDULED OUTLAYS & RECURRENT OBLIGATIONS</div>
        <div className="hidden md:block">IDEMPOTENT ATOMICITY: RFC 4122 PROTECTED</div>
        <div>PERIODIC REGISTER</div>
      </div>

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-[#E6E1D8] dark:border-[#222733] pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#121826] dark:text-zinc-100 tracking-tight">
            Recurring Bills & Subscriptions
          </h2>
          <p className="text-xs font-sans text-zinc-500 dark:text-zinc-400 mt-0.5">
            Automated recurring schedules and upcoming liabilities
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleTriggerProcessor}
            disabled={isProcessing}
            className="inline-flex items-center justify-center font-sans font-semibold text-xs px-3.5 py-2 bg-white dark:bg-[#1A1F29] text-[#121826] dark:text-zinc-200 border border-[#DDD7CE] dark:border-[#2D3442] rounded-lg shadow-sm hover:bg-[#F2EFE8] dark:hover:bg-[#222936] transition-all disabled:opacity-50"
            title="Execute due recurring transactions idempotently"
          >
            <RepeatIcon className={`w-3.5 h-3.5 mr-1.5 ${isProcessing ? 'animate-spin' : ''}`} />
            <span>{isProcessing ? 'Processing...' : 'Run Due Engine'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setRecurringToEdit(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center font-sans font-semibold text-xs px-3.5 py-2 bg-[#1E40AF] text-white rounded-lg shadow-sm hover:bg-[#1D3694] transition-all"
          >
            <PlusIcon className="w-4 h-4 mr-1.5" />
            <span>Add Schedule</span>
          </button>
        </div>
      </div>

      {/* Execution Feedback Banner */}
      {processNotification && (
        <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs font-sans text-[#1E40AF] dark:text-blue-300 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckIcon className="w-4 h-4 text-[#1E40AF]" />
            <span>{processNotification}</span>
          </div>
          <button
            type="button"
            onClick={() => setProcessNotification(null)}
            className="text-[11px] font-semibold underline ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Recurring Commitment Control Bar */}
      <div className="rounded-xl border border-[#E6E1D8] dark:border-[#222733] bg-[#FCFAF6] dark:bg-[#171A21] shadow-xs grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E6E1D8] dark:divide-[#222733] overflow-hidden">
        <div className="p-4">
          <span className="text-[11px] font-sans font-medium uppercase text-zinc-500 dark:text-zinc-400 block mb-1">
            Active Commitments
          </span>
          <span className="text-xl font-bold font-serif tabular-nums text-zinc-900 dark:text-zinc-100">
            {recurring.filter((r) => r.status === 'active').length} Schedules
          </span>
        </div>

        <div className="p-4">
          <span className="text-[11px] font-sans font-medium uppercase text-zinc-500 dark:text-zinc-400 block mb-1">
            Monthly Committed Outflow
          </span>
          <span className="text-xl font-bold font-serif tabular-nums text-[#DC2626]">
            {formatINR(totalMonthlyCommitment)}
          </span>
        </div>

        <div className="p-4">
          <span className="text-[11px] font-sans font-medium uppercase text-zinc-500 dark:text-zinc-400 block mb-1">
            Annualized Impact
          </span>
          <span className="text-xl font-bold font-serif tabular-nums text-zinc-900 dark:text-zinc-100">
            {formatINR(totalMonthlyCommitment * 12)}
          </span>
        </div>

        <div className="p-4 bg-[#F8F5EE] dark:bg-[#141720]">
          <span className="text-[11px] font-sans font-medium uppercase text-zinc-500 dark:text-zinc-400 block mb-1">
            Scheduler Protection
          </span>
          <span className="text-xs font-semibold text-[#1E40AF] dark:text-blue-400 block mt-1">
            Idempotent Atomic Execution
          </span>
        </div>
      </div>

      {/* Recurring Table */}
      {recurring.length === 0 ? (
        <EmptyState
          title="No Recurring Commitments Scheduled"
          description="Schedule automated monthly utilities, rent, streaming subscriptions, or recurring client retainer fees."
          actionLabel="Create Schedule"
          onAction={() => {
            setRecurringToEdit(null);
            setIsModalOpen(true);
          }}
          icon={<RepeatIcon className="w-8 h-8" />}
        />
      ) : (
        <div className="rounded-xl border border-[#E6E1D8] dark:border-[#222733] bg-[#FCFAF6] dark:bg-[#171A21] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F5F2EA] dark:bg-[#1A1E29] border-b border-[#E6E1D8] dark:border-[#222733] text-[11px] font-sans font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Frequency</th>
                  <th className="py-3 px-4">Next Due Date</th>
                  <th className="py-3 px-4">Category / Method</th>
                  <th className="py-3 px-4 text-right">Amount (INR)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFECE5] dark:divide-[#1E2330]">
                {recurring.map((item) => {
                  const isDue = item.status === 'active' && item.next_occurrence <= todayStr;
                  const isExpense = item.type === 'expense';

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-[#F8F5EE] dark:hover:bg-[#1C202B] transition-colors text-xs font-sans"
                    >
                      <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">
                        {item.description}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={isExpense ? 'expense' : 'income'}>
                          {item.type}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 capitalize text-zinc-600 dark:text-zinc-400">
                        {item.frequency}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {isDue && (
                            <span
                              className="text-amber-600 dark:text-amber-400"
                              title="Schedule is currently due for generation"
                            >
                              <AlertTriangleIcon className="w-3.5 h-3.5" />
                            </span>
                          )}
                          <span className={isDue ? 'font-semibold text-amber-700 dark:text-amber-400' : 'text-zinc-600 dark:text-zinc-300'}>
                            {formatDisplayDate(item.next_occurrence)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">
                        {item.category?.name || 'Category'} • {item.payment_method?.name || 'Cash'}
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-bold tabular-nums ${
                          isExpense ? 'text-[#DC2626]' : 'text-[#16A34A]'
                        }`}
                      >
                        {isExpense ? '- ' : '+ '}
                        {formatINR(item.amount)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item)}
                          className={`text-[10px] font-sans font-semibold uppercase px-2.5 py-0.5 rounded-full border transition-colors ${
                            item.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                              : 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'
                          }`}
                          title="Click to toggle status"
                        >
                          {item.status}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setRecurringToEdit(item);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 rounded-md border border-[#E0DBD0] dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-[#F2EFE8] text-zinc-700 dark:text-zinc-300 shadow-xs"
                            title="Edit"
                          >
                            <EditIcon className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setRecurringToDelete(item)}
                            className="p-1.5 rounded-md border border-[#E0DBD0] dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-red-50 text-[#DC2626] shadow-xs"
                            title="Delete"
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
      )}

      {/* Scheduler Technical Notice */}
      <div className="p-3 border border-ink-950/20 dark:border-zinc-700 bg-cream-100/50 dark:bg-zinc-900/30 text-[10px] font-mono text-ink-500 dark:text-zinc-400">
        <span className="font-bold uppercase text-ink-800 dark:text-zinc-300 block mb-1">
          Backend Automation Architecture:
        </span>
        Recurring schedules generate actual transaction journal rows using unique compound keys (`recurring_id_date`) to ensure total idempotency. Scheduler retries will never generate duplicate transaction records.
      </div>

      {/* Modals */}
      <RecurringModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setRecurringToEdit(null);
        }}
        onSubmit={handleSaveRecurring}
        recurringToEdit={recurringToEdit}
        categories={categories}
        paymentMethods={paymentMethods}
      />

      <ConfirmDialog
        isOpen={Boolean(recurringToDelete)}
        onClose={() => setRecurringToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Recurring Schedule"
        message={`Delete schedule "${recurringToDelete?.description}"? Previously generated transactions in the journal remain unchanged.`}
        confirmLabel="Confirm Delete"
      />
    </div>
  );
};
