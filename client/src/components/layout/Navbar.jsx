import React, { useState } from 'react';
import {
  Wallet,
  Menu,
  X,
  Camera,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import ProfileAvatar from '../profile/ProfileAvatar';

export const Navbar = ({
  currentView,
  onNavigate,
  onToggleMobileSidebar,
  onOpenPhotoModal,
  onOpenAddTransaction,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (viewId) => {
    if (onNavigate) onNavigate(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FAF5F0]/90 backdrop-blur-md border-b border-[#EDE4D9] px-4 sm:px-6 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto">
        {!isAuthenticated ? (
          /* Public Header: Large SpendWise branding in the middle */
          <div className="flex items-center justify-center w-full py-0.5">
            <button
              type="button"
              onClick={() => handleTabClick('home')}
              className="flex items-center gap-3 group cursor-pointer"
              title="SpendWise Home"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform">
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
          /* Authenticated Header: Mobile menu trigger + Brand on left, User Profile on right */
          <div className="flex items-center justify-between gap-4">
            {/* Left: Mobile Sidebar Drawer Button & SpendWise Logo */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onToggleMobileSidebar}
                className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-xl border border-[#EDE4D9] transition-colors cursor-pointer"
                aria-label="Toggle navigation drawer"
                title="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => handleTabClick('dashboard')}
                className="flex items-center gap-2.5 text-left group cursor-pointer lg:hidden"
                title="Go to Financial Dashboard"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 tracking-tight text-lg leading-none">
                    SpendWise
                  </span>
                </div>
              </button>

              {/* Desktop breadcrumb / Page indicator */}
              <div className="hidden lg:flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Workspace
                </span>
                <span className="text-slate-300">/</span>
                <span className="text-sm font-extrabold text-slate-800 capitalize">
                  {currentView === 'transactions' || currentView === 'filters'
                    ? 'Ledger'
                    : currentView === 'budget'
                    ? 'Budgets & Goals'
                    : currentView === 'profile' || currentView === 'settings'
                    ? 'Profile Settings'
                    : 'Dashboard'}
                </span>
              </div>
            </div>
            {/* Right: User Profile Pill */}
            <div className="flex items-center gap-2.5">
              {/* Top-Right Profile Pill with Photo Avatar (Click opens Photo & Profile Modal) */}
              <button
                type="button"
                onClick={onOpenPhotoModal || (() => handleTabClick('profile'))}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-[#EDE4D9] bg-white hover:bg-[#F5EFEB] text-slate-700 transition-all cursor-pointer shadow-xs group"
                title="Click to update photo or view profile"
              >
                <ProfileAvatar
                  name={user?.name || 'User'}
                  avatar={user?.avatar}
                  size="sm"
                  showStatus={false}
                />
                <div className="text-left hidden sm:block">
                  <span className="text-xs font-bold text-slate-800 max-w-[110px] truncate block leading-tight">
                    {user?.name}
                  </span>
                  <span className="text-[10px] font-medium text-brand-600 block leading-tight">
                    Photo & Info
                  </span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
