import React from 'react';
import {
  Home,
  LayoutDashboard,
  Receipt,
  PieChart,
  User,
  Activity,
  Layers,
  Database,
  Lock,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import ProfileAvatar from '../profile/ProfileAvatar';

export const Sidebar = ({ isOpen, onClose, currentView, onNavigate }) => {
  const { user, isAuthenticated } = useAuth();

  const navigationItems = [
    {
      id: 'home',
      name: 'Home & Welcome',
      icon: Home,
      phase: 'Landing',
    },
    {
      id: 'dashboard',
      name: 'Financial Dashboard',
      icon: LayoutDashboard,
      phase: 'Overview',
    },
    {
      id: 'transactions',
      name: 'Transaction Ledger',
      icon: Receipt,
      phase: 'CRUD & Live',
    },
    {
      id: 'filters',
      name: 'Search & Filtering',
      icon: PieChart,
      phase: 'Query Studio',
    },
    {
      id: isAuthenticated ? 'profile' : 'login',
      name: isAuthenticated ? 'Profile & Preferences' : 'Sign In / Register',
      icon: User,
      phase: 'Account',
    },
    {
      id: 'health',
      name: 'System Health & Shell',
      icon: Activity,
      phase: 'Diagnostics',
    },
  ];

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-5 flex items-center justify-between border-b border-slate-800">
          <button
            type="button"
            onClick={() => {
              if (onNavigate) onNavigate('home');
              if (onClose) onClose();
            }}
            className="flex items-center gap-3 text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 group-hover:scale-105 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-white group-hover:text-brand-300 transition-colors">SpendWise Core</h2>
              <p className="text-[11px] text-slate-400">Personal Expense Tracker</p>
            </div>
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Roadmap Navigation
          </div>

          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentView === item.id ||
              (item.id === 'login' && (currentView === 'login' || currentView === 'register'));

            return (
              <button
                key={item.name}
                type="button"
                onClick={() => {
                  if (onNavigate) onNavigate(item.id);
                  if (onClose) onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/20'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    isActive
                      ? 'bg-brand-700/80 text-brand-100'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.phase}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Session & Database Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 space-y-3">
          {isAuthenticated && user && (
            <div
              onClick={() => onNavigate && onNavigate('profile')}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs hover:border-slate-700 cursor-pointer transition-colors"
            >
              <ProfileAvatar name={user.name || 'User'} size="sm" showStatus={true} />
              <div className="truncate flex-1">
                <p className="font-semibold text-slate-200 truncate">{user.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2.5 text-xs">
            <Database className="w-4 h-4 text-emerald-400" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium">MongoDB Local</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <span className="text-[10px] text-slate-400 font-mono">localhost:27017</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
