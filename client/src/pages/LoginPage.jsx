import React, { useState } from 'react';
import { Mail, Sparkles, ArrowRight, LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/ui/Input';
import PasswordInput from '../components/ui/PasswordInput';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import Card, { CardContent } from '../components/ui/Card';

export const LoginPage = ({ onSwitchToRegister, onSuccess }) => {
  const { login, isLoading, error: authError, clearError } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [localAlert, setLocalAlert] = useState(null);

  const validate = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
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

  return (
    <div className="max-w-md mx-auto py-6 sm:py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold mb-3 border border-brand-200/60">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>Secure Sign In</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome Back
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Sign in to access your transactions, categories, and analytics.
        </p>
      </div>

      {/* Main Card */}
      <Card className="shadow-elevation border-slate-200/90">
        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Error Banner */}
          {(localAlert || authError) && (
            <Alert
              variant="error"
              title="Authentication Failed"
              onClose={() => {
                setLocalAlert(null);
                clearError();
              }}
            >
              {localAlert || authError}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={formErrors.password}
              required={true}
              autoComplete="current-password"
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              icon={LogIn}
            >
              Sign In
            </Button>
          </form>

          {/* Switch to Register */}
          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="font-semibold text-brand-600 hover:text-brand-700 hover:underline inline-flex items-center gap-1"
              >
                Create Account <ArrowRight className="w-3 h-3" />
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
