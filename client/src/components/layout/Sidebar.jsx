import React from 'react';
import {
  Wallet,
  LayoutDashboard,
  Receipt,
  Target,
  PieChart,
  Settings,
  LogOut,
  PlusCircle,
  Camera,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import ProfileAvatar from '../profile/ProfileAvatar';

export const Sidebar = ({
  currentView,
  onNavigate,
  onOpenPhotoModal,
  onOpenAddTransaction,
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const { user, logout } = useAuth();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'transactions',
      label: 'Ledger',
      icon: Receipt,
      badge: 'Live',
    },
    {
      id: 'budget',
      label: 'Budgets & Goals',
      icon: Target,
      badge: 'New',
    },
    {
      id: 'profile',
      label: 'Profile & Security',
      icon: Settings,
      badge: null,
    },
  ];

  const handleNavClick = (viewId) => {
    if (onNavigate) onNavigate(viewId);
    if (onCloseMobile) onCloseMobile();
  };

  const handleLogout = async () => {
    await logout();
    if (onNavigate) onNavigate('home');
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#FAF5F0] border-r border-[#EDE4D9] flex flex-col justify-between transition-all duration-300 ease-in-out shadow-xl lg:shadow-none ${
          /* Responsive Mobile state */
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${
          /* Desktop collapsed vs expanded */
          isCollapsed ? 'lg:w-20' : 'lg:w-72'
        } w-72`}
      >
        {/* TOP SECTION: Brand Logo & UserProfile Card */}
        <div className="flex flex-col p-4 sm:p-5 space-y-4">
          {/* SpendWise Brand Header */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => handleNavClick('dashboard')}
              className={`flex items-center gap-3 text-left group cursor-pointer ${
                isCollapsed ? 'justify-center w-full' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform shrink-0">
                <Wallet className="w-5 h-5" />
              </div>
              {!isCollapsed && (
                <div className="overflow-hidden">
                  <span className="font-extrabold text-slate-900 tracking-tight text-xl leading-none block group-hover:text-brand-600 transition-colors">
                    SpendWise
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                    Personal Expense Tracker
                  </span>
                </div>
              )}
            </button>

            {/* Desktop Collapse Button */}
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 rounded-xl border border-[#EDE4D9] bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* USER PROFILE CARD (TOP LEFT SIDEBAR) */}
          <div
            className={`bg-white rounded-2xl border border-[#EDE4D9] shadow-xs transition-all relative overflow-hidden group ${
              isCollapsed ? 'p-2 flex flex-col items-center' : 'p-3.5'
            }`}
          >
            <div className={`flex items-center ${isCollapsed ? 'flex-col gap-2' : 'gap-3'}`}>
              {/* Profile Avatar with Photo or Initials */}
              <div className="relative shrink-0">
                <ProfileAvatar
                  name={user?.name || 'User'}
                  avatar={user?.avatar}
                  size={isCollapsed ? 'md' : 'lg'}
                  showStatus={true}
                />
                {/* Camera Overlay Icon to Set / Update Photo */}
                <button
                  type="button"
                  onClick={onOpenPhotoModal}
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-md hover:bg-brand-700 transition-transform active:scale-95 cursor-pointer"
                  title="Set or update photo"
                >
                  <Camera className="w-3 h-3" />
                </button>
              </div>

              {/* User Name, Email, and Action */}
              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-slate-900 text-sm truncate block">
                      {user?.name || 'User'}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    {user?.email}
                  </p>
                  <button
                    type="button"
                    onClick={onOpenPhotoModal}
                    className="mt-1 text-[11px] font-bold text-brand-600 hover:text-brand-700 underline decoration-brand-300 transition-colors cursor-pointer block"
                  >
                    Update Photo & Info
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Action: New Transaction Button */}
          {onOpenAddTransaction && (
            <button
              type="button"
              onClick={onOpenAddTransaction}
              className={`w-full rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold transition-all shadow-md shadow-brand-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] ${
                isCollapsed ? 'p-2.5' : 'py-2.5 px-3.5 text-xs sm:text-sm'
              }`}
              title="Add New Transaction"
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span>New Transaction</span>}
            </button>
          )}

          {/* NAVIGATION LINKS */}
          <nav className="space-y-1 pt-1">
            <div className={`px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 ${isCollapsed ? 'text-center' : ''}`}>
              {!isCollapsed ? 'Navigation' : '•••'}
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                currentView === item.id ||
                (item.id === 'transactions' && (currentView === 'transactions' || currentView === 'filters')) ||
                (item.id === 'profile' && (currentView === 'profile' || currentView === 'settings'));

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 rounded-xl transition-all font-semibold cursor-pointer ${
                    isCollapsed ? 'justify-center p-3' : 'px-3.5 py-2.5 text-sm'
                  } ${
                    isActive
                      ? 'bg-white text-brand-700 shadow-xs border border-[#EDE4D9]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                  title={item.label}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                  {!isCollapsed && (
                    <div className="flex-1 flex items-center justify-between min-w-0">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-brand-50 text-brand-600 border border-brand-200">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* BOTTOM SECTION: Currency, Security & Sign Out */}
        <div className="p-4 sm:p-5 border-t border-[#EDE4D9] space-y-3 bg-[#FAF5F0]/80">
          {!isCollapsed && (
            <div className="px-2 py-1.5 rounded-xl bg-white/70 border border-[#EDE4D9] flex items-center justify-between text-xs text-slate-600">
              <span className="font-medium text-slate-500">Currency</span>
              <span className="font-extrabold text-slate-900">{user?.currency || 'ETB'}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className={`w-full rounded-xl border border-[#EDE4D9] bg-white hover:bg-rose-50 hover:border-rose-200 text-slate-600 hover:text-rose-600 font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isCollapsed ? 'p-2.5' : 'py-2 px-3 text-xs sm:text-sm'
            }`}
            title="Sign out of account"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
