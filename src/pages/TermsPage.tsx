import React from 'react';
import { Link } from 'react-router-dom';
import { RupeeIcon, ArrowRightIcon } from '../components/ui/Icons';

export const TermsPage: React.FC = () => {
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
          <span className="editorial-kicker">TERMS OF SERVICE & USAGE AGREEMENT</span>
          <h1 className="editorial-headline text-3xl sm:text-4xl">
            Terms and Conditions of Service
          </h1>
          <p className="text-xs font-mono text-ink-600 dark:text-zinc-400 mt-1">
            Last Updated: October 25, 2026 • Edition 1.0
          </p>
        </div>

        {/* Terms Content */}
        <div className="space-y-6 text-xs font-mono leading-relaxed text-ink-800 dark:text-zinc-300">
          <section className="brutal-card p-6 bg-cream-50 dark:bg-brutal-darkCard space-y-3">
            <h2 className="font-serif font-bold text-base text-ink-950 dark:text-zinc-100 border-b border-ink-950/20 dark:border-zinc-700 pb-2">
              1. Purpose of Service
            </h2>
            <p>
              Ledger Brutalist provides self-directed financial record-keeping, multi-currency display, budget tracking, and cash-flow monitoring tools. The application operates as a computational ledger to assist individual users and small teams in organizing their income and expenditures.
            </p>
          </section>

          <section className="brutal-card p-6 bg-cream-50 dark:bg-brutal-darkCard space-y-3">
            <h2 className="text-sm font-bold uppercase text-ink-950 dark:text-zinc-100 border-b border-ink-950/20 dark:border-zinc-700 pb-2">
              2. Financial & Legal Disclaimer
            </h2>
            <p>
              The information, calculations, and analytical insights produced by Ledger Brutalist are generated for general informational and personal organizational purposes only.
            </p>
            <p>
              • Not Financial Advice: Ledger Brutalist is not a certified financial planner, registered investment advisor, tax consultant, or licensed broker. None of the calculations or heuristic suggestions constitute certified financial, tax, or legal counsel.
            </p>
            <p>
              • Self-Directed Accounting: You are solely responsible for verifying the accuracy of entries, statutory tax compliance, and financial decisions executed on the basis of recorded data.
            </p>
          </section>

          <section className="brutal-card p-6 bg-cream-50 dark:bg-brutal-darkCard space-y-3">
            <h2 className="text-sm font-bold uppercase text-ink-950 dark:text-zinc-100 border-b border-ink-950/20 dark:border-zinc-700 pb-2">
              3. User Account Security
            </h2>
            <p>
              When establishing an account, you agree to:
            </p>
            <ul className="space-y-1.5 pl-2 list-none">
              <li>
                • Provide an accurate email address for authentication verification.
              </li>
              <li>
                • Protect access to your device, OAuth session tokens, and account passwords.
              </li>
              <li>
                • Refrain from attempting SQL injection, privilege escalation, or unauthorized access to other user partitions.
              </li>
            </ul>
          </section>

          <section className="brutal-card p-6 bg-cream-50 dark:bg-brutal-darkCard space-y-3">
            <h2 className="text-sm font-bold uppercase text-ink-950 dark:text-zinc-100 border-b border-ink-950/20 dark:border-zinc-700 pb-2">
              4. Service Availability & Limitations
            </h2>
            <p>
              While Ledger Brutalist incorporates PostgreSQL failover, automated backup routines, and local offline transaction caching, the software is provided on an "as-is" and "as-available" basis without warranties of uninterrupted availability.
            </p>
            <p>
              Users are encouraged to maintain periodic independent CSV or JSON backups using the built-in export utilities in the Settings page.
            </p>
          </section>

          <section className="brutal-card p-6 bg-cream-50 dark:bg-brutal-darkCard space-y-3">
            <h2 className="text-sm font-bold uppercase text-ink-950 dark:text-zinc-100 border-b border-ink-950/20 dark:border-zinc-700 pb-2">
              5. Intellectual Property & License
            </h2>
            <p>
              The application structure, UI tokens, and codebase are made available under an open-source permissive license. You own all financial transaction records and custom classification rules created within your personal ledger.
            </p>
          </section>

          <section className="brutal-card p-6 bg-cream-50 dark:bg-brutal-darkCard space-y-3">
            <h2 className="text-sm font-bold uppercase text-ink-950 dark:text-zinc-100 border-b border-ink-950/20 dark:border-zinc-700 pb-2">
              6. Modifications to Terms
            </h2>
            <p>
              We reserve the right to update these terms to reflect changes in regulatory standards or software features. Continued use of Ledger Brutalist constitutes acceptance of the current terms.
            </p>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="pt-6 border-t-2 border-ink-950 dark:border-zinc-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-ink-500 dark:text-zinc-400">
          <div>
            © 2026 Ledger Brutalist • Open Architecture Personal Finance
          </div>
          <div className="flex gap-4">
            <Link to="/privacy" className="underline hover:text-ink-950 dark:hover:text-zinc-200">
              Privacy Policy
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
