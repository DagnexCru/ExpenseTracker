import React, { useState } from 'react';
import { PieChart, DollarSign, Tag, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const PALETTE = [
  '#10b981', // emerald-500
  '#06b6d4', // cyan-500
  '#3b82f6', // blue-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#f59e0b', // amber-500
  '#f97316', // orange-500
  '#14b8a6', // teal-500
  '#6366f1', // indigo-500
  '#64748b', // slate-500
];

export default function CategoryBreakdownChart({
  categoryData = {},
  activeType = 'expense',
  onTypeChange,
  currency = 'ETB',
}) {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const { categories = [], totalAmount = 0 } = categoryData;

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Calculate SVG Donut stroke-dasharray arcs
  // Radius = 65, Circumference = 2 * PI * 65 ≈ 408.407
  const radius = 65;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;
  const slices = categories.map((cat, idx) => {
    const strokeDasharray = `${(cat.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((cumulativePercent / 100) * circumference);
    cumulativePercent += cat.percentage;
    const color = PALETTE[idx % PALETTE.length];

    return {
      ...cat,
      color,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  const hasData = categories.length > 0 && totalAmount > 0;

  return (
    <div className="rounded-2xl bg-white border border-[#EDE4D9] p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-cyan-600" />
            <h3 className="text-base font-semibold text-slate-900">
              Spending by Category
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Distribution of {activeType === 'expense' ? 'outflows' : 'inflows'} by classification
          </p>
        </div>

        {/* Type toggle buttons */}
        <div className="flex bg-[#FAF5F0] p-1 rounded-xl border border-[#EDE4D9]">
          <button
            type="button"
            onClick={() => onTypeChange && onTypeChange('expense')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeType === 'expense'
                ? 'bg-white text-rose-700 shadow-sm border border-rose-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Expenses
          </button>
          <button
            type="button"
            onClick={() => onTypeChange && onTypeChange('income')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeType === 'income'
                ? 'bg-white text-emerald-700 shadow-sm border border-emerald-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Income
          </button>
        </div>
      </div>

      {!hasData ? (
        <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-[#EDE4D9] bg-[#FAF5F0]/50 rounded-xl">
          <Tag className="w-10 h-10 text-slate-400 mb-2" />
          <p className="text-sm font-semibold text-slate-700">
            No {activeType} category data
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Categorized transactions will calculate visual proportions here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* SVG Donut */}
          <div className="md:col-span-5 flex justify-center relative">
            <svg
              className="w-48 h-48 -rotate-90 transform"
              viewBox="0 0 160 160"
            >
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#EDE4D9"
                strokeWidth="18"
                fill="transparent"
              />
              {slices.map((slice, idx) => (
                <circle
                  key={slice.category}
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke={slice.color}
                  strokeWidth={hoveredCategory === slice.category ? '22' : '18'}
                  strokeDasharray={slice.strokeDasharray}
                  strokeDashoffset={slice.strokeDashoffset}
                  fill="transparent"
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredCategory(slice.category)}
                  onMouseLeave={() => setHoveredCategory(null)}
                />
              ))}
            </svg>

            {/* Donut Center Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-[10px] uppercase font-bold text-slate-500">
                {hoveredCategory || 'Total'}
              </span>
              <span className="text-sm font-extrabold font-mono text-slate-900">
                {hoveredCategory
                  ? `${formatMoney(
                      slices.find((s) => s.category === hoveredCategory)?.total || 0
                    )}`
                  : formatMoney(totalAmount)}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {hoveredCategory
                  ? `${
                      slices.find((s) => s.category === hoveredCategory)?.percentage || 0
                    }%`
                  : currency}
              </span>
            </div>
          </div>

          {/* Category List Legend */}
          <div className="md:col-span-7 space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {slices.map((slice) => (
              <div
                key={slice.category}
                onMouseEnter={() => setHoveredCategory(slice.category)}
                onMouseLeave={() => setHoveredCategory(null)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  hoveredCategory === slice.category
                    ? 'bg-[#FAF5F0] border-[#EDE4D9] shadow-sm'
                    : 'bg-[#FBF8F5] border-[#EDE4D9]/80 hover:bg-[#FAF5F0]'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: slice.color }}
                    />
                    <span className="font-semibold text-slate-800">{slice.category}</span>
                    <span className="text-[10px] text-slate-500">
                      ({slice.count} {slice.count === 1 ? 'tx' : 'txs'})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">
                      {formatMoney(slice.total)} {currency}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-white border border-[#EDE4D9] text-slate-700">
                      {slice.percentage}%
                    </span>
                  </div>
                </div>

                {/* Progress bar line */}
                <div className="w-full bg-[#FAF5F0] border border-[#EDE4D9]/60 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${slice.percentage}%`,
                      backgroundColor: slice.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
