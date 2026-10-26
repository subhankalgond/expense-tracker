import React from 'react';
import { Link } from 'react-router-dom';
import { RupeeIcon } from '../components/ui/Icons';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream-100 dark:bg-brutal-darkBg flex flex-col items-center justify-center p-6 text-center">
      <div className="brutal-card p-8 max-w-md w-full bg-cream-50 dark:bg-brutal-darkCard shadow-brutal-xl">
        <div className="w-16 h-16 bg-brutal-red text-white flex items-center justify-center font-mono font-black text-2xl border-3 border-ink-950 mx-auto mb-4">
          404
        </div>

        <h1 className="text-xl font-black font-mono uppercase tracking-tight text-ink-950 dark:text-zinc-100 mb-2">
          Page Not In Ledger
        </h1>

        <p className="text-xs font-mono text-ink-600 dark:text-zinc-400 mb-6 leading-relaxed">
          The requested audit route does not exist in Ledger Brutalist or has been decommissioned.
        </p>

        <Link to="/dashboard" className="w-full brutal-btn-primary py-3 block text-center">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};
