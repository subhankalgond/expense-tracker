import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PlusIcon } from './Icons';
export const EmptyState = ({ title, description, actionLabel, onAction, icon, }) => {
    return (_jsxs("div", { className: "flex flex-col items-center justify-center p-8 md:p-12 text-center border-2 border-dashed border-ink-950/40 dark:border-zinc-700 bg-cream-50/50 dark:bg-brutal-darkCard/40", children: [icon && _jsx("div", { className: "mb-3 text-ink-500 dark:text-zinc-400", children: icon }), _jsx("h3", { className: "text-sm font-bold uppercase tracking-wider text-ink-900 dark:text-zinc-100 font-mono mb-1", children: title }), _jsx("p", { className: "text-xs text-ink-500 dark:text-zinc-400 max-w-sm mb-5", children: description }), actionLabel && onAction && (_jsxs("button", { type: "button", onClick: onAction, className: "brutal-btn-primary", children: [_jsx(PlusIcon, { className: "w-3.5 h-3.5 mr-1.5" }), actionLabel] }))] }));
};
