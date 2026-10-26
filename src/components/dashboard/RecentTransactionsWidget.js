import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { formatINR } from '../../lib/currency';
import { formatDisplayDate } from '../../lib/date';
import { EditIcon, TrashIcon, SearchIcon, PlusIcon, ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon, } from '../ui/Icons';
export const RecentTransactionsWidget = ({ transactions, categories, onEdit, onDelete, onAddIncome, onAddExpense, }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortOrder, setSortOrder] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    // Filter and sort transactions
    const filteredList = useMemo(() => {
        return transactions
            .filter((tx) => {
            if (typeFilter !== 'all' && tx.type !== typeFilter)
                return false;
            if (selectedCategory !== 'all' && tx.category_id !== selectedCategory)
                return false;
            if (searchTerm.trim()) {
                const q = searchTerm.toLowerCase();
                const matchDesc = tx.description.toLowerCase().includes(q);
                const matchCat = tx.category?.name.toLowerCase().includes(q) || false;
                const matchMethod = tx.payment_method?.name.toLowerCase().includes(q) || false;
                if (!matchDesc && !matchCat && !matchMethod)
                    return false;
            }
            return true;
        })
            .sort((a, b) => {
            if (sortOrder === 'desc')
                return b.date.localeCompare(a.date);
            return a.date.localeCompare(b.date);
        });
    }, [transactions, typeFilter, selectedCategory, searchTerm, sortOrder]);
    const totalPages = Math.max(1, Math.ceil(filteredList.length / pageSize));
    const paginatedList = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredList.slice(start, start + pageSize);
    }, [filteredList, currentPage]);
    return (_jsxs("div", { className: "bg-[#FCFAF6] dark:bg-[#171A21] p-5 rounded-xl border border-[#E6E1D8] dark:border-[#222733] shadow-xs flex flex-col justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-[#EFECE5] dark:border-[#222733] pb-3", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-xs font-sans font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100", children: "Recent Transactions" }), _jsx("p", { className: "text-[11px] font-sans text-zinc-500 dark:text-zinc-400", children: "Latest financial activity recorded in current cycle" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("button", { type: "button", onClick: onAddIncome, className: "inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-sans font-semibold bg-[#16A34A] hover:bg-emerald-700 text-white shadow-xs transition-colors", children: [_jsx(PlusIcon, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Add Income" })] }), _jsxs("button", { type: "button", onClick: onAddExpense, className: "inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-sans font-semibold bg-[#DC2626] hover:bg-red-700 text-white shadow-xs transition-colors", children: [_jsx(PlusIcon, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Add Expense" })] }), _jsxs(Link, { to: "/transactions", className: "text-xs font-sans text-[#1E40AF] dark:text-blue-400 font-semibold hover:underline flex items-center gap-0.5 ml-1", children: ["View All ", _jsx(ArrowRightIcon, { className: "w-3 h-3" })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3", children: [_jsxs("div", { className: "relative sm:col-span-1", children: [_jsx(SearchIcon, { className: "w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" }), _jsx("input", { type: "text", value: searchTerm, onChange: (e) => {
                                            setSearchTerm(e.target.value);
                                            setCurrentPage(1);
                                        }, placeholder: "Filter entries...", className: "w-full pl-8 pr-2.5 py-1.5 text-xs font-sans rounded-lg border border-[#E0DBD0] dark:border-[#2A303F] bg-white dark:bg-[#181C26] text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#1E40AF]" })] }), _jsxs("select", { value: typeFilter, onChange: (e) => {
                                    setTypeFilter(e.target.value);
                                    setCurrentPage(1);
                                }, className: "px-2.5 py-1.5 text-xs font-sans rounded-lg border border-[#E0DBD0] dark:border-[#2A303F] bg-white dark:bg-[#181C26] text-zinc-800 dark:text-zinc-200 focus:outline-none", children: [_jsx("option", { value: "all", children: "All Types" }), _jsx("option", { value: "income", children: "Income Only" }), _jsx("option", { value: "expense", children: "Expenses Only" })] }), _jsxs("select", { value: selectedCategory, onChange: (e) => {
                                    setSelectedCategory(e.target.value);
                                    setCurrentPage(1);
                                }, className: "px-2.5 py-1.5 text-xs font-sans rounded-lg border border-[#E0DBD0] dark:border-[#2A303F] bg-white dark:bg-[#181C26] text-zinc-800 dark:text-zinc-200 focus:outline-none", children: [_jsx("option", { value: "all", children: "All Categories" }), categories.map((cat) => (_jsx("option", { value: cat.id, children: cat.name }, cat.id)))] })] }), paginatedList.length === 0 ? (_jsx("div", { className: "py-8 text-center text-xs font-sans text-zinc-400", children: "No transactions matching current filters." })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-[#EFECE5] dark:border-[#222733] text-[10px] font-sans font-semibold uppercase tracking-wider text-zinc-500", children: [_jsxs("th", { className: "py-2 cursor-pointer select-none", onClick: () => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc')), children: ["Date ", sortOrder === 'desc' ? '↓' : '↑'] }), _jsx("th", { className: "py-2", children: "Description" }), _jsx("th", { className: "py-2", children: "Category" }), _jsx("th", { className: "py-2", children: "Method" }), _jsx("th", { className: "py-2 text-right", children: "Amount" }), _jsx("th", { className: "py-2 text-center", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-[#EFECE5] dark:divide-[#1E2330]", children: paginatedList.map((tx) => {
                                        const isIncome = tx.type === 'income';
                                        return (_jsxs("tr", { className: "hover:bg-[#F8F5EE] dark:hover:bg-[#1C202B] transition-colors text-xs font-sans", children: [_jsx("td", { className: "py-2.5 text-zinc-500 dark:text-zinc-400 whitespace-nowrap", children: formatDisplayDate(tx.date) }), _jsx("td", { className: "py-2.5 font-medium text-zinc-900 dark:text-zinc-100 max-w-[140px] truncate", children: tx.description }), _jsx("td", { className: "py-2.5 whitespace-nowrap", children: tx.category ? (_jsxs("span", { className: "inline-flex items-center gap-1.5", children: [_jsx("span", { className: "w-2 h-2 rounded-full", style: { backgroundColor: tx.category.color } }), _jsx("span", { className: "text-zinc-700 dark:text-zinc-300", children: tx.category.name })] })) : (_jsx("span", { className: "text-zinc-400", children: "Uncategorized" })) }), _jsx("td", { className: "py-2.5 text-zinc-500 dark:text-zinc-400 whitespace-nowrap", children: tx.payment_method?.name || 'Cash' }), _jsxs("td", { className: `py-2.5 text-right font-bold tabular-nums whitespace-nowrap ${isIncome ? 'text-[#16A34A] dark:text-emerald-400' : 'text-[#DC2626] dark:text-red-400'}`, children: [isIncome ? '+ ' : '- ', formatINR(tx.amount)] }), _jsx("td", { className: "py-2.5 text-center whitespace-nowrap", children: _jsxs("div", { className: "flex items-center justify-center gap-1", children: [_jsx("button", { type: "button", onClick: () => onEdit(tx), "aria-label": `Edit ${tx.description}`, className: "p-1 rounded border border-[#E0DBD0] dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-[#F2EFE8] text-zinc-700 dark:text-zinc-300", title: "Edit", children: _jsx(EditIcon, { className: "w-3 h-3" }) }), _jsx("button", { type: "button", onClick: () => onDelete(tx), "aria-label": `Delete ${tx.description}`, className: "p-1 rounded border border-[#E0DBD0] dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-red-50 text-[#DC2626]", title: "Delete", children: _jsx(TrashIcon, { className: "w-3 h-3" }) })] }) })] }, tx.id));
                                    }) })] }) }))] }), _jsxs("div", { className: "flex items-center justify-between pt-3 mt-3 border-t border-[#EFECE5] dark:border-[#222733] text-xs font-sans text-zinc-500", children: [_jsxs("span", { children: ["Showing ", filteredList.length === 0 ? 0 : (currentPage - 1) * pageSize + 1, "-", Math.min(currentPage * pageSize, filteredList.length), " of ", filteredList.length] }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx("button", { type: "button", onClick: () => setCurrentPage((p) => Math.max(1, p - 1)), disabled: currentPage <= 1, className: "p-1 rounded-md border border-[#E0DBD0] dark:border-zinc-700 bg-white dark:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#F2EFE8]", children: _jsx(ChevronLeftIcon, { className: "w-3.5 h-3.5" }) }), _jsxs("span", { className: "px-1.5 font-medium text-zinc-800 dark:text-zinc-200", children: [currentPage, " / ", totalPages] }), _jsx("button", { type: "button", onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)), disabled: currentPage >= totalPages, className: "p-1 rounded-md border border-[#E0DBD0] dark:border-zinc-700 bg-white dark:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#F2EFE8]", children: _jsx(ChevronRightIcon, { className: "w-3.5 h-3.5" }) })] })] })] }));
};
