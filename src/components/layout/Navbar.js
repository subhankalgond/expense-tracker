import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { SunIcon, MoonIcon, LogOutIcon, MenuIcon, SearchIcon, CalendarIcon, SettingsIcon, ShieldIcon, ChevronDownIcon, RupeeIcon, } from '../ui/Icons';
import { isConfiguredSupabase } from '../../lib/supabase';
export const Navbar = ({ onToggleSidebar, pageTitle }) => {
    const { user, profile, signOut } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
    const accountMenuRef = useRef(null);
    // Close account menu on outside click
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
                setIsAccountMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/transactions?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };
    const currentDateFormatted = new Date().toLocaleDateString('en-IN', {
        month: 'short',
        year: 'numeric',
    });
    const fullDateFormatted = new Date().toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
    });
    return (_jsxs("header", { className: "sticky top-0 z-30 bg-[#FAF8F5]/95 dark:bg-[#12151C]/95 backdrop-blur-md border-b border-[#E6E1D8] dark:border-[#222733] px-4 md:px-6 py-2.5 flex items-center justify-between gap-4 transition-colors", children: [_jsxs("div", { className: "flex items-center gap-3 shrink-0", children: [_jsx("button", { type: "button", onClick: onToggleSidebar, "aria-label": "Toggle navigation menu", className: "lg:hidden p-2 rounded-lg border border-[#E0DBD0] dark:border-[#2A303F] bg-white dark:bg-[#1A1E29] text-[#121826] dark:text-zinc-200 hover:bg-[#F2EFE8] dark:hover:bg-[#222838] shadow-xs transition-colors", children: _jsx(MenuIcon, { className: "w-4 h-4" }) }), _jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx("div", { className: "w-8 h-8 rounded-lg bg-[#1E40AF] text-white flex items-center justify-center font-serif font-bold text-base shadow-xs shrink-0", children: "\u20B9" }), _jsxs("div", { className: "hidden sm:block", children: [_jsx("span", { className: "block font-serif font-bold text-sm tracking-tight text-[#121826] dark:text-zinc-100 leading-tight", children: "Ledger Brutalist" }), _jsx("span", { className: "block text-[10px] font-sans text-zinc-500 dark:text-zinc-400", children: pageTitle })] })] })] }), _jsx("div", { className: "flex-1 max-w-md mx-2 hidden md:block", children: _jsxs("form", { onSubmit: handleSearchSubmit, className: "relative", children: [_jsx(SearchIcon, { className: "w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none" }), _jsx("input", { type: "search", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Search transactions, categories, descriptions...", className: "w-full pl-9 pr-4 py-1.5 text-xs font-sans rounded-lg border border-[#E0DBD0] dark:border-[#2A303F] bg-white dark:bg-[#181C26] text-[#121826] dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/30 focus:border-[#1E40AF] transition-all shadow-xs" })] }) }), _jsxs("div", { className: "flex items-center gap-2 sm:gap-3 shrink-0", children: [_jsxs("div", { className: "hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E0DBD0] dark:border-[#2A303F] bg-white dark:bg-[#181C26] text-xs font-sans text-[#121826] dark:text-zinc-200 shadow-xs", children: [_jsx(CalendarIcon, { className: "w-3.5 h-3.5 text-[#1E40AF] dark:text-blue-400" }), _jsx("span", { className: "font-semibold", children: currentDateFormatted }), _jsx("span", { className: "text-zinc-400 text-[10px]", children: "\u2022" }), _jsx("span", { className: "text-zinc-500 dark:text-zinc-400 text-[11px]", children: fullDateFormatted })] }), _jsx("button", { type: "button", onClick: toggleTheme, "aria-label": "Toggle color theme", className: "p-2 rounded-lg border border-[#E0DBD0] dark:border-[#2A303F] bg-white dark:bg-[#181C26] text-[#121826] dark:text-zinc-200 hover:bg-[#F2EFE8] dark:hover:bg-[#222838] shadow-xs transition-colors", title: `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`, children: theme === 'light' ? (_jsx(MoonIcon, { className: "w-4 h-4 text-zinc-700" })) : (_jsx(SunIcon, { className: "w-4 h-4 text-amber-400" })) }), _jsxs("div", { className: "relative", ref: accountMenuRef, children: [_jsxs("button", { type: "button", onClick: () => setIsAccountMenuOpen((prev) => !prev), "aria-expanded": isAccountMenuOpen, "aria-label": "User account menu", className: "flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-lg border border-[#E0DBD0] dark:border-[#2A303F] bg-white dark:bg-[#181C26] hover:bg-[#F2EFE8] dark:hover:bg-[#222838] shadow-xs transition-colors", children: [_jsx("div", { className: "w-6 h-6 rounded-md bg-[#1E40AF] text-white flex items-center justify-center font-sans font-bold text-xs shrink-0", children: profile?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'U' }), _jsx("span", { className: "hidden sm:inline-block text-xs font-semibold text-[#121826] dark:text-zinc-200 font-sans truncate max-w-[110px]", children: profile?.full_name || user?.email?.split('@')[0] }), _jsx(ChevronDownIcon, { className: "w-3 h-3 text-zinc-400" })] }), isAccountMenuOpen && (_jsxs("div", { className: "absolute right-0 mt-1.5 w-60 rounded-xl bg-white dark:bg-[#171B24] border border-[#E0DBD0] dark:border-[#2A303F] shadow-lg py-2 z-50 text-xs font-sans animate-in fade-in slide-in-from-top-1 duration-150", children: [_jsxs("div", { className: "px-3 py-2 border-b border-zinc-100 dark:border-zinc-800", children: [_jsx("div", { className: "font-semibold text-zinc-900 dark:text-zinc-100 truncate", children: profile?.full_name || 'Authenticated User' }), _jsx("div", { className: "text-[11px] text-zinc-500 dark:text-zinc-400 truncate", children: user?.email || 'user@ledger.local' }), _jsxs("div", { className: "mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800", children: [_jsx(ShieldIcon, { className: "w-2.5 h-2.5" }), isConfiguredSupabase ? 'PostgreSQL RLS Active' : 'Isolated Storage'] })] }), _jsxs("div", { className: "py-1", children: [_jsxs("button", { type: "button", onClick: () => {
                                                    setIsAccountMenuOpen(false);
                                                    navigate('/settings');
                                                }, className: "w-full text-left px-3 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-[#F6F4EF] dark:hover:bg-[#1E2330] flex items-center gap-2", children: [_jsx(SettingsIcon, { className: "w-3.5 h-3.5 text-zinc-500" }), _jsx("span", { children: "Account Settings" })] }), _jsxs("button", { type: "button", onClick: () => {
                                                    setIsAccountMenuOpen(false);
                                                    navigate('/transactions');
                                                }, className: "w-full text-left px-3 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-[#F6F4EF] dark:hover:bg-[#1E2330] flex items-center gap-2", children: [_jsx(RupeeIcon, { className: "w-3.5 h-3.5 text-zinc-500" }), _jsx("span", { children: "Transaction Register" })] })] }), _jsx("div", { className: "border-t border-zinc-100 dark:border-zinc-800 pt-1 mt-1", children: _jsxs("button", { type: "button", onClick: () => {
                                                setIsAccountMenuOpen(false);
                                                signOut();
                                            }, className: "w-full text-left px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 font-medium", children: [_jsx(LogOutIcon, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Sign Out" })] }) })] }))] })] })] }));
};
