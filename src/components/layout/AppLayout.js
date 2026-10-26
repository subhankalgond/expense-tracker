import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
const pageTitleMap = {
    '/dashboard': 'Financial Command Dashboard',
    '/transactions': 'Transaction Ledger',
    '/budgets': 'Expenditure Budgets',
    '/savings': 'Savings Goals & Capital',
    '/recurring': 'Recurring Schedules & Bills',
    '/reports': 'Financial Intelligence & Export',
    '/insights': 'Financial Intelligence & Trends',
    '/settings': 'System Settings & Data Control',
};
export const AppLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const title = pageTitleMap[location.pathname] || 'Ledger Brutalist';
    return (_jsxs("div", { className: "min-h-screen bg-cream-100 dark:bg-brutal-darkBg text-ink-950 dark:text-zinc-100 flex", children: [_jsx(Sidebar, { isOpen: sidebarOpen, onClose: () => setSidebarOpen(false) }), _jsxs("div", { className: "flex-1 flex flex-col lg:pl-64 min-w-0 pb-16 lg:pb-0", children: [_jsx(Navbar, { onToggleSidebar: () => setSidebarOpen((prev) => !prev), pageTitle: title }), _jsx("main", { className: "flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto", children: _jsx(Outlet, {}) }), _jsx("footer", { className: "border-t-2 border-ink-950/20 dark:border-zinc-800 bg-cream-200/40 dark:bg-zinc-900/40 py-4 px-6 text-[11px] font-mono text-ink-500 dark:text-zinc-400", children: _jsxs("div", { className: "max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3", children: [_jsxs("div", { children: [_jsx("span", { className: "font-bold text-ink-800 dark:text-zinc-300", children: "LEDGER BRUTALIST" }), " \u2022 Multi-User Financial Command Center"] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("a", { href: "/privacy", className: "underline hover:text-ink-950 dark:hover:text-zinc-200", children: "Privacy Policy" }), _jsx("span", { className: "text-ink-300 dark:text-zinc-600", children: "|" }), _jsx("a", { href: "/terms", className: "underline hover:text-ink-950 dark:hover:text-zinc-200", children: "Terms and Conditions" })] })] }) }), _jsx(BottomNav, { onOpenMenu: () => setSidebarOpen(true) })] })] }));
};
