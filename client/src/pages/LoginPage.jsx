import React, { useState } from 'react';
import {
  Flower2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Alert from '../components/ui/Alert';
import DemoCredentialsButton from '../components/auth/DemoCredentialsButton';
import RememberMeCheckbox from '../components/auth/RememberMeCheckbox';
import { useGoogleLogin } from '@react-oauth/google';
import { validateLoginForm } from '../utils/validation';
import { GoogleIcon } from '../components/auth/GoogleAccountChooserModal';

export const LoginPage = ({ onSwitchToRegister, onSwitchToGoogleAuth, onSuccess }) => {
  const { login, loginWithGoogle, isLoading, error: authError, clearError } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [localAlert, setLocalAlert] = useState(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const validate = () => {
    const baseValidation = validateLoginForm({
      email: formData.email,
      password: formData.password,
    });

    setFormErrors(baseValidation.errors);
    return baseValidation.isValid;
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

    const result = await login({
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
    <div className="w-full flex items-center justify-center py-6 sm:py-10 lg:py-12 animate-fade-in">
      {/* Enlarged Outer Rounded Container with Warm Pastel Peach/Cream Styling */}
      <div className="w-full max-w-6xl xl:max-w-7xl bg-[#FAF5F0] rounded-[36px] sm:rounded-[48px] p-8 sm:p-12 lg:p-14 xl:p-16 shadow-2xl border border-[#EDE4D9] grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center relative overflow-hidden">
        
        {/* LEFT COLUMN: Brand, Greeting, and Enlarged Custom 3D Illustration */}
        <div className="lg:col-span-6 flex flex-col justify-between h-full space-y-8">
          {/* Top Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#8A70D6] text-white flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Flower2 className="w-6 h-6 fill-white" />
            </div>
            <span className="font-extrabold text-slate-800 text-2xl sm:text-3xl tracking-tight">
              SpendWise
            </span>
          </div>

          {/* Welcome Message */}
          <div className="space-y-3 pt-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Welcome to SpendWise! 🌸
            </h1>
            <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed">
              Log in to your account and start your amazing financial journey with us.
            </p>
          </div>

          {/* Enlarged Custom 3D Character Illustration Card */}
          <div className="rounded-3xl sm:rounded-[36px] overflow-hidden shadow-2xl border border-purple-100/90 bg-white group">
            <img
              src="/assets/auth_illustration.jpg"
              alt="SpendWise Customized Character at desk"
              className="w-full h-auto object-cover max-h-[520px] lg:max-h-[580px] group-hover:scale-[1.02] transition-transform duration-300"
            />
          </div>

          <div className="text-xs sm:text-sm text-slate-500 text-center font-medium">
            100% Private • Bank-Grade Multi-Tenant Isolation • Real-Time Tracking
          </div>
        </div>

        {/* RIGHT COLUMN: Floating White Account Form Card (Enlarged) */}
        <div className="lg:col-span-6">
          <div className="bg-white rounded-[32px] sm:rounded-[42px] p-8 sm:p-10 lg:p-12 shadow-2xl shadow-purple-950/8 border border-purple-100/80 space-y-6">
            {/* Form Title & Subtitle */}
            <div className="text-center space-y-2">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Log in to your account
              </h2>
              <p className="text-sm sm:text-base text-slate-500 font-medium">
                Let's get started! Fill in your details below. 💜
              </p>
            </div>

            {/* Error or Alert Notifications */}
            {(localAlert || authError) && (
              <Alert
                variant="error"
                title="Authentication Alert"
                onClose={() => {
                  setLocalAlert(null);
                  clearError();
                }}
              >
                {localAlert || authError}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Address */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">
                  Email address
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 w-9 h-9 rounded-xl bg-[#F0EBF8] text-[#8A70D6] flex items-center justify-center pointer-events-none">
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
                    } focus:border-[#8A70D6] focus:ring-2 focus:ring-[#8A70D6]/20 rounded-2xl text-base font-medium text-slate-800 placeholder-slate-400 transition-all outline-none`}
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
                  <div className="absolute left-3.5 w-9 h-9 rounded-xl bg-[#F0EBF8] text-[#8A70D6] flex items-center justify-center pointer-events-none">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className={`w-full pl-[56px] pr-12 py-3.5 sm:py-4 bg-[#FBFBFC] hover:bg-white focus:bg-white border ${
                      formErrors.password ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'
                    } focus:border-[#8A70D6] focus:ring-2 focus:ring-[#8A70D6]/20 rounded-2xl text-base font-medium text-slate-800 placeholder-slate-400 transition-all outline-none`}
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

              {/* Remember Me Option */}
              <div className="flex items-center justify-between pt-1">
                <RememberMeCheckbox
                  checked={rememberMe}
                  onChange={setRememberMe}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 rounded-2xl bg-[#8A70D6] hover:bg-[#785ec5] active:scale-[0.99] text-white font-bold text-base sm:text-lg shadow-lg shadow-purple-500/30 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-3"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <span>Log in</span>
                )}
              </button>

              {/* Divider: "or" */}
              <div className="relative my-4 flex items-center justify-center">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-4 text-sm text-slate-400 font-medium absolute">
                  or
                </span>
              </div>

              {/* Google Sign-In Button (Microsoft Removed) */}
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

              {/* Quick Evaluator 1-Click Auto Fill Demo */}
              <div className="pt-1">
                <DemoCredentialsButton
                  mode="login"
                  onApply={({ email, password }) => {
                    setFormData({ email, password });
                    setFormErrors({});
                  }}
                />
              </div>
            </form>

            {/* Bottom Switch Link */}
            <div className="text-center pt-3 text-sm sm:text-base text-slate-500 font-medium">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-[#8A70D6] hover:text-[#785ec5] font-extrabold underline decoration-[#8A70D6]/40 cursor-pointer ml-1"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default LoginPage;
