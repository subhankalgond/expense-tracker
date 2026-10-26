-- Ledger Brutalist: Complete Database Migration & RLS Security Schema
-- Target: PostgreSQL / Supabase

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    currency TEXT NOT NULL DEFAULT 'INR',
    timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    opening_balance NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    has_completed_onboarding BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'both')),
    color TEXT NOT NULL DEFAULT '#1E40AF',
    icon TEXT NOT NULL DEFAULT 'tag',
    is_archived BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT categories_user_name_unique UNIQUE(user_id, name)
);

-- 4. Payment Methods Table
CREATE TABLE IF NOT EXISTS public.payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('cash', 'upi', 'debit_card', 'credit_card', 'bank_transfer', 'other')),
    is_archived BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT payment_methods_user_name_unique UNIQUE(user_id, name)
);

-- 5. Transactions Table
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    payment_method_id UUID REFERENCES public.payment_methods(id) ON DELETE SET NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT NOT NULL,
    notes TEXT,
    recurring_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Budgets Table
CREATE TABLE IF NOT EXISTS public.budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    limit_amount NUMERIC(14, 2) NOT NULL CHECK (limit_amount > 0),
    period TEXT NOT NULL DEFAULT 'monthly' CHECK (period IN ('monthly', 'weekly', 'yearly')),
    alert_threshold_75 BOOLEAN NOT NULL DEFAULT true,
    alert_threshold_90 BOOLEAN NOT NULL DEFAULT true,
    alert_threshold_100 BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Savings Goals Table
CREATE TABLE IF NOT EXISTS public.savings_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    target_amount NUMERIC(14, 2) NOT NULL CHECK (target_amount > 0),
    current_amount NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (current_amount >= 0),
    target_date DATE,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Savings Contributions Table
CREATE TABLE IF NOT EXISTS public.savings_contributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID NOT NULL REFERENCES public.savings_goals(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
    type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal')),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. Recurring Transactions Table
CREATE TABLE IF NOT EXISTS public.recurring_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    payment_method_id UUID REFERENCES public.payment_methods(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
    start_date DATE NOT NULL,
    end_date DATE,
    next_occurrence DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. Recurring History (Idempotent Execution Log)
CREATE TABLE IF NOT EXISTS public.recurring_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recurring_id UUID NOT NULL REFERENCES public.recurring_transactions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES public.transactions(id) ON DELETE SET NULL,
    occurrence_key TEXT NOT NULL UNIQUE,
    generated_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. Notification Preferences Table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    budget_alerts BOOLEAN NOT NULL DEFAULT true,
    bill_reminders BOOLEAN NOT NULL DEFAULT true,
    weekly_digest BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('budget_warning', 'budget_exceeded', 'bill_due', 'system', 'goal_milestone')),
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for Optimal Performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON public.transactions(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON public.transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_transactions_payment_method ON public.transactions(payment_method_id);
CREATE INDEX IF NOT EXISTS idx_categories_user ON public.categories(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_user ON public.budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_savings_goals_user ON public.savings_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_savings_contributions_goal ON public.savings_contributions(goal_id);
CREATE INDEX IF NOT EXISTS idx_recurring_user_status ON public.recurring_transactions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_recurring_next ON public.recurring_transactions(next_occurrence) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, is_read);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recurring_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recurring_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Categories Policies
CREATE POLICY "Users can view own categories" ON public.categories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own categories" ON public.categories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own categories" ON public.categories FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own categories" ON public.categories FOR DELETE USING (auth.uid() = user_id);

-- Payment Methods Policies
CREATE POLICY "Users can view own payment methods" ON public.payment_methods FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own payment methods" ON public.payment_methods FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own payment methods" ON public.payment_methods FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own payment methods" ON public.payment_methods FOR DELETE USING (auth.uid() = user_id);

-- Transactions Policies
CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON public.transactions FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    (category_id IS NULL OR EXISTS (SELECT 1 FROM public.categories c WHERE c.id = category_id AND c.user_id = auth.uid())) AND
    (payment_method_id IS NULL OR EXISTS (SELECT 1 FROM public.payment_methods pm WHERE pm.id = payment_method_id AND pm.user_id = auth.uid()))
);
CREATE POLICY "Users can update own transactions" ON public.transactions FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (
    auth.uid() = user_id AND
    (category_id IS NULL OR EXISTS (SELECT 1 FROM public.categories c WHERE c.id = category_id AND c.user_id = auth.uid())) AND
    (payment_method_id IS NULL OR EXISTS (SELECT 1 FROM public.payment_methods pm WHERE pm.id = payment_method_id AND pm.user_id = auth.uid()))
);
CREATE POLICY "Users can delete own transactions" ON public.transactions FOR DELETE USING (auth.uid() = user_id);

-- Budgets Policies
CREATE POLICY "Users can view own budgets" ON public.budgets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own budgets" ON public.budgets FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    (category_id IS NULL OR EXISTS (SELECT 1 FROM public.categories c WHERE c.id = category_id AND c.user_id = auth.uid()))
);
CREATE POLICY "Users can update own budgets" ON public.budgets FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (
    auth.uid() = user_id AND
    (category_id IS NULL OR EXISTS (SELECT 1 FROM public.categories c WHERE c.id = category_id AND c.user_id = auth.uid()))
);
CREATE POLICY "Users can delete own budgets" ON public.budgets FOR DELETE USING (auth.uid() = user_id);

