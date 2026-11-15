import React from 'react';
import { Trash2, AlertCircle, Archive } from 'lucide-react';

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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm"
      onClick={() => !loading && onClose()}
    >
      <div
        className="w-full max-w-md bg-vault-card border border-rose-500/30 rounded-2xl p-5 sm:p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2.5 text-rose-400 mb-2">
          <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <Trash2 className="w-5 h-5 text-rose-400" />
          </div>
          <h3 className="font-gaming font-bold text-lg sm:text-xl text-white">
            Bulk Remove {entityName}
          </h3>
        </div>

        <p className="mt-2 text-xs text-zinc-300 leading-relaxed">
          {description || (
            <>
              You have selected <span className="font-bold text-white text-sm">{count}</span> {entityName}.
              {supportArchive
                ? ' Choose whether to archive them or permanently wipe them from the database.'
                : ' Are you sure you want to permanently delete these items? This action cannot be undone.'}
            </>
          )}
        </p>

        {supportArchive && (
          <div className="mt-4 p-3 rounded-xl bg-vault-surface border border-zinc-800 text-[11px] text-zinc-400 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-300 font-semibold">
              <Archive className="w-3.5 h-3.5" />
              <span>Archive Option (Recommended)</span>
            </div>
            <p>Hides records from user view while preserving database history.</p>
            <div className="flex items-center gap-2 text-rose-400 font-semibold pt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Permanent Delete</span>
            </div>
            <p>Irreversibly removes selected records from the database.</p>
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center justify-end gap-2 sm:gap-2.5">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold disabled:opacity-50"
          >
            Cancel
          </button>

          {supportArchive && (
            <button
              type="button"
              disabled={loading}
              onClick={() => onConfirm(false)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-sm disabled:opacity-50 flex items-center gap-1.5"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Archive ({count})</span>
            </button>
          )}

          <button
            type="button"
            disabled={loading}
            onClick={() => onConfirm(true)}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-glow-sm disabled:opacity-50 flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{loading ? 'Deleting...' : `Delete (${count})`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkDeleteModal;
