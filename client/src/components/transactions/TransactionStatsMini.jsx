import React from 'react';
import { ArrowDownRight, ArrowUpRight, Wallet, Receipt } from 'lucide-react';
import Card, { CardContent } from '../ui/Card';

/**
 * Mini financial summary stats banner
 *
 * @param {Object} props
 * @param {Array} props.transactions
 * @param {string} [props.currency='ETB']
 */
export const TransactionStatsMini = ({ transactions = [], currency = 'ETB' }) => {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const netBalance = totalIncome - totalExpense;

  const formatMoney = (val) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Balance */}
      <Card className="border-[#EDE4D9] shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Net Balance
            </span>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                netBalance >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}
            >
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p
              className={`text-2xl font-extrabold tracking-tight tabular-nums ${
                netBalance >= 0 ? 'text-slate-900' : 'text-rose-600'
              }`}
            >
              {currency} {formatMoney(netBalance)}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Calculated from records</p>
          </div>
        </CardContent>
      </Card>

      {/* Total Income */}
      <Card className="border-[#EDE4D9] shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Income
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-emerald-600 tracking-tight tabular-nums">
              + {currency} {formatMoney(totalIncome)}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Total inflows</p>
          </div>
        </CardContent>
      </Card>

      {/* Total Expense */}
      <Card className="border-[#EDE4D9] shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Expenses
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-rose-600 tracking-tight tabular-nums">
              - {currency} {formatMoney(totalExpense)}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Total spending</p>
          </div>
        </CardContent>
      </Card>

      {/* Total Records Count */}
      <Card className="border-[#EDE4D9] shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Records
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight tabular-nums">
              {transactions.length}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Logged transactions</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionStatsMini;
