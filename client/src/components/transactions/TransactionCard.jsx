import React from 'react';
import { Edit2, Trash2, Calendar, CreditCard } from 'lucide-react';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../constants/transactionCategories';

/**
 * Mobile-responsive card view for a single transaction
 *
 * @param {Object} props
 * @param {Object} props.transaction
 * @param {Function} props.onEdit
 * @param {Function} props.onDelete
 * @param {string} [props.currency='ETB']
 */
export const TransactionCard = ({
  transaction,
  onEdit,
  onDelete,
  currency = 'ETB',
}) => {
  const isIncome = transaction.type === 'income';

  const categoryList = isIncome ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const categoryMeta = categoryList.find((c) => c.name === transaction.category);
  const colorBadgeClass =
    categoryMeta?.color ||
    (isIncome
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : 'bg-rose-50 text-rose-700 border-rose-200');

  const formattedDate = new Date(transaction.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm hover:shadow-md transition-all space-y-3">
      {/* Top Row: Category Pill & Amount */}
      <div className="flex items-center justify-between gap-3">
        <span
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${colorBadgeClass}`}
        >
          {transaction.category}
        </span>
        <span
          className={`text-base font-extrabold tracking-tight tabular-nums font-mono ${
            isIncome ? 'text-emerald-600' : 'text-slate-900'
          }`}
        >
          {isIncome ? '+' : '-'} {currency} {Number(transaction.amount).toFixed(2)}
        </span>
      </div>

      {/* Middle Row: Description if present */}
      {transaction.description && (
        <p className="text-xs text-slate-600 line-clamp-2">
          {transaction.description}
        </p>
      )}

      {/* Bottom Row: Metadata & Action buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formattedDate}</span>
          </span>
          <span className="capitalize px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
            {transaction.paymentMethod?.replace('_', ' ') || 'cash'}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(transaction)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
            title="Edit Transaction"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(transaction)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Delete Transaction"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
