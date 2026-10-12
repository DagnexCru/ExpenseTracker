import React from 'react';

/**
 * Divider separating primary auth fields from alternative actions.
 *
 * @param {Object} props
 * @param {string} [props.label='or continue with']
 */
export const SocialAuthDivider = ({ label = 'or continue with' }) => {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-slate-800" />
      </div>
      <div className="relative flex justify-center text-xs uppercase tracking-wider">
        <span className="bg-slate-900 px-3 text-slate-500 font-medium">
          {label}
        </span>
      </div>
    </div>
  );
};

export default SocialAuthDivider;
