import React from 'react';
import { Lock, LogIn, Loader2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';
import Card, { CardContent } from '../ui/Card';

export const ProtectedRoute = ({ children, onRequireLogin }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

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
    return (
      <div className="max-w-lg mx-auto py-12 px-4">
        <Card className="text-center shadow-card-hover border-slate-200">
          <CardContent className="p-8 space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 mx-auto shadow-sm">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                Authentication Required
              </h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                This section contains private financial data and is protected. Please sign in to your SpendWise account to access transactions and analytics.
              </p>
            </div>
            <div className="pt-2 flex justify-center">
              <Button
                variant="primary"
                size="md"
                icon={LogIn}
                onClick={onRequireLogin}
              >
                Sign In to Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
