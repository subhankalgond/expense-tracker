import React from 'react';
import { Modal } from './Modal';
import { AlertTriangleIcon } from './Icons';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm Action',
  cancelLabel = 'Cancel',
  isDestructive = true,
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 border-2 border-ink-950 dark:border-zinc-500 bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-400">
            <AlertTriangleIcon className="w-5 h-5" />
          </div>
          <p className="text-sm text-ink-700 dark:text-zinc-300 font-medium leading-relaxed">
            {message}
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-ink-200 dark:border-zinc-700">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="brutal-btn-secondary"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={isDestructive ? 'brutal-btn-danger' : 'brutal-btn-primary'}
          >
            {isLoading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};
