import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { formatINR } from '../../lib/currency';
export const MetricCard = ({ label, amount, type = 'balance', subtext, trendText, badgeType, }) => {
    const amountColor = {
        balance: 'text-[#1E40AF] dark:text-blue-400',
        income: 'text-[#16A34A] dark:text-emerald-400',
        expense: 'text-[#DC2626] dark:text-red-400',
        net: amount >= 0 ? 'text-[#16A34A] dark:text-emerald-400' : 'text-[#DC2626] dark:text-red-400',
    }[type];
    // Resolve badge color style
    const resolvedBadgeClass = () => {
        if (badgeType === 'success' || (!badgeType && (type === 'income' || (type === 'net' && amount >= 0)))) {
            return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60';
        }
        if (badgeType === 'danger' || (!badgeType && (type === 'expense' || (type === 'net' && amount < 0)))) {
            return 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200/80 dark:border-red-800/60';
        }
        if (type === 'balance' || badgeType === 'info') {
            return 'bg-blue-50 dark:bg-blue-950/40 text-[#1E40AF] dark:text-blue-300 border-blue-200/80 dark:border-blue-800/60';
        }
        return 'bg-[#F2EFE8] dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-[#E5E0D6] dark:border-zinc-700';
    };
    return (_jsxs("div", { className: "bg-[#FCFAF6] dark:bg-[#171A21] p-5 rounded-xl border border-[#E6E1D8] dark:border-[#222733] shadow-xs hover:border-[#D5CFBF] dark:hover:border-[#2E3646] transition-all flex flex-col justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between gap-2 mb-2", children: [_jsx("span", { className: "text-[11px] font-sans font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400", children: label }), trendText && (_jsx("span", { className: `text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full border ${resolvedBadgeClass()}`, children: trendText }))] }), _jsx("div", { className: `text-2xl sm:text-3xl font-serif font-bold tracking-tight tabular-nums my-1.5 ${amountColor}`, children: formatINR(amount) })] }), subtext && (_jsx("div", { className: "text-[11px] font-sans text-zinc-500 dark:text-zinc-400 pt-2.5 mt-2 border-t border-[#EFECE5] dark:border-[#1F2430]", children: subtext }))] }));
};
