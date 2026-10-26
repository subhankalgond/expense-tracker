import { TransactionType } from './database';

export type DateRangePreset = 'this_week' | 'this_month' | 'last_month' | 'this_year' | 'custom' | 'all';

export interface DateRange {
  preset: DateRangePreset;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  label: string;
}

export type SortField = 'date' | 'amount' | 'description';
export type SortOrder = 'asc' | 'desc';

export interface TransactionFiltersState {
  search: string;
  type: TransactionType | 'all';
  categoryId: string | 'all';
  paymentMethodId: string | 'all';
  minAmount: number | null;
  maxAmount: number | null;
  dateRange: DateRange;
  sortField: SortField;
  sortOrder: SortOrder;
  page: number;
  pageSize: number;
}
