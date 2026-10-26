import React from 'react';
import { NavLink } from 'react-router-dom';
import { WalletIcon, RupeeIcon, PieChartIcon, TargetIcon, MenuIcon } from '../ui/Icons';

interface BottomNavProps {
  onOpenMenu: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenMenu }) => {
  const quickLinks = [
    { to: '/dashboard', label: 'Home', icon: WalletIcon },
    { to: '/transactions', label: 'Entries', icon: RupeeIcon },
    { to: '/budgets', label: 'Budgets', icon: PieChartIcon },
    { to: '/savings', label: 'Savings', icon: TargetIcon },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-cream-50 dark:bg-brutal-darkCard border-t-2 border-ink-950 dark:border-zinc-700 px-2 py-1.5 flex items-center justify-around shadow-lg">
      {quickLinks.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-3 text-[10px] font-mono font-bold uppercase tracking-wider transition-colors ${
                isActive
                  ? 'text-cobalt dark:text-blue-400 border-b-2 border-cobalt dark:border-blue-400'
                  : 'text-ink-600 dark:text-zinc-400'
              }`
            }
          >
            <Icon className="w-4 h-4 mb-0.5" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}

      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="More navigation options"
        className="flex flex-col items-center justify-center py-1 px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-ink-600 dark:text-zinc-400"
      >
        <MenuIcon className="w-4 h-4 mb-0.5" />
        <span>More</span>
      </button>
    </nav>
  );
};
