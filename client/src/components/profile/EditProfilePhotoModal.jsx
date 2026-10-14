import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Camera,
  Trash2,
  Sparkles,
  Check,
  Loader2,
  User,
  DollarSign,
  AlertCircle,
  Smile,
} from 'lucide-react';
import ProfileAvatar from './ProfileAvatar';
import { updateUserProfileApi } from '../../api/user';
import { useAuth } from '../../hooks/useAuth';
import { SUPPORTED_CURRENCY_CODES } from '../../constants/currencies';

// 6 Curated High-Definition Preset Avatars (SVG Data URIs - Circular Format)
const PRESET_AVATARS = [
  {
    id: 'preset-1',
    label: 'Cosmic Violet',
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g1' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%238A70D6'/><stop offset='100%' stop-color='%234F46E5'/></linearGradient></defs><circle cx='50' cy='50' r='50' fill='url(%23g1)'/><circle cx='50' cy='38' r='18' fill='%23FFFFFF'/><path d='M22 84 C22 62, 34 56, 50 56 C66 56, 78 62, 78 84 Z' fill='%23FFFFFF' opacity='0.92'/></svg>",
  },
  {
    id: 'preset-2',
    label: 'Emerald Mint',
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g2' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%2310B981'/><stop offset='100%' stop-color='%23059669'/></linearGradient></defs><circle cx='50' cy='50' r='50' fill='url(%23g2)'/><circle cx='50' cy='38' r='18' fill='%23FFFFFF'/><path d='M22 84 C22 62, 34 56, 50 56 C66 56, 78 62, 78 84 Z' fill='%23FFFFFF' opacity='0.92'/></svg>",
  },
  {
    id: 'preset-3',
    label: 'Sunset Coral',
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g3' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%23F43F5E'/><stop offset='100%' stop-color='%23FB923C'/></linearGradient></defs><circle cx='50' cy='50' r='50' fill='url(%23g3)'/><circle cx='50' cy='38' r='18' fill='%23FFFFFF'/><path d='M22 84 C22 62, 34 56, 50 56 C66 56, 78 62, 78 84 Z' fill='%23FFFFFF' opacity='0.92'/></svg>",
  },
  {
    id: 'preset-4',
    label: 'Ocean Cyan',
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g4' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%2306B6D4'/><stop offset='100%' stop-color='%232563EB'/></linearGradient></defs><circle cx='50' cy='50' r='50' fill='url(%23g4)'/><circle cx='50' cy='38' r='18' fill='%23FFFFFF'/><path d='M22 84 C22 62, 34 56, 50 56 C66 56, 78 62, 78 84 Z' fill='%23FFFFFF' opacity='0.92'/></svg>",
  },
  {
    id: 'preset-5',
    label: 'Golden Amber',
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g5' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%23F59E0B'/><stop offset='100%' stop-color='%23D97706'/></linearGradient></defs><circle cx='50' cy='50' r='50' fill='url(%23g5)'/><circle cx='50' cy='38' r='18' fill='%23FFFFFF'/><path d='M22 84 C22 62, 34 56, 50 56 C66 56, 78 62, 78 84 Z' fill='%23FFFFFF' opacity='0.92'/></svg>",
  },
  {
    id: 'preset-6',
    label: 'Midnight Slate',
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g6' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%23334155'/><stop offset='100%' stop-color='%230F172A'/></linearGradient></defs><circle cx='50' cy='50' r='50' fill='url(%23g6)'/><circle cx='50' cy='38' r='18' fill='%23FFFFFF'/><path d='M22 84 C22 62, 34 56, 50 56 C66 56, 78 62, 78 84 Z' fill='%23FFFFFF' opacity='0.92'/></svg>",
  },
];

