import React, { useState } from 'react';
import { User, Mail, ShieldCheck, Globe, Calendar, Key, RefreshCw, LogOut, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { getMeApi } from '../api/auth';
import CurrencySelector from '../components/profile/CurrencySelector';
import SecurityLogs from '../components/profile/SecurityLogs';

export const UserProfileCard = () => {
  const { user, logout } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);

  const handleVerifySession = async () => {
    setIsVerifying(true);
    try {
      const data = await getMeApi();
      setVerifyResult({
        success: true,
        message: 'Verified active HTTP-only JWT cookie with server',
        timestamp: new Date().toLocaleTimeString(),
        userData: data.data.user,
      });
    } catch (err) {
      setVerifyResult({
        success: false,
        message: err.response?.data?.message || err.message,
        timestamp: new Date().toLocaleTimeString(),
      });
    } finally {
      setIsVerifying(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <Card className="shadow-elevation border-slate-200">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-slate-900 text-white flex items-center justify-center text-xl font-bold tracking-tight shadow-md shadow-brand-500/20">
                {user.name ? user.name.substring(0, 2).toUpperCase() : 'US'}
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    {user.name}
                  </h2>
                  <Badge variant="success" dot={true}>
                    Authenticated
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{user.email}</p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              icon={LogOut}
              onClick={logout}
              className="text-slate-600 hover:text-rose-600 hover:border-rose-200 self-start sm:self-auto"
            >
              Sign Out
            </Button>
          </div>

          {/* Account Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start gap-3">
              <Globe className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Default Display Currency
                </span>
                <p className="text-base font-bold text-slate-900 mt-0.5 font-mono">
                  {user.currency || 'ETB'} (Ethiopian Birr)
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Configurable in Profile Settings</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start gap-3">
              <Calendar className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Member Since
                </span>
                <p className="text-base font-bold text-slate-900 mt-0.5">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">MongoDB Document Created</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start gap-3">
              <Key className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Session Token Transport
                </span>
                <p className="text-base font-bold text-slate-900 mt-0.5">
                  HTTP-only Secure Cookie
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Protected against XSS & script theft</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Password Encryption
                </span>
                <p className="text-base font-bold text-slate-900 mt-0.5">
                  bcrypt Salted Hash (10 Rounds)
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Never returned in API responses</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Cookie Verification Card */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Verify Cookie Authentication Session</CardTitle>
            <CardDescription>
              Dispatches a live request to <code className="text-brand-600 font-mono">GET /api/auth/me</code> with credentials
            </CardDescription>
          </div>
          <Button
            variant="primary"
            size="sm"
            isLoading={isVerifying}
            icon={RefreshCw}
            onClick={handleVerifySession}
          >
            Verify Session with API
          </Button>
        </CardHeader>
        <CardContent>
          {verifyResult ? (
            <div
              className={`p-4 rounded-xl border text-xs font-mono space-y-2 ${
                verifyResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-center justify-between font-sans font-semibold">
                <span>{verifyResult.success ? '✅ Session Verified Active' : '❌ Session Check Failed'}</span>
                <span className="text-[10px] text-slate-500 font-normal">{verifyResult.timestamp}</span>
              </div>
              <p>{verifyResult.message}</p>
              {verifyResult.userData && (
                <pre className="bg-white/80 p-3 rounded-lg overflow-x-auto text-[11px] border border-emerald-100">
                  {JSON.stringify(verifyResult.userData, null, 2)}
                </pre>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-xs">
              Click &quot;Verify Session with API&quot; to test your browser&apos;s automatic HTTP-only cookie exchange with the Express backend.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Currency Preference Selector */}
      <CurrencySelector currentCurrency={user.currency || 'ETB'} />

      {/* Security and Architecture Compliance Audit */}
      <SecurityLogs />
    </div>
  );
};

export default UserProfileCard;
