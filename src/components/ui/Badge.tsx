import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'income' | 'expense' | 'neutral' | 'warning' | 'cobalt';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
}) => {
  const variantStyles = {
    income: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    expense: 'bg-red-50 text-[#DC2626] border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800',
    warning: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    cobalt: 'bg-blue-50 text-[#1E40AF] border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
    neutral: 'bg-[#F2EFE8] text-zinc-700 border-[#E2DDD2] dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700',
  }[variant];

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[10px] font-sans font-semibold uppercase tracking-wider rounded-full border ${variantStyles} ${className}`}
    >
      {children}
    </span>
  );
};

