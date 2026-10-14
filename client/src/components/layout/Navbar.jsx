import React, { useState } from 'react';
import {
  Wallet,
  LogOut,
  LayoutDashboard,
  Receipt,
  Menu,
  X,
} from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import ProfileAvatar from '../profile/ProfileAvatar';

export const Navbar = ({ currentView, onNavigate }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Concise navigation tabs available ONLY after user login
  const navTabs = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', name: 'Ledger', icon: Receipt },
  ];

  const handleTabClick = (viewId) => {
    if (onNavigate) onNavigate(viewId);
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    if (onNavigate) onNavigate('home');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF5F0]/90 backdrop-blur-md border-b border-[#EDE4D9] px-4 sm:px-6 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto">
        {!isAuthenticated ? (
          /* Public Header: Large SpendWise branding in the middle with NO sign-in/register buttons */
          <div className="flex items-center justify-center w-full py-0.5">
            <button
              type="button"
              onClick={() => handleTabClick('home')}
              className="flex items-center gap-3 group cursor-pointer"
              title="SpendWise Home"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform">
                <Wallet className="w-6 h-6" />
              </div>
              <div className="text-left sm:text-center">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none group-hover:text-brand-600 transition-colors">
                  SpendWise
                </span>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1">
                  Personal Expense Tracker
                </p>
              </div>
            </button>
          </div>
        ) : (
          /* Authenticated Header: Brand on left, Navigation tabs in middle, User profile & Sign Out on right */
          <div className="flex items-center justify-between gap-4">
            {/* Left: Brand */}
            <button
              type="button"
              onClick={() => handleTabClick('dashboard')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
              title="Go to Financial Dashboard"
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

            {/* Center: Navigation Tabs (ONLY available after login) */}
            <nav className="hidden md:flex items-center gap-1.5 bg-[#F2ECE3]/80 p-1.5 rounded-xl border border-[#EDE4D9] shadow-inner">
              {navTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive =
                  currentView === tab.id ||
                  (tab.id === 'transactions' && (currentView === 'transactions' || currentView === 'filters'));

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabClick(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white text-brand-700 shadow-xs border border-[#EDE4D9]'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right: User Authentication & Profile Actions */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => handleTabClick('profile')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all cursor-pointer ${
                  currentView === 'profile' || currentView === 'settings'
                    ? 'bg-brand-50 border-brand-200 text-brand-700 font-semibold'
                    : 'bg-white hover:bg-[#F5EFEB] border-[#EDE4D9] text-slate-700'
                }`}
                title="View Profile Details"
              >
                <ProfileAvatar name={user?.name || 'User'} size="sm" showStatus={true} />
                <span className="text-sm font-semibold max-w-[130px] truncate hidden sm:inline">
                  {user?.name}
                </span>
              </button>

              <Button
                variant="outline"
                size="md"
                icon={LogOut}
                onClick={handleLogout}
                className="text-slate-600 hover:text-rose-600 border-[#EDE4D9] bg-white hover:bg-[#F5EFEB]"
              >
                <span className="hidden sm:inline">Sign Out</span>
              </Button>

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
        )}
      </div>

      {/* Mobile Collapsible Navigation Menu (Only when authenticated) */}
      {isAuthenticated && mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-slate-200/80 space-y-1.5 animate-fade-in">
          <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Navigation Tabs
          </div>
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive =
              currentView === tab.id ||
              (tab.id === 'transactions' && (currentView === 'transactions' || currentView === 'filters'));

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
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
