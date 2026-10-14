import React from 'react';
import { Lock, LogIn, Loader2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';
import Card, { CardContent } from '../ui/Card';

export const ProtectedRoute = ({ children, onRequireLogin }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated && onRequireLogin) {
      onRequireLogin();
    }
  }, [isLoading, isAuthenticated, onRequireLogin]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">
          Verifying authentication session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
