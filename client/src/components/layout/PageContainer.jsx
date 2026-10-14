import React from 'react';

export const PageContainer = ({ title, subtitle, actions, showHeader = true, children }) => {
  return (
    <div className="flex-1 overflow-y-auto">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Page Header */}
        {showHeader && title && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight sm:text-3xl">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-1 text-sm text-slate-500 font-normal">
                  {subtitle}
                </p>
              )}
            </div>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
          </div>
        )}

        {/* Page Content */}
        {children}
      </main>
    </div>
  );
};

export default PageContainer;
