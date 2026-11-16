import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const TablePagination = ({
  page = 1,
  totalPages = 1,
  total = 0,
  limit = 10,
  onPageChange,
  onLimitChange,
  entityName = 'items',
}) => {
  // If no data OR 10 or fewer items, hide pagination and limit controls completely
  if (!total || total <= 10) {
    return null;
  }

  const startEntry = total === 0 ? 0 : (page - 1) * limit + 1;
  const endEntry = Math.min(page * limit, total);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="p-3 sm:p-4 bg-vault-surface/60 border-t border-purple-500/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
      {/* Left: item counter */}
      <div className="text-zinc-400">
        Showing <span className="font-semibold text-white">{startEntry}</span> to{' '}
        <span className="font-semibold text-white">{endEntry}</span> of{' '}
        <span className="font-semibold text-purple-300">{total}</span> {entityName}
      </div>

      {/* Right: limit dropdown & page navigation */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        {onLimitChange && (
          <div className="flex items-center gap-2">
            <span className="text-zinc-400">Rows per page:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="px-2 py-1 rounded-lg bg-vault-card border border-zinc-800 text-white text-xs outline-none focus:border-purple-400"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(1)}
            disabled={page <= 1}
            className="p-1.5 rounded-lg bg-vault-card border border-zinc-800 hover:border-purple-400 text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="First Page"
          >
            <ChevronsLeft className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="p-1.5 rounded-lg bg-vault-card border border-zinc-800 hover:border-purple-400 text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Previous Page"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1 px-1">
            {getPageNumbers().map((pageNum, idx) =>
              pageNum === '...' ? (
                <span key={`ellipsis-${idx}`} className="px-1.5 text-zinc-500">
                  ...
                </span>
              ) : (
                <button
                  type="button"
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${
                    page === pageNum
                      ? 'bg-purple-600 text-white shadow-glow-sm'
                      : 'bg-vault-card border border-zinc-800 hover:border-purple-400 text-zinc-300'
                  }`}
                >
                  {pageNum}
                </button>
              )
            )}
          </div>

          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            className="p-1.5 rounded-lg bg-vault-card border border-zinc-800 hover:border-purple-400 text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Next Page"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            disabled={page >= totalPages}
            className="p-1.5 rounded-lg bg-vault-card border border-zinc-800 hover:border-purple-400 text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Last Page"
          >
            <ChevronsRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TablePagination;
