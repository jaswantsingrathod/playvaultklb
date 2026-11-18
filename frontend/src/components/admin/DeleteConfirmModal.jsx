import React from 'react';
import { Trash2, AlertTriangle, X, Loader2, Archive, AlertCircle } from 'lucide-react';

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Deletion',
  itemName = '',
  description = 'Are you sure you want to permanently delete this item? This action cannot be undone.',
  confirmText = 'Delete',
  loading = false,
  supportArchive = false,
  onArchive,
  archiveText = 'Soft Archive',
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => !loading && onClose()}
    >
      <div
        className="w-full max-w-md bg-vault-card border border-rose-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-rose-950/60 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle background ambient red glow */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-rose-500/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 shadow-sm">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-gaming font-extrabold text-lg sm:text-xl text-white tracking-wide">
                {title}
              </h3>
              <p className="text-[11px] text-zinc-400 font-medium">Permanent Removal Warning</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-4 space-y-3">
          {itemName && (
            <div className="p-2.5 rounded-xl bg-vault-surface border border-rose-500/20 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span className="font-semibold text-white text-xs truncate max-w-full">
                {itemName}
              </span>
            </div>
          )}

          <p className="text-xs text-zinc-300 leading-relaxed">
            {description}
          </p>

          {supportArchive && (
            <div className="p-3 rounded-xl bg-vault-surface/80 border border-zinc-800 text-[11px] text-zinc-400 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-300 font-semibold">
                <Archive className="w-3.5 h-3.5" />
                <span>Archive Option</span>
              </div>
              <p>Hides record from users while safely preserving historical database records.</p>
              <div className="flex items-center gap-2 text-rose-400 font-semibold pt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Permanent Delete</span>
              </div>
              <p>Irreversibly deletes this item and all linked assets from the database.</p>
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="flex flex-wrap items-center justify-end gap-2.5 pt-3 border-t border-rose-500/15">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-vault-surface hover:bg-vault-card border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold transition-colors disabled:opacity-50"
          >
            Cancel
          </button>

          {supportArchive && onArchive && (
            <button
              type="button"
              disabled={loading}
              onClick={onArchive}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>{archiveText}</span>
            </button>
          )}

          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-950/60 flex items-center gap-1.5 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>{confirmText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
