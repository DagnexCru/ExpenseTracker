import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  User,
  Activity,
  Layers,
  Database,
  Lock,
  ChevronRight,
  X,
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const navigationItems = [
    {
      name: 'System Shell & Health',
      icon: Activity,
      active: true,
      phase: 'Phase 1',
      status: 'Active',
    },
    {
      name: 'Authentication',
      icon: Lock,
      active: false,
      phase: 'Phase 2',
      status: 'Next',
    },
    {
      name: 'Transactions CRUD',
      icon: Receipt,
      active: false,
      phase: 'Phase 3',
      status: 'Upcoming',
    },
    {
      name: 'Dashboard & Charts',
      icon: LayoutDashboard,
      active: false,
      phase: 'Phase 4',
      status: 'Upcoming',
    },
    {
      name: 'Search & Filters',
      icon: PieChart,
      active: false,
      phase: 'Phase 5',
      status: 'Upcoming',
    },
    {
      name: 'Profile & Currency',
      icon: User,
      active: false,
      phase: 'Phase 6',
      status: 'Upcoming',
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
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-white">SpendWise Core</h2>
              <p className="text-[11px] text-slate-400">MERN Workspace</p>
            </div>
          </div>
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
            return (
              <div
                key={item.name}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  item.active
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/20'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${item.active ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    item.active
                      ? 'bg-brand-700/80 text-brand-100'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.phase}
                </span>
              </div>
            );
          })}
        </div>

        {/* Database Status footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
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
