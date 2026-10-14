import React from 'react';

/**
 * One-click demo credentials loader button for quick reviewer access.
 *
 * @param {Object} props
 * @param {Function} props.onApply - Callback receiving { email, password, name }
 */
export const DemoCredentialsButton = ({ onApply, mode = 'login' }) => {
  const handleClick = (e) => {
    e.preventDefault();
    if (mode === 'register') {
      onApply({
        name: 'Abebe Bikila',
        email: 'abebe.test@spendwise.et',
        password: 'Password123!',
      });
    } else {
      onApply({
        email: 'abebe.test@spendwise.et',
        password: 'Password123!',
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full py-2.5 px-4 text-xs font-semibold text-[#7A5EC5] bg-[#F7F3FC] hover:bg-[#EFE8F9] border border-[#E4D8F4] rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer shadow-2xs"
      title="Fill test credentials with one click"
    >
      <svg
        className="w-4 h-4 text-[#8A70D6] group-hover:rotate-12 transition-transform duration-200"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
      <span>Auto-Fill Demo Credentials (Reviewer Mode)</span>
    </button>
  );
};

export default DemoCredentialsButton;
