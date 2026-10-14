import React from 'react';
import { getInitials, getAvatarColor } from '../../utils/avatar.util.js';

/**
 * Avatar with user initials or custom photo, gradient background, and optional online status ring.
 *
 * @param {Object} props
 * @param {string} props.name - User's full name
 * @param {string} [props.avatar] - Photo image URL or data URI
 * @param {'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'} [props.size='md']
 * @param {boolean} [props.showStatus=false]
 * @param {boolean} [props.editable=false]
 * @param {Function} [props.onEdit]
 */
export const ProfileAvatar = ({
  name = 'User',
  avatar = null,
  size = 'md',
  showStatus = false,
  editable = false,
  onEdit,
  className = '',
}) => {
  const initials = getInitials(name);
  const colorClass = getAvatarColor(name);

  const sizeClasses = {
    xs: 'w-7 h-7 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl font-bold',
    '2xl': 'w-24 h-24 text-3xl font-extrabold',
  };

  const statusSizeClasses = {
    xs: 'w-2 h-2',
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-3.5 h-3.5',
    xl: 'w-5 h-5',
    '2xl': 'w-6 h-6',
  };

  return (
    <div className={`relative inline-block group ${className}`}>
      <div
        className={`${
          sizeClasses[size] || sizeClasses.md
        } rounded-2xl bg-gradient-to-tr ${colorClass} text-slate-950 font-bold flex items-center justify-center shadow-md select-none overflow-hidden relative border border-white/60`}
      >
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-full h-full object-cover rounded-2xl transition-transform duration-200 group-hover:scale-105"
            onError={(e) => {
              // Fallback to initials if image link breaks
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <span>{initials}</span>
        )}

        {editable && (
          <button
            type="button"
            onClick={onEdit}
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
            title="Update photo"
          >
            <span className="text-xs font-semibold">Change</span>
          </button>
        )}
      </div>

      {showStatus && (
        <span
          className={`absolute bottom-0 right-0 ${
            statusSizeClasses[size] || statusSizeClasses.md
          } bg-emerald-500 border-2 border-white rounded-full shadow-xs`}
          title="Active & Protected"
        />
      )}
    </div>
  );
};

export default ProfileAvatar;
