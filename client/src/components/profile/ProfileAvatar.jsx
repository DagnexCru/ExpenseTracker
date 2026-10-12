import React from 'react';
import { getInitials, getAvatarColor } from '../../utils/avatar.util.js';

/**
 * Avatar with user initials, gradient background, and optional online status ring.
 *
 * @param {Object} props
 * @param {string} props.name - User's full name
 * @param {'sm' | 'md' | 'lg' | 'xl'} [props.size='md']
 * @param {boolean} [props.showStatus=false]
 */
export const ProfileAvatar = ({ name = 'User', size = 'md', showStatus = false, className = '' }) => {
  const initials = getInitials(name);
  const colorClass = getAvatarColor(name);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl font-bold',
  };

  const statusSizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3.5 h-3.5',
    xl: 'w-5 h-5',
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className={`${sizeClasses[size] || sizeClasses.md} rounded-2xl bg-gradient-to-tr ${colorClass} text-slate-950 font-bold flex items-center justify-center shadow-md select-none`}
      >
        {initials}
      </div>
      {showStatus && (
        <span
          className={`absolute bottom-0 right-0 ${statusSizeClasses[size] || statusSizeClasses.md} bg-emerald-400 border-2 border-slate-900 rounded-full`}
          title="Online"
        />
      )}
    </div>
  );
};

export default ProfileAvatar;
