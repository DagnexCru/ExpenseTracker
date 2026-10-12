import React from 'react';
import { Wallet, LogIn, LogOut, UserPlus, Activity, Menu, Globe, User } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

export const Navbar = ({ onToggleSidebar, isHealthy, onNavigate }) => {
  const { user, isAuthenticated, logout } = useAuth();

  // Extract initials from full name (e.g. "Dagnew Cru" -> "DC")
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

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

          <button
            onClick={() => onNavigate && onNavigate('health')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform">
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
          </button>
        </div>

        {/* Center/Right: System Status & User Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
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
            <span>{user?.currency || 'ETB'}</span>
          </div>

          {/* Auth State Switcher */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-600 to-slate-900 text-white flex items-center justify-center text-xs font-bold tracking-tight shadow-sm">
                  {getInitials(user.name)}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-semibold text-slate-800 leading-none">{user.name}</p>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5 truncate max-w-[140px]">{user.email}</p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                icon={LogOut}
                onClick={logout}
                className="text-slate-600 hover:text-rose-600 hover:border-rose-200"
              >
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200">
              <Button
                variant="ghost"
                size="sm"
                icon={LogIn}
                onClick={() => onNavigate && onNavigate('login')}
              >
                Sign In
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={UserPlus}
                onClick={() => onNavigate && onNavigate('register')}
              >
                <span className="hidden sm:inline">Create Account</span>
                <span className="sm:hidden">Join</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
