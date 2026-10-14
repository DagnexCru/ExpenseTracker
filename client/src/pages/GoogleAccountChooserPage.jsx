import React, { useState } from 'react';
import {
  ArrowLeft,
  RotateCw,
  Lock,
  Star,
  User,
  ChevronDown,
  Loader2,
  Wallet,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

// Authentic Google Multicolor SVG Icon
const GoogleGLogo = ({ className = 'w-5 h-5 flex-shrink-0' }) => (
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

// Sleek dark glowing avatar matching the screenshot
const AccountAvatar = () => (
  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-900 via-zinc-800 to-slate-700 border border-zinc-700/80 flex items-center justify-center relative overflow-hidden shadow-inner flex-shrink-0">
    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
    <svg className="w-5 h-5 text-zinc-300 transform -rotate-45" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
  </div>
);

export const GoogleAccountChooserPage = ({ onNavigate, returnView = 'login' }) => {
  const { loginWithGoogle } = useAuth();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [useOtherAccount, setUseOtherAccount] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [customError, setCustomError] = useState('');

  // Accounts directly from user's screenshot
  const accounts = [
    {
      name: 'DAGNEX',
      email: 'dagnew19211921@gmail.com',
    },
    {
      name: 'DAGNEX',
      email: 'dag21192119@gmail.com',
    },
  ];

  const handleSelectAccount = async (account) => {
    setIsAuthenticating(true);
    setSelectedEmail(account.email);

    try {
      const result = await loginWithGoogle({
        email: account.email,
        name: account.name || 'DAGNEX',
      });

      if (result.success) {
        // Direct immediately to financial dashboard
        if (onNavigate) onNavigate('dashboard');
      } else {
        setIsAuthenticating(false);
      }
    } catch {
      setIsAuthenticating(false);
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const clean = customEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!clean) {
      setCustomError('Enter your Google email');
      return;
    }
    if (!emailRegex.test(clean)) {
      setCustomError('Enter a valid email address');
      return;
    }

    handleSelectAccount({
      name: customName.trim() || clean.split('@')[0],
      email: clean,
    });
  };

  return (
    <div className="min-h-screen bg-[#131314] text-[#E3E3E3] font-sans flex flex-col justify-between selection:bg-[#A8C7FA]/30 selection:text-white">
      {/* ------------------------------------------------------------------- */}
      {/* SIMULATED CHROME BROWSER BAR (Matching accounts.google.com bar)       */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-[#1F1F20] border-b border-[#303030] px-4 py-2.5 flex items-center justify-between gap-3 text-xs text-[#C4C7C5]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate(returnView)}
            className="p-1.5 hover:bg-[#2A2B2D] rounded-full text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title="Back to SpendWise"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="p-1.5 hover:bg-[#2A2B2D] rounded-full text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Reload"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        {/* Chrome Address Bar */}
        <div className="flex-1 max-w-3xl bg-[#131314] hover:bg-[#1A1A1B] border border-[#3C4043] rounded-full px-4 py-1.5 flex items-center justify-between text-xs text-zinc-300 transition-colors shadow-inner">
          <div className="flex items-center gap-2 truncate">
            <Lock className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
            <span className="text-zinc-400 font-mono">
              accounts.google.com/v3/signin/accountchooser?client_id=717762328687-iludtf96g1hinl76e4lc1b.apps.googleusercontent.com
            </span>
          </div>
          <Star className="w-3.5 h-3.5 text-zinc-500 hover:text-amber-400 cursor-pointer flex-shrink-0 ml-2" />
        </div>

        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-zinc-300">
          D
        </div>
      </div>

      {/* Progress Bar when authenticating */}
      {isAuthenticating && (
        <div className="w-full h-1 bg-[#202124] overflow-hidden">
          <div className="h-full bg-[#A8C7FA] animate-pulse w-full" />
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* MAIN GOOGLE ACCOUNT CHOOSER CONTAINER                                 */}
      {/* ------------------------------------------------------------------- */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10 sm:py-16 flex flex-col justify-center">
        {/* Top Header: "G Sign in with Google" */}
        <div className="flex items-center gap-3 mb-10">
          <GoogleGLogo className="w-6 h-6" />
          <span className="text-sm sm:text-base font-medium text-[#E3E3E3]">
            Sign in with Google
          </span>
        </div>

        {/* Split Grid matching the user's screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 lg:gap-20 items-start">
          {/* Left Column: Brand & Headline */}
          <div className="md:col-span-5 space-y-6">
            {/* SpendWise App Icon */}
            <div className="w-14 h-14 rounded-2xl bg-[#004A77] border border-[#00639B]/60 flex items-center justify-center text-[#C2E7FF] shadow-lg">
              <Wallet className="w-7 h-7" />
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-normal text-[#E3E3E3] tracking-tight">
                Choose an account
              </h1>
              <p className="text-sm sm:text-base text-[#C4C7C5]">
                to continue to{' '}
                <span className="text-[#A8C7FA] font-medium hover:underline cursor-pointer">
                  SpendWise
                </span>
              </p>
            </div>
          </div>

          {/* Right Column: Account Selection List */}
          <div className="md:col-span-7 space-y-6">
            {isAuthenticating ? (
              <div className="py-16 flex flex-col items-center justify-center space-y-4 bg-[#1E1F20] rounded-2xl border border-[#303030]">
                <Loader2 className="w-10 h-10 text-[#A8C7FA] animate-spin" />
                <p className="text-base font-medium text-[#E3E3E3]">
                  Connecting to SpendWise as {selectedEmail}...
                </p>
                <p className="text-xs text-[#C4C7C5]">Redirecting to your Financial Dashboard</p>
              </div>
            ) : useOtherAccount ? (
              /* Custom Account Form */
              <form onSubmit={handleCustomSubmit} className="bg-[#1E1F20] p-6 rounded-2xl border border-[#303030] space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#303030]">
                  <h3 className="text-base font-semibold text-[#E3E3E3]">Sign in with another Google account</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setUseOtherAccount(false);
                      setCustomError('');
                    }}
                    className="text-xs text-[#A8C7FA] hover:underline cursor-pointer"
                  >
                    Back to list
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#C4C7C5]">
                    Email or phone
                  </label>
                  <input
                    type="email"
                    value={customEmail}
                    onChange={(e) => {
                      setCustomEmail(e.target.value);
                      if (customError) setCustomError('');
                    }}
                    autoFocus
                    placeholder="Enter your Google email"
                    className="w-full px-4 py-3 bg-[#131314] border border-[#444746] focus:border-[#A8C7FA] focus:ring-1 focus:ring-[#A8C7FA] rounded-lg text-sm text-[#E3E3E3] outline-none"
                    required
                  />
                  {customError && (
                    <p className="text-xs text-[#F2B8B5]">{customError}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#C4C7C5]">
                    Full Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. DAGNEX"
                    className="w-full px-4 py-3 bg-[#131314] border border-[#444746] focus:border-[#A8C7FA] focus:ring-1 focus:ring-[#A8C7FA] rounded-lg text-sm text-[#E3E3E3] outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setUseOtherAccount(false)}
                    className="px-4 py-2 text-sm font-medium text-[#A8C7FA] hover:bg-[#2A2B2D] rounded-full transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#A8C7FA] hover:bg-[#8AB4F8] text-[#001D35] font-semibold text-sm rounded-full transition-colors cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </form>
            ) : (
              /* Account List from User Screenshot */
              <div className="space-y-1">
                {accounts.map((acc, index) => (
                  <div key={acc.email}>
                    <button
                      type="button"
                      onClick={() => handleSelectAccount(acc)}
                      className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-[#1E1F20] transition-colors text-left cursor-pointer group"
                    >
                      <AccountAvatar />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm sm:text-base font-semibold text-[#E3E3E3] group-hover:text-white transition-colors">
                          {acc.name}
                        </div>
                        <div className="text-xs sm:text-sm text-[#C4C7C5] truncate">
                          {acc.email}
                        </div>
                      </div>
                    </button>
                    {index < accounts.length - 1 && (
                      <div className="border-b border-[#303030] mx-4" />
                    )}
                  </div>
                ))}

                <div className="border-b border-[#303030] mx-4" />

                {/* Use Another Account Option */}
                <button
                  type="button"
                  onClick={() => setUseOtherAccount(true)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-[#1E1F20] transition-colors text-left cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-[#C4C7C5] group-hover:text-white transition-colors flex-shrink-0">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm sm:text-base font-medium text-[#E3E3E3] group-hover:text-white transition-colors">
                      Use another account
                    </div>
                  </div>
                </button>
              </div>
            )}

            {/* Privacy Policy & Terms Notice */}
            <div className="pt-6 text-xs sm:text-sm text-[#C4C7C5] leading-relaxed">
              Before using this app, you can review SpendWise's{' '}
              <button
                type="button"
                onClick={() => alert('SpendWise Privacy Policy: 100% Multi-Tenant Data Isolation, Zero Third-Party Trackers.')}
                className="text-[#A8C7FA] font-medium hover:underline cursor-pointer"
              >
                Privacy Policy
              </button>{' '}
              and{' '}
              <button
                type="button"
                onClick={() => alert('SpendWise Terms of Service: Free personal expense tracking under MIT license.')}
                className="text-[#A8C7FA] font-medium hover:underline cursor-pointer"
              >
                Terms of Service
              </button>
              .
            </div>
          </div>
        </div>
      </main>

      {/* ------------------------------------------------------------------- */}
      {/* BOTTOM FOOTER (Matching Google Login footer)                         */}
      {/* ------------------------------------------------------------------- */}
      <footer className="max-w-5xl w-full mx-auto px-6 py-6 border-t border-[#303030] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#C4C7C5]">
        <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
          <span>English (United States)</span>
          <ChevronDown className="w-4 h-4" />
        </div>

        <div className="flex items-center gap-6">
          <button type="button" className="hover:text-white transition-colors cursor-pointer">
            Help
          </button>
          <button type="button" className="hover:text-white transition-colors cursor-pointer">
            Privacy
          </button>
          <button type="button" className="hover:text-white transition-colors cursor-pointer">
            Terms
          </button>
        </div>
      </footer>
    </div>
  );
};

export default GoogleAccountChooserPage;
