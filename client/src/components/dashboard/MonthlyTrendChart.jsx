import React, { useState } from 'react';
import { BarChart3, TrendingUp, Calendar } from 'lucide-react';

export default function MonthlyTrendChart({ monthlyData = [], currency = 'ETB' }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate maximum value for chart vertical scaling
  const maxVal = Math.max(
    ...monthlyData.map((d) => Math.max(d.income || 0, d.expenses || 0)),
    1000 // Fallback ceiling so zero doesn't cause division by zero
  );

  const chartHeight = 220;
  const paddingBottom = 40;
  const usableHeight = chartHeight - paddingBottom;

  const hasData = monthlyData.some((d) => (d.income || 0) > 0 || (d.expenses || 0) > 0);

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-700/60 p-6 shadow-xl backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-semibold text-slate-100">
              Monthly Income vs Expenses
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Cashflow comparison across consecutive calendar months
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-emerald-500"></span>
            <span className="text-slate-300 font-medium">Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-rose-500"></span>
            <span className="text-slate-300 font-medium">Expenses</span>
          </div>
        </div>
      </div>

      {!hasData ? (
        <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-800 rounded-xl">
          <Calendar className="w-10 h-10 text-slate-600 mb-2" />
          <p className="text-sm font-medium text-slate-300">No monthly transaction data</p>
          <p className="text-xs text-slate-500 mt-1">
            Recorded transactions will appear here organized by month.
          </p>
        </div>
      ) : (
        <div className="relative pt-4">
          {/* Active tooltip floating overlay */}
          {hoveredIndex !== null && monthlyData[hoveredIndex] && (
            <div className="absolute top-0 right-4 z-10 bg-slate-950/95 border border-slate-700 rounded-xl p-3 shadow-2xl backdrop-blur-md pointer-events-none transition-all">
              <p className="text-xs font-semibold text-slate-200 mb-1">
                {monthlyData[hoveredIndex].label}
              </p>
              <div className="space-y-1 text-xs font-mono">
                <div className="flex items-center justify-between gap-4 text-emerald-400">
                  <span>Income:</span>
                  <span className="font-bold">
                    +{formatMoney(monthlyData[hoveredIndex].income)} {currency}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 text-rose-400">
                  <span>Expenses:</span>
                  <span className="font-bold">
                    -{formatMoney(monthlyData[hoveredIndex].expenses)} {currency}
                  </span>
                </div>
                <div className="pt-1 border-t border-slate-800 flex items-center justify-between gap-4 text-slate-200">
                  <span>Net Flow:</span>
                  <span
                    className={`font-bold ${
                      monthlyData[hoveredIndex].net >= 0
                        ? 'text-emerald-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {monthlyData[hoveredIndex].net >= 0 ? '+' : ''}
                    {formatMoney(monthlyData[hoveredIndex].net)} {currency}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SVG Grouped Column Chart */}
          <div className="w-full overflow-x-auto">
            <svg
              className="w-full min-w-[500px]"
              viewBox={`0 0 ${Math.max(monthlyData.length * 90, 500)} ${chartHeight}`}
            >
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0.7" />
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#e11d48" stopOpacity="0.7" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                const y = usableHeight * (1 - ratio) + 10;
                return (
                  <g key={idx}>
                    <line
                      x1="0"
                      y1={y}
                      x2={Math.max(monthlyData.length * 90, 500)}
                      y2={y}
                      stroke="#334155"
                      strokeDasharray="4 4"
                      strokeOpacity="0.4"
                    />
                  </g>
                );
              })}

              {/* Columns for each month */}
              {monthlyData.map((data, index) => {
                const totalWidth = Math.max(monthlyData.length * 90, 500);
                const colWidth = totalWidth / monthlyData.length;
                const barWidth = Math.min(colWidth * 0.25, 20);
                const gap = 4;
                const centerX = colWidth * index + colWidth / 2;

                const incomeHeight =
                  maxVal > 0 ? ((data.income || 0) / maxVal) * usableHeight : 0;
                const expenseHeight =
                  maxVal > 0 ? ((data.expenses || 0) / maxVal) * usableHeight : 0;

                const incomeX = centerX - barWidth - gap / 2;
                const expenseX = centerX + gap / 2;

                const incomeY = usableHeight - incomeHeight + 10;
                const expenseY = usableHeight - expenseHeight + 10;

                const isHovered = hoveredIndex === index;

                return (
                  <g
                    key={data.monthKey || index}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="cursor-pointer"
                  >
                    {/* Hover column background highlight */}
                    {isHovered && (
                      <rect
                        x={colWidth * index + 4}
                        y="0"
                        width={colWidth - 8}
                        height={chartHeight - 20}
                        fill="#334155"
                        fillOpacity="0.2"
                        rx="8"
                      />
                    )}

                    {/* Income Bar */}
                    <rect
                      x={incomeX}
                      y={incomeY}
                      width={barWidth}
                      height={Math.max(incomeHeight, 2)}
                      rx="4"
                      fill="url(#incomeGradient)"
                      className="transition-all duration-300"
                    />

                    {/* Expense Bar */}
                    <rect
                      x={expenseX}
                      y={expenseY}
                      width={barWidth}
                      height={Math.max(expenseHeight, 2)}
                      rx="4"
                      fill="url(#expenseGradient)"
                      className="transition-all duration-300"
                    />

                    {/* Month Label */}
                    <text
                      x={centerX}
                      y={chartHeight - 12}
                      textAnchor="middle"
                      fill={isHovered ? '#f8fafc' : '#94a3b8'}
                      fontSize="11"
                      fontWeight={isHovered ? 'bold' : 'normal'}
                      className="transition-colors"
                    >
                      {data.shortMonth || data.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
