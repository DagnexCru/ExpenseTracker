import React, { useState } from 'react';
import {
  Wallet,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Check,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Alert from '../components/ui/Alert';
import { useGoogleLogin } from '@react-oauth/google';
import { validateRegisterForm } from '../utils/validation';
import { GoogleIcon } from '../components/auth/GoogleAccountChooserModal';

export const RegisterPage = ({ onSwitchToLogin, onSwitchToGoogleAuth, onSuccess }) => {
  const { register, loginWithGoogle, isLoading, error: authError, clearError } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [localAlert, setLocalAlert] = useState(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const validate = () => {
    const baseValidation = validateRegisterForm({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });

    const errors = { ...baseValidation.errors };

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirming your password is required';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!agreedToTerms) {
      errors.terms = 'Please accept the Terms of Service to continue';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (localAlert) setLocalAlert(null);
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await register({
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    });

    if (result.success) {
      if (onSuccess) onSuccess(result.user, 'dashboard');
    } else {
      setLocalAlert(result.message);
    }
  };

  // Real Google OAuth Handler using @react-oauth/google
  const handleGoogleSuccess = async (tokenResponse) => {
    setIsGoogleLoading(true);
    setLocalAlert(null);
    clearError();

    try {
      const accessToken = tokenResponse?.access_token;
      if (!accessToken) {
        throw new Error('Google did not return an access token');
      }

      const result = await loginWithGoogle({ accessToken });

      if (result.success) {
        if (onSuccess) onSuccess(result.user, 'dashboard');
      } else {
        setLocalAlert(result.message || 'Google Sign-In failed');
      }
    } catch (err) {
      setLocalAlert(err.message || 'An error occurred during Google Sign-In');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleError = (errorResponse) => {
    console.error('Google OAuth error:', errorResponse);
    setIsGoogleLoading(false);
    if (errorResponse?.type === 'popup_closed' || errorResponse?.error === 'popup_closed_by_user') {
      setLocalAlert('Google sign-in popup was closed before completing.');
    } else {
      setLocalAlert('Google Sign-In failed. Please ensure test user access and try again.');
    }
  };

  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleError,
    onNonOAuthError: handleGoogleError,
  });

  const handleGoogleButtonClick = () => {
    setLocalAlert(null);
    clearError();
    setIsGoogleLoading(true);

    const googleClientId =
      import.meta.env.VITE_GOOGLE_CLIENT_ID ||
      '197519387650-bi4vo6qid359of0l8c72278rie53n3hk.apps.googleusercontent.com';

    // 1. Direct Google Identity Services Token Client
    if (window.google?.accounts?.oauth2) {
      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: 'openid profile email',
          callback: (response) => {
            if (response.error) {
              handleGoogleError(response);
            } else {
              handleGoogleSuccess(response);
            }
          },
          error_callback: (nonOAuthErr) => {
            console.error('Non-OAuth error:', nonOAuthErr);
            handleGoogleError(nonOAuthErr);
          },
        });
        client.requestAccessToken({ prompt: 'select_account' });
        return;
      } catch (err) {
        console.warn('Direct initTokenClient error, attempting hook fallback:', err);
      }
    }

    // 2. Hook fallback
    try {
      triggerGoogleLogin();
    } catch (err) {
      console.error('Google OAuth trigger error:', err);
      setIsGoogleLoading(false);
      setLocalAlert('Google Sign-In script could not load. Please check your internet connection or ad-blocker settings.');
    }
  };

  return (
    <div className="w-full flex items-center justify-center py-6 sm:py-10 lg:py-12 animate-fade-in relative">
      {/* Soft atmospheric ambient glow blurs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-brand-300/20 via-purple-300/15 to-emerald-300/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Enlarged Outer Rounded Container with Warm Pastel Peach/Cream Styling */}
      <div className="w-full max-w-6xl xl:max-w-7xl bg-[#FAF5F0]/95 backdrop-blur-md rounded-[36px] sm:rounded-[48px] p-6 sm:p-10 lg:p-12 xl:p-14 shadow-2xl border border-[#EDE4D9] flex flex-col space-y-6 sm:space-y-8 relative overflow-hidden">
        
        {/* Top Brand Logo & Welcome Message Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#EDE4D9]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-brand-500/25">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-2xl sm:text-3xl tracking-tight block">
                SpendWise
              </span>
              <p className="text-slate-500 text-xs sm:text-sm font-medium">
                Personal Financial Management
              </p>
            </div>
          </div>

          <div className="sm:text-right space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-[#EDE4D9] text-xs font-semibold text-slate-700 shadow-2xs backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-900">Protected Workspace</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600">Bank-Grade Isolation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Create your account
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm font-normal">
              Join SpendWise today and take full control of your personal finances.
            </p>
          </div>
        </div>

        {/* 2-COLUMN SECTION: Live Fintech Showcase & Authentication Card at the EXACT SAME HEIGHT & LEVEL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-stretch flex-1">
          {/* LEFT COLUMN: Modern Fintech Dashboard Feature Showcase (Replaces Cartoon Illustration) */}
          <div className="lg:col-span-6 flex flex-col h-full">
            <div className="h-full w-full rounded-[32px] sm:rounded-[42px] overflow-hidden shadow-2xl shadow-indigo-950/15 border border-indigo-900/30 bg-gradient-to-br from-[#110D2C] via-[#1B1545] to-[#0A071E] text-white p-7 sm:p-9 lg:p-10 flex flex-col justify-between relative min-h-[500px] group">
              {/* Subtle ambient lighting orbs */}
              <div className="absolute -top-16 -right-16 w-56 h-56 bg-brand-500/25 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-500/35 transition-all duration-700" />
              <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-purple-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/30 transition-all duration-700" />

              {/* Top: Brand pill & Core Value Proposition */}
              <div className="relative z-10 space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-bold text-indigo-200 backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Designed for Real-World Financial Velocity</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
                  Master Your Money With{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-purple-300 to-indigo-200">
                    Precision & Absolute Privacy.
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                  Real-time cashflow intelligence, automated ledger categorization, and zero data leakage.
                </p>
              </div>

              {/* Center: Live Financial Snapshot Card (Matches Home Screen & Dashboard Metrics) */}
              <div className="relative z-10 my-4 space-y-3">
                <div className="rounded-2xl bg-white/10 border border-white/15 p-4 sm:p-5 backdrop-blur-xl shadow-xl space-y-3 hover:bg-white/[0.13] transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-200">
                      Net Operating Balance
                    </span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                      +92% Retained
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      +43,400.00 <span className="text-xs sm:text-sm font-semibold text-indigo-300">ETB</span>
                    </span>
                    <span className="text-xs text-emerald-300 font-semibold flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" /> Healthy Inflow
                    </span>
                  </div>

                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full w-[86%]" />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1">
                    <span>Total Inflow: <strong className="text-white">+50,000 ETB</strong></span>
                    <span>Expenses: <strong className="text-white">-6,600 ETB</strong></span>
                  </div>
                </div>

                {/* 3 Pillars of Security & Privacy */}
                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="bg-white/5 rounded-xl p-2.5 border border-white/10 backdrop-blur-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                    <span className="text-[11px] font-bold text-slate-200 block">Bank-Grade</span>
                    <span className="text-[10px] text-slate-400 block">Encryption</span>
                  </div>
                  <div className="bg-white/5 rounded-xl p-2.5 border border-white/10 backdrop-blur-sm">
                    <Lock className="w-4 h-4 text-purple-300 mx-auto mb-1" />
                    <span className="text-[11px] font-bold text-slate-200 block">100% Private</span>
                    <span className="text-[10px] text-slate-400 block">Zero Leakage</span>
                  </div>
                  <div className="bg-white/5 rounded-xl p-2.5 border border-white/10 backdrop-blur-sm">
                    <Sparkles className="w-4 h-4 text-amber-300 mx-auto mb-1" />
                    <span className="text-[11px] font-bold text-slate-200 block">Real-Time</span>
                    <span className="text-[10px] text-slate-400 block">Analytics</span>
                  </div>
                </div>
              </div>

              {/* Bottom: Guarantee Footer */}
              <div className="relative z-10 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-indigo-200/80">
                <span>Multi-Tenant Isolated Session</span>
                <span className="font-bold text-white">SpendWise Protected Session</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Floating White Account Form Card (Matched Height Level) */}
          <div className="lg:col-span-6 flex flex-col h-full">
            <div className="h-full bg-white rounded-[32px] sm:rounded-[42px] p-8 sm:p-10 lg:p-12 shadow-2xl shadow-indigo-950/8 border border-[#EDE4D9] flex flex-col justify-between space-y-6">
              {/* Form Title & Subtitle */}
              <div className="text-center space-y-2">
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  Create your account
                </h2>
                <p className="text-sm sm:text-base text-slate-500 font-medium">
                  Let's get started! Fill in your details below to begin.
                </p>
              </div>

              {/* Error or Alert Notifications */}
              {(localAlert || authError) && (
                <Alert
                  variant="error"
                  title="Registration Alert"
                  onClose={() => {
                    setLocalAlert(null);
                    clearError();
                  }}
                >
                  {localAlert || authError}
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">
                    Full name
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center pointer-events-none">
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      required
                      className={`w-full pl-[56px] pr-4 py-3.5 sm:py-4 bg-[#FBFBFC] hover:bg-white focus:bg-white border ${
                        formErrors.name ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'
                      } focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 rounded-2xl text-base font-medium text-slate-800 placeholder-slate-400 transition-all outline-none`}
                    />
                  </div>
                  {formErrors.name && (
                    <p className="text-xs text-rose-600 font-medium">{formErrors.name}</p>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">
                    Email address
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center pointer-events-none">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      autoComplete="email"
                      required
                      className={`w-full pl-[56px] pr-4 py-3.5 sm:py-4 bg-[#FBFBFC] hover:bg-white focus:bg-white border ${
                        formErrors.email ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'
                      } focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 rounded-2xl text-base font-medium text-slate-800 placeholder-slate-400 transition-all outline-none`}
                    />
                  </div>
                  {formErrors.email && (
                    <p className="text-xs text-rose-600 font-medium">{formErrors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center pointer-events-none">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      autoComplete="new-password"
                      required
                      className={`w-full pl-[56px] pr-12 py-3.5 sm:py-4 bg-[#FBFBFC] hover:bg-white focus:bg-white border ${
                        formErrors.password ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'
                      } focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 rounded-2xl text-base font-medium text-slate-800 placeholder-slate-400 transition-all outline-none`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 text-slate-400 hover:text-slate-600 p-1.5 cursor-pointer transition-colors"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="text-xs text-rose-600 font-medium">{formErrors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">
                    Confirm password
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center pointer-events-none">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      required
                      className={`w-full pl-[56px] pr-12 py-3.5 sm:py-4 bg-[#FBFBFC] hover:bg-white focus:bg-white border ${
                        formErrors.confirmPassword ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'
                      } focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 rounded-2xl text-base font-medium text-slate-800 placeholder-slate-400 transition-all outline-none`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 text-slate-400 hover:text-slate-600 p-1.5 cursor-pointer transition-colors"
                      title={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {formErrors.confirmPassword && (
                    <p className="text-xs text-rose-600 font-medium">{formErrors.confirmPassword}</p>
                  )}
                </div>

                {/* Terms of Service Checkbox */}
                <div className="pt-1">
                  <label className="flex items-center gap-3 text-sm text-slate-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="w-5 h-5 rounded text-brand-600 focus:ring-brand-500 border-slate-300 accent-brand-600 cursor-pointer"
                    />
                    <span>
                      I agree to the{' '}
                      <span className="text-brand-600 hover:text-brand-700 hover:underline font-semibold cursor-pointer">
                        Terms of Service
                      </span>{' '}
                      and{' '}
                      <span className="text-brand-600 hover:text-brand-700 hover:underline font-semibold cursor-pointer">
                        Privacy Policy
                      </span>
                    </span>
                  </label>
                  {formErrors.terms && (
                    <p className="text-xs text-rose-600 font-medium mt-1">{formErrors.terms}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 px-6 rounded-2xl bg-brand-600 hover:bg-brand-700 active:scale-[0.99] text-white font-extrabold text-base sm:text-lg shadow-lg shadow-brand-500/25 hover:shadow-brand-500/35 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-3"
                >
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <span>Sign up</span>
                  )}
                </button>

                {/* Divider: "or" */}
                <div className="relative my-4 flex items-center justify-center">
                  <div className="border-t border-slate-200 w-full" />
                  <span className="bg-white px-4 text-sm text-slate-400 font-medium absolute">
                    or
                  </span>
                </div>

                {/* Google Sign-In Button */}
                <div>
                  <button
                    type="button"
                    onClick={handleGoogleButtonClick}
                    disabled={isGoogleLoading || isLoading}
                    className="w-full py-3.5 sm:py-4 px-6 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl text-sm sm:text-base font-bold text-slate-700 flex items-center justify-center gap-3 transition-all shadow-sm active:scale-[0.99] cursor-pointer disabled:opacity-50"
                    title="Sign in with your Google Account"
                  >
                    {isGoogleLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin text-[#4285F4]" />
                        <span>Connecting to Google...</span>
                      </>
                    ) : (
                      <>
                        <GoogleIcon />
                        <span>Continue with Google</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Bottom Switch Link */}
              <div className="text-center pt-3 text-sm sm:text-base text-slate-500 font-medium">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-brand-600 hover:text-brand-700 font-extrabold underline decoration-brand-300 cursor-pointer ml-1"
                >
                  Log in
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust Badge */}
        <div className="text-xs sm:text-sm text-slate-500 text-center font-medium pt-2">
          100% Private • Bank-Grade Multi-Tenant Isolation • Real-Time Tracking
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
