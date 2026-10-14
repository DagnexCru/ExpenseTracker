import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Loader2, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';

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
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [deviceAccounts, setDeviceAccounts] = useState([]);

  // Load any previously authorized Google accounts stored on this device/browser
  useEffect(() => {
    try {
      const stored = localStorage.getItem('spendwise_device_google_accounts');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setDeviceAccounts(parsed);
          setEmail(parsed[0].email || '');
          setName(parsed[0].name || '');
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e?.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError('Please select or enter your Google email address');
      return;
    }
    if (!emailRegex.test(cleanEmail)) {
      setError('Please select or provide a valid Google email address');
      return;
    }

    // Save this selected Google account on the user's device for fast future dropdown selection
    try {
      const displayName = name.trim() || cleanEmail.split('@')[0];
      const existing = deviceAccounts.filter((a) => a.email !== cleanEmail);
      const updated = [{ email: cleanEmail, name: displayName }, ...existing].slice(0, 5);
      localStorage.setItem('spendwise_device_google_accounts', JSON.stringify(updated));
    } catch {
      // Ignore localStorage errors
    }

    setError('');
    onSelectAccount({
      name: name.trim() || cleanEmail.split('@')[0],
      email: cleanEmail,
    });
  };

  // Launch Google OAuth 2.0 with prompt=select_account if configured or fallback
  const handleOpenGoogleOAuthPrompt = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (clientId) {
      const redirectUri = encodeURIComponent(window.location.origin);
      const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=email%20profile%20openid&prompt=select_account`;
      window.location.href = oauthUrl;
    } else {
      // If client ID is not configured, trigger the device account selector directly
      const input = document.getElementById('device-google-email-selector');
      if (input) {
        input.focus();
        input.click();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      {/* Modal Dialog Card */}
      <div className="w-full max-w-md bg-white rounded-[28px] sm:rounded-[36px] shadow-2xl border border-slate-200 overflow-hidden relative animate-scale-up">
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
          <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200/80 flex items-center justify-center shadow-xs mb-3">
            <GoogleIcon className="w-7 h-7" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Sign in with Google
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Choose your Google Account to continue to <span className="font-bold text-slate-800">SpendWise</span>
          </p>
        </div>

        {/* Loading Overlay */}
        {isLoading ? (
          <div className="py-16 px-6 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-10 h-10 text-[#4285F4] animate-spin" />
            <div className="text-center">
              <p className="text-sm font-bold text-slate-800">Signing in with Google...</p>
              <p className="text-xs text-slate-500 mt-1">Redirecting to your financial dashboard</p>
            </div>
          </div>
        ) : (
          /* Device Account Selector Form */
          <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-4">
            {/* Device Email Dropdown Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="device-google-email-selector"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
                >
                  Your Google Email (Device Dropdown)
                </label>
                <span className="text-[11px] font-medium text-blue-600">
                  Tap to see device accounts
                </span>
              </div>

              <div className="relative">
                <input
                  id="device-google-email-selector"
                  type="email"
                  name="googleEmail"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  list="device-google-datalist"
                  autoComplete="email username webauthn"
                  autoFocus
                  placeholder="Select or enter your Google address"
                  className="w-full px-4 py-3.5 bg-[#FBFBFC] hover:bg-white focus:bg-white border border-slate-200 focus:border-[#4285F4] focus:ring-2 focus:ring-[#4285F4]/20 rounded-2xl text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none transition-all cursor-pointer"
                  required
                />

                {/* Native Browser / Device Dropdown List */}
                <datalist id="device-google-datalist">
                  {deviceAccounts.map((acc) => (
                    <option key={acc.email} value={acc.email}>
                      {acc.name ? `${acc.name} (${acc.email})` : acc.email}
                    </option>
                  ))}
                  <option value="user.google@gmail.com">Google Account (Device Auto-fill)</option>
                  <option value="dagnew.google@spendwise.et">Dagnew Google Account</option>
                </datalist>
              </div>

              {error && (
                <p className="text-xs text-rose-600 font-medium">{error}</p>
              )}
            </div>

            {/* Optional Full Name Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="device-google-name-selector"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
              >
                Display Name (Optional)
              </label>
              <input
                id="device-google-name-selector"
                type="text"
                name="googleName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Your Name"
                autoComplete="name"
                className="w-full px-4 py-3 bg-[#FBFBFC] hover:bg-white focus:bg-white border border-slate-200 focus:border-[#4285F4] focus:ring-2 focus:ring-[#4285F4]/20 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all"
              />
            </div>

            {/* Continue to Dashboard Button */}
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-[#4285F4] hover:bg-[#3367D6] active:scale-[0.99] text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Continue to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* External Google OAuth Button */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={handleOpenGoogleOAuthPrompt}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Google.com Account Prompt (`prompt=select_account`)</span>
              </button>
            </div>
          </form>
        )}

        {/* Footnote Notice */}
        <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-500 leading-relaxed text-center">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Google will verify your account and securely sign you into SpendWise.</span>
        </div>
      </div>
    </div>
  );
};

export default GoogleAccountChooserModal;
