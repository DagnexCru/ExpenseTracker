import React, { useState } from 'react';
import { X, UserPlus, ArrowLeft, Loader2, Check } from 'lucide-react';

// Authentic Google Multicolor SVG Icon
export const GoogleIcon = ({ className = 'w-5 h-5 flex-shrink-0' }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

export const GoogleAccountChooserModal = ({ isOpen, onClose, onSelectAccount, isLoading = false }) => {
  const [customMode, setCustomMode] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [customError, setCustomError] = useState('');

  if (!isOpen) return null;

  const defaultAccounts = [
    {
      name: 'Dagnew Cru',
      email: 'dagnew.cru@gmail.com',
      avatarLetter: 'D',
      bgColor: 'bg-indigo-600',
    },
    {
      name: 'Abebe Bikila',
      email: 'abebe.test@spendwise.et',
      avatarLetter: 'A',
      bgColor: 'bg-emerald-600',
    },
  ];

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customEmail.trim()) {
      setCustomError('Email is required');
      return;
    }
    if (!emailRegex.test(customEmail.trim())) {
      setCustomError('Please enter a valid Google email address');
      return;
    }

    setCustomError('');
    onSelectAccount({
      name: customName.trim() || customEmail.split('@')[0],
      email: customEmail.trim().toLowerCase(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      {/* Modal Dialog Card */}
      <div className="w-full max-w-md bg-white rounded-[28px] sm:rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden relative animate-scale-up">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
          aria-label="Close Google account chooser"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center pt-8 pb-4 px-6 text-center border-b border-slate-100">
          <div className="w-11 h-11 rounded-full bg-slate-50 border border-slate-200/80 flex items-center justify-center shadow-xs mb-3">
            <GoogleIcon className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            {customMode ? 'Sign in with Google' : 'Choose an account'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            to continue to <span className="font-semibold text-slate-800">SpendWise</span>
          </p>
        </div>

        {/* Loading Overlay */}
        {isLoading ? (
          <div className="py-16 px-6 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-10 h-10 text-[#4285F4] animate-spin" />
            <div className="text-center">
              <p className="text-sm font-bold text-slate-800">Signing in with Google...</p>
              <p className="text-xs text-slate-500 mt-0.5">Redirecting to your financial dashboard</p>
            </div>
          </div>
        ) : customMode ? (
          /* Custom Google Account Form */
          <form onSubmit={handleCustomSubmit} className="p-6 space-y-4">
            <button
              type="button"
              onClick={() => {
                setCustomMode(false);
                setCustomError('');
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer mb-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to accounts</span>
            </button>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Google Email
              </label>
              <input
                type="email"
                value={customEmail}
                onChange={(e) => {
                  setCustomEmail(e.target.value);
                  if (customError) setCustomError('');
                }}
                placeholder="your.email@gmail.com"
                required
                autoFocus
                className="w-full px-4 py-3 bg-[#FBFBFC] hover:bg-white focus:bg-white border border-slate-200 focus:border-[#4285F4] focus:ring-2 focus:ring-[#4285F4]/20 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all"
              />
              {customError && (
                <p className="text-xs text-rose-600 font-medium">{customError}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Your Full Name (Optional)
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Dagnew Cru"
                className="w-full px-4 py-3 bg-[#FBFBFC] hover:bg-white focus:bg-white border border-slate-200 focus:border-[#4285F4] focus:ring-2 focus:ring-[#4285F4]/20 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-[#4285F4] hover:bg-[#3367D6] text-white font-bold text-sm shadow-md shadow-blue-500/20 active:scale-[0.99] transition-all cursor-pointer mt-2"
            >
              Continue to SpendWise
            </button>
          </form>
        ) : (
          /* List of Available Google Accounts */
          <div className="py-2">
            {defaultAccounts.map((account) => (
              <button
                key={account.email}
                type="button"
                onClick={() => onSelectAccount({ name: account.name, email: account.email })}
                className="w-full flex items-center gap-3.5 px-6 py-3.5 hover:bg-slate-50 transition-colors border-b border-slate-100 text-left cursor-pointer group"
              >
                <div
                  className={`w-10 h-10 rounded-full ${account.bgColor} text-white flex items-center justify-center font-bold text-base shadow-xs group-hover:scale-105 transition-transform`}
                >
                  {account.avatarLetter}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                    {account.name}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {account.email}
                  </div>
                </div>
              </button>
            ))}

            {/* Use Another Account Button */}
            <button
              type="button"
              onClick={() => setCustomMode(true)}
              className="w-full flex items-center gap-3.5 px-6 py-3.5 hover:bg-slate-50 transition-colors text-left cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shadow-2xs group-hover:bg-slate-200 transition-colors">
                <UserPlus className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Use another account
                </div>
                <div className="text-xs text-slate-500">
                  Sign in with any custom Google account
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Footnote Notice */}
        <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed text-center">
          To continue, Google will share your name, email address, language preference, and profile picture with SpendWise.
        </div>
      </div>
    </div>
  );
};

export default GoogleAccountChooserModal;
