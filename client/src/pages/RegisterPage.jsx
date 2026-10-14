import React, { useState } from 'react';
import {
  Flower2,
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
import DemoCredentialsButton from '../components/auth/DemoCredentialsButton';
import { validateRegisterForm } from '../utils/validation';

// Authentic Google Multicolor SVG Icon
const GoogleIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
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

export const RegisterPage = ({ onSwitchToLogin, onSuccess }) => {
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
      if (onSuccess) onSuccess(result.user);
    } else {
      setLocalAlert(result.message);
    }
  };

  // Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setLocalAlert(null);
    clearError();

    try {
      const result = await loginWithGoogle({
        email: 'dagnew.google@spendwise.et',
        name: 'Dagnew Cru',
      });

      if (result.success) {
        if (onSuccess) onSuccess(result.user);
      } else {
        setLocalAlert(result.message || 'Google Sign-In failed');
      }
    } catch (err) {
      setLocalAlert(err.message || 'An error occurred during Google Sign-In');
    } finally {
      setIsGoogleLoading(false);
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
              Create your account and start your amazing financial journey with us.
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
                Create your account
              </h2>
              <p className="text-sm sm:text-base text-slate-500 font-medium">
                Let's get started! Fill in your details below. 💜
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
                  <div className="absolute left-3.5 w-9 h-9 rounded-xl bg-[#F0EBF8] text-[#8A70D6] flex items-center justify-center pointer-events-none">
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
                    } focus:border-[#8A70D6] focus:ring-2 focus:ring-[#8A70D6]/20 rounded-2xl text-base font-medium text-slate-800 placeholder-slate-400 transition-all outline-none`}
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
                    placeholder="Create a password"
                    autoComplete="new-password"
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

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">
                  Confirm password
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 w-9 h-9 rounded-xl bg-[#F0EBF8] text-[#8A70D6] flex items-center justify-center pointer-events-none">
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
                    } focus:border-[#8A70D6] focus:ring-2 focus:ring-[#8A70D6]/20 rounded-2xl text-base font-medium text-slate-800 placeholder-slate-400 transition-all outline-none`}
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
                    className="w-5 h-5 rounded text-[#8A70D6] focus:ring-[#8A70D6] border-slate-300 accent-[#8A70D6] cursor-pointer"
                  />
                  <span>
                    I agree to the{' '}
                    <span className="text-[#8A70D6] hover:underline font-semibold cursor-pointer">
                      Terms of Service
                    </span>{' '}
                    and{' '}
                    <span className="text-[#8A70D6] hover:underline font-semibold cursor-pointer">
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
                className="w-full py-4 px-6 rounded-2xl bg-[#8A70D6] hover:bg-[#785ec5] active:scale-[0.99] text-white font-bold text-base sm:text-lg shadow-lg shadow-purple-500/30 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-3"
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

              {/* Google Sign-In Button (Microsoft Removed) */}
              <div>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading || isLoading}
                  className="w-full py-3.5 sm:py-4 px-6 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl text-sm sm:text-base font-bold text-slate-700 flex items-center justify-center gap-3 transition-all shadow-sm active:scale-[0.99] cursor-pointer disabled:opacity-50"
                  title="Sign in with your Google Account"
                >
                  {isGoogleLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-[#4285F4]" />
                      <span>Signing in with Google...</span>
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
                  mode="register"
                  onApply={({ name, email, password }) => {
                    setFormData({
                      name,
                      email,
                      password,
                      confirmPassword: password,
                    });
                    setFormErrors({});
                  }}
                />
              </div>
            </form>

            {/* Bottom Switch Link */}
            <div className="text-center pt-3 text-sm sm:text-base text-slate-500 font-medium">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-[#8A70D6] hover:text-[#785ec5] font-extrabold underline decoration-[#8A70D6]/40 cursor-pointer ml-1"
              >
                Log in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
