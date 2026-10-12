import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export const Alert = ({
  children,
  title,
  variant = 'error',
  onClose,
  className = '',
}) => {
  const configs = {
    error: {
      container: 'bg-rose-50 border-rose-200 text-rose-800',
      icon: AlertCircle,
      iconColor: 'text-rose-600',
      closeColor: 'text-rose-500 hover:text-rose-700 hover:bg-rose-100',
    },
    success: {
      container: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
      closeColor: 'text-emerald-500 hover:text-emerald-700 hover:bg-emerald-100',
    },
    warning: {
      container: 'bg-amber-50 border-amber-200 text-amber-800',
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
      closeColor: 'text-amber-500 hover:text-amber-700 hover:bg-amber-100',
    },
    info: {
      container: 'bg-brand-50 border-brand-200 text-brand-800',
      icon: Info,
      iconColor: 'text-brand-600',
      closeColor: 'text-brand-500 hover:text-brand-700 hover:bg-brand-100',
    },
  };

  const config = configs[variant] || configs.info;
  const Icon = config.icon;

  return (
    <div
      role="alert"
      className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${config.container} ${className}`}
    >
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${config.iconColor}`} />
      <div className="flex-1 text-xs sm:text-sm">
        {title && <h4 className="font-semibold mb-0.5">{title}</h4>}
        <div className="leading-relaxed">{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className={`p-1 -mr-1 -mt-1 rounded-lg transition-colors ${config.closeColor}`}
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
