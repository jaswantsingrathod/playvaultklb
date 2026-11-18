import React from 'react';
import { Trash2, AlertCircle, Archive, X, Loader2 } from 'lucide-react';

const BulkDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  count = 0,
  entityName = 'items',
  loading = false,
  supportArchive = false,
  description,
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
                Bulk Remove {entityName}
              </h3>
              <p className="text-[11px] text-zinc-400 font-medium">Batch Removal Action</p>
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
          <div className="p-2.5 rounded-xl bg-vault-surface border border-rose-500/20 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-semibold text-white text-xs">
              Selected: <strong className="text-rose-300 text-sm">{count}</strong> {entityName}
            </span>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed">
            {description || (
              <>
                Are you sure you want to proceed with deleting these <span className="font-bold text-white">{count}</span> {entityName}?
                {supportArchive
                  ? ' Choose whether to soft-archive them or permanently wipe them from the database.'
                  : ' This action cannot be undone.'}
              </>
            )}
          </p>

          {supportArchive && (
            <div className="p-3 rounded-xl bg-vault-surface/80 border border-zinc-800 text-[11px] text-zinc-400 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-300 font-semibold">
                <Archive className="w-3.5 h-3.5" />
                <span>Archive Option (Recommended)</span>
              </div>
              <p>Hides records from user view while safely preserving database history.</p>
              <div className="flex items-center gap-2 text-rose-400 font-semibold pt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Permanent Delete</span>
              </div>
              <p>Irreversibly removes selected records from the database.</p>
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="mt-2 flex flex-wrap items-center justify-end gap-2.5 pt-3 border-t border-rose-500/15">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-vault-surface hover:bg-vault-card border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold transition-colors disabled:opacity-50"
          >
            Cancel
          </button>

          {supportArchive && (
            <button
              type="button"
              disabled={loading}
              onClick={() => onConfirm(false)}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Archive ({count})</span>
            </button>
          )}

          <button
            type="button"
            disabled={loading}
            onClick={() => onConfirm(true)}
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
                <span>Delete ({count})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkDeleteModal;
