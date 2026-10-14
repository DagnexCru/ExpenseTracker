import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Mail,
  ShieldCheck,
  Globe,
  Calendar,
  Key,
  RefreshCw,
  LogOut,
  CheckCircle2,
  Save,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Alert from '../components/ui/Alert';
import { getUserProfileApi, updateUserProfileApi } from '../api/user';
import CurrencySelector from '../components/profile/CurrencySelector';
import SecurityLogs from '../components/profile/SecurityLogs';
import ProfileAvatar from '../components/profile/ProfileAvatar';
import SecurityAuditBadge from '../components/auth/SecurityAuditBadge';
import PasswordChangeModal from '../components/profile/PasswordChangeModal';

export const UserProfileCard = () => {
  const { user, updateUser, logout } = useAuth();

  // Form edit states
  const [name, setName] = useState(user?.name || '');
  const [currency, setCurrency] = useState(user?.currency || 'ETB');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(null);
  const [saveError, setSaveError] = useState(null);

  // Live session check states
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Sync state if user changes externally
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setCurrency(user.currency || 'ETB');
    }
  }, [user]);

  const hasChanges =
    user && (name.trim() !== (user.name || '') || currency !== (user.currency || 'ETB'));

  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    setSaveError(null);
    setSaveSuccess(null);

    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      setSaveError('Full Name must be at least 2 characters long.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await updateUserProfileApi({
        name: trimmedName,
        currency,
      });

      if (res?.data?.user) {
        updateUser(res.data.user);
        setSaveSuccess('Your profile details and currency preference were updated successfully!');
      } else {
        setSaveSuccess('Profile preferences saved!');
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        err.message ||
        'Failed to update profile preferences.';
      setSaveError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetForm = () => {
    if (user) {
      setName(user.name || '');
      setCurrency(user.currency || 'ETB');
    }
    setSaveError(null);
    setSaveSuccess(null);
  };

  const handleVerifySession = async () => {
    setIsVerifying(true);
    try {
      const data = await getUserProfileApi();
      setVerifyResult({
        success: true,
        message: 'Successfully verified live session with GET /api/users/me',
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Profile Header Card */}
      <Card className="shadow-elevation border-slate-200">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <ProfileAvatar name={user.name || 'User'} size="lg" showStatus={true} />
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    {user.name}
                  </h2>
                  <Badge variant="success" dot={true}>
                    Authenticated
                  </Badge>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Phase 6 Active
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Button
                variant="outline"
                size="sm"
                icon={Key}
                onClick={() => setIsPasswordModalOpen(true)}
                className="text-slate-600 hover:text-brand-600"
              >
                Change Password
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={LogOut}
                onClick={logout}
                className="text-slate-600 hover:text-rose-600 hover:border-rose-200"
              >
                Sign Out
              </Button>
            </div>
          </div>

          {/* Account Snapshot Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
            <div className="p-3.5 rounded-xl bg-[#FBF8F5] border border-[#EDE4D9] flex items-start gap-3">
              <Globe className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Active Currency
                </span>
                <p className="text-sm font-bold text-slate-900 mt-0.5 font-mono">
                  {user.currency || 'ETB'}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Persisted in DB</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FBF8F5] border border-[#EDE4D9] flex items-start gap-3">
              <Calendar className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Member Since
                </span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today'}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Account Created</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FBF8F5] border border-[#EDE4D9] flex items-start gap-3">
              <Key className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Session Guard
                </span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  HTTP-only JWT
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Anti-XSS Storage</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FBF8F5] border border-[#EDE4D9] flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Data Isolation
                </span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  Multi-Tenant
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Zero Data Leakage</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editable Profile & Currency Settings Form */}
      <Card className="border-slate-200 shadow-sm">
        <form onSubmit={handleSaveProfile}>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div>
                <CardTitle className="text-lg">Profile Details & Currency Preferences</CardTitle>
                <CardDescription>
                  Modify your display name and default currency preference below. Changes take effect across your dashboard immediately.
                </CardDescription>
              </div>
              {hasChanges && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                  Unsaved Changes
                </span>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {saveSuccess && (
              <Alert variant="success" title="Success" onClose={() => setSaveSuccess(null)}>
                {saveSuccess}
              </Alert>
            )}

            {saveError && (
              <Alert variant="error" title="Update Error" onClose={() => setSaveError(null)}>
                {saveError}
              </Alert>
            )}

            {/* Inputs: Display Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Input
                  label="Display Name"
                  id="profile-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  icon={UserIcon}
                  disabled={isSaving}
                  required
                />
                <p className="text-[11px] text-slate-400">
                  Visible on your navigation bar, welcome banners, and receipts.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Account Email (Primary ID)
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 text-sm cursor-not-allowed select-none"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <span className="text-[10px] font-semibold text-slate-400 bg-slate-200/80 px-2 py-0.5 rounded-md">
                        Immutable
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  Protected field. Email is strictly locked to prevent account takeover.
                </p>
              </div>
            </div>

            {/* Interactive Currency Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Select Preferred Display Currency
              </label>
              <CurrencySelector
                selectedCurrency={currency}
                onChange={(code) => setCurrency(code)}
                disabled={isSaving}
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FBF8F5] border-t border-[#EDE4D9] px-6 py-4">
            <span className="text-xs text-slate-500">
              {hasChanges
                ? 'You have unsaved adjustments. Click Save to persist them to MongoDB.'
                : 'Your profile settings are up to date with the server.'}
            </span>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                icon={RotateCcw}
                onClick={handleResetForm}
                disabled={!hasChanges || isSaving}
              >
                Discard
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="sm"
                icon={Save}
                isLoading={isSaving}
                disabled={!hasChanges}
              >
                Save Preferences
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>

      {/* Live Cookie & API Verification Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div>
              <CardTitle>Verify Live Profile Session (GET /api/users/me)</CardTitle>
              <CardDescription>
                Dispatches an authenticated query to <code className="text-brand-600 font-mono">GET /api/users/me</code> to verify database state.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              isLoading={isVerifying}
              icon={RefreshCw}
              onClick={handleVerifySession}
            >
              Verify Endpoint
            </Button>
          </div>
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
                <span>{verifyResult.success ? '✅ Session & Profile Verified' : '❌ Verification Failed'}</span>
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
            <div className="p-4 rounded-xl bg-[#FBF8F5] border border-[#EDE4D9] text-slate-500 text-xs">
              Click &quot;Verify Endpoint&quot; to test your active session against the newly mounted Express endpoint.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Defenses Summary Badge */}
      <SecurityAuditBadge />

      {/* Security and Architecture Compliance Audit */}
      <SecurityLogs />

      {/* Password Change Dialog */}
      <PasswordChangeModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
};

export default UserProfileCard;
