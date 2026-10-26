import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { getDateRangeFromPreset } from '../../lib/date';
import { CalendarIcon } from '../ui/Icons';
export const DateRangeSelector = ({ currentRange, onChange, }) => {
    const presets = [
        { key: 'this_week', label: 'This Week' },
        { key: 'this_month', label: 'This Month' },
        { key: 'last_month', label: 'Last Month' },
        { key: 'this_year', label: 'This Year' },
    ];
    return (_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2.5 p-2.5 bg-cream-50 dark:bg-brutal-darkCard border-2 border-ink-950 dark:border-zinc-700 shadow-brutal-sm", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "p-1.5 border border-ink-950 dark:border-zinc-600 bg-cream-200 dark:bg-zinc-800", children: _jsx(CalendarIcon, { className: "w-3.5 h-3.5 text-cobalt" }) }), _jsxs("span", { className: "text-xs font-mono font-bold uppercase tracking-wider text-ink-950 dark:text-zinc-100", children: ["Period: ", _jsx("span", { className: "text-cobalt dark:text-blue-400", children: currentRange.label })] }), _jsxs("span", { className: "hidden sm:inline text-[11px] font-mono text-ink-500 dark:text-zinc-400", children: ["(", currentRange.startDate, " \u2014 ", currentRange.endDate, ")"] })] }), _jsx("div", { className: "flex items-center gap-1", children: presets.map((p) => (_jsx("button", { type: "button", onClick: () => onChange(getDateRangeFromPreset(p.key)), className: `px-2.5 py-1 text-[11px] font-mono font-bold uppercase border-2 transition-all ${currentRange.preset === p.key
                        ? 'bg-ink-950 dark:bg-white text-white dark:text-ink-950 border-ink-950 dark:border-white shadow-brutal-sm'
                        : 'bg-white dark:bg-zinc-800 text-ink-800 dark:text-zinc-300 border-ink-950 dark:border-zinc-600 hover:bg-cream-200 dark:hover:bg-zinc-700'}`, children: p.label }, p.key))) })] }));
};
