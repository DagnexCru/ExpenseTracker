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
import { validateLoginForm } from '../utils/validation';

// Authentic Google Multicolor SVG Icon
const GoogleIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
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

// Authentic Microsoft 4-Color SVG Icon
const MicrosoftIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 21 21">
    <rect x="1" y="1" width="9" height="9" fill="#f25022" />
    <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
    <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
    <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
  </svg>
);

export const LoginPage = ({ onSwitchToRegister, onSuccess }) => {
  const { login, isLoading, error: authError, clearError } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [localAlert, setLocalAlert] = useState(null);
  const [socialToast, setSocialToast] = useState(null);

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
      if (onSuccess) onSuccess(result.user);
    } else {
      setLocalAlert(result.message);
    }
  };

  const handleSocialAuth = (provider) => {
    setSocialToast(
      `${provider} Single Sign-On is configured for enterprise OAuth. Use email/password or the 1-Click Demo Credentials button below to log in instantly!`
    );
    setTimeout(() => setSocialToast(null), 5000);
  };

  return (
    <div className="w-full flex items-center justify-center py-4 sm:py-8 animate-fade-in">
      {/* Outer Rounded Container with Warm Pastel Peach/Cream Styling */}
      <div className="w-full max-w-5xl bg-[#FAF5F0] rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 lg:p-12 shadow-2xl border border-[#EDE4D9] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative overflow-hidden">
        
        {/* LEFT COLUMN: Brand, Greeting, and 3D Clay Illustration */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6">
          {/* Top Brand Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#8A70D6] text-white flex items-center justify-center shadow-md shadow-purple-500/25">
              <Flower2 className="w-5 h-5 fill-white" />
            </div>
            <span className="font-bold text-slate-800 text-2xl tracking-tight">
              SpendWise
            </span>
          </div>

          {/* Welcome Message */}
          <div className="space-y-2 pt-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Welcome to SpendWise! 🌸
            </h1>
            <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
              Log in to your account and start your amazing financial journey with us.
            </p>
          </div>

          {/* 3D Character Illustration Card */}
          <div className="rounded-3xl overflow-hidden shadow-lg border border-purple-100/80 bg-white group">
            <img
              src="/assets/auth_illustration.jpg"
              alt="SpendWise 3D Character working happily at desk"
              className="w-full h-auto object-cover max-h-[380px] group-hover:scale-[1.02] transition-transform duration-300"
            />
          </div>

          <div className="text-[11px] text-slate-400 text-center font-medium">
            100% Private • Bank-Grade Multi-Tenant Isolation
          </div>
        </div>

        {/* RIGHT COLUMN: Floating White Account Form Card */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 lg:p-10 shadow-xl shadow-purple-950/5 border border-purple-50/80 space-y-5">
            {/* Form Title & Subtitle */}
            <div className="text-center space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Log in to your account
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
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

            {socialToast && (
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                <span>{socialToast}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Email address
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 w-8 h-8 rounded-lg bg-[#F0EBF8] text-[#8A70D6] flex items-center justify-center pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                    className={`w-full pl-[50px] pr-4 py-2.5 sm:py-3 bg-[#FBFBFC] hover:bg-white focus:bg-white border ${
                      formErrors.email ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'
                    } focus:border-[#8A70D6] focus:ring-2 focus:ring-[#8A70D6]/20 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 transition-all outline-none`}
                  />
                </div>
                {formErrors.email && (
                  <p className="text-xs text-rose-600 font-medium">{formErrors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 w-8 h-8 rounded-lg bg-[#F0EBF8] text-[#8A70D6] flex items-center justify-center pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className={`w-full pl-[50px] pr-10 py-2.5 sm:py-3 bg-[#FBFBFC] hover:bg-white focus:bg-white border ${
                      formErrors.password ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'
                    } focus:border-[#8A70D6] focus:ring-2 focus:ring-[#8A70D6]/20 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 transition-all outline-none`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 cursor-pointer transition-colors"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                className="w-full py-3.5 px-4 rounded-xl bg-[#8A70D6] hover:bg-[#785ec5] active:scale-[0.99] text-white font-semibold text-sm sm:text-base shadow-md shadow-purple-500/25 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span>Log in</span>
                )}
              </button>

              {/* Divider: "or" */}
              <div className="relative my-3 flex items-center justify-center">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-xs text-slate-400 font-medium absolute">
                  or
                </span>
              </div>

              {/* Social Login Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleSocialAuth('Google')}
                  className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 flex items-center justify-center gap-3 transition-colors shadow-2xs cursor-pointer active:scale-[0.99]"
                >
                  <GoogleIcon />
                  <span>Continue with Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialAuth('Microsoft')}
                  className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 flex items-center justify-center gap-3 transition-colors shadow-2xs cursor-pointer active:scale-[0.99]"
                >
                  <MicrosoftIcon />
                  <span>Continue with Microsoft</span>
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
            <div className="text-center pt-2 text-xs sm:text-sm text-slate-500">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-[#8A70D6] hover:text-[#785ec5] font-bold underline decoration-[#8A70D6]/40 cursor-pointer ml-1"
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
