import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  WalletIcon,
  PieChartIcon,
  TargetIcon,
  RepeatIcon,
  TrendingUpIcon,
  AnalyticsIcon,
  SettingsIcon,
  CloseIcon,
  RupeeIcon,
} from '../ui/Icons';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: WalletIcon },
  { to: '/transactions', label: 'Transactions', icon: RupeeIcon },
  { to: '/budgets', label: 'Budgets', icon: PieChartIcon },
  { to: '/savings', label: 'Savings Goals', icon: TargetIcon },
  { to: '/recurring', label: 'Recurring Bills', icon: RepeatIcon },
  { to: '/reports', label: 'Reports', icon: TrendingUpIcon },
  { to: '/insights', label: 'Financial Insights', icon: AnalyticsIcon },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-zinc-950/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-60 bg-[#FAF8F5] dark:bg-[#12151C] border-r border-[#E5E0D6] dark:border-[#222733] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#EAE5DC] dark:border-[#222733]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1E40AF] text-white flex items-center justify-center font-serif font-bold text-base shadow-xs">
              ₹
            </div>
            <div>
              <span className="block font-serif font-bold text-sm tracking-tight text-[#121826] dark:text-zinc-100 leading-tight">
                Ledger Brutalist
              </span>
              <span className="block text-[10px] font-sans font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Financial Command
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="lg:hidden p-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => onClose()}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 text-xs font-sans font-semibold rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#1E40AF] text-white shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-[#EFECE5] dark:hover:bg-[#1C212C]'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Meta */}
        <div className="p-4 border-t border-[#EAE5DC] dark:border-[#222733] bg-[#F5F2EA]/60 dark:bg-[#141720]/60 text-[11px] font-sans text-zinc-500 dark:text-zinc-400">
          <div className="flex justify-between items-center mb-1">
            <span>Currency:</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">INR (₹)</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Security:</span>
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">PostgreSQL RLS</span>
          </div>
        </div>
      </aside>
    </>
  );
};
