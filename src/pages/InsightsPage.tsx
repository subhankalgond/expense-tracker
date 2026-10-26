import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../lib/dataService';
import { DateRange } from '../types/filters';
import { getDateRangeFromPreset } from '../lib/date';
import { safeSubtract } from '../lib/currency';
import { DateRangeSelector } from '../components/dashboard/DateRangeSelector';
import { InsightsEngine } from '../components/insights/InsightsEngine';
import { AnalyticsIcon } from '../components/ui/Icons';

export const InsightsPage: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id || 'demo-user';

  const [dateRange, setDateRange] = useState<DateRange>(() => getDateRangeFromPreset('this_month'));
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [categorySpending, setCategorySpending] = useState<
    Array<{ category: string; amount: number; percentage: number }>
  >([]);
  const [budgetStatus, setBudgetStatus] = useState<
    Array<{ name: string; spent: number; limit: number; percent: number }>
  >([]);
  const [recurringTotal, setRecurringTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [txRes, budgets, recurring] = await Promise.all([
          dataService.getTransactions(userId, {
            search: '',
            type: 'all',
            categoryId: 'all',
            paymentMethodId: 'all',
            minAmount: null,
            maxAmount: null,
            dateRange,
            sortField: 'date',
            sortOrder: 'desc',
            page: 1,
            pageSize: 5000,
          }),
          dataService.getBudgets(userId, dateRange),
          dataService.getRecurringTransactions(userId),
        ]);

        const inc = txRes.data
          .filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        const exp = txRes.data
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);

        setTotalIncome(inc);
        setTotalExpense(exp);

        // Category Breakdown
        const catMap: Record<string, number> = {};
        txRes.data
          .filter((t) => t.type === 'expense')
          .forEach((t) => {
            const name = t.category?.name || 'Uncategorized';
            catMap[name] = (catMap[name] || 0) + t.amount;
          });

        const catList = Object.entries(catMap)
          .map(([name, amount]) => ({
            category: name,
            amount,
            percentage: exp > 0 ? Math.round((amount / exp) * 100) : 0,
          }))
          .sort((a, b) => b.amount - a.amount);
        setCategorySpending(catList);

        // Budgets status
        setBudgetStatus(
          budgets.map((b) => ({
            name: b.name,
            spent: b.spent_amount || 0,
            limit: b.limit_amount,
            percent: b.percentage_used || 0,
          }))
        );

        // Recurring bills
        const recSum = recurring
          .filter((r) => r.status === 'active' && r.type === 'expense')
          .reduce((sum, r) => sum + r.amount, 0);
        setRecurringTotal(recSum);
      } catch (err) {
        console.warn('Failed to load insights data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [userId, dateRange]);

  const netCashFlow = safeSubtract(totalIncome, totalExpense);

  return (
    <div className="space-y-6">
      {/* Editorial Folio */}
      <div className="editorial-masthead">
        <div>FOLIO № 50 • HEURISTIC VARIANCE & CAPITAL FORESIGHT</div>
        <div className="hidden md:block">ANALYTICS ENGINE: DETERMINISTIC STATISTICAL AUDITOR</div>
        <div>OPINION & ADVISORY</div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b-2 border-ink-950 dark:border-zinc-700 pb-4">
        <div>
          <span className="editorial-kicker">FINANCIAL INTELLIGENCE DISPATCH</span>
          <h2 className="editorial-headline text-2xl sm:text-3xl flex items-center gap-2">
            <AnalyticsIcon className="w-6 h-6 text-cobalt" />
            Variance Analysis & Strategic Advisories
          </h2>
          <p className="text-xs font-mono text-ink-500 dark:text-zinc-400 mt-1">
            Real-time pattern detection, variance warnings, and capital conservation advisories
          </p>
        </div>
      </div>

      {/* Date selector */}
      <DateRangeSelector currentRange={dateRange} onChange={setDateRange} />

      {/* Insights Engine Container */}
      {!isLoading && (
        <InsightsEngine
          periodLabel={dateRange.label}
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          netCashFlow={netCashFlow}
          categorySpending={categorySpending}
          budgetStatus={budgetStatus}
          recurringTotal={recurringTotal}
        />
      )}
    </div>
  );
};
