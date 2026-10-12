import React from 'react';

/**
 * Styled accessible checkbox for Remember Me session option.
 *
 * @param {Object} props
 * @param {boolean} props.checked
 * @param {Function} props.onChange
 */
export const RememberMeCheckbox = ({ checked, onChange }) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-400 hover:text-slate-300 transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500/30 focus:ring-offset-0 focus:ring-1 cursor-pointer accent-emerald-500"
      />
      <span>Remember me on this browser</span>
    </label>
  );
};

export default RememberMeCheckbox;