export const EditProfilePhotoModal = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);

  const [name, setName] = useState(user?.name || '');
  const [currency, setCurrency] = useState(user?.currency || 'ETB');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // Sync state on open
  React.useEffect(() => {
    if (user) {
      setName(user.name || '');
      setCurrency(user.currency || 'ETB');
      setAvatarPreview(user.avatar || null);
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  // Process and compress image file via HTML5 Canvas
  const processImageFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, WebP, etc.).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size is too large. Please select an image under 5MB.');
      return;
    }

    setErrorMessage('');
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Resize to maximum 300x300 for crisp, lightweight storage
        const canvas = document.createElement('canvas');
        const maxDim = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to webp/jpeg data URI
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setAvatarPreview(compressedDataUrl);
      };
      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processImageFile(file);
  };

  const handleRemovePhoto = () => {
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSelectPreset = (presetUrl) => {
    setAvatarPreview(presetUrl);
    setErrorMessage('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      setErrorMessage('Full name must be at least 2 characters.');
      return;
    }

    setIsUploading(true);
    try {
      const res = await updateUserProfileApi({
        name: trimmedName,
        currency,
        avatar: avatarPreview,
      });

      if (res?.data?.user) {
        updateUser(res.data.user);
      } else {
        updateUser({
          ...user,
          name: trimmedName,
          currency,
          avatar: avatarPreview,
        });
      }

      setSuccessMessage('Profile photo and details updated successfully!');
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      console.error('Failed to update avatar:', err);
      setErrorMessage(
        err.response?.data?.message || err.message || 'Failed to save changes. Please try again.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#FAF5F0] rounded-[32px] border border-[#EDE4D9] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-[#EDE4D9] bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shadow-xs">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                User Profile & Photo
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Customize your avatar, display name, and currency
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6 flex-1">
          {/* Notifications */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs sm:text-sm font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="flex items-center gap-2 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs sm:text-sm font-medium">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Current Avatar & Live Preview */}
          <div className="bg-white p-5 rounded-2xl border border-[#EDE4D9] shadow-xs flex flex-col sm:flex-row items-center gap-5">
            <div className="relative">
              <ProfileAvatar
                name={name || user?.name || 'User'}
                avatar={avatarPreview}
                size="2xl"
                showStatus={true}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 rounded-full bg-brand-600 text-white shadow-md hover:bg-brand-700 transition-colors cursor-pointer"
                title="Upload Photo"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 text-center sm:text-left flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="font-extrabold text-slate-900 text-base">
                  {name || 'Your Name'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                  {currency}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal">
                {avatarPreview ? 'Custom photo active' : 'Default initials avatar active'}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center justify-center sm:justify-start gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose Photo</span>
                </button>

                {avatarPreview && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Drag & Drop Box */}
          <div
            onDragEnter={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setDragActive(false);
            }}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all cursor-pointer ${
              dragActive
                ? 'border-brand-500 bg-brand-50/70 scale-[1.01]'
                : 'border-slate-300 hover:border-brand-400 bg-white/60 hover:bg-white'
            }`}
          >
            <div className="flex flex-col items-center justify-center gap-1">
              <Upload className="w-6 h-6 text-slate-400" />
              <p className="text-xs font-bold text-slate-700">
                Drag & drop your photo here, or <span className="text-brand-600 underline">browse</span>
              </p>
              <p className="text-[11px] text-slate-400">
                Supports JPG, PNG, WebP (Max 5MB • Automatically optimized)
              </p>
            </div>
          </div>

          {/* Pick from Curated Preset Avatars */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Or Choose a Preset Avatar</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {PRESET_AVATARS.map((preset) => {
                const isSelected = avatarPreview === preset.url;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset.url)}
                    className={`relative p-1 rounded-full border-2 transition-all cursor-pointer group ${
                      isSelected
                        ? 'border-brand-600 ring-2 ring-brand-500/20 scale-105 shadow-sm'
                        : 'border-transparent hover:border-slate-300'
                    }`}
                    title={preset.label}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-12 h-12 rounded-full object-cover shadow-xs"
                    />
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-600 text-white flex items-center justify-center text-[10px]">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Details: Name & Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#EDE4D9]">
            {/* Display Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Display Name
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#EDE4D9] rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>

            {/* Baseline Currency */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Baseline Currency
              </label>
              <div className="relative flex items-center">
                <DollarSign className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#EDE4D9] rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 cursor-pointer"
                >
                  {SUPPORTED_CURRENCY_CODES.map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 sm:px-8 py-4 bg-white border-t border-[#EDE4D9] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="px-4 py-2.5 rounded-xl border border-[#EDE4D9] text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isUploading}
            className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-brand-500/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Save Profile</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePhotoModal;
