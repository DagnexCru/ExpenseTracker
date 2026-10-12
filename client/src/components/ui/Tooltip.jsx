import React, { useState } from 'react';

/**
 * Lightweight accessible tooltip component.
 *
 * @param {Object} props
 * @param {string} props.content - Tooltip text
 * @param {React.ReactNode} props.children - Target element
 */
export const Tooltip = ({ content, children, className = '' }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 text-xs font-medium text-slate-100 bg-slate-900 border border-slate-700 rounded-md shadow-xl whitespace-nowrap z-50 pointer-events-none animate-fadeIn"
        >
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
