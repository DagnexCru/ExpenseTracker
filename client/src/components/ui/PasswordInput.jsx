import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

export const PasswordInput = ({
  label = 'Password',
  id,
  value,
  onChange,
  error,
  placeholder = '••••••••',
  required = false,
  showStrength = false,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || `password-${Math.random().toString(36).substring(2, 9)}`;

  // Calculate password strength score (0-4)
  const getStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strength = showStrength ? getStrength(value) : 0;
  const strengthLabels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = [
    'bg-slate-200',
    'bg-rose-500',
    'bg-amber-500',
    'bg-brand-500',
    'bg-emerald-500',
  ];

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative rounded-lg shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Lock className="w-4 h-4" />
        </div>

        <input
          id={inputId}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={error ? 'true' : 'false'}
          className={`block w-full rounded-lg text-sm transition-all duration-150 py-2.5 pl-9.5 pr-10 ${
            error
              ? 'border-rose-300 text-rose-900 placeholder-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-rose-50/30'
              : 'border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 bg-white hover:border-slate-400'
          }`}
          {...props}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
          tabIndex={-1}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>

      {showStrength && value && value.length > 0 && (
        <div className="mt-2 space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Password strength:</span>
            <span className="font-semibold text-slate-700">{strengthLabels[strength]}</span>
          </div>
          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden flex gap-1">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-full flex-1 transition-all duration-300 rounded-full ${
                  step <= strength ? strengthColors[strength] : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {error && (
        <p className="mt-1.5 text-xs text-rose-600 font-medium">
          {error}
        </p>
      )}
    </div>
  );
};

export default PasswordInput;
