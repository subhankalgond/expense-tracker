import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { AnalyticsIcon, ShieldIcon, AlertTriangleIcon, RefreshIcon } from '../ui/Icons';
import { supabase, isConfiguredSupabase } from '../../lib/supabase';
export const InsightsEngine = ({ periodLabel, totalIncome, totalExpense, netCashFlow, categorySpending, budgetStatus, recurringTotal, }) => {
    const [insights, setInsights] = useState(() => generateRuleBasedInsights({
        periodLabel,
        totalIncome,
        totalExpense,
        netCashFlow,
        categorySpending,
        budgetStatus,
        recurringTotal,
    }));
    const [source, setSource] = useState('rule_based');
    const [isLoading, setIsLoading] = useState(false);
    async function fetchLiveAiInsights() {
        setIsLoading(true);
        try {
            if (isConfiguredSupabase) {
                const { data: sessionData } = await supabase.auth.getSession();
                const token = sessionData.session?.access_token;
                if (token) {
                    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-insights`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            periodLabel,
                            totalIncome,
                            totalExpense,
                            netCashFlow,
                            categorySpending,
                            budgetStatus,
                            recurringTotal,
                        }),
                    });
                    if (res.ok) {
                        const result = await res.json();
                        if (result.insights && Array.isArray(result.insights)) {
                            setInsights(result.insights);
                            setSource(result.source === 'gemini_ai' ? 'external_llm' : 'rule_based');
                            setIsLoading(false);
                            return;
                        }
                    }
                }
            }
        }
        catch (err) {
            console.warn('Edge function call failed, generating localized insights:', err);
        }
        // Deterministic rule-based insights
        const ruleBased = generateRuleBasedInsights({
            periodLabel,
            totalIncome,
            totalExpense,
            netCashFlow,
            categorySpending,
            budgetStatus,
            recurringTotal,
        });
        setInsights(ruleBased);
        setSource('rule_based');
        setIsLoading(false);
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "p-5 rounded-xl border border-[#E6E1D8] dark:border-[#222733] bg-[#FCFAF6] dark:bg-[#171A21] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx(AnalyticsIcon, { className: "w-4 h-4 text-[#1E40AF] dark:text-blue-400" }), _jsx("h3", { className: "text-xs font-sans font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100", children: "Heuristic & AI Financial Intelligence" })] }), _jsxs("p", { className: "text-xs font-sans text-zinc-500 dark:text-zinc-400", children: ["Engine Mode:", ' ', _jsx("strong", { className: "text-zinc-900 dark:text-zinc-100", children: source === 'external_llm' ? 'Gemini 1.5 Edge Analysis' : 'Local Deterministic Auditor' }), ' ', "\u2022 Period: ", _jsx("strong", { children: periodLabel })] })] }), _jsxs("button", { type: "button", onClick: fetchLiveAiInsights, disabled: isLoading, className: "inline-flex items-center justify-center font-sans font-semibold text-xs px-3.5 py-2 bg-white dark:bg-[#1A1F29] text-[#121826] dark:text-zinc-200 border border-[#DDD7CE] dark:border-[#2D3442] rounded-lg shadow-sm hover:bg-[#F2EFE8] dark:hover:bg-[#222936] transition-all disabled:opacity-50 self-start sm:self-center", children: [_jsx(RefreshIcon, { className: `w-3.5 h-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}` }), _jsx("span", { children: isLoading ? 'Synthesizing...' : 'Re-Analyze Trends' })] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: insights.map((item, idx) => {
                    const badgeStyle = {
                        high: 'bg-red-50 text-[#DC2626] border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800',
                        medium: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
                        low: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
                    }[item.severity];
                    return (_jsxs("div", { className: "p-5 rounded-xl border border-[#E6E1D8] dark:border-[#222733] bg-[#FCFAF6] dark:bg-[#171A21] shadow-xs flex flex-col justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-3 border-b border-[#EFECE5] dark:border-[#222733] pb-2", children: [_jsxs("span", { className: `text-[10px] font-sans font-semibold uppercase px-2 py-0.5 rounded-full border ${badgeStyle}`, children: ["Severity: ", item.severity] }), item.severity === 'high' && (_jsxs("div", { className: "flex items-center gap-1 text-[11px] font-sans font-semibold text-[#DC2626]", children: [_jsx(AlertTriangleIcon, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Attention Required" })] }))] }), _jsx("h4", { className: "text-sm font-semibold text-zinc-900 dark:text-zinc-100 font-sans mb-1.5", children: item.title }), _jsx("p", { className: "text-xs text-zinc-600 dark:text-zinc-400 font-sans mb-3 leading-relaxed", children: item.observation })] }), _jsxs("div", { className: "p-3 rounded-lg bg-[#FAF8F4] dark:bg-[#1C202B] border border-[#EBE6DD] dark:border-[#262D3D] text-xs font-sans", children: [_jsx("span", { className: "block font-semibold uppercase text-[10px] text-[#1E40AF] dark:text-blue-400 mb-0.5", children: "Actionable Strategy:" }), _jsx("span", { className: "text-zinc-800 dark:text-zinc-200", children: item.suggestion })] })] }, idx));
                }) }), _jsxs("div", { className: "p-3.5 rounded-xl border border-[#E6E1D8] dark:border-[#222733] bg-[#FAF8F4] dark:bg-[#161922] text-xs font-sans text-zinc-500 dark:text-zinc-400 flex items-center gap-2.5", children: [_jsx(ShieldIcon, { className: "w-4 h-4 shrink-0 text-[#1E40AF] dark:text-blue-400" }), _jsx("span", { children: "Calculations run over aggregated accounting data. No banking credentials, raw personal keys, or private records are transmitted to third-party endpoints." })] })] }));
};
// Pure deterministic rule engine running over actual data
function generateRuleBasedInsights(payload) {
    const items = [];
    // Rule 1: High expense ratio
    if (payload.totalIncome > 0 && payload.totalExpense > payload.totalIncome * 0.8) {
        const burnPct = Math.round((payload.totalExpense / payload.totalIncome) * 100);
        items.push({
            title: 'High Burn Rate Detected',
            observation: `You have consumed ${burnPct}% of total income in ${payload.periodLabel}.`,
            suggestion: 'Postpone discretionary purchases to ensure your liquid cash buffer does not erode.',
            severity: burnPct > 100 ? 'high' : 'medium',
        });
    }
    // Rule 2: Top category dominance
    if (payload.categorySpending && payload.categorySpending.length > 0) {
        const topCat = payload.categorySpending[0];
        if (topCat.percentage >= 35) {
            items.push({
                title: `Heavy Concentration in ${topCat.category}`,
                observation: `${topCat.category} commands ${topCat.percentage}% (₹${topCat.amount.toLocaleString('en-IN')}) of aggregate outlays.`,
                suggestion: `Examine detailed line items in ${topCat.category} to distinguish unavoidable fixed expenses from variable discretionary spend.`,
                severity: 'medium',
            });
        }
    }
    // Rule 3: Budget overruns
    const exceeded = payload.budgetStatus.filter((b) => b.percent >= 90);
    if (exceeded.length > 0) {
        const names = exceeded.map((b) => b.name).join(', ');
        items.push({
            title: 'Budget Alert Threshold Exceeded',
            observation: `${names} exceeded 90% utilization threshold in ${payload.periodLabel}.`,
            suggestion: 'Impose a pause on further purchases under these categories until the next accounting period.',
            severity: 'high',
        });
    }
    // Rule 4: Surplus / Savings potential
    if (payload.netCashFlow > 0 && payload.totalIncome > 0) {
        const savingsRate = Math.round((payload.netCashFlow / payload.totalIncome) * 100);
        if (savingsRate >= 15) {
            items.push({
                title: `Net Cash Surplus: ${savingsRate}%`,
                observation: `You retained a surplus of ₹${payload.netCashFlow.toLocaleString('en-IN')} this period.`,
                suggestion: 'Consider transferring 50% of this surplus immediately to an active savings target or liquid investment fund.',
                severity: 'low',
            });
        }
    }
    if (items.length === 0) {
        items.push({
            title: 'Operating Variance Within Normal Band',
            observation: `Cash flow and categorical expenses are steady and within ordinary variance limits for ${payload.periodLabel}.`,
            suggestion: 'Maintain diligent transaction bookkeeping to build a robust multi-quarter baseline.',
            severity: 'low',
        });
    }
    return items;
}
