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
    <div className="rounded-2xl bg-slate-900/80 border border-slate-700/60 p-6 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-semibold text-slate-100">Recent Transactions</h3>
        </div>
        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
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
        <div className="divide-y divide-slate-800/80">
          {transactions.map((tx) => {
            const isIncome = tx.type === 'income';
            const meta = getCategoryMetadata(tx.category);

            return (
              <div
                key={tx.id || tx._id}
                className="py-3 flex items-center justify-between gap-4 hover:bg-slate-800/30 px-2 -mx-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isIncome
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-rose-500/10 text-rose-400'
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
                      <p className="text-xs font-semibold text-slate-200 truncate">
                        {tx.description || tx.category}
                      </p>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/50">
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
                      isIncome ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isIncome ? '+' : '-'}
                    {formatMoney(tx.amount)}
                  </span>
                  <p className="text-[10px] text-slate-500">{currency}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
