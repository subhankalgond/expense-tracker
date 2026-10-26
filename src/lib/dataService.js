import { supabase, isConfiguredSupabase } from './supabase';
// Default initial seed data for new profiles or local demo state
const DEFAULT_CATEGORIES = [
    { name: 'Food & Groceries', type: 'expense', color: '#C2410C', icon: 'utensils', is_archived: false },
    { name: 'Transport', type: 'expense', color: '#1E40AF', icon: 'car', is_archived: false },
    { name: 'Housing & Utilities', type: 'expense', color: '#4B5563', icon: 'home', is_archived: false },
    { name: 'Healthcare', type: 'expense', color: '#B91C1C', icon: 'heart-pulse', is_archived: false },
    { name: 'Education', type: 'expense', color: '#7C3AED', icon: 'book-open', is_archived: false },
    { name: 'Shopping', type: 'expense', color: '#DB2777', icon: 'shopping-bag', is_archived: false },
    { name: 'Entertainment', type: 'expense', color: '#D97706', icon: 'film', is_archived: false },
    { name: 'Travel', type: 'expense', color: '#059669', icon: 'plane', is_archived: false },
    { name: 'Salary', type: 'income', color: '#047857', icon: 'briefcase', is_archived: false },
    { name: 'Freelance Income', type: 'income', color: '#0D9488', icon: 'laptop', is_archived: false },
    { name: 'Investments', type: 'income', color: '#2563EB', icon: 'trending-up', is_archived: false },
    { name: 'Other', type: 'both', color: '#6B7280', icon: 'more-horizontal', is_archived: false },
];
const DEFAULT_PAYMENT_METHODS = [
    { name: 'UPI', type: 'upi', is_archived: false },
    { name: 'Cash', type: 'cash', is_archived: false },
    { name: 'Debit Card', type: 'debit_card', is_archived: false },
    { name: 'Credit Card', type: 'credit_card', is_archived: false },
    { name: 'Bank Transfer', type: 'bank_transfer', is_archived: false },
    { name: 'Other', type: 'other', is_archived: false },
];
// In-Memory / LocalStorage Mock Cache for unconfigured/offline environment
class LocalStorageDataStore {
    getStorageKey(userId, table) {
        return `ledger_brutalist_${userId}_${table}`;
    }
    getItem(userId, table, fallback) {
        try {
            const raw = localStorage.getItem(this.getStorageKey(userId, table));
            return raw ? JSON.parse(raw) : fallback;
        }
        catch {
            return fallback;
        }
    }
    setItem(userId, table, val) {
        try {
            localStorage.setItem(this.getStorageKey(userId, table), JSON.stringify(val));
        }
        catch {
            // ignore
        }
    }
    seedInitialData(userId) {
        const isSeeded = localStorage.getItem(`ledger_brutalist_${userId}_seeded`);
        if (isSeeded)
            return;
        localStorage.setItem(`ledger_brutalist_${userId}_seeded`, 'true');
        const cats = this.getItem(userId, 'categories', []);
        if (cats.length === 0) {
            const initialCats = DEFAULT_CATEGORIES.map((c, i) => ({
                ...c,
                id: `cat-${userId}-${i}`,
                user_id: userId,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }));
            this.setItem(userId, 'categories', initialCats);
        }
        const pms = this.getItem(userId, 'payment_methods', []);
        if (pms.length === 0) {
            const initialPms = DEFAULT_PAYMENT_METHODS.map((pm, i) => ({
                ...pm,
                id: `pm-${userId}-${i}`,
                user_id: userId,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }));
            this.setItem(userId, 'payment_methods', initialPms);
        }
        const txs = this.getItem(userId, 'transactions', []);
        if (txs.length === 0) {
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
            const todayDate = `${currentYear}-${currentMonth}-${String(now.getDate()).padStart(2, '0')}`;
            const firstOfMonth = `${currentYear}-${currentMonth}-01`;
            const midMonth = `${currentYear}-${currentMonth}-10`;
            const seededTxs = [
                {
                    id: `tx-${userId}-1`,
                    user_id: userId,
                    type: 'income',
                    amount: 145000,
                    category_id: `cat-${userId}-8`, // Salary
                    payment_method_id: `pm-${userId}-4`, // Bank Transfer
                    date: firstOfMonth,
                    description: 'Monthly Engineering Salary',
                    notes: 'Direct corporate deposit',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
                {
                    id: `tx-${userId}-2`,
                    user_id: userId,
                    type: 'expense',
                    amount: 32000,
                    category_id: `cat-${userId}-2`, // Housing & Utilities
                    payment_method_id: `pm-${userId}-4`, // Bank Transfer
                    date: firstOfMonth,
                    description: 'Apartment Rent & Maintenance',
                    notes: 'Paid to landlord',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
                {
                    id: `tx-${userId}-3`,
                    user_id: userId,
                    type: 'expense',
                    amount: 14250,
                    category_id: `cat-${userId}-0`, // Food & Groceries
                    payment_method_id: `pm-${userId}-0`, // UPI
                    date: midMonth,
                    description: 'Supermarket Groceries & Pantry Restock',
                    notes: 'Nature Basket organic produce',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
                {
                    id: `tx-${userId}-4`,
                    user_id: userId,
                    type: 'expense',
                    amount: 3800,
                    category_id: `cat-${userId}-1`, // Transport
                    payment_method_id: `pm-${userId}-0`, // UPI
                    date: todayDate,
                    description: 'Fuel & Metro Cards',
                    notes: 'HPCL Fuel station',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
            ];
            this.setItem(userId, 'transactions', seededTxs);
        }
        const budgets = this.getItem(userId, 'budgets', []);
        if (budgets.length === 0) {
            const seededBudgets = [
                {
                    id: `budget-${userId}-1`,
                    user_id: userId,
                    name: 'Food & Groceries Monthly',
                    category_id: `cat-${userId}-0`,
                    limit_amount: 25000,
                    period: 'monthly',
                    alert_threshold_75: true,
                    alert_threshold_90: true,
                    alert_threshold_100: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
                {
                    id: `budget-${userId}-2`,
                    user_id: userId,
                    name: 'Transport & Commute',
                    category_id: `cat-${userId}-1`,
                    limit_amount: 8000,
                    period: 'monthly',
                    alert_threshold_75: true,
                    alert_threshold_90: true,
                    alert_threshold_100: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
            ];
            this.setItem(userId, 'budgets', seededBudgets);
        }
        const goals = this.getItem(userId, 'savings_goals', []);
        if (goals.length === 0) {
            const seededGoals = [
                {
                    id: `goal-${userId}-1`,
                    user_id: userId,
                    name: 'Emergency Fund (6 Months)',
                    target_amount: 300000,
                    current_amount: 185000,
                    target_date: `${new Date().getFullYear()}-12-31`,
                    description: 'High-yield liquid fund deposit for safety',
                    status: 'active',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
            ];
            this.setItem(userId, 'savings_goals', seededGoals);
        }
        const recurring = this.getItem(userId, 'recurring_transactions', []);
        if (recurring.length === 0) {
            const seededRecurring = [
                {
                    id: `rec-${userId}-1`,
                    user_id: userId,
                    type: 'expense',
                    amount: 1499,
                    category_id: `cat-${userId}-6`, // Entertainment
                    payment_method_id: `pm-${userId}-3`, // Credit Card
                    description: 'High-Speed Fiber Broadband',
                    frequency: 'monthly',
                    start_date: `${new Date().getFullYear()}-01-01`,
                    end_date: null,
                    next_occurrence: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-28`,
                    status: 'active',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
            ];
            this.setItem(userId, 'recurring_transactions', seededRecurring);
        }
    }
}
export const localStore = new LocalStorageDataStore();
/**
 * Data Service Abstraction
 * Handles communication with Supabase PostgreSQL RLS tables with automatic local fallback
 */
export const dataService = {
    // --- TRANSACTIONS ---
    async getTransactions(userId, filters) {
        if (isConfiguredSupabase) {
            try {
                let query = supabase
                    .from('transactions')
                    .select('*, category:categories(*), payment_method:payment_methods(*)', { count: 'exact' })
                    .eq('user_id', userId);
                if (filters) {
                    if (filters.type && filters.type !== 'all') {
                        query = query.eq('type', filters.type);
                    }
                    if (filters.categoryId && filters.categoryId !== 'all') {
                        query = query.eq('category_id', filters.categoryId);
                    }
                    if (filters.paymentMethodId && filters.paymentMethodId !== 'all') {
                        query = query.eq('payment_method_id', filters.paymentMethodId);
                    }
                    if (filters.minAmount !== null && filters.minAmount !== undefined) {
                        query = query.gte('amount', filters.minAmount);
                    }
                    if (filters.maxAmount !== null && filters.maxAmount !== undefined) {
                        query = query.lte('amount', filters.maxAmount);
                    }
                    if (filters.dateRange) {
                        query = query
                            .gte('date', filters.dateRange.startDate)
                            .lte('date', filters.dateRange.endDate);
                    }
                    if (filters.search) {
                        query = query.ilike('description', `%${filters.search}%`);
                    }
                    const sortField = filters.sortField || 'date';
                    const ascending = filters.sortOrder === 'asc';
                    query = query.order(sortField, { ascending });
                    if (filters.page && filters.pageSize) {
                        const from = (filters.page - 1) * filters.pageSize;
                        const to = from + filters.pageSize - 1;
                        query = query.range(from, to);
                    }
                }
                else {
                    query = query.order('date', { ascending: false });
                }
                const { data, count, error } = await query;
                if (!error && data) {
                    return { data, totalCount: count || data.length };
                }
            }
            catch (e) {
                console.warn('Supabase query failed, falling back to local storage:', e);
            }
        }
        // Local / Offline fallback
        localStore.seedInitialData(userId);
        let items = localStore.getItem(userId, 'transactions', []);
        const categories = localStore.getItem(userId, 'categories', []);
        const paymentMethods = localStore.getItem(userId, 'payment_methods', []);
        // Hydrate relations
        items = items.map((t) => ({
            ...t,
            category: categories.find((c) => c.id === t.category_id) || null,
            payment_method: paymentMethods.find((p) => p.id === t.payment_method_id) || null,
        }));
        if (filters) {
            if (filters.type && filters.type !== 'all') {
                items = items.filter((t) => t.type === filters.type);
            }
            if (filters.categoryId && filters.categoryId !== 'all') {
                items = items.filter((t) => t.category_id === filters.categoryId);
            }
            if (filters.paymentMethodId && filters.paymentMethodId !== 'all') {
                items = items.filter((t) => t.payment_method_id === filters.paymentMethodId);
            }
            if (filters.minAmount !== null && filters.minAmount !== undefined) {
                items = items.filter((t) => t.amount >= filters.minAmount);
            }
            if (filters.maxAmount !== null && filters.maxAmount !== undefined) {
                items = items.filter((t) => t.amount <= filters.maxAmount);
            }
            if (filters.dateRange) {
                items = items.filter((t) => t.date >= filters.dateRange.startDate && t.date <= filters.dateRange.endDate);
            }
            if (filters.search) {
                const q = filters.search.toLowerCase();
                items = items.filter((t) => t.description.toLowerCase().includes(q) ||
                    (t.notes && t.notes.toLowerCase().includes(q)));
            }
            // Sort
            const field = filters.sortField || 'date';
            const asc = filters.sortOrder === 'asc';
            items.sort((a, b) => {
                let valA = a[field] ?? '';
                let valB = b[field] ?? '';
                if (field === 'amount') {
                    return asc ? valA - valB : valB - valA;
                }
                return asc
                    ? String(valA).localeCompare(String(valB))
                    : String(valB).localeCompare(String(valA));
            });
            const totalCount = items.length;
            if (filters.page && filters.pageSize) {
                const from = (filters.page - 1) * filters.pageSize;
                items = items.slice(from, from + filters.pageSize);
            }
            return { data: items, totalCount };
        }
        items.sort((a, b) => b.date.localeCompare(a.date));
        return { data: items, totalCount: items.length };
    },
    async addTransaction(userId, tx) {
        const payload = {
            ...tx,
            user_id: userId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        if (isConfiguredSupabase) {
            try {
                const { data, error } = await supabase
                    .from('transactions')
                    .insert(payload)
                    .select('*, category:categories(*), payment_method:payment_methods(*)')
                    .single();
                if (!error && data)
                    return data;
            }
            catch (err) {
                console.warn('Supabase add failed, saving locally:', err);
            }
        }
        const items = localStore.getItem(userId, 'transactions', []);
        const newTx = {
            ...payload,
            id: `tx-${crypto.randomUUID()}`,
        };
        items.unshift(newTx);
        localStore.setItem(userId, 'transactions', items);
        return newTx;
    },
    async updateTransaction(userId, id, tx) {
        if (isConfiguredSupabase) {
            try {
                const { data, error } = await supabase
                    .from('transactions')
                    .update({ ...tx, updated_at: new Date().toISOString() })
                    .eq('id', id)
                    .eq('user_id', userId)
                    .select('*, category:categories(*), payment_method:payment_methods(*)')
                    .single();
                if (!error && data)
                    return data;
            }
            catch (err) {
                console.warn('Supabase update failed:', err);
            }
        }
        const items = localStore.getItem(userId, 'transactions', []);
        const idx = items.findIndex((i) => i.id === id);
        if (idx !== -1) {
            items[idx] = { ...items[idx], ...tx, updated_at: new Date().toISOString() };
            localStore.setItem(userId, 'transactions', items);
            return items[idx];
        }
        throw new Error('Transaction not found');
    },
    async deleteTransaction(userId, id) {
        if (isConfiguredSupabase) {
            try {
                const { error } = await supabase
                    .from('transactions')
                    .delete()
                    .eq('id', id)
                    .eq('user_id', userId);
                if (!error)
                    return;
            }
            catch (err) {
                console.warn('Supabase delete failed:', err);
            }
        }
        const items = localStore.getItem(userId, 'transactions', []);
        const updated = items.filter((i) => i.id !== id);
        localStore.setItem(userId, 'transactions', updated);
    },
    // --- CATEGORIES ---
    async getCategories(userId) {
        if (isConfiguredSupabase) {
            try {
                const { data, error } = await supabase
                    .from('categories')
                    .select('*')
                    .eq('user_id', userId)
                    .order('name');
                if (!error && data && data.length > 0)
                    return data;
            }
            catch (err) {
                console.warn('Categories fetch failed:', err);
            }
        }
        localStore.seedInitialData(userId);
        return localStore.getItem(userId, 'categories', []);
    },
    async addCategory(userId, category) {
        const payload = {
            ...category,
            user_id: userId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        if (isConfiguredSupabase) {
            try {
                const { data, error } = await supabase
                    .from('categories')
                    .insert(payload)
                    .select('*')
                    .single();
                if (!error && data)
                    return data;
            }
            catch (err) {
                console.warn('Supabase category add failed:', err);
            }
        }
        const items = localStore.getItem(userId, 'categories', []);
        const newCat = { ...payload, id: `cat-${Date.now()}-${Math.random().toString(36).slice(2, 9)}` };
        items.push(newCat);
        localStore.setItem(userId, 'categories', items);
        return newCat;
    },
    async updateCategory(userId, id, category) {
        if (isConfiguredSupabase) {
            try {
                const { data, error } = await supabase
                    .from('categories')
                    .update({ ...category, updated_at: new Date().toISOString() })
                    .eq('id', id)
                    .eq('user_id', userId)
                    .select('*')
                    .single();
                if (!error && data)
                    return data;
            }
            catch (err) {
                console.warn('Supabase category update failed:', err);
            }
        }
        const items = localStore.getItem(userId, 'categories', []);
        const idx = items.findIndex((i) => i.id === id);
        if (idx !== -1) {
            items[idx] = { ...items[idx], ...category, updated_at: new Date().toISOString() };
            localStore.setItem(userId, 'categories', items);
            return items[idx];
        }
        throw new Error('Category not found');
    },
    // --- PAYMENT METHODS ---
    async getPaymentMethods(userId) {
        if (isConfiguredSupabase) {
            try {
                const { data, error } = await supabase
                    .from('payment_methods')
                    .select('*')
                    .eq('user_id', userId)
                    .order('name');
                if (!error && data && data.length > 0)
                    return data;
            }
            catch (err) {
                console.warn('Payment methods fetch failed:', err);
            }
        }
        localStore.seedInitialData(userId);
        return localStore.getItem(userId, 'payment_methods', []);
    },
    async addPaymentMethod(userId, pm) {
        const payload = {
            ...pm,
            user_id: userId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        if (isConfiguredSupabase) {
            try {
                const { data, error } = await supabase
                    .from('payment_methods')
                    .insert(payload)
                    .select('*')
                    .single();
                if (!error && data)
                    return data;
            }
            catch (err) {
                console.warn('Supabase payment method add failed:', err);
            }
        }
        const items = localStore.getItem(userId, 'payment_methods', []);
        const newPm = { ...payload, id: `pm-${Date.now()}-${Math.random().toString(36).slice(2, 9)}` };
        items.push(newPm);
        localStore.setItem(userId, 'payment_methods', items);
        return newPm;
    },
    // --- BUDGETS ---
    async getBudgets(userId, periodDateRange) {
        let budgets = [];
        if (isConfiguredSupabase) {
            try {
                const { data, error } = await supabase
                    .from('budgets')
                    .select('*, category:categories(*)')
                    .eq('user_id', userId);
                if (!error && data)
                    budgets = data;
            }
            catch (err) {
                console.warn('Supabase budget fetch failed:', err);
            }
        }
        if (budgets.length === 0) {
            localStore.seedInitialData(userId);
            budgets = localStore.getItem(userId, 'budgets', []);
            const categories = localStore.getItem(userId, 'categories', []);
            budgets = budgets.map((b) => ({
                ...b,
                category: categories.find((c) => c.id === b.category_id) || null,
            }));
        }
        // Calculate actual spending for each budget within the current period
        const { data: transactions } = await this.getTransactions(userId, {
            search: '',
            type: 'expense',
            categoryId: 'all',
            paymentMethodId: 'all',
            minAmount: null,
            maxAmount: null,
            dateRange: {
                preset: 'this_month',
                startDate: periodDateRange?.startDate || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-01`,
                endDate: periodDateRange?.endDate || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-31`,
                label: 'Current Period',
            },
            sortField: 'date',
            sortOrder: 'desc',
            page: 1,
            pageSize: 1000,
        });
        return budgets.map((b) => {
            const categorySpent = transactions
                .filter((t) => t.category_id === b.category_id && t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);
            const remaining = Math.max(0, b.limit_amount - categorySpent);
            const percentage = b.limit_amount > 0 ? Math.round((categorySpent / b.limit_amount) * 100) : 0;
            return {
                ...b,
                spent_amount: categorySpent,
                remaining_amount: remaining,
                percentage_used: percentage,
            };
        });
    },
    async addBudget(userId, budget) {
        const payload = {
            ...budget,
            user_id: userId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        if (isConfiguredSupabase) {
            try {
                const { data, error } = await supabase
                    .from('budgets')
                    .insert(payload)
                    .select('*, category:categories(*)')
                    .single();
                if (!error && data)
                    return data;
            }
            catch (err) {
                console.warn('Supabase budget add failed:', err);
            }
        }
        const items = localStore.getItem(userId, 'budgets', []);
        const newBudget = { ...payload, id: `budget-${Date.now()}-${Math.random().toString(36).slice(2, 9)}` };
        items.push(newBudget);
        localStore.setItem(userId, 'budgets', items);
        return newBudget;
    },
    async deleteBudget(userId, id) {
        if (isConfiguredSupabase) {
            try {
                const { error } = await supabase
                    .from('budgets')
                    .delete()
                    .eq('id', id)
                    .eq('user_id', userId);
                if (!error)
                    return;
            }
            catch (err) {
                console.warn('Supabase budget delete failed:', err);
            }
        }
        const items = localStore.getItem(userId, 'budgets', []);
        const filtered = items.filter((b) => b.id !== id);
        localStore.setItem(userId, 'budgets', filtered);
    },
    // --- SAVINGS GOALS ---
    async getSavingsGoals(userId) {
        if (isConfiguredSupabase) {
            try {
                const { data, error } = await supabase
                    .from('savings_goals')
                    .select('*')
                    .eq('user_id', userId)
                    .order('created_at', { ascending: false });
                if (!error && data && data.length > 0)
                    return data;
            }
            catch (err) {
                console.warn('Savings goals fetch failed:', err);
            }
        }
        localStore.seedInitialData(userId);
        return localStore.getItem(userId, 'savings_goals', []);
    },
    async addSavingsGoal(userId, goal) {
        const payload = {
            ...goal,
            user_id: userId,
            current_amount: 0.0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        if (isConfiguredSupabase) {
            try {
                const { data, error } = await supabase
                    .from('savings_goals')
                    .insert(payload)
                    .select('*')
                    .single();
                if (!error && data)
                    return data;
            }
            catch (err) {
                console.warn('Supabase savings goal add failed:', err);
            }
        }
        const items = localStore.getItem(userId, 'savings_goals', []);
        const newGoal = { ...payload, id: `goal-${Date.now()}-${Math.random().toString(36).slice(2, 9)}` };
        items.unshift(newGoal);
        localStore.setItem(userId, 'savings_goals', items);
        return newGoal;
    },
    async recordSavingsMovement(userId, goalId, amount, type, note) {
        if (isConfiguredSupabase) {
            try {
                const { error: rpcErr } = await supabase.rpc('record_savings_movement', {
                    p_goal_id: goalId,
                    p_amount: amount,
                    p_type: type,
                    p_note: note || null,
                });
                if (!rpcErr) {
                    const { data } = await supabase
                        .from('savings_goals')
                        .select('*')
                        .eq('id', goalId)
                        .single();
                    if (data)
                        return data;
                }
            }
            catch (err) {
                console.warn('Atomic savings movement RPC failed, fallback to local:', err);
            }
        }
        const goals = localStore.getItem(userId, 'savings_goals', []);
        const idx = goals.findIndex((g) => g.id === goalId);
        if (idx === -1)
            throw new Error('Goal not found');
        const goal = goals[idx];
        const newAmount = type === 'deposit'
            ? goal.current_amount + amount
            : Math.max(0, goal.current_amount - amount);
        goals[idx] = {
            ...goal,
            current_amount: newAmount,
            status: newAmount >= goal.target_amount ? 'completed' : 'active',
            updated_at: new Date().toISOString(),
        };
        localStore.setItem(userId, 'savings_goals', goals);
        return goals[idx];
    },
    async deleteSavingsGoal(userId, id) {
        if (isConfiguredSupabase) {
            try {
                await supabase.from('savings_goals').delete().eq('id', id).eq('user_id', userId);
                return;
            }
            catch (err) {
                console.warn('Supabase savings delete failed:', err);
            }
        }
        const items = localStore.getItem(userId, 'savings_goals', []);
        localStore.setItem(userId, 'savings_goals', items.filter((g) => g.id !== id));
    },
    // --- RECURRING TRANSACTIONS ---
    async getRecurringTransactions(userId) {
        if (isConfiguredSupabase) {
            try {
                const { data, error } = await supabase
                    .from('recurring_transactions')
                    .select('*, category:categories(*), payment_method:payment_methods(*)')
                    .eq('user_id', userId)
                    .order('next_occurrence');
                if (!error && data && data.length > 0)
                    return data;
            }
            catch (err) {
                console.warn('Recurring transactions fetch failed:', err);
            }
        }
        localStore.seedInitialData(userId);
        const items = localStore.getItem(userId, 'recurring_transactions', []);
        const cats = localStore.getItem(userId, 'categories', []);
        const pms = localStore.getItem(userId, 'payment_methods', []);
        return items.map((r) => ({
            ...r,
            category: cats.find((c) => c.id === r.category_id) || null,
            payment_method: pms.find((p) => p.id === r.payment_method_id) || null,
        }));
    },
    async addRecurringTransaction(userId, recurring) {
        const payload = {
            ...recurring,
            user_id: userId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        if (isConfiguredSupabase) {
            try {
                const { data, error } = await supabase
                    .from('recurring_transactions')
                    .insert(payload)
                    .select('*, category:categories(*), payment_method:payment_methods(*)')
                    .single();
                if (!error && data)
                    return data;
            }
            catch (err) {
                console.warn('Supabase recurring add failed:', err);
            }
        }
        const items = localStore.getItem(userId, 'recurring_transactions', []);
        const newRec = { ...payload, id: `rec-${Date.now()}-${Math.random().toString(36).slice(2, 9)}` };
        items.push(newRec);
        localStore.setItem(userId, 'recurring_transactions', items);
        return newRec;
    },
    async toggleRecurringStatus(userId, id, status) {
        if (isConfiguredSupabase) {
            try {
                await supabase
                    .from('recurring_transactions')
                    .update({ status, updated_at: new Date().toISOString() })
                    .eq('id', id)
                    .eq('user_id', userId);
                return;
            }
            catch (err) {
                console.warn('Supabase recurring toggle failed:', err);
            }
        }
        const items = localStore.getItem(userId, 'recurring_transactions', []);
        const idx = items.findIndex((r) => r.id === id);
        if (idx !== -1) {
            items[idx].status = status;
            localStore.setItem(userId, 'recurring_transactions', items);
        }
    },
    async deleteRecurringTransaction(userId, id) {
        if (isConfiguredSupabase) {
            try {
                await supabase.from('recurring_transactions').delete().eq('id', id).eq('user_id', userId);
                return;
            }
            catch (err) {
                console.warn('Supabase recurring delete failed:', err);
            }
        }
        const items = localStore.getItem(userId, 'recurring_transactions', []);
        localStore.setItem(userId, 'recurring_transactions', items.filter((r) => r.id !== id));
    },
    // Trigger immediate idempotent generation for due schedules
    async triggerRecurringRun(userId) {
        if (isConfiguredSupabase) {
            try {
                const { data, error } = await supabase.rpc('process_due_recurring_transactions', {
                    p_target_date: new Date().toISOString().split('T')[0],
                });
                if (!error && data) {
                    return { processed: data.processed_count || 0 };
                }
            }
            catch (err) {
                console.warn('RPC process recurring failed:', err);
            }
        }
        // Local simulation of idempotent runner
        const recurrings = localStore.getItem(userId, 'recurring_transactions', []);
        const today = new Date().toISOString().split('T')[0];
        let processed = 0;
        for (const rec of recurrings) {
            if (rec.status === 'active' && rec.next_occurrence <= today) {
                // Add transaction
                await this.addTransaction(userId, {
                    type: rec.type,
                    amount: rec.amount,
                    category_id: rec.category_id,
                    payment_method_id: rec.payment_method_id,
                    date: rec.next_occurrence,
                    description: rec.description,
                    notes: 'Auto-generated from scheduled recurring bill',
                });
                // Compute next occurrence
                const nextDate = new Date(rec.next_occurrence);
                if (rec.frequency === 'daily')
                    nextDate.setDate(nextDate.getDate() + 1);
                else if (rec.frequency === 'weekly')
                    nextDate.setDate(nextDate.getDate() + 7);
                else if (rec.frequency === 'yearly')
                    nextDate.setFullYear(nextDate.getFullYear() + 1);
                else
                    nextDate.setMonth(nextDate.getMonth() + 1);
                rec.next_occurrence = nextDate.toISOString().split('T')[0];
                processed++;
            }
        }
        localStore.setItem(userId, 'recurring_transactions', recurrings);
        return { processed };
    },
    // --- PROFILE & USER DELETION ---
    async getProfile(userId) {
        if (isConfiguredSupabase) {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', userId)
                    .single();
                if (!error && data)
                    return data;
            }
            catch (err) {
                console.warn('Profile fetch failed:', err);
            }
        }
        const fallback = {
            id: userId,
            email: 'user@ledgerbrutalist.com',
            full_name: 'Lead Financial Auditor',
            avatar_url: null,
            currency: 'INR',
            timezone: 'Asia/Kolkata',
            opening_balance: 0,
            has_completed_onboarding: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        return localStore.getItem(userId, 'profile', fallback);
    },
    async updateProfile(userId, updates) {
        if (isConfiguredSupabase) {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .update({ ...updates, updated_at: new Date().toISOString() })
                    .eq('id', userId)
                    .select('*')
                    .single();
                if (!error && data)
                    return data;
            }
            catch (err) {
                console.warn('Profile update failed:', err);
            }
        }
        const current = await this.getProfile(userId);
        const updated = { ...current, ...updates, updated_at: new Date().toISOString() };
        localStore.setItem(userId, 'profile', updated);
        return updated;
    },
    async deleteUserAccountData(userId) {
        if (isConfiguredSupabase) {
            try {
                await supabase.rpc('delete_user_account_data');
            }
            catch (err) {
                console.warn('Account deletion RPC failed:', err);
            }
        }
        // Clear all local user partitions
        const tables = ['transactions', 'budgets', 'savings_goals', 'recurring_transactions', 'categories', 'payment_methods', 'profile'];
        tables.forEach((t) => localStorage.removeItem(`ledger_brutalist_${userId}_${t}`));
    },
};
