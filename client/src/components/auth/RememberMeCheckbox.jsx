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
    <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-medium text-slate-600 hover:text-slate-800 transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-slate-300 text-[#8A70D6] focus:ring-[#8A70D6]/30 cursor-pointer accent-[#8A70D6]"
      />
      <span>Remember me</span>
    </label>
  );
};

export default RememberMeCheckbox;
