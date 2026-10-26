import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleIcon, ShieldIcon, RupeeIcon } from '../components/ui/Icons';
import { isConfiguredSupabase } from '../lib/supabase';
export const LoginPage = () => {
    const { user, isLoading, signInWithGoogle, signInWithPassword, signUpWithPassword, signInWithDemoUser, } = useAuth();
    const [authMode, setAuthMode] = useState('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    if (!isLoading && user) {
        return _jsx(Navigate, { to: "/dashboard", replace: true });
    }
    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(null);
        // Basic input validation
        if (!email || !email.includes('@')) {
            setErrorMessage('Please provide a valid email address.');
            return;
        }
        if (!password || password.length < 6) {
            setErrorMessage('Password must contain at least 6 characters.');
            return;
        }
        setIsSubmitting(true);
        try {
            if (authMode === 'signin') {
                const { error } = await signInWithPassword(email.trim(), password);
                if (error) {
                    setErrorMessage(error.message || 'Authentication failed. Please verify credentials.');
                }
            }
            else {
                const { error } = await signUpWithPassword(email.trim(), password);
                if (error) {
                    setErrorMessage(error.message || 'Unable to register account.');
                }
                else {
                    setSuccessMessage(isConfiguredSupabase
                        ? 'Registration initiated. Please check your email inbox to verify your account.'
                        : 'Account registered and authenticated.');
                }
            }
        }
        catch {
            setErrorMessage('An unexpected authentication error occurred. Please try again.');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-cream-100 dark:bg-brutal-darkBg flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-cobalt selection:text-white", children: _jsxs("div", { className: "w-full max-w-md space-y-4", children: [_jsxs("div", { className: "brutal-card p-6 sm:p-8 bg-cream-50 dark:bg-brutal-darkCard shadow-brutal-lg", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6 pb-4 border-b-2 border-ink-950 dark:border-zinc-700", children: [_jsx("div", { className: "w-10 h-10 bg-ink-950 dark:bg-white text-white dark:text-ink-950 flex items-center justify-center font-mono font-black text-xl border-2 border-ink-950", children: _jsx(RupeeIcon, { className: "w-6 h-6" }) }), _jsxs("div", { children: [_jsx("span", { className: "block font-serif font-black text-xl tracking-tight text-ink-950 dark:text-zinc-100", children: "Ledger Brutalist" }), _jsx("p", { className: "text-[10px] font-mono font-bold tracking-widest text-cobalt dark:text-blue-400 uppercase", children: "Financial Dispatch & Accounting Bureau" })] })] }), _jsxs("div", { className: "space-y-1 mb-6", children: [_jsx("span", { className: "editorial-kicker", children: "ACCESS VERIFICATION" }), _jsx("h2", { className: "editorial-headline text-xl", children: "Authentic Ledger Access" }), _jsx("p", { className: "text-xs text-ink-600 dark:text-zinc-400 font-mono leading-relaxed pt-1", children: "Engineered for independent professionals and disciplined households seeking strict Indian Rupee accounting, zero advertising telemetry, and PostgreSQL tenant isolation." })] }), _jsxs("div", { className: "flex border-2 border-ink-950 dark:border-zinc-700 mb-4 bg-cream-200 dark:bg-zinc-800", children: [_jsx("button", { type: "button", onClick: () => {
                                        setAuthMode('signin');
                                        setErrorMessage(null);
                                        setSuccessMessage(null);
                                    }, className: `flex-1 py-2 text-xs font-mono font-bold uppercase transition-colors ${authMode === 'signin'
                                        ? 'bg-cobalt text-white'
                                        : 'text-ink-800 dark:text-zinc-300 hover:bg-cream-300 dark:hover:bg-zinc-700'}`, children: "Sign In" }), _jsx("button", { type: "button", onClick: () => {
                                        setAuthMode('signup');
                                        setErrorMessage(null);
                                        setSuccessMessage(null);
                                    }, className: `flex-1 py-2 text-xs font-mono font-bold uppercase transition-colors ${authMode === 'signup'
                                        ? 'bg-cobalt text-white'
                                        : 'text-ink-800 dark:text-zinc-300 hover:bg-cream-300 dark:hover:bg-zinc-700'}`, children: "Register" })] }), errorMessage && (_jsx("div", { className: "mb-4 p-3 border-2 border-brutal-red bg-red-50 dark:bg-red-950/40 text-brutal-red dark:text-red-300 text-xs font-mono", children: errorMessage })), successMessage && (_jsx("div", { className: "mb-4 p-3 border-2 border-brutal-green bg-emerald-50 dark:bg-emerald-950/40 text-brutal-green dark:text-emerald-300 text-xs font-mono", children: successMessage })), _jsxs("form", { onSubmit: handleEmailAuth, className: "space-y-3 mb-4", children: [_jsxs("div", { children: [_jsx("label", { className: "brutal-label", children: "Email Address" }), _jsx("input", { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), placeholder: "name@example.com", className: "brutal-input font-mono" })] }), _jsxs("div", { children: [_jsx("label", { className: "brutal-label", children: "Password" }), _jsx("input", { type: "password", required: true, value: password, onChange: (e) => setPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", className: "brutal-input font-mono" })] }), _jsx("button", { type: "submit", disabled: isSubmitting || isLoading, className: "w-full brutal-btn-primary mt-2", children: isSubmitting
                                        ? 'Processing...'
                                        : authMode === 'signin'
                                            ? 'Sign In to Ledger'
                                            : 'Create Account' })] }), _jsxs("div", { className: "relative flex py-2 items-center", children: [_jsx("div", { className: "flex-grow border-t-2 border-ink-200 dark:border-zinc-700" }), _jsx("span", { className: "flex-shrink mx-2 text-[10px] font-mono uppercase text-ink-500 font-bold", children: "OR SINGLE SIGN-ON" }), _jsx("div", { className: "flex-grow border-t-2 border-ink-200 dark:border-zinc-700" })] }), _jsxs("button", { type: "button", onClick: signInWithGoogle, disabled: isLoading || isSubmitting, className: "w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white dark:bg-zinc-800 text-ink-950 dark:text-white font-mono font-bold text-xs uppercase tracking-wider border-2 border-ink-950 dark:border-zinc-600 shadow-brutal hover:bg-cream-200 dark:hover:bg-zinc-700 transition-all disabled:opacity-50", children: [_jsx(GoogleIcon, { className: "w-4 h-4" }), _jsx("span", { children: "Continue with Google" })] }), _jsxs("div", { className: "mt-4 pt-3 border-t border-ink-950/20 dark:border-zinc-700", children: [_jsx("span", { className: "block text-[10px] font-mono font-bold uppercase text-ink-500 dark:text-zinc-400 mb-2", children: "Isolated Test Simulation (Preloaded Profiles)" }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsx("button", { type: "button", onClick: () => signInWithDemoUser('auditor'), disabled: isLoading, className: "py-2 px-2 bg-cream-200 dark:bg-zinc-800 text-ink-950 dark:text-zinc-200 border border-ink-950 dark:border-zinc-600 text-[10px] font-mono font-bold uppercase hover:bg-cream-300 dark:hover:bg-zinc-700 transition-colors", title: "Log in as Lead Auditor", children: "Auditor Session (A)" }), _jsx("button", { type: "button", onClick: () => signInWithDemoUser('analyst'), disabled: isLoading, className: "py-2 px-2 bg-cream-200 dark:bg-zinc-800 text-ink-950 dark:text-zinc-200 border border-ink-950 dark:border-zinc-600 text-[10px] font-mono font-bold uppercase hover:bg-cream-300 dark:hover:bg-zinc-700 transition-colors", title: "Log in as Analyst B to verify RLS tenant isolation", children: "Analyst Session (B)" })] })] }), _jsxs("div", { className: "mt-6 pt-4 border-t-2 border-ink-950 dark:border-zinc-700 space-y-2 text-[10px] font-mono text-ink-500 dark:text-zinc-400", children: [_jsxs("div", { className: "flex items-center gap-1.5 font-bold text-ink-800 dark:text-zinc-300", children: [_jsx(ShieldIcon, { className: "w-3.5 h-3.5 text-cobalt" }), _jsx("span", { children: "POSTGRESQL TENANT ISOLATION SPECIFICATION" })] }), _jsxs("ul", { className: "space-y-1 pl-1 list-none", children: [_jsxs("li", { className: "flex items-baseline gap-1.5", children: [_jsx("span", { className: "text-ink-950 dark:text-zinc-100", children: "\u2022" }), _jsx("span", { children: "Cryptographic Row Level Security: auth.uid() isolation per row" })] }), _jsxs("li", { className: "flex items-baseline gap-1.5", children: [_jsx("span", { className: "text-ink-950 dark:text-zinc-100", children: "\u2022" }), _jsx("span", { children: "Zero floating-point rounding: pure paise minor-unit math" })] }), _jsxs("li", { className: "flex items-baseline gap-1.5", children: [_jsx("span", { className: "text-ink-950 dark:text-zinc-100", children: "\u2022" }), _jsxs("span", { children: ["Engine: ", isConfiguredSupabase ? 'Active Supabase Backend' : 'Local Offline Partition'] })] })] })] })] }), _jsxs("div", { className: "p-3 border border-ink-950/20 dark:border-zinc-700 bg-cream-50/60 dark:bg-zinc-900/40 text-[10px] font-mono text-ink-600 dark:text-zinc-400 flex items-center justify-between", children: [_jsx("div", { children: "\u00A9 2026 Ledger Brutalist" }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Link, { to: "/privacy", className: "underline hover:text-ink-950 dark:hover:text-zinc-200", children: "Privacy Policy" }), _jsx("span", { children: "\u2022" }), _jsx(Link, { to: "/terms", className: "underline hover:text-ink-950 dark:hover:text-zinc-200", children: "Terms & Conditions" })] })] })] }) }));
};
