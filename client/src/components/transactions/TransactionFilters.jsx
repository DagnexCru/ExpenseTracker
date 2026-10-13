import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../constants/transactionCategories';

/**
 * Filter bar for transactions
 *
 * @param {Object} props
 * @param {string} props.typeFilter - 'all' | 'expense' | 'income'
 * @param {Function} props.onTypeFilterChange
 * @param {string} props.categoryFilter
 * @param {Function} props.onCategoryFilterChange
 * @param {string} props.searchQuery
 * @param {Function} props.onSearchQueryChange
 * @param {Function} props.onReset
 */
export const TransactionFilters = ({
  typeFilter = 'all',
  onTypeFilterChange,
  categoryFilter = '',
  onCategoryFilterChange,
  searchQuery = '',
  onSearchQueryChange,
  onReset,
}) => {
  // Available categories based on selected type filter
  const categoryOptions =
    typeFilter === 'income'
      ? INCOME_CATEGORIES
      : typeFilter === 'expense'
      ? EXPENSE_CATEGORIES
      : [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

  const hasActiveFilters = typeFilter !== 'all' || categoryFilter !== '' || searchQuery !== '';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
      {/* Left: Type Filter Pills */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl shrink-0 self-start sm:self-auto">
        <button
          type="button"
          onClick={() => {
            onTypeFilterChange('all');
            onCategoryFilterChange('');
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            typeFilter === 'all'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
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
              ? 'bg-rose-50 text-rose-700 shadow-sm border border-rose-200/50'
              : 'text-slate-600 hover:text-slate-900'
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
              ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-200/50'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Income
        </button>
      </div>

      {/* Center & Right: Category Filter & Search Box */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 max-w-xl justify-end">
        {/* Category Select */}
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryFilterChange(e.target.value)}
          className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all cursor-pointer"
        >
          <option value="">All Categories</option>
          {categoryOptions.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Search Input */}
        <div className="relative flex-1 min-w-[160px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="Search descriptions..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
        </div>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shrink-0"
            title="Reset filters"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TransactionFilters;
