import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Calendar,
  RefreshCw,
  PlusCircle,
  AlertCircle,
  Filter,
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-100 tracking-tight">
              Financial Dashboard
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time financial summary, monthly cashflow velocity, and category allocations
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Period Filter Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              className="bg-transparent border-none text-slate-200 text-xs focus:ring-0 focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-slate-200">
                All Time
              </option>
              <option value="this_month" className="bg-slate-900 text-slate-200">
                This Month
              </option>
              <option value="last_30_days" className="bg-slate-900 text-slate-200">
                Last 30 Days
              </option>
              <option value="this_year" className="bg-slate-900 text-slate-200">
                This Year
              </option>
            </select>
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={() => loadDashboardData(true)}
            disabled={refreshing || loading}
            className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors disabled:opacity-50"
            title="Refresh calculations"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-emerald-400' : ''}`} />
          </button>

          {/* New Transaction CTA */}
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('transactions')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-semibold text-xs shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
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
              <div key={i} className="h-28 bg-slate-800/60 rounded-2xl border border-slate-700/50" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
            <div className="lg:col-span-7 h-72 bg-slate-800/60 rounded-2xl border border-slate-700/50" />
            <div className="lg:col-span-5 h-72 bg-slate-800/60 rounded-2xl border border-slate-700/50" />
          </div>
        </div>
      ) : (
        <>
          {/* KPI Summary Cards */}
          <SummaryCards summary={summaryData?.summary} currency={currency} />

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
