import { describe, it, expect, beforeEach } from 'vitest';
import { dataService, localStore } from '../lib/dataService';
describe('Data Service & Business Logic Integration', () => {
    const testUserId = 'test-unit-user-001';
    beforeEach(() => {
        localStorage.clear();
        localStore.seedInitialData(testUserId);
    });
    it('correctly creates, reads, updates, and deletes transactions', async () => {
        // 1. Add transaction
        const newTx = await dataService.addTransaction(testUserId, {
            type: 'expense',
            amount: 4500,
            category_id: null,
            payment_method_id: null,
            date: '2026-10-25',
            description: 'Audit Test Transaction',
            notes: 'Automated test note',
        });
        expect(newTx.id).toBeDefined();
        expect(newTx.amount).toBe(4500);
        // 2. Read transactions
        const res = await dataService.getTransactions(testUserId);
        const found = res.data.find((t) => t.id === newTx.id);
        expect(found).toBeDefined();
        expect(found?.description).toBe('Audit Test Transaction');
        // 3. Update transaction
        const updated = await dataService.updateTransaction(testUserId, newTx.id, {
            amount: 5200,
            description: 'Updated Test Transaction',
        });
        expect(updated.amount).toBe(5200);
        expect(updated.description).toBe('Updated Test Transaction');
        // 4. Delete transaction
        await dataService.deleteTransaction(testUserId, newTx.id);
        const afterDelete = await dataService.getTransactions(testUserId);
        expect(afterDelete.data.find((t) => t.id === newTx.id)).toBeUndefined();
    });
    it('atomically handles savings goal deposits and withdrawals', async () => {
        // 1. Create goal
        const goal = await dataService.addSavingsGoal(testUserId, {
            name: 'Test Goal',
            target_amount: 100000,
            target_date: '2026-12-31',
            description: 'Test target',
            status: 'active',
        });
        expect(goal.current_amount).toBe(0);
        // 2. Deposit
        const afterDeposit = await dataService.recordSavingsMovement(testUserId, goal.id, 25000, 'deposit', 'First installment');
        expect(afterDeposit.current_amount).toBe(25000);
        // 3. Withdrawal
        const afterWithdrawal = await dataService.recordSavingsMovement(testUserId, goal.id, 5000, 'withdrawal', 'Emergency withdrawal');
        expect(afterWithdrawal.current_amount).toBe(20000);
    });
    it('calculates budget utilization against actual expenses', async () => {
        // Clear transactions to isolate test
        localStore.setItem(testUserId, 'transactions', []);
        // Create dedicated category for test
        const customCat = await dataService.addCategory(testUserId, {
            name: 'Custom Isolated Test Category',
            type: 'expense',
            color: '#C2410C',
            icon: 'tag',
            is_archived: false,
        });
        // Create budget of ₹10,000 for this category
        const budget = await dataService.addBudget(testUserId, {
            name: 'Custom Budget Cap',
            category_id: customCat.id,
            limit_amount: 10000,
            period: 'monthly',
            alert_threshold_75: true,
            alert_threshold_90: true,
            alert_threshold_100: true,
        });
        // Add ₹8,000 expense in this category
        await dataService.addTransaction(testUserId, {
            type: 'expense',
            amount: 8000,
            category_id: customCat.id,
            payment_method_id: null,
            date: new Date().toISOString().split('T')[0],
            description: 'Audit test purchase',
            notes: null,
        });
        const budgets = await dataService.getBudgets(testUserId);
        const found = budgets.find((b) => b.id === budget.id);
        expect(found).toBeDefined();
        expect(found?.spent_amount).toBe(8000);
        expect(found?.remaining_amount).toBe(2000);
        expect(found?.percentage_used).toBe(80);
    });
});
