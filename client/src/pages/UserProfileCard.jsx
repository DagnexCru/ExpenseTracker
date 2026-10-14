import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Mail,
  Globe,
  Calendar,
  Key,
  LogOut,
  Save,
  RotateCcw,
  Sparkles,
  Camera,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Alert from '../components/ui/Alert';
import { updateUserProfileApi } from '../api/user';
import CurrencySelector from '../components/profile/CurrencySelector';
import ProfileAvatar from '../components/profile/ProfileAvatar';
import PasswordChangeModal from '../components/profile/PasswordChangeModal';
import EditProfilePhotoModal from '../components/profile/EditProfilePhotoModal';

export const UserProfileCard = () => {
  const { user, updateUser, logout } = useAuth();

  // Form edit states
  const [name, setName] = useState(user?.name || '');
  const [currency, setCurrency] = useState(user?.currency || 'ETB');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(null);
  const [saveError, setSaveError] = useState(null);

  // Dialog states
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

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

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* TOP PROFILE HEADER CARD */}
      <Card className="border-[#EDE4D9] rounded-3xl shadow-xs bg-white overflow-hidden">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#EDE4D9]">
            {/* User Avatar & Identity */}
            <div className="flex items-center gap-4">
              <div className="relative group shrink-0">
                <ProfileAvatar
                  name={user.name || 'User'}
                  avatar={user.avatar}
                  size="xl"
                  showStatus={true}
                />
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(true)}
                  className="absolute bottom-0 right-0 p-1.5 rounded-full bg-brand-600 text-white shadow-md hover:bg-brand-700 transition-colors cursor-pointer"
                  title="Update profile photo"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {user.name}
                  </h2>
                  <Badge variant="success" dot={true}>
                    Active
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">{user.email}</p>
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(true)}
                  className="text-xs font-bold text-brand-600 hover:text-brand-700 underline mt-1.5 cursor-pointer block"
                >
                  Set or Update Profile Photo
                </button>
              </div>
            </div>

            {/* Quick Profile Actions */}
            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
              <Button
                variant="outline"
                size="sm"
                icon={Camera}
                onClick={() => setIsPhotoModalOpen(true)}
                className="text-brand-700 border-brand-200 bg-brand-50 hover:bg-brand-100 font-bold"
              >
                Update Photo
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={Key}
                onClick={() => setIsPasswordModalOpen(true)}
                className="text-slate-600 hover:text-brand-600 border-[#EDE4D9] bg-white hover:bg-slate-50"
              >
                Change Password
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={LogOut}
                onClick={logout}
                className="text-slate-600 hover:text-rose-600 border-[#EDE4D9] hover:border-rose-200 bg-white hover:bg-rose-50"
              >
                Sign Out
              </Button>
            </div>
          </div>

          {/* Account Snapshot Badges (Interactive on Cursor Hover) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-6">
            {/* Card 1: Active Currency (Interactive Hover Card) */}
            <div
              onClick={() => {
                const el = document.getElementById('currency-selector-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group cursor-pointer p-5 rounded-2xl bg-[#FAF5F0] hover:bg-white border border-[#EDE4D9] hover:border-brand-400 shadow-2xs hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-300 transform hover:-translate-y-1.5 active:scale-[0.99] relative overflow-hidden select-none"
            >
              {/* Top ambient glow bar on hover */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Ambient blur glow */}
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-brand-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white group-hover:bg-brand-600 text-brand-600 group-hover:text-white border border-[#EDE4D9] group-hover:border-transparent flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-md group-hover:shadow-brand-500/30 shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider group-hover:text-brand-600 transition-colors block">
                      Active Currency
                    </span>
                    <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5 font-mono group-hover:text-brand-950 transition-colors">
                      {user.currency || 'ETB'}
                    </p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5 group-hover:text-slate-600 transition-colors">
                      Default Baseline Format
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200">
                    <span>Change</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Member Since (Interactive Hover Card) */}
            <div
              className="group cursor-default p-5 rounded-2xl bg-[#FAF5F0] hover:bg-white border border-[#EDE4D9] hover:border-emerald-400 shadow-2xs hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 transform hover:-translate-y-1.5 active:scale-[0.99] relative overflow-hidden select-none"
            >
              {/* Top ambient glow bar on hover */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Ambient blur glow */}
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white group-hover:bg-emerald-600 text-emerald-600 group-hover:text-white border border-[#EDE4D9] group-hover:border-transparent flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-md group-hover:shadow-emerald-500/30 shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider group-hover:text-emerald-700 transition-colors block">
                      Member Since
                    </span>
                    <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5 group-hover:text-emerald-950 transition-colors">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active User'}
                    </p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5 group-hover:text-slate-600 transition-colors">
                      Account Registered & Verified
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* EDITABLE PROFILE & CURRENCY SETTINGS FORM */}
      <Card className="border-[#EDE4D9] rounded-3xl shadow-xs bg-white overflow-hidden">
        <form onSubmit={handleSaveProfile}>
          <CardHeader className="border-b border-[#EDE4D9]">
            <div className="flex items-center justify-between w-full">
              <div>
                <CardTitle className="text-lg font-black text-slate-900">
                  Profile Details & Currency Preferences
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Modify your display name and default currency preference below. Changes take effect across your dashboard immediately.
                </CardDescription>
              </div>
              {hasChanges && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                  Unsaved Changes
                </span>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-6 sm:p-8 space-y-6">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                  Visible on your navigation bar, welcome banners, and ledger.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Account Email (Primary ID)
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-3.5 py-2.5 bg-[#FAF5F0] border border-[#EDE4D9] rounded-xl text-slate-600 font-medium text-sm cursor-not-allowed select-none"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-200/70 px-2 py-0.5 rounded-md">
                        Immutable
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  Protected credential. Email is locked to ensure account security.
                </p>
              </div>
            </div>

            {/* Interactive Currency Selector */}
            <div id="currency-selector-section" className="space-y-2 pt-2 scroll-mt-6">
              <label className="block text-xs font-bold text-slate-700">
                Select Preferred Display Currency
              </label>
              <CurrencySelector
                selectedCurrency={currency}
                onChange={(code) => setCurrency(code)}
                disabled={isSaving}
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FAF5F0] border-t border-[#EDE4D9] px-6 sm:px-8 py-4">
            <span className="text-xs text-slate-500 font-medium">
              {hasChanges
                ? 'You have unsaved adjustments. Click Save to persist them.'
                : 'Your profile settings are up to date.'}
            </span>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                icon={RotateCcw}
                onClick={handleResetForm}
                disabled={!hasChanges || isSaving}
                className="bg-white border-[#EDE4D9] hover:bg-slate-50 text-slate-600"
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
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md shadow-brand-500/25"
              >
                Save Preferences
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>

      {/* Password Change Dialog */}
      <PasswordChangeModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />

      {/* Edit Profile & Photo Dialog */}
      <EditProfilePhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
      />
    </div>
  );
};

export default UserProfileCard;
