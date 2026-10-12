import React from 'react';

/**
 * Glassmorphic container card for authentication views.
 *
 * @param {Object} props
 * @param {string} props.title - Main header title
 * @param {string} props.subtitle - Descriptive subtitle
 * @param {React.ReactNode} props.children - Form contents
 */
export const AuthCard = ({ title, subtitle, children, className = '' }) => {
  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-emerald-950/20 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand header */}
        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black text-2xl shadow-lg shadow-emerald-500/30 mb-4 transform hover:scale-105 transition-transform duration-300">
            S
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        {/* Content body */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthCard;
