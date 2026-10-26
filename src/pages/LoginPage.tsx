import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleIcon, ShieldIcon, RupeeIcon } from '../components/ui/Icons';
import { isConfiguredSupabase } from '../lib/supabase';

export const LoginPage: React.FC = () => {
  const {
    user,
    isLoading,
    signInWithGoogle,
    signInWithPassword,
    signUpWithPassword,
    signInWithDemoUser,
  } = useAuth();

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
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
      } else {
        const { error } = await signUpWithPassword(email.trim(), password);
        if (error) {
          setErrorMessage(error.message || 'Unable to register account.');
        } else {
          setSuccessMessage(
            isConfiguredSupabase
              ? 'Registration initiated. Please check your email inbox to verify your account.'
              : 'Account registered and authenticated.'
          );
        }
      }
    } catch {
      setErrorMessage('An unexpected authentication error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-brutal-darkBg flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-cobalt selection:text-white">
      <div className="w-full max-w-md space-y-4">
        {/* Brand Card */}
        <div className="brutal-card p-6 sm:p-8 bg-cream-50 dark:bg-brutal-darkCard shadow-brutal-lg">
          {/* Logo badge */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-ink-950 dark:border-zinc-700">
            <div className="w-10 h-10 bg-ink-950 dark:bg-white text-white dark:text-ink-950 flex items-center justify-center font-mono font-black text-xl border-2 border-ink-950">
              <RupeeIcon className="w-6 h-6" />
            </div>
            <div>
              <span className="block font-serif font-black text-xl tracking-tight text-ink-950 dark:text-zinc-100">
                Ledger Brutalist
              </span>
              <p className="text-[10px] font-mono font-bold tracking-widest text-cobalt dark:text-blue-400 uppercase">
                Financial Dispatch & Accounting Bureau
              </p>
            </div>
          </div>

          <div className="space-y-1 mb-6">
            <span className="editorial-kicker">ACCESS VERIFICATION</span>
            <h2 className="editorial-headline text-xl">
              Authentic Ledger Access
            </h2>
            <p className="text-xs text-ink-600 dark:text-zinc-400 font-mono leading-relaxed pt-1">
              Engineered for independent professionals and disciplined households seeking strict Indian Rupee accounting, zero advertising telemetry, and PostgreSQL tenant isolation.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex border-2 border-ink-950 dark:border-zinc-700 mb-4 bg-cream-200 dark:bg-zinc-800">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-mono font-bold uppercase transition-colors ${
                authMode === 'signin'
                  ? 'bg-cobalt text-white'
                  : 'text-ink-800 dark:text-zinc-300 hover:bg-cream-300 dark:hover:bg-zinc-700'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-mono font-bold uppercase transition-colors ${
                authMode === 'signup'
                  ? 'bg-cobalt text-white'
                  : 'text-ink-800 dark:text-zinc-300 hover:bg-cream-300 dark:hover:bg-zinc-700'
              }`}
            >
              Register
            </button>
          </div>

          {/* Alerts */}
          {errorMessage && (
            <div className="mb-4 p-3 border-2 border-brutal-red bg-red-50 dark:bg-red-950/40 text-brutal-red dark:text-red-300 text-xs font-mono">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 border-2 border-brutal-green bg-emerald-50 dark:bg-emerald-950/40 text-brutal-green dark:text-emerald-300 text-xs font-mono">
              {successMessage}
            </div>
          )}

          {/* Email / Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-3 mb-4">
            <div>
              <label className="brutal-label">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="brutal-input font-mono"
              />
            </div>

            <div>
              <label className="brutal-label">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="brutal-input font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full brutal-btn-primary mt-2"
            >
              {isSubmitting
                ? 'Processing...'
                : authMode === 'signin'
                ? 'Sign In to Ledger'
                : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t-2 border-ink-200 dark:border-zinc-700"></div>
            <span className="flex-shrink mx-2 text-[10px] font-mono uppercase text-ink-500 font-bold">
              OR SINGLE SIGN-ON
            </span>
            <div className="flex-grow border-t-2 border-ink-200 dark:border-zinc-700"></div>
          </div>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={isLoading || isSubmitting}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white dark:bg-zinc-800 text-ink-950 dark:text-white font-mono font-bold text-xs uppercase tracking-wider border-2 border-ink-950 dark:border-zinc-600 shadow-brutal hover:bg-cream-200 dark:hover:bg-zinc-700 transition-all disabled:opacity-50"
          >
            <GoogleIcon className="w-4 h-4" />
            <span>Continue with Google</span>
          </button>

          {/* Demo Sandbox Credentials */}
          <div className="mt-4 pt-3 border-t border-ink-950/20 dark:border-zinc-700">
            <span className="block text-[10px] font-mono font-bold uppercase text-ink-500 dark:text-zinc-400 mb-2">
              Isolated Test Simulation (Preloaded Profiles)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => signInWithDemoUser('auditor')}
                disabled={isLoading}
                className="py-2 px-2 bg-cream-200 dark:bg-zinc-800 text-ink-950 dark:text-zinc-200 border border-ink-950 dark:border-zinc-600 text-[10px] font-mono font-bold uppercase hover:bg-cream-300 dark:hover:bg-zinc-700 transition-colors"
                title="Log in as Lead Auditor"
              >
                Auditor Session (A)
              </button>
              <button
                type="button"
                onClick={() => signInWithDemoUser('analyst')}
                disabled={isLoading}
                className="py-2 px-2 bg-cream-200 dark:bg-zinc-800 text-ink-950 dark:text-zinc-200 border border-ink-950 dark:border-zinc-600 text-[10px] font-mono font-bold uppercase hover:bg-cream-300 dark:hover:bg-zinc-700 transition-colors"
                title="Log in as Analyst B to verify RLS tenant isolation"
              >
                Analyst Session (B)
              </button>
            </div>
          </div>

          {/* Security & Architecture Specs */}
          <div className="mt-6 pt-4 border-t-2 border-ink-950 dark:border-zinc-700 space-y-2 text-[10px] font-mono text-ink-500 dark:text-zinc-400">
            <div className="flex items-center gap-1.5 font-bold text-ink-800 dark:text-zinc-300">
              <ShieldIcon className="w-3.5 h-3.5 text-cobalt" />
              <span>POSTGRESQL TENANT ISOLATION SPECIFICATION</span>
            </div>
            <ul className="space-y-1 pl-1 list-none">
              <li className="flex items-baseline gap-1.5">
                <span className="text-ink-950 dark:text-zinc-100">•</span>
                <span>Cryptographic Row Level Security: auth.uid() isolation per row</span>
              </li>
              <li className="flex items-baseline gap-1.5">
                <span className="text-ink-950 dark:text-zinc-100">•</span>
                <span>Zero floating-point rounding: pure paise minor-unit math</span>
              </li>
              <li className="flex items-baseline gap-1.5">
                <span className="text-ink-950 dark:text-zinc-100">•</span>
                <span>Engine: {isConfiguredSupabase ? 'Active Supabase Backend' : 'Local Offline Partition'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Legal Links */}
        <div className="p-3 border border-ink-950/20 dark:border-zinc-700 bg-cream-50/60 dark:bg-zinc-900/40 text-[10px] font-mono text-ink-600 dark:text-zinc-400 flex items-center justify-between">
          <div>
            © 2026 Ledger Brutalist
          </div>
          <div className="flex items-center gap-3">
            <Link to="/privacy" className="underline hover:text-ink-950 dark:hover:text-zinc-200">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/terms" className="underline hover:text-ink-950 dark:hover:text-zinc-200">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
