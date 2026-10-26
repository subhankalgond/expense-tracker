import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldIcon, RupeeIcon, ArrowRightIcon } from '../components/ui/Icons';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream-100 dark:bg-brutal-darkBg text-ink-950 dark:text-zinc-100 p-4 sm:p-8 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-8">
        {/* Navigation Header */}
        <div className="flex items-center justify-between border-b-2 border-ink-950 dark:border-zinc-700 pb-4">
          <Link to="/login" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-ink-950 dark:bg-white text-white dark:text-ink-950 flex items-center justify-center font-mono font-bold text-sm border border-ink-950">
              <RupeeIcon className="w-4 h-4" />
            </div>
            <span className="font-mono font-black text-sm uppercase tracking-wider group-hover:underline">
              Ledger Brutalist
            </span>
          </Link>

          <Link
            to="/login"
            className="brutal-btn-secondary text-xs flex items-center gap-1.5"
          >
            <span>Back to Application</span>
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Header Title */}
        <div>
          <span className="editorial-kicker">LEGAL DOCUMENTATION & DATA PROTOCOL</span>
          <h1 className="editorial-headline text-3xl sm:text-4xl">
            Privacy Policy & Data Sovereignty
          </h1>
          <p className="text-xs font-mono text-ink-600 dark:text-zinc-400 mt-1">
            Effective Date: October 25, 2026 • Edition 1.0 (PostgreSQL RLS Architecture)
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-6 text-xs font-mono leading-relaxed text-ink-800 dark:text-zinc-300">
          <section className="brutal-card p-6 bg-cream-50 dark:bg-brutal-darkCard space-y-3">
            <h2 className="font-serif font-bold text-base text-ink-950 dark:text-zinc-100 border-b border-ink-950/20 dark:border-zinc-700 pb-2">
              1. Architecture & Core Data Principle
            </h2>
            <p>
              Ledger Brutalist is designed as a secure, private personal financial ledger. We believe your personal accounting, income lines, expenditure records, and savings targets belong exclusively to you. The system is engineered to minimize external data exposure and enforce cryptographic and database-level isolation.
            </p>
          </section>

          <section className="brutal-card p-6 bg-cream-50 dark:bg-brutal-darkCard space-y-3">
            <h2 className="text-sm font-bold uppercase text-ink-950 dark:text-zinc-100 border-b border-ink-950/20 dark:border-zinc-700 pb-2">
              2. Information We Process
            </h2>
            <p>
              When you use Ledger Brutalist, the following data points are created and managed:
            </p>
            <ul className="space-y-1.5 pl-2 list-none">
              <li>
                <strong className="text-ink-950 dark:text-zinc-100">• Account Credentials:</strong> Your email address and authentication tokens managed via Supabase Auth (or Google OAuth credentials). We never store plaintext passwords on our servers.
              </li>
              <li>
                <strong className="text-ink-950 dark:text-zinc-100">• Accounting Transactions:</strong> Amounts in Indian Rupee integer minor units (paise), timestamps, categorical classifications, payment notes, and recurring frequency schedules.
              </li>
              <li>
                <strong className="text-ink-950 dark:text-zinc-100">• User Configuration:</strong> Budget threshold limits, currency display preferences, and theme state.
              </li>
            </ul>
          </section>

          <section className="brutal-card p-6 bg-cream-50 dark:bg-brutal-darkCard space-y-3">
            <h2 className="text-sm font-bold uppercase text-ink-950 dark:text-zinc-100 border-b border-ink-950/20 dark:border-zinc-700 pb-2">
              3. Database Security & Tenant Isolation
            </h2>
            <p>
              All primary application data is stored in PostgreSQL equipped with Row Level Security (RLS). Every table query executes with explicit security policies enforcing <code className="bg-cream-200 dark:bg-zinc-800 px-1 py-0.5 border border-ink-950/20 text-ink-950 dark:text-zinc-200 font-bold">auth.uid() = user_id</code>.
            </p>
            <p>
              Even in the event of an unauthorized API request, the database engine prohibits cross-tenant record reads, inserts, modifications, or deletions at the kernel level.
            </p>
          </section>

          <section className="brutal-card p-6 bg-cream-50 dark:bg-brutal-darkCard space-y-3">
            <h2 className="text-sm font-bold uppercase text-ink-950 dark:text-zinc-100 border-b border-ink-950/20 dark:border-zinc-700 pb-2">
              4. Cookies, Analytics & Third-Party Sharing
            </h2>
            <p>
              • No Advertising Trackers: We do not integrate advertising networks, marketing pixels, or third-party behavioral telemetry.
            </p>
            <p>
              • Authentication Storage: Browser session tokens are stored securely in local storage or HTTP-only cookies purely to maintain user authentication state across page navigations.
            </p>
            <p>
              • No Data Selling: We do not monetize or sell transaction data, spending habits, or financial figures to brokers, underwriters, or marketers.
            </p>
          </section>

          <section className="brutal-card p-6 bg-cream-50 dark:bg-brutal-darkCard space-y-3">
            <h2 className="text-sm font-bold uppercase text-ink-950 dark:text-zinc-100 border-b border-ink-950/20 dark:border-zinc-700 pb-2">
              5. Data Sovereignty, Export & Right to Deletion
            </h2>
            <p>
              You maintain unencumbered ownership of your ledger entries:
            </p>
            <ul className="space-y-1.5 pl-2 list-none">
              <li>
                <strong className="text-ink-950 dark:text-zinc-100">• Data Portability:</strong> You may at any time export your transactions, budgets, and savings history in standard CSV and JSON formats from the application interface.
              </li>
              <li>
                <strong className="text-ink-950 dark:text-zinc-100">• Permanent Erasure:</strong> You can purge your complete financial records directly from the Settings panel via an atomic PostgreSQL stored procedure. Once confirmed, your records are deleted immediately and irreversibly.
              </li>
            </ul>
          </section>

          <section className="brutal-card p-6 bg-cream-50 dark:bg-brutal-darkCard space-y-3">
            <h2 className="text-sm font-bold uppercase text-ink-950 dark:text-zinc-100 border-b border-ink-950/20 dark:border-zinc-700 pb-2">
              6. Policy Inquiries
            </h2>
            <p>
              If you have operational inquiries regarding this privacy policy or your stored financial records, you may review your profile settings or reach out through the application repository documentation.
            </p>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="pt-6 border-t-2 border-ink-950 dark:border-zinc-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-ink-500 dark:text-zinc-400">
          <div>
            © 2026 Ledger Brutalist • Open Architecture Personal Finance
          </div>
          <div className="flex gap-4">
            <Link to="/terms" className="underline hover:text-ink-950 dark:hover:text-zinc-200">
              Terms and Conditions
            </Link>
            <Link to="/login" className="underline hover:text-ink-950 dark:hover:text-zinc-200">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
