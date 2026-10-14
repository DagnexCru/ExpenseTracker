import React, { useState, useEffect } from 'react';
import {
  Target,
  PiggyBank,
  TrendingUp,
  AlertTriangle,
  Plus,
  Trash2,
  CheckCircle,
  Save,
  Sparkles,
  DollarSign,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { fetchDashboardSummary } from '../api/dashboard';

export const BudgetGoalsPage = ({ onNavigate }) => {
  const { user } = useAuth();
  const currency = user?.currency || 'ETB';

  // Budget states (persisted locally per user)
  const budgetStorageKey = `spendwise_budget_${user?.id || user?._id || 'guest'}`;
  const goalsStorageKey = `spendwise_goals_${user?.id || user?._id || 'guest'}`;

  const [monthlyBudget, setMonthlyBudget] = useState(() => {
    const saved = localStorage.getItem(budgetStorageKey);
    return saved ? Number(saved) : 25000;
  });

  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState(monthlyBudget.toString());

  // Goals state
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem(goalsStorageKey);
    return saved
      ? JSON.parse(saved)
      : [
          { id: 1, name: 'Emergency Reserve Fund', target: 50000, current: 32000, category: 'Savings' },
          { id: 2, name: 'Annual Insurance & Tax', target: 12000, current: 8500, category: 'Safety' },
          { id: 3, name: 'Tech Hardware Upgrade', target: 20000, current: 7500, category: 'Personal' },
        ];
  });

  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [newGoalCurrent, setNewGoalCurrent] = useState('');
  const [showAddGoal, setShowAddGoal] = useState(false);

  // Live spending summary
  const [monthlyExpense, setMonthlyExpense] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFinancials = async () => {
      try {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
        const res = await fetchDashboardSummary({ startDate: start, endDate: end });
        const summary = res?.data?.summary || {};
        setMonthlyExpense(summary.totalExpenses || 0);
        setMonthlyIncome(summary.totalIncome || 0);
      } catch (err) {
        console.error('Failed to load budget metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    loadFinancials();
  }, []);

  const handleSaveBudget = (e) => {
    e.preventDefault();
    const val = Number(budgetInput);
    if (!isNaN(val) && val > 0) {
      setMonthlyBudget(val);
      localStorage.setItem(budgetStorageKey, val.toString());
      setIsEditingBudget(false);
    }
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newGoalName.trim() || !newGoalTarget) return;

    const newGoal = {
      id: Date.now(),
      name: newGoalName.trim(),
      target: Number(newGoalTarget),
      current: Number(newGoalCurrent) || 0,
      category: 'General',
    };

    const updated = [...goals, newGoal];
    setGoals(updated);
    localStorage.setItem(goalsStorageKey, JSON.stringify(updated));

    setNewGoalName('');
    setNewGoalTarget('');
    setNewGoalCurrent('');
    setShowAddGoal(false);
  };

  const handleDeleteGoal = (goalId) => {
    const updated = goals.filter((g) => g.id !== goalId);
    setGoals(updated);
    localStorage.setItem(goalsStorageKey, JSON.stringify(updated));
  };

  const handleDepositToGoal = (goalId, amount) => {
    const updated = goals.map((g) => {
      if (g.id === goalId) {
        return { ...g, current: Math.min(g.target, g.current + amount) };
      }
      return g;
    });
    setGoals(updated);
    localStorage.setItem(goalsStorageKey, JSON.stringify(updated));
  };

  // Calculations
  const budgetSpentPercent = monthlyBudget > 0 ? Math.min(100, Math.round((monthlyExpense / monthlyBudget) * 100)) : 0;
  const budgetRemaining = Math.max(0, monthlyBudget - monthlyExpense);
  const isOverBudget = monthlyExpense > monthlyBudget;

  const totalGoalsTarget = goals.reduce((sum, g) => sum + g.target, 0);
  const totalGoalsSaved = goals.reduce((sum, g) => sum + g.current, 0);
  const overallGoalsPercent = totalGoalsTarget > 0 ? Math.round((totalGoalsSaved / totalGoalsTarget) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EDE4D9]">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-50 text-brand-600 border border-purple-200/80">
              <Target className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Budgets & Savings Goals
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor real-time monthly spending caps and track milestones for your savings targets
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowAddGoal(true)}
            className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-2.5 sm:py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm sm:text-base shadow-md shadow-brand-500/25 hover:shadow-lg transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-5 h-5 shrink-0" />
            <span>Create New Goal</span>
          </button>
        </div>
      </div>

      {/* TOP SECTION: Monthly Budget vs Spending Progress */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDE4D9] shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#EDE4D9]/60">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Current Month Cap
              </span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  isOverBudget
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : budgetSpentPercent > 80
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {isOverBudget ? 'Budget Exceeded!' : `${100 - budgetSpentPercent}% Remaining`}
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {monthlyExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}{' '}
                <span className="text-base sm:text-lg font-medium text-slate-400">{currency}</span>
              </h2>
              <span className="text-sm font-semibold text-slate-500">
                spent of {monthlyBudget.toLocaleString()} {currency} target
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isEditingBudget ? (
              <form onSubmit={handleSaveBudget} className="flex items-center gap-2">
                <input
                  type="number"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  className="w-36 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition-colors cursor-pointer"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingBudget(false)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setBudgetInput(monthlyBudget.toString());
                  setIsEditingBudget(true);
                }}
                className="px-4 py-2 rounded-xl border border-[#EDE4D9] bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Adjust Monthly Cap
              </button>
            )}
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-600">{budgetSpentPercent}% of Monthly Allowance Used</span>
            <span className={isOverBudget ? 'text-rose-600 font-bold' : 'text-slate-500'}>
              {budgetRemaining.toLocaleString()} {currency} Left to Spend
            </span>
          </div>

          <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                isOverBudget
                  ? 'bg-gradient-to-r from-rose-500 to-red-600'
                  : budgetSpentPercent > 80
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                  : 'bg-gradient-to-r from-emerald-400 to-brand-500'
              }`}
              style={{ width: `${Math.min(100, budgetSpentPercent)}%` }}
            />
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#EDE4D9]/60">
          <div className="p-4 rounded-2xl bg-[#FAF5F0] border border-[#EDE4D9]">
            <span className="text-xs text-slate-500 font-medium">Monthly Inflow</span>
            <p className="text-lg font-black text-emerald-600 mt-1">
              +{monthlyIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF5F0] border border-[#EDE4D9]">
            <span className="text-xs text-slate-500 font-medium">Monthly Outflow</span>
            <p className="text-lg font-black text-rose-600 mt-1">
              -{monthlyExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF5F0] border border-[#EDE4D9]">
            <span className="text-xs text-slate-500 font-medium">Net Retained Cash</span>
            <p className="text-lg font-black text-brand-600 mt-1">
              {(monthlyIncome - monthlyExpense).toLocaleString(undefined, { minimumFractionDigits: 2 })}{' '}
              {currency}
            </p>
          </div>
        </div>
      </div>

      {/* SAVINGS GOALS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-brand-600" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Active Savings Targets ({goals.length})
            </h2>
          </div>

          <div className="text-xs font-semibold text-slate-500">
            Total Saved:{' '}
            <span className="font-extrabold text-slate-900">
              {totalGoalsSaved.toLocaleString()} / {totalGoalsTarget.toLocaleString()} {currency}
            </span>{' '}
            ({overallGoalsPercent}%)
          </div>
        </div>

        {/* Goal Creation Form (Inline) */}
        {showAddGoal && (
          <form
            onSubmit={handleAddGoal}
            className="p-5 bg-white rounded-2xl border-2 border-brand-300 shadow-sm space-y-4 animate-fade-in"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 text-sm">Define New Savings Goal</span>
              <button
                type="button"
                onClick={() => setShowAddGoal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Goal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Vacation Trip"
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Amount ({currency})</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="e.g., 30000"
                  value={newGoalTarget}
                  onChange={(e) => setNewGoalTarget(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Initial Saved ({currency})</label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g., 5000"
                  value={newGoalCurrent}
                  onChange={(e) => setNewGoalCurrent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddGoal(false)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                Save Target
              </button>
            </div>
          </form>
        )}

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {goals.map((goal) => {
            const percent = goal.target > 0 ? Math.min(100, Math.round((goal.current / goal.target) * 100)) : 0;
            const isCompleted = percent >= 100;

            return (
              <div
                key={goal.id}
                className="bg-white p-5 rounded-2xl border border-[#EDE4D9] shadow-xs hover:shadow-md transition-shadow space-y-4 relative group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
                      {goal.category}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-base mt-1">{goal.name}</h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="p-1 text-slate-300 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Delete goal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-500">
                      {goal.current.toLocaleString()} / {goal.target.toLocaleString()} {currency}
                    </span>
                    <span className={isCompleted ? 'text-emerald-600 font-bold' : 'text-slate-800 font-bold'}>
                      {percent}%
                    </span>
                  </div>

                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCompleted
                          ? 'bg-emerald-500'
                          : 'bg-gradient-to-r from-brand-500 via-indigo-500 to-brand-600'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {/* Quick deposit helper */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Quick Deposit:</span>
                  <div className="flex items-center gap-1">
                    {[500, 1000, 5000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handleDepositToGoal(goal.id, amt)}
                        className="px-2 py-0.5 rounded-md bg-[#FAF5F0] hover:bg-brand-50 border border-[#EDE4D9] hover:border-brand-300 text-slate-700 hover:text-brand-700 text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        +{amt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BudgetGoalsPage;
