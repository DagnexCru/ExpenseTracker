import React from 'react';
import { Receipt, Plus } from 'lucide-react';
import Button from '../ui/Button';

/**
 * Empty state view when no transactions exist or match filters
 *
 * @param {Object} props
 * @param {boolean} props.hasFilters
 * @param {Function} props.onAddClick
 * @param {Function} props.onResetFilters
 */
export const EmptyTransactionsState = ({ hasFilters, onAddClick, onResetFilters }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-10 sm:p-14 text-center max-w-lg mx-auto shadow-sm">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 border border-brand-100 flex items-center justify-center mx-auto mb-4 shadow-sm">
        <Receipt className="w-8 h-8" />
      </div>

      <h3 className="text-lg font-bold text-slate-900 tracking-tight">
        {hasFilters ? 'No Matching Transactions' : 'No Transactions Recorded Yet'}
      </h3>

      <p className="mt-1.5 text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
        {hasFilters
          ? 'We could not find any transactions matching your current type, category, or search filters.'
          : 'Start tracking your financial journey by logging your first income or expense transaction.'}
      </p>

      <div className="mt-6 flex items-center justify-center gap-3">
        {hasFilters ? (
          <Button variant="outline" size="sm" onClick={onResetFilters}>
            Clear All Filters
          </Button>
        ) : (
          <Button variant="primary" size="md" icon={Plus} onClick={onAddClick}>
            Add First Transaction
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyTransactionsState;
