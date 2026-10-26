import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../lib/dataService';
import { getDateRangeFromPreset } from '../lib/date';
import { exportTransactionsToCSV } from '../lib/export';
import { TransactionFilters } from '../components/transactions/TransactionFilters';
import { TransactionTable } from '../components/transactions/TransactionTable';
import { TransactionModal } from '../components/transactions/TransactionModal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { PlusIcon, DownloadIcon } from '../components/ui/Icons';
export const TransactionsPage = () => {
    const { user } = useAuth();
    const userId = user?.id || 'demo-user';
    const [searchParams] = useSearchParams();
    const urlQuery = searchParams.get('q') || '';
    const initialFilters = {
        search: urlQuery,
        type: 'all',
        categoryId: 'all',
        paymentMethodId: 'all',
        minAmount: null,
        maxAmount: null,
        dateRange: getDateRangeFromPreset('this_month'),
        sortField: 'date',
        sortOrder: 'desc',
        page: 1,
        pageSize: 15,
    };
    const [filters, setFilters] = useState(initialFilters);
    useEffect(() => {
        if (urlQuery !== filters.search) {
            setFilters((prev) => ({ ...prev, search: urlQuery, page: 1 }));
        }
    }, [urlQuery]);
    const [transactions, setTransactions] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [categories, setCategories] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // Modals
    const [isTxModalOpen, setIsTxModalOpen] = useState(false);
    const [txToEdit, setTxToEdit] = useState(null);
    const [txToDelete, setTxToDelete] = useState(null);
    const fetchTransactions = async () => {
        setIsLoading(true);
        try {
            const [cats, pms, res] = await Promise.all([
                dataService.getCategories(userId),
                dataService.getPaymentMethods(userId),
                dataService.getTransactions(userId, filters),
            ]);
            setCategories(cats);
            setPaymentMethods(pms);
            setTransactions(res.data);
            setTotalCount(res.totalCount);
        }
        catch (err) {
            console.warn('Failed to fetch transactions:', err);
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchTransactions();
    }, [userId, filters]);
    const handleFilterChange = (updated) => {
        setFilters((prev) => ({ ...prev, ...updated }));
    };
    const handleResetFilters = () => {
        setFilters(initialFilters);
    };
    const handleSaveTransaction = async (values) => {
        if (txToEdit) {
            await dataService.updateTransaction(userId, txToEdit.id, values);
        }
        else {
            await dataService.addTransaction(userId, values);
        }
        await fetchTransactions();
    };
    const handleDeleteTransaction = async () => {
        if (txToDelete) {
            await dataService.deleteTransaction(userId, txToDelete.id);
            setTxToDelete(null);
            await fetchTransactions();
        }
    };
    const handleExportCSV = async () => {
        try {
            // Fetch full filtered list for export
            const full = await dataService.getTransactions(userId, {
                ...filters,
                page: 1,
                pageSize: 10000,
            });
            exportTransactionsToCSV(full.data, 'ledger_filtered_records');
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : 'Export failed';
            alert(msg);
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "editorial-masthead", children: [_jsx("div", { children: "FOLIO \u2116 24 \u2022 TRANSACTION AUDIT REGISTER" }), _jsxs("div", { className: "hidden md:block", children: ["ENTRIES RECORDED: ", totalCount, " RECORDS"] }), _jsx("div", { children: "CURRENCY: INDIAN RUPEE (\u20B9)" })] }), _jsxs("div", { className: "flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b-2 border-ink-950 dark:border-zinc-700 pb-4", children: [_jsxs("div", { children: [_jsx("span", { className: "editorial-kicker", children: "CHRONOLOGICAL REGISTER" }), _jsx("h2", { className: "editorial-headline text-2xl sm:text-3xl", children: "Financial Ledger & Cash Movements" }), _jsxs("p", { className: "text-xs font-mono text-ink-500 dark:text-zinc-400 mt-1", children: ["Total ledger entries: ", _jsx("strong", { children: totalCount }), " \u2022 Multi-tenant RLS authenticated"] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("button", { type: "button", onClick: handleExportCSV, disabled: totalCount === 0 || isLoading, className: "brutal-btn-secondary", title: "Download CSV export", children: [_jsx(DownloadIcon, { className: "w-3.5 h-3.5 mr-1.5" }), _jsx("span", { children: "Export CSV" })] }), _jsxs("button", { type: "button", onClick: () => {
                                    setTxToEdit(null);
                                    setIsTxModalOpen(true);
                                }, className: "brutal-btn-primary", children: [_jsx(PlusIcon, { className: "w-4 h-4 mr-1.5" }), _jsx("span", { children: "Record Entry" })] })] })] }), _jsx(TransactionFilters, { filters: filters, onChange: handleFilterChange, onReset: handleResetFilters, categories: categories, paymentMethods: paymentMethods, totalResults: totalCount }), _jsx(TransactionTable, { transactions: transactions, totalCount: totalCount, page: filters.page, pageSize: filters.pageSize, sortField: filters.sortField, sortOrder: filters.sortOrder, onSortChange: (field) => handleFilterChange({
                    sortField: field,
                    sortOrder: filters.sortField === field && filters.sortOrder === 'asc' ? 'desc' : 'asc',
                }), onPageChange: (newPage) => handleFilterChange({ page: newPage }), onEdit: (tx) => {
                    setTxToEdit(tx);
                    setIsTxModalOpen(true);
                }, onDelete: (tx) => setTxToDelete(tx), onAddNew: () => {
                    setTxToEdit(null);
                    setIsTxModalOpen(true);
                } }), _jsx(TransactionModal, { isOpen: isTxModalOpen, onClose: () => {
                    setIsTxModalOpen(false);
                    setTxToEdit(null);
                }, onSubmit: handleSaveTransaction, transactionToEdit: txToEdit, categories: categories, paymentMethods: paymentMethods }), _jsx(ConfirmDialog, { isOpen: Boolean(txToDelete), onClose: () => setTxToDelete(null), onConfirm: handleDeleteTransaction, title: "Confirm Transaction Deletion", message: `Delete entry "${txToDelete?.description}" permanently? This adjustment is immediate.`, confirmLabel: "Confirm Delete" })] }));
};
