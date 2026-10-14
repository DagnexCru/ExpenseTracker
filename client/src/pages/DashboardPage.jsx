import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Calendar,
  RefreshCw,
  PlusCircle,
  AlertCircle,
  Filter,
  Target,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import SummaryCards from '../components/dashboard/SummaryCards';
import MonthlyTrendChart from '../components/dashboard/MonthlyTrendChart';
import CategoryBreakdownChart from '../components/dashboard/CategoryBreakdownChart';
import RecentTransactionsList from '../components/dashboard/RecentTransactionsList';
import Alert from '../components/ui/Alert';
import {
  fetchDashboardSummary,
  fetchMonthlyTrend,
  fetchCategoryBreakdown,
} from '../api/dashboard';

export default function DashboardPage({ onNavigate, userCurrency = 'ETB' }) {
  const [periodFilter, setPeriodFilter] = useState('all');
  const [activeCategoryType, setActiveCategoryType] = useState('expense');

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [summaryData, setSummaryData] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState({ categories: [], totalAmount: 0 });

  // Calculate date range based on periodFilter
  const getDateRange = (filter) => {
    const now = new Date();
    if (filter === 'this_month') {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return {
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0],
      };
    }
    if (filter === 'last_30_days') {
      const start = new Date(now);
      start.setDate(start.getDate() - 30);
      return {
        startDate: start.toISOString().split('T')[0],
        endDate: now.toISOString().split('T')[0],
      };
    }
    if (filter === 'this_year') {
      const start = new Date(now.getFullYear(), 0, 1);
      const end = new Date(now.getFullYear(), 11, 31);
      return {
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0],
      };
    }
    return {}; // All time
  };

  const loadDashboardData = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const dateParams = getDateRange(periodFilter);

      // Fetch summary, monthly trends, and categories in parallel
      const [summaryRes, monthlyRes, categoryRes] = await Promise.all([
        fetchDashboardSummary(dateParams),
        fetchMonthlyTrend({ months: 6 }),
        fetchCategoryBreakdown({ type: activeCategoryType, ...dateParams }),
      ]);

      setSummaryData(summaryRes.data);
      setMonthlyData(monthlyRes.data?.monthly || []);
      setCategoryData(categoryRes.data || { categories: [], totalAmount: 0 });
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
      setError(
        err.response?.data?.message ||
          'Failed to load financial calculations. Please check server connectivity.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [periodFilter, activeCategoryType]);

  const currency = userCurrency || 'ETB';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#EDE4D9]">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/80">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Financial Dashboard
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time financial summary, monthly cashflow velocity, and category allocations
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Period Filter Dropdown (Large Size) */}
          <div className="flex items-center gap-2.5 bg-white border border-[#EDE4D9] rounded-2xl px-4 py-2.5 sm:px-5 sm:py-3 text-sm sm:text-base text-slate-700 shadow-sm hover:border-slate-300 transition-colors">
            <Calendar className="w-5 h-5 text-slate-500 shrink-0" />
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              className="bg-transparent border-none text-slate-900 text-sm sm:text-base font-bold focus:ring-0 focus:outline-none cursor-pointer pr-1"
            >
              <option value="all" className="bg-white text-slate-800">
                All Time
              </option>
              <option value="this_month" className="bg-white text-slate-800">
                This Month
              </option>
              <option value="last_30_days" className="bg-white text-slate-800">
                Last 30 Days
              </option>
              <option value="this_year" className="bg-white text-slate-800">
                This Year
              </option>
            </select>
          </div>

          {/* Refresh Button (Large Size) */}
          <button
            type="button"
            onClick={() => loadDashboardData(true)}
            disabled={refreshing || loading}
            className="p-3 sm:p-3.5 rounded-2xl bg-white border border-[#EDE4D9] text-slate-600 hover:text-slate-900 hover:bg-[#FAF5F0] shadow-sm hover:shadow-md transition-all disabled:opacity-50 cursor-pointer active:scale-95"
            title="Refresh calculations"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin text-emerald-600' : ''}`} />
          </button>

          {/* New Transaction CTA (Large Size) */}
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('transactions')}
              className="inline-flex items-center gap-2.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm sm:text-base shadow-md shadow-emerald-500/25 hover:shadow-lg transition-all cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-5 h-5 shrink-0" />
              <span>Add Transaction</span>
            </button>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      {/* Loading Skeleton */}
      {loading && !refreshing ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-white/80 rounded-2xl border border-[#EDE4D9]" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
            <div className="lg:col-span-7 h-72 bg-white/80 rounded-2xl border border-[#EDE4D9]" />
            <div className="lg:col-span-5 h-72 bg-white/80 rounded-2xl border border-[#EDE4D9]" />
          </div>
        </div>
      ) : (
        <>
          {/* KPI Summary Cards */}
          <SummaryCards summary={summaryData?.summary} currency={currency} />

          {/* Monthly Budget Velocity Bar & Quick Navigator */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EDE4D9] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-brand-600 border border-purple-200/80 flex items-center justify-center shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <span>Monthly Spending Cap</span>
                    <span className="text-[10px] font-semibold text-brand-600 bg-brand-50 px-1.5 py-0.2 rounded">
                      Smart Budgeting
                    </span>
                  </span>
                  <span className="text-slate-500 font-semibold">
                    {(summaryData?.summary?.totalExpenses || 0).toLocaleString()} / 25,000 {currency}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-brand-500 to-indigo-600 transition-all duration-700"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(5, Math.round(((summaryData?.summary?.totalExpenses || 0) / 25000) * 100))
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('budget')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF5F0] hover:bg-brand-50 border border-[#EDE4D9] text-xs font-bold text-brand-700 hover:text-brand-800 transition-colors cursor-pointer shrink-0"
              >
                <span>Manage Budgets & Goals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Chart Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Monthly Trend Chart (7 cols) */}
            <div className="lg:col-span-7">
              <MonthlyTrendChart monthlyData={monthlyData} currency={currency} />
            </div>

            {/* Category Breakdown Donut Chart (5 cols) */}
            <div className="lg:col-span-5">
              <CategoryBreakdownChart
                categoryData={categoryData}
                activeType={activeCategoryType}
                onTypeChange={setActiveCategoryType}
                currency={currency}
              />
            </div>
          </div>

          {/* Recent Activity Section */}
          <RecentTransactionsList
            transactions={summaryData?.recentTransactions || []}
            currency={currency}
            onViewAll={onNavigate ? () => onNavigate('transactions') : null}
          />
        </>
      )}
    </div>
  );
}
