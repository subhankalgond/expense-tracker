import { describe, it, expect, beforeEach } from 'vitest';
import { dataService, localStore } from '../lib/dataService';
describe('Multi-Tenant Data Privacy & User Isolation Module', () => {
    const userA = '00000000-0000-0000-0000-000000000001'; // Lead Auditor
    const userB = '00000000-0000-0000-0000-000000000002'; // Independent Analyst
    beforeEach(() => {
        localStorage.clear();
        localStore.seedInitialData(userA);
        localStore.seedInitialData(userB);
    });
    it('guarantees User A cannot see or access User B transactions', async () => {
        // Add confidential transaction for User A
        const txA = await dataService.addTransaction(userA, {
            type: 'expense',
            amount: 99999,
            category_id: null,
            payment_method_id: null,
            date: '2026-10-25',
            description: 'User A Secret Transaction',
            notes: 'Confidential corporate audit',
        });
        // Add different transaction for User B
        const txB = await dataService.addTransaction(userB, {
            type: 'income',
            amount: 11111,
            category_id: null,
            payment_method_id: null,
            date: '2026-10-25',
            description: 'User B Freelance Retainer',
            notes: 'Private freelance contract',
        });
        // Query User A transactions
        const listA = await dataService.getTransactions(userA);
        expect(listA.data.some((t) => t.id === txA.id)).toBe(true);
        expect(listA.data.some((t) => t.id === txB.id)).toBe(false);
        // Query User B transactions
        const listB = await dataService.getTransactions(userB);
        expect(listB.data.some((t) => t.id === txB.id)).toBe(true);
        expect(listB.data.some((t) => t.id === txA.id)).toBe(false);
    });
    it('prevents User B from modifying or deleting User A records', async () => {
        const txA = await dataService.addTransaction(userA, {
            type: 'income',
            amount: 75000,
            category_id: null,
            payment_method_id: null,
            date: '2026-10-25',
            description: 'User A Income',
            notes: null,
        });
        // Attempt to delete User A record while signed in as User B
        await dataService.deleteTransaction(userB, txA.id);
        // Verify User A record still exists safely
        const listA = await dataService.getTransactions(userA);
        expect(listA.data.some((t) => t.id === txA.id)).toBe(true);
    });
});
