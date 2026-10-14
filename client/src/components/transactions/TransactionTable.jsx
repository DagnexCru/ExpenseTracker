import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import TransactionCard from './TransactionCard';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../constants/transactionCategories';

/**
 * Responsive transaction table with desktop table and mobile card views
 *
 * @param {Object} props
 * @param {Array} props.transactions
 * @param {Function} props.onEdit
 * @param {Function} props.onDelete
 * @param {string} [props.currency='ETB']
 */
export const TransactionTable = ({
  transactions = [],
  onEdit,
  onDelete,
  currency = 'ETB',
}) => {
  return (
    <div>
      {/* Mobile View: Render cards */}
      <div className="grid grid-cols-1 gap-3 sm:hidden">
        {transactions.map((tx) => (
          <TransactionCard
            key={tx.id}
            transaction={tx}
            onEdit={onEdit}
            onDelete={onDelete}
            currency={currency}
          />
        ))}
      </div>

      {/* Desktop / Tablet View: Render Table */}
      <div className="hidden sm:block overflow-hidden bg-white border border-[#EDE4D9] rounded-2xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#EDE4D9] bg-[#FAF5F0]/70 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE4D9]/60 text-xs">
              {transactions.map((tx) => {
                const isIncome = tx.type === 'income';
                const categoryList = isIncome ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
                const categoryMeta = categoryList.find((c) => c.name === tx.category);
                const colorBadgeClass =
                  categoryMeta?.color ||
                  (isIncome
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200');

                const formattedDate = new Date(tx.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-[#FAF5F0]/70 transition-colors group"
                  >
                    {/* Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold border ${colorBadgeClass}`}
                      >
                        {tx.category}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="py-3.5 px-4 text-slate-700 font-medium max-w-[220px] truncate">
                      {tx.description || <span className="text-slate-400 italic">No description</span>}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {formattedDate}
                    </td>

                    {/* Payment Method */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="capitalize px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">
                        {tx.paymentMethod?.replace('_', ' ') || 'cash'}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono font-bold">
                      <span
                        className={
                          isIncome ? 'text-emerald-600' : 'text-slate-900'
                        }
                      >
                        {isIncome ? '+' : '-'} {currency}{' '}
                        {new Intl.NumberFormat('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(tx.amount)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => onEdit(tx)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                          title="Edit Transaction"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(tx)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Transaction"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;
