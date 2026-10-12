/**
 * Extracts initials from a user's full name
 * @param {string} name
 * @returns {string} Initials (e.g. "DC")
 */
export const getInitials = (name) => {
  if (!name || typeof name !== 'string') return 'U';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Returns a consistent Tailwind gradient for a given user name
 * @param {string} name
 * @returns {string} Tailwind CSS gradient classes
 */
export const getAvatarGradient = (name) => {
  const gradients = [
    'from-brand-600 via-indigo-600 to-slate-900',
    'from-emerald-600 via-teal-600 to-slate-900',
    'from-blue-600 via-cyan-600 to-slate-900',
    'from-purple-600 via-brand-600 to-slate-900',
    'from-amber-600 via-orange-600 to-slate-900',
  ];

  if (!name) return gradients[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
};

export default {
  getInitials,
  getAvatarGradient,
};
