import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Link } from 'react-router-dom';
import { AnalyticsIcon, ArrowRightIcon, AlertTriangleIcon, ShieldIcon } from '../ui/Icons';
import { isConfiguredSupabase } from '../../lib/supabase';
export const InsightsOverviewWidget = ({ periodLabel, totalIncome, totalExpense, netCashFlow, categorySpending, }) => {
    // Deterministic insights calculation over real transaction history
    const insights = React.useMemo(() => {
        const list = [];
        if (totalIncome > 0 && totalExpense > totalIncome * 0.8) {
            const burnPct = Math.round((totalExpense / totalIncome) * 100);
            list.push({
                title: 'Elevated Expense Ratio',
                observation: `Outflows represent ${burnPct}% of period income.`,
                suggestion: 'Consider reviewing discretionary spending before cycle close.',
                severity: burnPct > 100 ? 'high' : 'medium',
            });
        }
        if (categorySpending.length > 0 && categorySpending[0].percentage >= 35) {
            const top = categorySpending[0];
            list.push({
                title: `Heavy ${top.category} Allocation`,
                observation: `${top.category} accounts for ${top.percentage}% of total expenses.`,
                suggestion: 'Examine recurring line items to optimize variable outlays.',
                severity: 'medium',
            });
        }
        if (netCashFlow > 0 && totalIncome > 0) {
            const savingsRate = Math.round((netCashFlow / totalIncome) * 100);
            list.push({
                title: `Positive Savings Margin: ${savingsRate}%`,
                observation: `Surplus of ₹${netCashFlow.toLocaleString('en-IN')} achieved in ${periodLabel}.`,
                suggestion: 'Route a portion of this surplus towards your target savings goals.',
                severity: 'low',
            });
        }
        if (list.length === 0) {
            list.push({
                title: 'Healthy Operating Balance',
                observation: `Income and expense velocity remain within expected bounds for ${periodLabel}.`,
                suggestion: 'Continue regular ledger entry logging to refine predictive patterns.',
                severity: 'low',
            });
        }
        return list.slice(0, 2);
    }, [periodLabel, totalIncome, totalExpense, netCashFlow, categorySpending]);
    return (_jsxs("div", { className: "bg-[#FCFAF6] dark:bg-[#171A21] p-5 rounded-xl border border-[#E6E1D8] dark:border-[#222733] shadow-xs", children: [_jsxs("div", { className: "flex items-center justify-between mb-4 border-b border-[#EFECE5] dark:border-[#222733] pb-2.5", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(AnalyticsIcon, { className: "w-4 h-4 text-[#1E40AF] dark:text-blue-400" }), _jsx("h3", { className: "text-xs font-sans font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100", children: "Financial Insights" })] }), _jsxs(Link, { to: "/insights", className: "text-xs font-sans text-[#1E40AF] dark:text-blue-400 font-semibold hover:underline flex items-center gap-1", children: ["View All ", _jsx(ArrowRightIcon, { className: "w-3 h-3" })] })] }), _jsx("div", { className: "mb-3 flex items-center gap-2", children: _jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-sans font-medium bg-blue-50 dark:bg-blue-950/40 text-[#1E40AF] dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60", children: [_jsx(ShieldIcon, { className: "w-2.5 h-2.5" }), isConfiguredSupabase ? 'Rule-Based Engine + AI Ready' : 'Deterministic Auditor'] }) }), _jsx("div", { className: "space-y-3", children: insights.map((item, idx) => {
                    const badgeColor = {
                        high: 'bg-red-50 text-[#DC2626] dark:bg-red-950/40 dark:text-red-400 border-red-200 dark:border-red-800',
                        medium: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800',
                        low: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
                    }[item.severity];
                    return (_jsxs("div", { className: "p-3 rounded-lg bg-[#FAF8F4] dark:bg-[#1C202B] border border-[#EBE6DD] dark:border-[#262D3D]", children: [_jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [_jsx("span", { className: `text-[10px] font-sans font-semibold px-1.5 py-0.2 rounded border ${badgeColor}`, children: item.severity === 'high' ? 'Alert' : item.severity === 'medium' ? 'Attention' : 'Optimal' }), item.severity === 'high' && (_jsx(AlertTriangleIcon, { className: "w-3 h-3 text-[#DC2626]" }))] }), _jsx("h4", { className: "text-xs font-semibold text-zinc-900 dark:text-zinc-100 font-sans mb-1", children: item.title }), _jsx("p", { className: "text-[11px] font-sans text-zinc-600 dark:text-zinc-400 leading-relaxed mb-1.5", children: item.observation }), _jsxs("p", { className: "text-[11px] font-sans text-zinc-700 dark:text-zinc-300 bg-white/70 dark:bg-zinc-800/70 p-2 rounded border border-zinc-200/60 dark:border-zinc-700/60", children: [_jsx("span", { className: "font-semibold text-[#1E40AF] dark:text-blue-400", children: "Action: " }), item.suggestion] })] }, idx));
                }) })] }));
};
