import React from 'react';
import { CheckSquare, Trash2 } from 'lucide-react';

const BulkActionBar = ({
  selectedCount = 0,
  entityName = 'items',
  onClear,
  onDelete,
  deleteLabel,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-purple-950/60 border border-purple-500/40 text-purple-200 shadow-lg">
      <div className="flex items-center gap-2.5">
        <div className="px-2.5 py-1 rounded-lg bg-purple-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm">
          <CheckSquare className="w-3.5 h-3.5" />
          <span>{selectedCount} Selected</span>
        </div>
        <span className="text-xs text-zinc-300 hidden sm:inline">
          Selected {selectedCount} {entityName}. Choose an action below.
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onClear}
          className="px-3 py-1.5 rounded-xl bg-vault-surface hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-semibold transition-all"
        >
          Clear Selection
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-glow-sm transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{deleteLabel || `Bulk Delete (${selectedCount})`}</span>
        </button>
      </div>
    </div>
  );
};

export default BulkActionBar;