-- Savings Goals Policies
CREATE POLICY "Users can view own savings goals" ON public.savings_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own savings goals" ON public.savings_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own savings goals" ON public.savings_goals FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own savings goals" ON public.savings_goals FOR DELETE USING (auth.uid() = user_id);

-- Savings Contributions Policies
CREATE POLICY "Users can view own contributions" ON public.savings_contributions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own contributions" ON public.savings_contributions FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (SELECT 1 FROM public.savings_goals g WHERE g.id = goal_id AND g.user_id = auth.uid())
);

-- Recurring Transactions Policies
CREATE POLICY "Users can view own recurring schedules" ON public.recurring_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own recurring schedules" ON public.recurring_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own recurring schedules" ON public.recurring_transactions FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own recurring schedules" ON public.recurring_transactions FOR DELETE USING (auth.uid() = user_id);

-- Recurring History Policies
CREATE POLICY "Users can view own recurring history" ON public.recurring_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own recurring history" ON public.recurring_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notification Preferences Policies
CREATE POLICY "Users can view own notification prefs" ON public.notification_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notification prefs" ON public.notification_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notification prefs" ON public.notification_preferences FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Notifications Policies
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own notifications" ON public.notifications FOR DELETE USING (auth.uid() = user_id);

-- DATABASE FUNCTIONS & TRIGGERS

-- A. Onboarding Trigger: Automatically seed profile, default categories, and default payment methods on sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- 1. Create Profile
    INSERT INTO public.profiles (id, email, full_name, avatar_url, currency, timezone, opening_balance)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url',
        'INR',
        'Asia/Kolkata',
        0.00
    );

    -- 2. Create Notification Preferences
    INSERT INTO public.notification_preferences (user_id, budget_alerts, bill_reminders, weekly_digest)
    VALUES (NEW.id, true, true, false);

    -- 3. Seed Default Categories
    INSERT INTO public.categories (user_id, name, type, color, icon) VALUES
        (NEW.id, 'Food & Groceries', 'expense', '#C2410C', 'utensils'),
        (NEW.id, 'Transport', 'expense', '#1E40AF', 'car'),
        (NEW.id, 'Housing & Utilities', 'expense', '#4B5563', 'home'),
        (NEW.id, 'Healthcare', 'expense', '#B91C1C', 'heart-pulse'),
        (NEW.id, 'Education', 'expense', '#7C3AED', 'book-open'),
        (NEW.id, 'Shopping', 'expense', '#DB2777', 'shopping-bag'),
        (NEW.id, 'Entertainment', 'expense', '#D97706', 'film'),
        (NEW.id, 'Travel', 'expense', '#059669', 'plane'),
        (NEW.id, 'Salary', 'income', '#047857', 'briefcase'),
        (NEW.id, 'Freelance Income', 'income', '#0D9488', 'laptop'),
        (NEW.id, 'Investments', 'income', '#2563EB', 'trending-up'),
        (NEW.id, 'Other', 'both', '#6B7280', 'more-horizontal');

    -- 4. Seed Default Payment Methods
    INSERT INTO public.payment_methods (user_id, name, type) VALUES
        (NEW.id, 'UPI', 'upi'),
        (NEW.id, 'Cash', 'cash'),
        (NEW.id, 'Debit Card', 'debit_card'),
        (NEW.id, 'Credit Card', 'credit_card'),
        (NEW.id, 'Bank Transfer', 'bank_transfer'),
        (NEW.id, 'Other', 'other');

    -- 5. Welcome Notification
    INSERT INTO public.notifications (user_id, title, message, type) VALUES
        (NEW.id, 'Welcome to Ledger Brutalist', 'Your financial command center is ready. Set your opening balance or add your first transaction.', 'system');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- B. Atomic Savings Movement Function (Guarantees consistency between contributions and goal current_amount)
