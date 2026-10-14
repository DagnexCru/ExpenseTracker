import React from 'react';
import {
  Wallet,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  LayoutDashboard,
  Receipt,
  Lock,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export const HomePage = ({ onNavigate }) => {
  const { isAuthenticated, user } = useAuth();
  const currency = user?.currency || 'ETB';

  const workflowSteps = [
    {
      step: '01',
      title: 'Log Daily Activity',
      description:
        'Quickly record income or categorized expenses with payment method and optional description notes.',
      icon: Receipt,
      glowGradient: 'from-brand-500 via-indigo-500 to-purple-500',
      borderHover: 'hover:border-brand-300 hover:shadow-brand-500/15',
      ambientBg: 'bg-brand-500/10',
      numberColor: 'text-brand-600 group-hover:text-brand-700',
      iconBox: 'bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white group-hover:shadow-brand-500/30',
      badge: 'Zero Friction',
      tag: 'Fast Entry',
    },
    {
      step: '02',
      title: 'Analyze Instant Trends',
      description:
        'Review interactive monthly cashflow bar charts and proportional spending category donut visualizations.',
      icon: BarChart3,
      glowGradient: 'from-blue-500 via-indigo-500 to-cyan-500',
      borderHover: 'hover:border-indigo-300 hover:shadow-indigo-500/15',
      ambientBg: 'bg-indigo-500/10',
      numberColor: 'text-indigo-600 group-hover:text-indigo-700',
      iconBox: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-indigo-500/30',
      badge: 'Visual Insights',
      tag: 'Real-Time Charts',
    },
    {
      step: '03',
      title: 'Optimize Savings Velocity',
      description:
        'Make data-driven budgeting choices with clear net-worth metrics and isolated multi-tenant records.',
      icon: TrendingUp,
      glowGradient: 'from-emerald-500 via-teal-500 to-green-500',
      borderHover: 'hover:border-emerald-300 hover:shadow-emerald-500/15',
      ambientBg: 'bg-emerald-500/10',
      numberColor: 'text-emerald-600 group-hover:text-emerald-700',
      iconBox: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white group-hover:shadow-emerald-500/30',
      badge: 'Financial Growth',
      tag: 'Automated Metrics',
    },
  ];

  return (
    <div className="space-y-16 pb-12 animate-fade-in">
      {/* --------------------------------------------------------------------- */}
      {/* HERO SECTION (Open & Warm Design System)                              */}
      {/* --------------------------------------------------------------------- */}
      <section className="relative overflow-hidden pt-4 pb-6 sm:pt-8 sm:pb-10 lg:pt-10 lg:pb-12 text-center">
        {/* Soft atmospheric ambient glow blurs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-gradient-to-tr from-purple-200/40 via-brand-200/35 to-emerald-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#EDE4D9] text-xs font-semibold text-slate-700 shadow-xs backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-900">SpendWise v1.0</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600">Personal Expense Tracker</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-slate-900 max-w-4xl mx-auto">
            Master Your Money With{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600">
              Precision & Absolute Privacy.
            </span>
          </h1>

          {/* Subheading */}
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 tracking-tight max-w-3xl mx-auto">
            Ready to Take Control of Your Financial Future?
          </h2>

          {/* Combined Description */}
          <p className="text-slate-600 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
            Join thousands tracking their daily transactions with zero hassle, instant categorization, and complete data privacy.
          </p>

          {/* Action Button Row */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-3">
            {isAuthenticated ? (
              <>
                <Button
                  size="lg"
                  icon={LayoutDashboard}
                  onClick={() => onNavigate && onNavigate('dashboard')}
                  className="bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-lg shadow-brand-500/25 px-7 py-3.5 text-base cursor-pointer"
                >
                  Go to Financial Dashboard
                </Button>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('transactions')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm sm:text-base font-bold text-slate-800 bg-white hover:bg-[#F5EFEB] border border-[#EDE4D9] shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Receipt className="w-4 h-4 text-slate-600" />
                  <span>View Live Ledger</span>
                </button>
              </>
            ) : (
              <>
                <Button
                  size="lg"
                  icon={ArrowRight}
                  onClick={() => onNavigate && onNavigate('register')}
                  className="bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-lg shadow-brand-500/25 px-7 py-3.5 text-base cursor-pointer"
                >
                  Get Started Today
                </Button>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('login')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm sm:text-base font-bold text-slate-800 bg-white hover:bg-[#F5EFEB] border border-[#EDE4D9] shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-slate-600" />
                  <span>Sign In</span>
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------- */}
      {/* INTERACTIVE LIVE METRIC SIMULATION PREVIEW                            */}
      {/* --------------------------------------------------------------------- */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <Badge variant="brand" className="mb-2">
            Live Interface Architecture
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Designed for Real-World Financial Velocity
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Every metric updates automatically as transactions are recorded, edited, or categorized.
          </p>
        </div>

        {/* Live Mock Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Total Income */}
          <div
            className="bg-white p-6 rounded-2xl border border-[#EDE4D9] shadow-sm hover:shadow-xl hover:shadow-emerald-500/15 hover:border-emerald-300 transform hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 ease-out relative overflow-hidden group select-none cursor-default"
          >
            {/* Top gradient glow bar */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Ambient blur glow */}
            <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-emerald-700 transition-colors">
                Total Monthly Inflow
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center transition-all duration-300 group-hover:bg-emerald-500 group-hover:text-white group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-md group-hover:shadow-emerald-500/30">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4 relative z-10">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight group-hover:text-emerald-950 transition-colors">
                +50,000.00 <span className="text-xs font-medium text-slate-500">{currency}</span>
              </p>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-600 group-hover:translate-x-1 transition-transform duration-200">
                <Sparkles className="w-3.5 h-3.5 group-hover:animate-spin" />
                <span>Primary salary retainer confirmed</span>
              </div>
            </div>

            {/* Informational feature status on hover */}
            <div className="mt-4 pt-3 border-t border-[#EDE4D9]/60 flex items-center justify-between text-xs text-slate-400 group-hover:text-emerald-600 transition-colors relative z-10">
              <span className="font-medium">Live Cash Inflow</span>
              <span className="font-semibold text-emerald-600">Real-Time Stream</span>
            </div>
          </div>

          {/* Card 2: Total Expenses */}
          <div
            className="bg-white p-6 rounded-2xl border border-[#EDE4D9] shadow-sm hover:shadow-xl hover:shadow-rose-500/15 hover:border-rose-300 transform hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 ease-out relative overflow-hidden group select-none cursor-default"
          >
            {/* Top gradient glow bar */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-rose-400 via-pink-400 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Ambient blur glow */}
            <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-rose-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-rose-700 transition-colors">
                Total Outflow Expenses
              </span>
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center transition-all duration-300 group-hover:bg-rose-500 group-hover:text-white group-hover:scale-110 group-hover:-rotate-6 group-hover:shadow-md group-hover:shadow-rose-500/30">
                <TrendingDown className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4 relative z-10">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight group-hover:text-rose-950 transition-colors">
                -6,600.00 <span className="text-xs font-medium text-slate-500">{currency}</span>
              </p>
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 group-hover:bg-rose-50 group-hover:text-rose-700 transition-colors">
                  Housing (68%)
                </span>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 group-hover:bg-amber-50 group-hover:text-amber-700 transition-colors">
                  Food (19%)
                </span>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
                  Utilities (13%)
                </span>
              </div>
            </div>

            {/* Informational feature status on hover */}
            <div className="mt-4 pt-3 border-t border-[#EDE4D9]/60 flex items-center justify-between text-xs text-slate-400 group-hover:text-rose-600 transition-colors relative z-10">
              <span className="font-medium">Categorized Spend</span>
              <span className="font-semibold text-rose-600">Dynamic Allocation</span>
            </div>
          </div>

          {/* Card 3: Net Cashflow Balance */}
          <div
            className="bg-gradient-to-tr from-brand-700 via-indigo-700 to-brand-800 text-white p-6 rounded-2xl border border-brand-600 shadow-md hover:shadow-2xl hover:shadow-brand-500/35 hover:border-brand-400 transform hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 ease-out relative overflow-hidden group select-none cursor-default"
          >
            {/* Top gradient glow bar */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-300 via-indigo-200 to-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Ambient blur glow */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-bold text-brand-200 uppercase tracking-wider group-hover:text-white transition-colors">
                Net Operating Balance
              </span>
              <div className="w-10 h-10 rounded-xl bg-white/15 text-white flex items-center justify-center transition-all duration-300 group-hover:bg-white group-hover:text-brand-700 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg group-hover:shadow-white/20">
                <Wallet className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4 relative z-10">
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight group-hover:tracking-wide transition-all">
                +43,400.00 <span className="text-xs font-medium text-brand-200">{currency}</span>
              </p>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-300 group-hover:text-emerald-200 group-hover:translate-x-1 transition-all duration-200">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>86.8% Savings retention velocity</span>
              </div>
            </div>

            {/* Informational feature status on hover */}
            <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-brand-200 group-hover:text-white transition-colors relative z-10">
              <span className="font-medium">Total Capital Velocity</span>
              <span className="font-semibold text-emerald-300">Live Formula</span>
            </div>
          </div>
        </div>
      </section>


      {/* --------------------------------------------------------------------- */}
      {/* 3-STEP WORKFLOW                                                       */}
      {/* --------------------------------------------------------------------- */}
      <section className="bg-[#F5EFEB]/90 rounded-3xl p-8 sm:p-12 border border-[#EDE4D9] space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <Badge variant="default" className="mb-2">
            Simple 3-Step Lifecycle
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            How SpendWise Streamlines Your Financial Routine
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {workflowSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className={`bg-white p-6 rounded-2xl border border-[#EDE4D9] shadow-xs hover:shadow-xl ${step.borderHover} transform hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 ease-out space-y-3 relative overflow-hidden group select-none cursor-default`}
              >
                {/* Top gradient glow bar */}
                <div
                  className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${step.glowGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                {/* Ambient blur glow */}
                <div
                  className={`absolute -right-8 -bottom-8 w-28 h-28 ${step.ambientBg} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none`}
                />

                <div className="flex items-center justify-between relative z-10">
                  <span
                    className={`text-2xl font-black font-mono transition-transform duration-300 group-hover:scale-110 origin-left inline-block ${step.numberColor}`}
                  >
                    {step.step}
                  </span>
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-md ${step.iconBox}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="relative z-10 space-y-1">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-slate-950 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Informational badge footer */}
                <div className="pt-3 border-t border-[#EDE4D9]/60 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-slate-700 transition-colors relative z-10">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 group-hover:text-brand-600 transition-colors">
                    {step.badge}
                  </span>
                  <span className="text-xs font-medium text-slate-400 group-hover:text-slate-600 transition-colors">
                    {step.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* --------------------------------------------------------------------- */}
      {/* FOOTER                                                                */}
      {/* --------------------------------------------------------------------- */}
      <footer className="pt-8 border-t border-[#EDE4D9] flex items-center justify-center gap-2 text-xs text-slate-500 text-center">
        <div className="w-5 h-5 rounded-md bg-brand-600 text-white flex items-center justify-center font-bold text-[10px]">
          SW
        </div>
        <span className="font-semibold text-slate-800">SpendWise Personal Expense Tracker</span>
        <span>© 2026 All Rights Reserved.</span>
      </footer>
    </div>
  );
};

export default HomePage;
