import React, { useState } from 'react';
import {
  Search,
  Filter,
  X,
  Calendar,
  ArrowUpDown,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from '../../constants/transactionCategories';

export const TransactionFilters = ({
  typeFilter = 'all',
  onTypeFilterChange,
  categoryFilter = '',
  onCategoryFilterChange,
  searchQuery = '',
  onSearchQueryChange,
  startDate = '',
  onStartDateChange,
  endDate = '',
  onEndDateChange,
  sortBy = 'date',
  onSortByChange,
  sortOrder = 'desc',
  onSortOrderChange,
  onReset,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Filter categories by selected transaction type
  const categoryOptions =
    typeFilter === 'income'
      ? INCOME_CATEGORIES
      : typeFilter === 'expense'
      ? EXPENSE_CATEGORIES
      : [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

  // Count active filters
  let activeFilterCount = 0;
  if (typeFilter !== 'all') activeFilterCount++;
  if (categoryFilter !== '') activeFilterCount++;
  if (searchQuery.trim() !== '') activeFilterCount++;
  if (startDate !== '') activeFilterCount++;
  if (endDate !== '') activeFilterCount++;
  if (sortBy !== 'date' || sortOrder !== 'desc') activeFilterCount++;

  const handleSortChange = (e) => {
    const val = e.target.value;
    if (val === 'date_desc') {
      onSortByChange('date');
      onSortOrderChange('desc');
    } else if (val === 'date_asc') {
      onSortByChange('date');
      onSortOrderChange('asc');
    } else if (val === 'amount_desc') {
      onSortByChange('amount');
      onSortOrderChange('desc');
    } else if (val === 'amount_asc') {
      onSortByChange('amount');
      onSortOrderChange('asc');
    } else if (val === 'category_asc') {
      onSortByChange('category');
      onSortOrderChange('asc');
    }
  };

  const currentSortVal = `${sortBy}_${sortOrder}`;

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-700/60 p-4 shadow-xl backdrop-blur-md space-y-3">
      {/* Primary Filter Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left: Type Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              onTypeFilterChange('all');
              onCategoryFilterChange('');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              typeFilter === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => {
              onTypeFilterChange('expense');
              onCategoryFilterChange('');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              typeFilter === 'expense'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Expenses
          </button>
          <button
            type="button"
            onClick={() => {
              onTypeFilterChange('income');
              onCategoryFilterChange('');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              typeFilter === 'income'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Income
          </button>
        </div>

        {/* Center & Right: Search, Category, Sort, and Advanced Toggle */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1 justify-end">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              placeholder="Search descriptions..."
              className="w-full pl-8 pr-7 py-1.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs placeholder:text-slate-500 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchQueryChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            className="text-xs bg-slate-950/70 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 cursor-pointer"
          >
            <option value="" className="bg-slate-900 text-slate-300">
              All Categories
            </option>
            {categoryOptions.map((cat) => (
              <option key={cat.name} value={cat.name} className="bg-slate-900 text-slate-300">
                {cat.name}
              </option>
            ))}
          </select>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-700/80 rounded-xl px-2.5 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={currentSortVal}
              onChange={handleSortChange}
              className="bg-transparent border-none text-xs text-slate-300 focus:ring-0 focus:outline-none cursor-pointer"
            >
              <option value="date_desc" className="bg-slate-900 text-slate-300">
                Date: Newest
              </option>
              <option value="date_asc" className="bg-slate-900 text-slate-300">
                Date: Oldest
              </option>
              <option value="amount_desc" className="bg-slate-900 text-slate-300">
                Amount: High &rarr; Low
              </option>
              <option value="amount_asc" className="bg-slate-900 text-slate-300">
                Amount: Low &rarr; High
              </option>
            </select>
          </div>

          {/* Advanced Filter Toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`p-1.5 rounded-xl border transition-colors flex items-center gap-1 text-xs ${
              showAdvanced || startDate || endDate
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-950/70 border-slate-700/80 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Date Range Filters"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dates</span>
          </button>

          {/* Reset Filters Button */}
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl transition-all"
              title="Reset all filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset ({activeFilterCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Advanced Collapsible Filter Drawer: Date Range */}
      {showAdvanced && (
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-300">Date Range:</span>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-700 rounded-lg px-2 py-1">
                <span className="text-[10px] text-slate-500">From:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => onStartDateChange(e.target.value)}
                  className="bg-transparent text-slate-200 text-xs border-none focus:outline-none cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-700 rounded-lg px-2 py-1">
                <span className="text-[10px] text-slate-500">To:</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => onEndDateChange(e.target.value)}
                  className="bg-transparent text-slate-200 text-xs border-none focus:outline-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {(startDate || endDate) && (
            <button
              type="button"
              onClick={() => {
                onStartDateChange('');
                onEndDateChange('');
              }}
              className="text-[11px] text-slate-400 hover:text-rose-400 underline transition-colors"
            >
              Clear dates
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionFilters;
