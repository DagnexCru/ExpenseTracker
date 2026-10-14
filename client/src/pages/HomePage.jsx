import React from 'react';
import {
  Wallet,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  LayoutDashboard,
  Receipt,
  PieChart,
  Globe,
  Lock,
  Database,
  Activity,
  CheckCircle2,
  Sparkles,
  Zap,
  BarChart3,
  Layers,
  Clock,
  ChevronRight,
  DollarSign,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export const HomePage = ({ onNavigate }) => {
  const { isAuthenticated, user } = useAuth();
  const currency = user?.currency || 'ETB';

  const features = [
    {
      icon: LayoutDashboard,
      title: 'Real-Time Financial Dashboard',
      description:
        'MongoDB aggregation pipelines compute net balance, monthly income, and category expenditures in sub-30ms execution times.',
      tag: 'Analytics',
      color: 'from-blue-500 to-indigo-600',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200/60',
    },
    {
      icon: Receipt,
      title: 'Full Transaction Ledger CRUD',
      description:
        'Record income and expenses with automatic category affinity, payment method tracking, and strict floating-point precision guarantees.',
      tag: 'Ledger',
      color: 'from-emerald-500 to-teal-600',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    },
    {
      icon: PieChart,
      title: 'Dynamic Search & Filter Studio',
      description:
        'Multi-criteria search with 300ms input debouncing, date range selectors, category filters, and paginated query results.',
      tag: 'Query Engine',
      color: 'from-purple-500 to-indigo-600',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200/60',
    },
    {
      icon: ShieldCheck,
      title: 'Enterprise Defense & Privacy',
      description:
        'Protected by bcrypt salted hashing, HTTP-only SameSite JWT cookies, OWASP security headers, and recursive NoSQL injection sanitizers.',
      tag: 'Security',
      color: 'from-rose-500 to-pink-600',
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200/60',
    },
    {
      icon: Globe,
      title: 'Multi-Currency Customization',
      description:
        'First-class support for ETB (Ethiopian Birr), USD, EUR, and GBP with persistent user preference storage and localized formatting.',
      tag: 'Preferences',
      color: 'from-amber-500 to-orange-600',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200/60',
    },
    {
      icon: TrendingUp,
      title: 'Smart Financial Budgeting',
      description:
        'Track net cashflow retention velocity, analyze spending ratios, and maintain full control over your financial habits.',
      tag: 'Budgeting',
      color: 'from-emerald-500 to-teal-600',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Log Daily Activity',
      description:
        'Quickly record income or categorized expenses with payment method and optional description notes.',
      icon: Receipt,
    },
    {
      step: '02',
      title: 'Analyze Instant Trends',
      description:
        'Review interactive monthly cashflow bar charts and proportional spending category donut visualizations.',
      icon: BarChart3,
    },
    {
      step: '03',
      title: 'Optimize Savings Velocity',
      description:
        'Make data-driven budgeting choices with clear net-worth metrics and isolated multi-tenant records.',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-16 pb-12 animate-fade-in">
      {/* --------------------------------------------------------------------- */}
      {/* HERO SECTION                                                          */}
      {/* --------------------------------------------------------------------- */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-2xl">
        {/* Subtle decorative glow circles */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-medium text-slate-300 backdrop-blur-md shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">SpendWise v1.0</span>
            <span className="text-slate-500">•</span>
            <span>Personal Expense Tracker</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Master Your Money With{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-300 to-emerald-400">
              Precision & Absolute Privacy.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-300 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
            Gain full control of your personal finances. Track income, monitor expenses across categories, 
            inspect real-time monthly trends, and protect your data with enterprise-grade encryption.
          </p>

          {/* Action Button Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            {isAuthenticated ? (
              <>
                <Button
                  size="lg"
                  icon={LayoutDashboard}
                  onClick={() => onNavigate && onNavigate('dashboard')}
                  className="bg-brand-500 hover:bg-brand-600 text-white font-semibold shadow-lg shadow-brand-500/30"
                >
                  Go to Financial Dashboard
                </Button>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('transactions')}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm sm:text-base font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-slate-500 shadow-md transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Receipt className="w-4 h-4 text-slate-300" />
                  <span>View Live Ledger</span>
                </button>
              </>
            ) : (
              <>
                <Button
                  size="lg"
                  icon={ArrowRight}
                  onClick={() => onNavigate && onNavigate('register')}
                  className="bg-brand-500 hover:bg-brand-600 text-white font-semibold shadow-lg shadow-brand-500/30"
                >
                  Create Free Account
                </Button>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('login')}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm sm:text-base font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-slate-500 shadow-md transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-slate-300" />
                  <span>Sign In to Account</span>
                </button>
              </>
            )}
          </div>

          {/* Trust Guarantees */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-slate-400 border-t border-slate-800/80">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Private Multi-Tenant Isolation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Bcrypt Salted Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Multi-Currency (ETB, USD, EUR, GBP)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero Third-Party Trackers</span>
            </div>
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
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Monthly Inflow
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                +50,000.00 <span className="text-xs font-medium text-slate-500">{currency}</span>
              </p>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-600">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Primary salary retainer confirmed</span>
              </div>
            </div>
          </div>

          {/* Card 2: Total Expenses */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Outflow Expenses
              </span>
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingDown className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                -6,600.00 <span className="text-xs font-medium text-slate-500">{currency}</span>
              </p>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-slate-500">
                <span>Housing (68%), Food (19%), Utilities (13%)</span>
              </div>
            </div>
          </div>

          {/* Card 3: Net Cashflow Balance */}
          <div className="bg-gradient-to-tr from-brand-700 to-indigo-800 text-white p-6 rounded-2xl border border-brand-600 shadow-md relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-brand-200 uppercase tracking-wider">
                Net Operating Balance
              </span>
              <div className="w-9 h-9 rounded-xl bg-white/10 text-brand-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                +43,400.00 <span className="text-xs font-medium text-brand-200">{currency}</span>
              </p>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-300">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>86.8% Savings retention velocity</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------- */}
      {/* CORE FEATURES GRID                                                    */}
      {/* --------------------------------------------------------------------- */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <Badge variant="indigo" className="mb-2">
            Engineered Capabilities
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Everything You Need to Master Your Personal Finances
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Built from scratch with strict software engineering practices and production MERN fundamentals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${feature.color} flex items-center justify-center text-white shadow-sm`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${feature.badgeBg}`}>
                      {feature.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* --------------------------------------------------------------------- */}
      {/* 3-STEP WORKFLOW                                                       */}
      {/* --------------------------------------------------------------------- */}
      <section className="bg-slate-100/70 rounded-3xl p-8 sm:p-12 border border-slate-200/70 space-y-8">
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
              <div key={step.step} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-brand-600 font-mono">
                    {step.step}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
                <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* --------------------------------------------------------------------- */}
      {/* FINAL CALL TO ACTION BANNER                                           */}
      {/* --------------------------------------------------------------------- */}
      <section className="bg-gradient-to-r from-brand-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-8 sm:p-12 border border-brand-800/60 shadow-xl text-center space-y-6 relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-4 relative z-10">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Take Control of Your Financial Future?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base font-normal">
            Join thousands tracking their daily transactions with zero hassle, instant categorization, and complete data privacy.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              icon={ArrowRight}
              onClick={() => onNavigate && onNavigate(isAuthenticated ? 'dashboard' : 'register')}
              className="bg-brand-500 hover:bg-brand-600 text-white font-semibold shadow-lg shadow-brand-500/25"
            >
              {isAuthenticated ? 'Open Financial Dashboard' : 'Get Started Free Today'}
            </Button>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate(isAuthenticated ? 'transactions' : 'login')}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm sm:text-base font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-slate-500 shadow-md transition-all active:scale-[0.98] cursor-pointer"
            >
              <Receipt className="w-4 h-4 text-slate-300" />
              <span>{isAuthenticated ? 'Manage Transactions' : 'Sign In'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------- */}
      {/* FOOTER                                                                */}
      {/* --------------------------------------------------------------------- */}
      <footer className="pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-brand-600 text-white flex items-center justify-center font-bold text-[10px]">
            SW
          </div>
          <span className="font-semibold text-slate-800">SpendWise Personal Expense Tracker</span>
          <span>© 2026 All Rights Reserved.</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('home')}
            className="hover:text-brand-600 transition-colors"
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('dashboard')}
            className="hover:text-brand-600 transition-colors"
          >
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('transactions')}
            className="hover:text-brand-600 transition-colors"
          >
            Transactions
          </button>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
