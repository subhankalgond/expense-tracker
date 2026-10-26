import React from 'react';
import { PlusIcon } from './Icons';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center border-2 border-dashed border-ink-950/40 dark:border-zinc-700 bg-cream-50/50 dark:bg-brutal-darkCard/40">
      {icon && <div className="mb-3 text-ink-500 dark:text-zinc-400">{icon}</div>}
      <h3 className="text-sm font-bold uppercase tracking-wider text-ink-900 dark:text-zinc-100 font-mono mb-1">
        {title}
      </h3>
      <p className="text-xs text-ink-500 dark:text-zinc-400 max-w-sm mb-5">
        {description}
      </p>
      {actionLabel && onAction && (
        <button type="button" onClick={onAction} className="brutal-btn-primary">
          <PlusIcon className="w-3.5 h-3.5 mr-1.5" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};
