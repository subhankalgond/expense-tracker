import React, { useEffect, useRef } from 'react';
import { CloseIcon } from './Icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  }[maxWidth];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/60 backdrop-blur-none transition-opacity"
    >
      {/* Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div
        ref={modalRef}
        className={`relative w-full ${maxWidthClass} bg-cream-50 dark:bg-brutal-darkCard border-3 border-ink-950 dark:border-zinc-300 shadow-brutal-xl z-10 max-h-[90vh] flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-ink-950 dark:border-zinc-700 px-5 py-3.5 bg-cream-200 dark:bg-zinc-800">
          <h2 className="text-sm font-black uppercase tracking-wider text-ink-950 dark:text-zinc-100 font-mono">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 border border-ink-950 dark:border-zinc-400 bg-white dark:bg-zinc-700 hover:bg-cream-300 dark:hover:bg-zinc-600 active:translate-x-0.5 active:translate-y-0.5"
          >
            <CloseIcon className="w-4 h-4 text-ink-950 dark:text-zinc-100" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