CREATE OR REPLACE FUNCTION public.record_savings_movement(
    p_goal_id UUID,
    p_amount NUMERIC(14, 2),
    p_type TEXT,
    p_note TEXT DEFAULT NULL,
    p_date DATE DEFAULT CURRENT_DATE
)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_goal RECORD;
    v_new_amount NUMERIC(14, 2);
    v_contrib_id UUID;
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    IF p_amount <= 0 THEN
        RAISE EXCEPTION 'Amount must be greater than zero';
    END IF;

    IF p_type NOT IN ('deposit', 'withdrawal') THEN
        RAISE EXCEPTION 'Invalid transaction type for savings movement';
    END IF;

    -- Lock and retrieve goal
    SELECT * INTO v_goal FROM public.savings_goals WHERE id = p_goal_id AND user_id = v_user_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Savings goal not found or permission denied';
    END IF;

    -- Calculate new balance
    IF p_type = 'deposit' THEN
        v_new_amount := v_goal.current_amount + p_amount;
    ELSE
        IF v_goal.current_amount < p_amount THEN
            RAISE EXCEPTION 'Insufficient funds in savings goal for withdrawal';
        END IF;
        v_new_amount := v_goal.current_amount - p_amount;
    END IF;

    -- Update goal balance atomically
    UPDATE public.savings_goals
    SET current_amount = v_new_amount,
        status = CASE WHEN v_new_amount >= target_amount THEN 'completed' ELSE 'active' END,
        updated_at = now()
    WHERE id = p_goal_id;

    -- Insert contribution record
    INSERT INTO public.savings_contributions (goal_id, user_id, amount, type, date, note)
    VALUES (p_goal_id, v_user_id, p_amount, p_type, p_date, p_note)
    RETURNING id INTO v_contrib_id;

    RETURN jsonb_build_object(
        'goal_id', p_goal_id,
        'contribution_id', v_contrib_id,
        'previous_amount', v_goal.current_amount,
        'new_amount', v_new_amount,
        'status', CASE WHEN v_new_amount >= v_goal.target_amount THEN 'completed' ELSE 'active' END
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- C. Idempotent Recurring Transaction Processor Function
CREATE OR REPLACE FUNCTION public.process_due_recurring_transactions(p_target_date DATE DEFAULT CURRENT_DATE)
RETURNS JSONB AS $$
DECLARE
    v_rec RECORD;
    v_occ_key TEXT;
    v_new_tx_id UUID;
    v_processed_count INT := 0;
    v_next_date DATE;
BEGIN
    FOR v_rec IN
        SELECT * FROM public.recurring_transactions
        WHERE status = 'active'
          AND next_occurrence <= p_target_date
          AND (end_date IS NULL OR next_occurrence <= end_date)
        FOR UPDATE
    LOOP
        v_occ_key := v_rec.id::text || '_' || v_rec.next_occurrence::text;

        -- Check idempotency
        IF NOT EXISTS (SELECT 1 FROM public.recurring_history WHERE occurrence_key = v_occ_key) THEN
            -- Insert transaction
            INSERT INTO public.transactions (
                user_id,
                type,
                amount,
                category_id,
                payment_method_id,
                date,
                description,
                notes,
                recurring_id
            ) VALUES (
                v_rec.user_id,
                v_rec.type,
                v_rec.amount,
                v_rec.category_id,
                v_rec.payment_method_id,
                v_rec.next_occurrence,
                v_rec.description,
                'Generated automatically from recurring schedule',
                v_rec.id
            ) RETURNING id INTO v_new_tx_id;

            -- Record history
            INSERT INTO public.recurring_history (recurring_id, user_id, transaction_id, occurrence_key, generated_date)
            VALUES (v_rec.id, v_rec.user_id, v_new_tx_id, v_occ_key, v_rec.next_occurrence);

            v_processed_count := v_processed_count + 1;
        END IF;

        -- Calculate next occurrence
        CASE v_rec.frequency
            WHEN 'daily' THEN v_next_date := v_rec.next_occurrence + INTERVAL '1 day';
            WHEN 'weekly' THEN v_next_date := v_rec.next_occurrence + INTERVAL '1 week';
            WHEN 'monthly' THEN v_next_date := v_rec.next_occurrence + INTERVAL '1 month';
            WHEN 'yearly' THEN v_next_date := v_rec.next_occurrence + INTERVAL '1 year';
            ELSE v_next_date := v_rec.next_occurrence + INTERVAL '1 month';
        END CASE;

        -- Check if recurrence has finished
        IF v_rec.end_date IS NOT NULL AND v_next_date > v_rec.end_date THEN
            UPDATE public.recurring_transactions
            SET status = 'completed', updated_at = now()
            WHERE id = v_rec.id;
        ELSE
            UPDATE public.recurring_transactions
            SET next_occurrence = v_next_date, updated_at = now()
            WHERE id = v_rec.id;
        END IF;
    END LOOP;

    RETURN jsonb_build_object(
        'processed_count', v_processed_count,
        'target_date', p_target_date
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- D. Delete User Account Data (GDPR / Privacy Compliance)
CREATE OR REPLACE FUNCTION public.delete_user_account_data()
RETURNS VOID AS $$
DECLARE
    v_user_id UUID := auth.uid();
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Due to ON DELETE CASCADE on auth.users, deleting the user or records cascades.
    DELETE FROM public.transactions WHERE user_id = v_user_id;
    DELETE FROM public.budgets WHERE user_id = v_user_id;
    DELETE FROM public.savings_goals WHERE user_id = v_user_id;
    DELETE FROM public.recurring_transactions WHERE user_id = v_user_id;
    DELETE FROM public.categories WHERE user_id = v_user_id;
    DELETE FROM public.payment_methods WHERE user_id = v_user_id;
    DELETE FROM public.notifications WHERE user_id = v_user_id;
    DELETE FROM public.notification_preferences WHERE user_id = v_user_id;
    DELETE FROM public.profiles WHERE id = v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
