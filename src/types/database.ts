// Ledger Brutalist Database & Domain Types

export type TransactionType = 'income' | 'expense';
export type CategoryType = 'income' | 'expense' | 'both';
export type PaymentMethodType = 'cash' | 'upi' | 'debit_card' | 'credit_card' | 'bank_transfer' | 'other';
export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type RecurringStatus = 'active' | 'paused' | 'completed';
export type SavingsStatus = 'active' | 'completed' | 'archived';
export type ContributionType = 'deposit' | 'withdrawal';
export type BudgetPeriod = 'monthly' | 'weekly' | 'yearly';
export type NotificationType = 'budget_warning' | 'budget_exceeded' | 'bill_due' | 'system' | 'goal_milestone';

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  currency: string;
  timezone: string;
  opening_balance: number;
  has_completed_onboarding: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  type: CategoryType;
  color: string;
  icon: string;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethod {
  id: string;
  user_id: string;
  name: string;
  type: PaymentMethodType;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  category_id: string | null;
  payment_method_id: string | null;
  date: string;
  description: string;
  notes: string | null;
  recurring_id?: string | null;
  created_at: string;
  updated_at: string;
  category?: Category | null;
  payment_method?: PaymentMethod | null;
}

export interface Budget {
  id: string;
  user_id: string;
  name: string;
  category_id: string;
  limit_amount: number;
  period: BudgetPeriod;
  alert_threshold_75: boolean;
  alert_threshold_90: boolean;
  alert_threshold_100: boolean;
  created_at: string;
  updated_at: string;
  category?: Category | null;
  // Computed fields
  spent_amount?: number;
  remaining_amount?: number;
  percentage_used?: number;
}

export interface SavingsGoal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
  description: string | null;
  status: SavingsStatus;
  created_at: string;
  updated_at: string;
}

export interface SavingsContribution {
  id: string;
  goal_id: string;
  user_id: string;
  amount: number;
  type: ContributionType;
  date: string;
  note: string | null;
  created_at: string;
}

export interface RecurringTransaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  category_id: string | null;
  payment_method_id: string | null;
  description: string;
  frequency: RecurrenceFrequency;
  start_date: string;
  end_date: string | null;
  next_occurrence: string;
  status: RecurringStatus;
  created_at: string;
  updated_at: string;
  category?: Category | null;
  payment_method?: PaymentMethod | null;
}

export interface NotificationPreference {
  user_id: string;
  budget_alerts: boolean;
  bill_reminders: boolean;
  weekly_digest: boolean;
  created_at: string;
  updated_at: string;
}

export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
}

export interface SpendingInsight {
  title: string;
  observation: string;
  suggestion: string;
  severity: 'high' | 'medium' | 'low';
}
