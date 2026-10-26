import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

const pageTitleMap: Record<string, string> = {
  '/dashboard': 'Financial Command Dashboard',
  '/transactions': 'Transaction Ledger',
  '/budgets': 'Expenditure Budgets',
  '/savings': 'Savings Goals & Capital',
  '/recurring': 'Recurring Schedules & Bills',
  '/reports': 'Financial Intelligence & Export',
  '/insights': 'Financial Intelligence & Trends',
  '/settings': 'System Settings & Data Control',
};

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const title = pageTitleMap[location.pathname] || 'Ledger Brutalist';

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-brutal-darkBg text-ink-950 dark:text-zinc-100 flex">
      {/* Desktop & Mobile Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0 pb-16 lg:pb-0">
        <Navbar
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          pageTitle={title}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Global Footer */}
        <footer className="border-t-2 border-ink-950/20 dark:border-zinc-800 bg-cream-200/40 dark:bg-zinc-900/40 py-4 px-6 text-[11px] font-mono text-ink-500 dark:text-zinc-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="font-bold text-ink-800 dark:text-zinc-300">LEDGER BRUTALIST</span> • Multi-User Financial Command Center
            </div>
            <div className="flex items-center gap-4">
              <a href="/privacy" className="underline hover:text-ink-950 dark:hover:text-zinc-200">
                Privacy Policy
              </a>
              <span className="text-ink-300 dark:text-zinc-600">|</span>
              <a href="/terms" className="underline hover:text-ink-950 dark:hover:text-zinc-200">
                Terms and Conditions
              </a>
            </div>
          </div>
        </footer>

        {/* Mobile Bottom Navigation */}
        <BottomNav onOpenMenu={() => setSidebarOpen(true)} />
      </div>
    </div>
  );
};
