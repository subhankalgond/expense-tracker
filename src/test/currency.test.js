import { describe, it, expect } from 'vitest';
import { formatINR, toPaise, fromPaise, safeSum, safeSubtract, safePercentage, } from '../lib/currency';
describe('Currency and Financial Arithmetic Module', () => {
    it('correctly formats numbers to Indian Rupee (INR) standard', () => {
        const formatted = formatINR(125000);
        // Should format as ₹1,25,000.00 in en-IN locale
        expect(formatted).toContain('1,25,000');
        expect(formatted).toContain('₹');
    });
    it('correctly handles compact crore and lakh notation', () => {
        expect(formatINR(15000000, { compact: true })).toBe('₹1.50 Cr');
        expect(formatINR(450000, { compact: true })).toBe('₹4.50 L');
    });
    it('accurately converts to and from minor units (paise) without floating point errors', () => {
        // In standard IEEE 754: 0.1 + 0.2 = 0.30000000000000004
        const paise1 = toPaise(0.1);
        const paise2 = toPaise(0.2);
        expect(paise1 + paise2).toBe(30);
        expect(fromPaise(paise1 + paise2)).toBe(0.3);
    });
    it('accurately sums arrays of monetary values with safeSum', () => {
        const amounts = [100.1, 200.2, 300.3, 400.4];
        const total = safeSum(amounts);
        expect(total).toBe(1001.0);
    });
    it('accurately subtracts with safeSubtract', () => {
        const result = safeSubtract(1000.5, 450.25);
        expect(result).toBe(550.25);
    });
    it('computes safe percentages with protection against division by zero', () => {
        expect(safePercentage(50, 200)).toBe(25);
        expect(safePercentage(150, 0)).toBe(0);
        expect(safePercentage(200, 100)).toBe(200);
    });
});
