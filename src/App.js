import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { BudgetsPage } from './pages/BudgetsPage';
import { SavingsPage } from './pages/SavingsPage';
import { RecurringPage } from './pages/RecurringPage';
import { ReportsPage } from './pages/ReportsPage';
import { InsightsPage } from './pages/InsightsPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            refetchOnWindowFocus: false,
        },
    },
});
// Protected Route Guard
const ProtectedRoute = ({ children }) => {
    const { user, isLoading } = useAuth();
    if (isLoading) {
        return (_jsx("div", { className: "min-h-screen bg-cream-100 dark:bg-brutal-darkBg flex items-center justify-center p-4", children: _jsxs("div", { className: "brutal-card p-6 font-mono text-xs font-bold uppercase tracking-wider text-ink-950 dark:text-zinc-100 flex items-center gap-3", children: [_jsx("div", { className: "w-4 h-4 border-2 border-cobalt border-t-transparent animate-spin" }), _jsx("span", { children: "Verifying Ledger Security Credentials..." })] }) }));
    }
    if (!user) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    return _jsx(_Fragment, { children: children });
};
export const App = () => {
    return (_jsx(QueryClientProvider, { client: queryClient, children: _jsx(ThemeProvider, { children: _jsx(AuthProvider, { children: _jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/privacy", element: _jsx(PrivacyPolicyPage, {}) }), _jsx(Route, { path: "/terms", element: _jsx(TermsPage, {}) }), _jsxs(Route, { path: "/", element: _jsx(ProtectedRoute, { children: _jsx(AppLayout, {}) }), children: [_jsx(Route, { index: true, element: _jsx(Navigate, { to: "/dashboard", replace: true }) }), _jsx(Route, { path: "dashboard", element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "transactions", element: _jsx(TransactionsPage, {}) }), _jsx(Route, { path: "budgets", element: _jsx(BudgetsPage, {}) }), _jsx(Route, { path: "savings", element: _jsx(SavingsPage, {}) }), _jsx(Route, { path: "recurring", element: _jsx(RecurringPage, {}) }), _jsx(Route, { path: "reports", element: _jsx(ReportsPage, {}) }), _jsx(Route, { path: "insights", element: _jsx(InsightsPage, {}) }), _jsx(Route, { path: "settings", element: _jsx(SettingsPage, {}) })] }), _jsx(Route, { path: "*", element: _jsx(NotFoundPage, {}) })] }) }) }) }) }));
};
export default App;
