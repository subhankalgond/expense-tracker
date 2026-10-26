import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink } from 'react-router-dom';
import { WalletIcon, RupeeIcon, PieChartIcon, TargetIcon, MenuIcon } from '../ui/Icons';
export const BottomNav = ({ onOpenMenu }) => {
    const quickLinks = [
        { to: '/dashboard', label: 'Home', icon: WalletIcon },
        { to: '/transactions', label: 'Entries', icon: RupeeIcon },
        { to: '/budgets', label: 'Budgets', icon: PieChartIcon },
        { to: '/savings', label: 'Savings', icon: TargetIcon },
    ];
    return (_jsxs("nav", { className: "lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-cream-50 dark:bg-brutal-darkCard border-t-2 border-ink-950 dark:border-zinc-700 px-2 py-1.5 flex items-center justify-around shadow-lg", children: [quickLinks.map((item) => {
                const Icon = item.icon;
                return (_jsxs(NavLink, { to: item.to, className: ({ isActive }) => `flex flex-col items-center justify-center py-1 px-3 text-[10px] font-mono font-bold uppercase tracking-wider transition-colors ${isActive
                        ? 'text-cobalt dark:text-blue-400 border-b-2 border-cobalt dark:border-blue-400'
                        : 'text-ink-600 dark:text-zinc-400'}`, children: [_jsx(Icon, { className: "w-4 h-4 mb-0.5" }), _jsx("span", { children: item.label })] }, item.to));
            }), _jsxs("button", { type: "button", onClick: onOpenMenu, "aria-label": "More navigation options", className: "flex flex-col items-center justify-center py-1 px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-ink-600 dark:text-zinc-400", children: [_jsx(MenuIcon, { className: "w-4 h-4 mb-0.5" }), _jsx("span", { children: "More" })] })] }));
};
