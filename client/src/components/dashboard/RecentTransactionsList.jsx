import React from 'react';
import { ArrowUpRight, ArrowDownRight, Clock, ArrowRight } from 'lucide-react';
import { getCategoryMetadata } from '../../constants/transactionCategories';

export default function RecentTransactionsList({
  transactions = [],
  currency = 'ETB',
  onViewAll,
}) {
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="rounded-2xl bg-white border border-[#EDE4D9] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-semibold text-slate-900">Recent Transactions</h3>
        </div>
        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {transactions.length === 0 ? (
        <div className="py-8 text-center text-slate-500 text-xs">
          No recent activity recorded yet.
        </div>
      ) : (
        <div className="divide-y divide-[#EDE4D9]/60">
          {transactions.map((tx) => {
            const isIncome = tx.type === 'income';
            const meta = getCategoryMetadata(tx.category);

            return (
              <div
                key={tx.id || tx._id}
                className="py-3 flex items-center justify-between gap-4 hover:bg-[#FAF5F0] px-3 -mx-3 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                      isIncome
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        : 'bg-rose-50 text-rose-600 border-rose-100'
                    }`}
                  >
                    {isIncome ? (
                      <ArrowUpRight className="w-5 h-5" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        {tx.description || tx.category}
                      </p>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#FAF5F0] text-slate-600 border border-[#EDE4D9] font-medium">
                        {tx.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {formatDate(tx.date)}
                      {tx.paymentMethod && (
                        <span className="capitalize"> • {tx.paymentMethod.replace('_', ' ')}</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-xs font-bold font-mono ${
                      isIncome ? 'text-emerald-600' : 'text-slate-900'
                    }`}
                  >
                    {isIncome ? '+' : '-'}
                    {formatMoney(tx.amount)}
                  </span>
                  <p className="text-[10px] text-slate-400">{currency}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
