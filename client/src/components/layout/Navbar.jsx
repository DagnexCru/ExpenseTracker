import React from 'react';
import { Wallet, Bell, ShieldCheck, Activity, Menu, Globe } from 'lucide-react';
import Badge from '../ui/Badge';

export const Navbar = ({ onToggleSidebar, isHealthy, uptime }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left: Mobile Menu Trigger & Brand Name */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 -ml-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg lg:hidden"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/25">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 tracking-tight text-lg leading-none">
                  SpendWise
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-brand-50 text-brand-700 px-1.5 py-0.5 rounded border border-brand-200/60">
                  MERN
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Personal Expense Tracker</p>
            </div>
          </div>
        </div>

        {/* Center/Right: Live System Status & Account Preview */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Live Backend Connection Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200/60">
            <Activity className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-600 font-medium">API:</span>
            <Badge variant={isHealthy ? 'success' : 'danger'} dot={true}>
              {isHealthy ? 'Online (5000)' : 'Offline'}
            </Badge>
          </div>

          {/* Currency Preference Pill */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100/80 rounded-lg text-xs font-semibold text-slate-700">
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>ETB</span>
          </div>

          {/* User Placeholder */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold tracking-tight">
              DC
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-slate-800 leading-none">DagnexCru</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Developer Mode</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
