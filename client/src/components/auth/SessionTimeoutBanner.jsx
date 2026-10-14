import React from 'react';

/**
 * Toast / banner warning when session is near expiration or token needs refresh.
 *
 * @param {Object} props
 * @param {boolean} props.visible
 * @param {Function} props.onRefresh
 * @param {Function} props.onDismiss
 */
export const SessionTimeoutBanner = ({ visible, onRefresh, onDismiss }) => {
  if (!visible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full bg-white border border-[#EDE4D9] rounded-2xl p-4 shadow-2xl flex items-start gap-3 animate-slideDown">
      <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center shrink-0">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-bold text-slate-900">Session Expiring Soon</h4>
        <p className="text-xs text-slate-500 mt-0.5">
          Your secure authentication session will expire shortly. Would you like to stay signed in?
        </p>
        <div className="mt-3 flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
            >
              Extend Session
            </button>
          )}
          <button
            onClick={onDismiss}
            className="text-xs font-medium px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeoutBanner;
