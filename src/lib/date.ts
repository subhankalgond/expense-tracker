import { DateRange, DateRangePreset } from '../types/filters';

/**
 * Format a Date object to YYYY-MM-DD in local timezone
 */
export function formatISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format date string to editorial display (e.g., "24 Oct 2026")
 */
export function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Generates start and end dates based on user preset selection
 */
export function getDateRangeFromPreset(preset: DateRangePreset): DateRange {
  const now = new Date();
  let start = new Date(now);
  let end = new Date(now);
  let label = 'This Month';

  switch (preset) {
    case 'this_week': {
      const day = now.getDay();
      const diffToMonday = (day === 0 ? -6 : 1) - day;
      start.setDate(now.getDate() + diffToMonday);
      end = new Date(start);
      end.setDate(start.getDate() + 6);
      label = 'This Week';
      break;
    }
    case 'this_month': {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      label = 'This Month';
      break;
    }
    case 'last_month': {
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      end = new Date(now.getFullYear(), now.getMonth(), 0);
      label = 'Last Month';
      break;
    }
    case 'this_year': {
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31);
      label = 'This Year';
      break;
    }
    case 'all': {
      start = new Date(2000, 0, 1);
      end = new Date(2099, 11, 31);
      label = 'All Time';
      break;
    }
    case 'custom':
    default: {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      label = 'Custom Range';
      break;
    }
  }

  return {
    preset,
    startDate: formatISODate(start),
    endDate: formatISODate(end),
    label,
  };
}
