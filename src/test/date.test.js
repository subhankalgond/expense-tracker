import { describe, it, expect } from 'vitest';
import { formatISODate, formatDisplayDate, getDateRangeFromPreset } from '../lib/date';
describe('Date Calculation and Formatting Module', () => {
    it('formats Date instances to ISO YYYY-MM-DD string', () => {
        const d = new Date(2026, 9, 25); // Oct 25, 2026
        expect(formatISODate(d)).toBe('2026-10-25');
    });
    it('formats dates for editorial display', () => {
        const formatted = formatDisplayDate('2026-10-25');
        expect(formatted).toContain('2026');
        expect(formatted).toContain('Oct');
        expect(formatted).toContain('25');
    });
    it('generates accurate date ranges for presets', () => {
        const thisMonth = getDateRangeFromPreset('this_month');
        expect(thisMonth.preset).toBe('this_month');
        expect(thisMonth.startDate).toMatch(/^\d{4}-\d{2}-01$/);
        const thisYear = getDateRangeFromPreset('this_year');
        expect(thisYear.startDate).toMatch(/^\d{4}-01-01$/);
        expect(thisYear.endDate).toMatch(/^\d{4}-12-31$/);
        const thisWeek = getDateRangeFromPreset('this_week');
        expect(thisWeek.startDate).toBeDefined();
        expect(thisWeek.endDate).toBeDefined();
    });
});
