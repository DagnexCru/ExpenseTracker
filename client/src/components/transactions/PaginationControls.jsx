import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

export default function PaginationControls({
  pagination = {},
  onPageChange,
  onLimitChange,
}) {
  const {
    page = 1,
    limit = 10,
    totalCount = 0,
    totalPages = 1,
    hasNextPage = false,
    hasPrevPage = false,
  } = pagination;

  if (totalCount === 0) return null;

  const startRecord = (page - 1) * limit + 1;
  const endRecord = Math.min(page * limit, totalCount);

  // Generate page numbers array to show around current page
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-800 text-xs text-slate-400">
      {/* Left: Summary & Per-page selector */}
      <div className="flex items-center gap-3">
        <span>
          Showing <strong className="text-slate-800">{startRecord}</strong> to{' '}
          <strong className="text-slate-800">{endRecord}</strong> of{' '}
          <strong className="text-slate-800">{totalCount}</strong> transactions
        </span>

        {onLimitChange && (
          <div className="flex items-center gap-1.5 ml-2 pl-3 border-l border-[#EDE4D9]">
            <span>Per page:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="bg-white border border-[#EDE4D9] rounded-lg px-2.5 py-1 text-slate-800 text-xs shadow-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none cursor-pointer font-medium"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
        )}
      </div>

      {/* Right: Pagination Navigation Controls */}
      <div className="flex items-center gap-1 self-center sm:self-auto">
        {/* First Page */}
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={!hasPrevPage}
          className="p-1.5 rounded-lg border border-[#EDE4D9] bg-white text-slate-600 hover:text-slate-900 hover:bg-[#FAF5F0] shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          title="First Page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous Page */}
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage}
          className="p-1.5 rounded-lg border border-[#EDE4D9] bg-white text-slate-600 hover:text-slate-900 hover:bg-[#FAF5F0] shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Numeric Page Buttons */}
        <div className="flex items-center gap-1 mx-1">
          {pageNumbers.map((p) => {
            const isActive = p === page;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'bg-white border border-[#EDE4D9] text-slate-700 hover:bg-[#FAF5F0] hover:text-slate-900 shadow-sm'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Next Page */}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          className="p-1.5 rounded-lg border border-[#EDE4D9] bg-white text-slate-600 hover:text-slate-900 hover:bg-[#FAF5F0] shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last Page */}
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNextPage}
          className="p-1.5 rounded-lg border border-[#EDE4D9] bg-white text-slate-600 hover:text-slate-900 hover:bg-[#FAF5F0] shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          title="Last Page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
