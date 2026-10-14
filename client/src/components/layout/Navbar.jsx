import React, { useState } from 'react';
import {
  Wallet,
  LogIn,
  LogOut,
  UserPlus,
  Home,
  LayoutDashboard,
  Receipt,
  PieChart,
  Activity,
  Menu,
  X,
  User,
} from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import ProfileAvatar from '../profile/ProfileAvatar';

export const Navbar = ({ currentView, onNavigate }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Concise navigation tabs replacing the left sidebar items
  const navTabs = [
    { id: 'home', name: 'Home', icon: Home },
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', name: 'Ledger', icon: Receipt },
    { id: 'filters', name: 'Search & Filters', icon: PieChart },
  ];

  const handleTabClick = (viewId) => {
    if (onNavigate) onNavigate(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3 transition-all">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left: SpendWise Brand Logo & Title */}
        <button
          type="button"
          onClick={() => handleTabClick('home')}
          className="flex items-center gap-2.5 text-left group cursor-pointer"
          title="Go to SpendWise Home"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-slate-900 tracking-tight text-lg leading-none">
              SpendWise
            </span>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Personal Expense Tracker</p>
          </div>
        </button>

        {/* Center: Concise Navigation Tabs (Replaces Left Sidebar) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/60 shadow-inner">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive =
              currentView === tab.id ||
              (tab.id === 'transactions' && currentView === 'transactions') ||
              (tab.id === 'filters' && currentView === 'filters');

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-brand-700 shadow-xs border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: User Authentication & Profile Actions */}
        <div className="flex items-center gap-2.5">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => handleTabClick('profile')}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  currentView === 'profile' || currentView === 'settings'
                    ? 'bg-brand-50 border-brand-200 text-brand-700 font-semibold'
                    : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700'
                }`}
                title="View Profile Details"
              >
                <ProfileAvatar name={user.name || 'User'} size="sm" showStatus={true} />
                <span className="text-xs font-semibold max-w-[120px] truncate hidden sm:inline">
                  {user.name}
                </span>
              </button>

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
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                icon={LogIn}
                onClick={() => handleTabClick('login')}
                className={currentView === 'login' ? 'bg-slate-100 text-brand-600 font-semibold' : ''}
              >
                Sign In
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={UserPlus}
                onClick={() => handleTabClick('register')}
              >
                <span className="hidden sm:inline">Create Account</span>
                <span className="sm:hidden">Join</span>
              </Button>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg md:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-slate-200/80 space-y-1.5 animate-fade-in">
          <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Navigation Tabs
          </div>
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive =
              currentView === tab.id ||
              (tab.id === 'transactions' && currentView === 'transactions') ||
              (tab.id === 'filters' && currentView === 'filters');

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 border border-brand-200/60'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                  <span>{tab.name}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default Navbar;
