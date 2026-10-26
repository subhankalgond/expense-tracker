import { describe, it, expect } from 'vitest';
import { sanitizeCsvField } from '../lib/export';
describe('CSV Sanitization & Formula Injection Protection Module', () => {
    it('protects against formula injection starting with =', () => {
        const malicious = '=1+2; cmd|/C calc.exe';
        const sanitized = sanitizeCsvField(malicious);
        expect(sanitized).toBe("\"'=1+2; cmd|/C calc.exe\"");
    });
    it('protects against formula injection starting with +, -, @', () => {
        expect(sanitizeCsvField('+SUM(A1:A10)')).toBe("\"'+SUM(A1:A10)\"");
        expect(sanitizeCsvField('-CMD')).toBe("\"'-CMD\"");
        expect(sanitizeCsvField('@SUM(1,2)')).toBe("\"'@SUM(1,2)\"");
    });
    it('properly escapes quotes, commas, and newlines in accordance with RFC 4180', () => {
        const textWithComma = 'Groceries, Supermarket';
        expect(sanitizeCsvField(textWithComma)).toBe('"Groceries, Supermarket"');
        const textWithQuote = 'John "Doc" Doe';
        expect(sanitizeCsvField(textWithQuote)).toBe('"John ""Doc"" Doe"');
    });
    it('handles null and undefined safely', () => {
        expect(sanitizeCsvField(null)).toBe('""');
        expect(sanitizeCsvField(undefined)).toBe('""');
    });
});
