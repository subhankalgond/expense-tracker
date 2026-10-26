import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../lib/dataService';
import { Category, PaymentMethod } from '../types/database';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Modal } from '../components/ui/Modal';
import { PlusIcon, TrashIcon, ShieldIcon, CheckIcon } from '../components/ui/Icons';
import { formatINR } from '../lib/currency';

export const SettingsPage: React.FC = () => {
  const { user, profile, updateProfileState, signOut } = useAuth();
  const userId = user?.id || 'demo-user';

  const [categories, setCategories] = useState<Category[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [openingBalance, setOpeningBalance] = useState<number>(profile?.opening_balance || 0);

  // Notifications
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [billReminders, setBillReminders] = useState(true);

  // Category Add Modal
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState<'expense' | 'income' | 'both'>('expense');

  // Payment Method Modal
  const [isPmModalOpen, setIsPmModalOpen] = useState(false);
  const [newPmName, setNewPmName] = useState('');
  const [newPmType, setNewPmType] = useState<'cash' | 'upi' | 'debit_card' | 'credit_card' | 'bank_transfer' | 'other'>('upi');

  // Deletion modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const loadSettingsData = async () => {
    try {
      const [cats, pms] = await Promise.all([
        dataService.getCategories(userId),
        dataService.getPaymentMethods(userId),
      ]);
      setCategories(cats);
      setPaymentMethods(pms);
      if (profile) {
        setOpeningBalance(profile.opening_balance || 0);
      }
    } catch (err) {
      console.warn('Failed to load settings data:', err);
    }
  };

  useEffect(() => {
    loadSettingsData();
  }, [userId, profile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfileState({
      opening_balance: openingBalance,
    });
    setSaveMessage('Profile and balance preferences saved.');
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    await dataService.addCategory(userId, {
      name: newCatName.trim(),
      type: newCatType,
      color: newCatType === 'income' ? '#047857' : '#C2410C',
      icon: 'tag',
      is_archived: false,
    });
    setNewCatName('');
    setIsCatModalOpen(false);
    await loadSettingsData();
  };

  const handleAddPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPmName.trim()) return;
    await dataService.addPaymentMethod(userId, {
      name: newPmName.trim(),
      type: newPmType,
      is_archived: false,
    });
    setNewPmName('');
    setIsPmModalOpen(false);
    await loadSettingsData();
  };

  const handleExportFullAccountBackup = async () => {
    const tx = await dataService.getTransactions(userId);
    const budgets = await dataService.getBudgets(userId);
    const goals = await dataService.getSavingsGoals(userId);
    const recurring = await dataService.getRecurringTransactions(userId);

    const fullBackup = {
      user_id: userId,
      export_timestamp: new Date().toISOString(),
      profile,
      categories,
      payment_methods: paymentMethods,
      transactions: tx.data,
      budgets,
      savings_goals: goals,
      recurring_schedules: recurring,
    };

    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ledger_backup_${userId}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleConfirmAccountDeletion = async () => {
    if (deleteConfirmationText !== 'DELETE') return;
    await dataService.deleteUserAccountData(userId);
    setIsDeleteModalOpen(false);
    await signOut();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Header */}
      <div className="border-b-2 border-ink-950 dark:border-zinc-700 pb-4">
        <h2 className="text-base font-black font-mono uppercase tracking-wider text-ink-950 dark:text-zinc-100">
          Ledger Configuration & Data Sovereignty
        </h2>
        <p className="text-xs font-mono text-ink-500 dark:text-zinc-400">
          Accounting currency, opening reserves, custom categories, and data erasure
        </p>
      </div>

      {saveMessage && (
        <div className="p-3 bg-emerald-100 dark:bg-emerald-950/40 border-2 border-emerald-800 text-emerald-900 dark:text-emerald-300 font-mono text-xs flex items-center gap-2">
          <CheckIcon className="w-4 h-4 text-emerald-700" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Profile & Currency Form */}
      <div className="brutal-card p-5">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-ink-950 dark:text-zinc-100 mb-4 border-b-2 border-ink-950 dark:border-zinc-700 pb-2">
          Fiscal Profile & Balances
        </h3>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="brutal-label">Account Identification</label>
              <input
                type="text"
                disabled
                value={user?.email || 'auditor@ledgerbrutalist.internal'}
                className="brutal-input bg-cream-200 dark:bg-zinc-800 cursor-not-allowed font-mono text-xs"
              />
            </div>

            <div>
              <label className="brutal-label">Ledger Currency Format</label>
              <div className="p-2 bg-cream-100 dark:bg-zinc-800 border-2 border-ink-950 dark:border-zinc-600 font-mono text-xs font-bold flex justify-between items-center">
                <span>Indian Rupee (INR - ₹)</span>
                <span className="text-[10px] bg-cobalt text-white px-1.5 py-0.5">MANDATED</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="opening_bal" className="brutal-label">
                Initial Opening Balance (₹ INR)
              </label>
              <input
                id="opening_bal"
                type="number"
                step="0.01"
                min="0"
                value={openingBalance}
                onChange={(e) => setOpeningBalance(parseFloat(e.target.value) || 0)}
                className="brutal-input font-mono font-bold text-sm"
              />
              <span className="text-[10px] font-mono text-ink-500 mt-1 block">
                Calculated balance preview: {formatINR(openingBalance)}
              </span>
            </div>

            <div>
              <label className="brutal-label">Accounting Timezone</label>
              <input
                type="text"
                disabled
                value={profile?.timezone || 'Asia/Kolkata (IST +05:30)'}
                className="brutal-input bg-cream-200 dark:bg-zinc-800 cursor-not-allowed font-mono text-xs"
              />
            </div>
          </div>

          <button type="submit" className="brutal-btn-primary">
            Save Preferences
          </button>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="brutal-card p-5">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-ink-950 dark:text-zinc-100 mb-4 border-b-2 border-ink-950 dark:border-zinc-700 pb-2">
          Notification Directives
        </h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 text-xs font-mono cursor-pointer">
            <input
              type="checkbox"
              checked={budgetAlerts}
              onChange={(e) => setBudgetAlerts(e.target.checked)}
              className="w-4 h-4 border-2 border-ink-950 accent-cobalt rounded-none"
            />
            <span>Broadcast in-app alert when category spending reaches 75% or 90% threshold</span>
          </label>
          <label className="flex items-center gap-3 text-xs font-mono cursor-pointer">
            <input
              type="checkbox"
              checked={billReminders}
              onChange={(e) => setBillReminders(e.target.checked)}
              className="w-4 h-4 border-2 border-ink-950 accent-cobalt rounded-none"
            />
            <span>Highlight upcoming recurring liabilities due within 7 days</span>
          </label>
        </div>
      </div>

      {/* Categories Management */}
      <div className="brutal-card p-5">
        <div className="flex items-center justify-between mb-4 border-b-2 border-ink-950 dark:border-zinc-700 pb-2">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-ink-950 dark:text-zinc-100">
            Accounting Categories ({categories.length})
          </h3>
          <button
            type="button"
            onClick={() => setIsCatModalOpen(true)}
            className="brutal-btn-secondary py-1 text-xs flex items-center gap-1"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            <span>Add Category</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {categories.map((c) => (
            <div
              key={c.id}
              className="p-2 border border-ink-950/30 dark:border-zinc-700 bg-cream-100 dark:bg-zinc-800 text-xs font-mono flex items-center justify-between"
            >
              <div className="flex items-center gap-2 truncate pr-2">
                <span
                  className="w-2.5 h-2.5 border border-ink-950 shrink-0"
                  style={{ backgroundColor: c.color }}
                />
                <span className="truncate">{c.name}</span>
              </div>
              <span className="text-[9px] uppercase font-bold text-ink-500">
                {c.type}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Methods Management */}
      <div className="brutal-card p-5">
        <div className="flex items-center justify-between mb-4 border-b-2 border-ink-950 dark:border-zinc-700 pb-2">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-ink-950 dark:text-zinc-100">
            Settlement Instruments ({paymentMethods.length})
          </h3>
          <button
            type="button"
            onClick={() => setIsPmModalOpen(true)}
            className="brutal-btn-secondary py-1 text-xs flex items-center gap-1"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            <span>Add Instrument</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {paymentMethods.map((pm) => (
            <div
              key={pm.id}
              className="p-2 border border-ink-950/30 dark:border-zinc-700 bg-cream-100 dark:bg-zinc-800 text-xs font-mono flex items-center justify-between"
            >
              <span className="truncate">{pm.name}</span>
              <span className="text-[9px] uppercase font-bold text-ink-500">
                {pm.type}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Data Sovereignty & Account Erasure */}
      <div className="brutal-card p-5 border-2 border-ink-950 dark:border-zinc-700 bg-red-50/20 dark:bg-red-950/20 space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-red-100 text-brutal-red border border-brutal-red dark:bg-red-950/60 dark:text-red-300 dark:border-red-800">
              IRREVERSIBLE DATA ACTIONS
            </span>
          </div>
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-brutal-red mb-1">
            Data Sovereignty & Permanent Erasure
          </h3>
          <p className="text-xs font-mono text-ink-600 dark:text-zinc-400">
            Export a full JSON archive of your transactions and accounting rules, or purge all database records under GDPR standards.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportFullAccountBackup}
            className="brutal-btn-secondary"
          >
            Export Complete JSON Ledger
          </button>
          <button
            type="button"
            onClick={() => {
              setDeleteConfirmationText('');
              setIsDeleteModalOpen(true);
            }}
            className="brutal-btn-danger"
          >
            <TrashIcon className="w-3.5 h-3.5 mr-1.5" />
            <span>Delete Account & Purge Records</span>
          </button>
        </div>
      </div>

      {/* Add Category Modal */}
      <Modal isOpen={isCatModalOpen} onClose={() => setIsCatModalOpen(false)} title="Add Ledger Category">
        <form onSubmit={handleAddCategory} className="space-y-4">
          <div>
            <label className="brutal-label">Category Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Pet Care, Software Subscriptions"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="brutal-input text-xs"
            />
          </div>
          <div>
            <label className="brutal-label">Classification</label>
            <select
              value={newCatType}
              onChange={(e) => setNewCatType(e.target.value as any)}
              className="brutal-input text-xs font-mono"
            >
              <option value="expense">Expense (-)</option>
              <option value="income">Income (+)</option>
              <option value="both">Both Inflows & Outflows</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setIsCatModalOpen(false)} className="brutal-btn-secondary">
              Cancel
            </button>
            <button type="submit" className="brutal-btn-primary">
              Add Category
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Payment Method Modal */}
      <Modal isOpen={isPmModalOpen} onClose={() => setIsPmModalOpen(false)} title="Add Settlement Instrument">
        <form onSubmit={handleAddPaymentMethod} className="space-y-4">
          <div>
            <label className="brutal-label">Instrument Label</label>
            <input
              type="text"
              required
              placeholder="e.g. HDFC Salary Account, Axis Forex Card"
              value={newPmName}
              onChange={(e) => setNewPmName(e.target.value)}
              className="brutal-input text-xs"
            />
          </div>
          <div>
            <label className="brutal-label">Instrument Type</label>
            <select
              value={newPmType}
              onChange={(e) => setNewPmType(e.target.value as any)}
              className="brutal-input text-xs font-mono"
            >
              <option value="upi">UPI</option>
              <option value="cash">Cash</option>
              <option value="debit_card">Debit Card</option>
              <option value="credit_card">Credit Card</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setIsPmModalOpen(false)} className="brutal-btn-secondary">
              Cancel
            </button>
            <button type="submit" className="brutal-btn-primary">
              Add Instrument
            </button>
          </div>
        </form>
      </Modal>

      {/* Account Deletion Double Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Permanent Account Deletion (GDPR)"
      >
        <div className="space-y-4">
          <p className="text-xs font-mono text-ink-700 dark:text-zinc-300 leading-relaxed">
            This action will permanently delete all transactions, budgets, capital savings goals, categories, and account profiles associated with user ID <code className="bg-cream-200 dark:bg-zinc-800 px-1">{userId}</code>.
          </p>
          <div className="p-3 bg-red-100 dark:bg-red-950/60 border border-brutal-red text-brutal-red font-mono text-xs">
            To proceed, type <strong className="underline">DELETE</strong> below:
          </div>
          <input
            type="text"
            value={deleteConfirmationText}
            onChange={(e) => setDeleteConfirmationText(e.target.value)}
            placeholder="Type DELETE"
            className="brutal-input text-center font-mono font-bold tracking-widest uppercase"
          />
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              className="brutal-btn-secondary"
            >
              Abort
            </button>
            <button
              type="button"
              disabled={deleteConfirmationText !== 'DELETE'}
              onClick={handleConfirmAccountDeletion}
              className="brutal-btn-danger"
            >
              Purge All Data & Exit
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
