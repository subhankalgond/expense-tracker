import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { NavLink } from 'react-router-dom';
import { WalletIcon, PieChartIcon, TargetIcon, RepeatIcon, TrendingUpIcon, AnalyticsIcon, SettingsIcon, CloseIcon, RupeeIcon, } from '../ui/Icons';
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
export const Sidebar = ({ isOpen, onClose }) => {
    return (_jsxs(_Fragment, { children: [isOpen && (_jsx("div", { className: "fixed inset-0 z-40 bg-zinc-950/40 backdrop-blur-xs lg:hidden", onClick: onClose })), _jsxs("aside", { className: `fixed top-0 bottom-0 left-0 z-50 w-60 bg-[#FAF8F5] dark:bg-[#12151C] border-r border-[#E5E0D6] dark:border-[#222733] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`, children: [_jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-[#EAE5DC] dark:border-[#222733]", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 rounded-lg bg-[#1E40AF] text-white flex items-center justify-center font-serif font-bold text-base shadow-xs", children: "\u20B9" }), _jsxs("div", { children: [_jsx("span", { className: "block font-serif font-bold text-sm tracking-tight text-[#121826] dark:text-zinc-100 leading-tight", children: "Ledger Brutalist" }), _jsx("span", { className: "block text-[10px] font-sans font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400", children: "Financial Command" })] })] }), _jsx("button", { onClick: onClose, "aria-label": "Close sidebar", className: "lg:hidden p-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300", children: _jsx(CloseIcon, { className: "w-4 h-4" }) })] }), _jsx("nav", { className: "flex-1 overflow-y-auto px-3 py-4 space-y-1", children: navItems.map((item) => {
                            const Icon = item.icon;
                            return (_jsxs(NavLink, { to: item.to, onClick: () => onClose(), className: ({ isActive }) => `flex items-center gap-3 px-3 py-2 text-xs font-sans font-semibold rounded-lg transition-all ${isActive
                                    ? 'bg-[#1E40AF] text-white shadow-xs'
                                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-[#EFECE5] dark:hover:bg-[#1C212C]'}`, children: [_jsx(Icon, { className: "w-4 h-4 shrink-0" }), _jsx("span", { children: item.label })] }, item.to));
                        }) }), _jsxs("div", { className: "p-4 border-t border-[#EAE5DC] dark:border-[#222733] bg-[#F5F2EA]/60 dark:bg-[#141720]/60 text-[11px] font-sans text-zinc-500 dark:text-zinc-400", children: [_jsxs("div", { className: "flex justify-between items-center mb-1", children: [_jsx("span", { children: "Currency:" }), _jsx("span", { className: "font-semibold text-zinc-800 dark:text-zinc-200", children: "INR (\u20B9)" })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { children: "Security:" }), _jsx("span", { className: "font-semibold text-emerald-700 dark:text-emerald-400", children: "PostgreSQL RLS" })] })] })] })] }));
};
