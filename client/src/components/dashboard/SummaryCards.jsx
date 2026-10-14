import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from 'lucide-react';

export default function SummaryCards({ summary, currency = 'ETB' }) {
  const {
    totalIncome = 0,
    totalExpenses = 0,
    netBalance = 0,
    savingsRate = 0,
    incomeCount = 0,
    expenseCount = 0,
  } = summary || {};

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const isNetPositive = netBalance >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Net Balance Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-[#EDE4D9] p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-[#DFD3C3]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Net Balance
          </span>
          <div
            className={`p-2 rounded-xl border ${
              isNetPositive
                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                : 'bg-rose-50 text-rose-600 border-rose-100'
            }`}
          >
            <Wallet className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span
            className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${
              isNetPositive ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {isNetPositive ? '+' : ''}
            {formatMoney(netBalance)}
          </span>
          <span className="text-xs font-medium text-slate-400">{currency}</span>
        </div>
        <div className="mt-3 flex items-center text-xs text-slate-500">
          <span
            className={`inline-flex items-center gap-0.5 font-semibold ${
              isNetPositive ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {isNetPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5" />
            )}
            {isNetPositive ? 'Surplus' : 'Deficit'}
          </span>
          <span className="mx-1.5 text-slate-300">•</span>
          <span>Income minus expenses</span>
        </div>
      </div>

      {/* 2. Total Income Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-[#EDE4D9] p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-[#DFD3C3]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Income
          </span>
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-slate-900">
            {formatMoney(totalIncome)}
          </span>
          <span className="text-xs font-medium text-slate-400">{currency}</span>
        </div>
        <div className="mt-3 flex items-center text-xs text-slate-500">
          <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            {incomeCount} {incomeCount === 1 ? 'entry' : 'entries'}
          </span>
          <span className="mx-1.5 text-slate-300">•</span>
          <span>All cash inflows</span>
        </div>
      </div>

      {/* 3. Total Expenses Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-[#EDE4D9] p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-[#DFD3C3]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Expenses
          </span>
          <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-slate-900">
            {formatMoney(totalExpenses)}
          </span>
          <span className="text-xs font-medium text-slate-400">{currency}</span>
        </div>
        <div className="mt-3 flex items-center text-xs text-slate-500">
          <span className="inline-flex items-center gap-1 text-rose-600 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            {expenseCount} {expenseCount === 1 ? 'entry' : 'entries'}
          </span>
          <span className="mx-1.5 text-slate-300">•</span>
          <span>All cash outflows</span>
        </div>
      </div>

      {/* 4. Savings Rate Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-[#EDE4D9] p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-[#DFD3C3]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Savings Rate
          </span>
          <div className="p-2 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-100">
            <PiggyBank className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-slate-900">
            {savingsRate}%
          </span>
          <span className="text-xs font-medium text-slate-400">of income</span>
        </div>
        <div className="mt-3">
          <div className="w-full bg-[#FAF5F0] border border-[#EDE4D9] rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                savingsRate >= 20
                  ? 'bg-emerald-500'
                  : savingsRate > 0
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(Math.max(savingsRate, 0), 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
