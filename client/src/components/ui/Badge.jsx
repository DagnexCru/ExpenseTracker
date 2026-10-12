import React from 'react';

export const Badge = ({
  children,
  variant = 'neutral',
  dot = false,
  className = '',
}) => {
  const variants = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    danger: 'bg-rose-50 text-rose-700 border-rose-200/80',
    warning: 'bg-amber-50 text-amber-700 border-amber-200/80',
    info: 'bg-brand-50 text-brand-700 border-brand-200/80',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const dots = {
    success: 'bg-emerald-500',
    danger: 'bg-rose-500',
    warning: 'bg-amber-500',
    info: 'bg-brand-500',
    neutral: 'bg-slate-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}
    >
      {dot && (
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dots[variant]}`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${dots[variant]}`} />
        </span>
      )}
      {children}
    </span>
  );
};

export default Badge;
