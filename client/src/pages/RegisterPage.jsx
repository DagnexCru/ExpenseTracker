import React, { useState } from 'react';
import { User, Mail, ShieldCheck, Sparkles, ArrowRight, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/ui/Input';
import PasswordInput from '../components/ui/PasswordInput';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import Card, { CardContent } from '../components/ui/Card';
import DemoCredentialsButton from '../components/auth/DemoCredentialsButton';

export const RegisterPage = ({ onSwitchToLogin, onSuccess }) => {
  const { register, isLoading, error: authError, clearError } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [localAlert, setLocalAlert] = useState(null);

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for field as user types
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

  return (
    <div className="max-w-md mx-auto py-6 sm:py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold mb-3 border border-brand-200/60">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>New Account Registration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Join SpendWise
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Take full control of your personal expenses and savings.
        </p>
      </div>

      {/* Main Card */}
      <Card className="shadow-elevation border-slate-200/90">
        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Error Banner */}
          {(localAlert || authError) && (
            <Alert
              variant="error"
              title="Registration Error"
              onClose={() => {
                setLocalAlert(null);
                clearError();
              }}
            >
              {localAlert || authError}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <Input
              label="Full Name"
              name="name"
              placeholder="e.g. Dagnew Cru"
              value={formData.name}
              onChange={handleChange}
              error={formErrors.name}
              icon={User}
              required={true}
              autoComplete="name"
            />

            {/* Email Address */}
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="dagnew@example.com"
              value={formData.email}
              onChange={handleChange}
              error={formErrors.email}
              icon={Mail}
              required={true}
              autoComplete="email"
            />

            {/* Password */}
            <PasswordInput
              label="Password"
              name="password"
              placeholder="Min. 6 characters"
              value={formData.password}
              onChange={handleChange}
              error={formErrors.password}
              required={true}
              showStrength={true}
              autoComplete="new-password"
            />

            {/* Confirm Password */}
            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={formErrors.confirmPassword}
              required={true}
              autoComplete="new-password"
            />

            {/* Security note */}
            <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Passwords are encrypted with bcrypt and sessions are protected by HTTP-only cookies.</span>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
            >
              Create Account
            </Button>

            {/* Reviewer / Evaluator Demo Auto-Fill */}
            <div className="pt-2">
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

          {/* Switch to Login */}
          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Already have a SpendWise account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="font-semibold text-brand-600 hover:text-brand-700 hover:underline inline-flex items-center gap-1"
              >
                Sign In <ArrowRight className="w-3 h-3" />
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
