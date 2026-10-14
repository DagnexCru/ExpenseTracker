import React from 'react';
import { getPasswordStrength } from '../../utils/passwordStrength.js';

/**
 * Visual segmented password strength meter with checklist feedback.
 *
 * @param {Object} props
 * @param {string} props.password
 */
export const PasswordStrengthMeter = ({ password = '' }) => {
  if (!password) return null;

  const { score, label, color, rules } = getPasswordStrength(password);

  return (
    <div className="mt-2 space-y-2 animate-fadeIn">
      {/* 4-bar indicator */}
      <div className="flex items-center gap-1.5 h-1.5">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`flex-1 h-full rounded-full transition-all duration-300 ${
              score >= level ? color : 'bg-[#EDE4D9]'
            }`}
          />
        ))}
      </div>

      {/* Label and Score */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500">Password strength:</span>
        <span className="font-bold text-slate-800">{label}</span>
      </div>

      {/* Checklist hints */}
      <div className="grid grid-cols-2 gap-1 pt-1 text-[11px] text-slate-500">
        <div className={`flex items-center gap-1 ${rules.minLength ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
          <span>{rules.minLength ? '✓' : '○'}</span>
          <span>At least 6 chars</span>
        </div>
        <div className={`flex items-center gap-1 ${rules.upper && rules.lower ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
          <span>{rules.upper && rules.lower ? '✓' : '○'}</span>
          <span>Upper & lowercase</span>
        </div>
        <div className={`flex items-center gap-1 ${rules.number ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
          <span>{rules.number ? '✓' : '○'}</span>
          <span>Contains number</span>
        </div>
        <div className={`flex items-center gap-1 ${rules.special ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
          <span>{rules.special ? '✓' : '○'}</span>
          <span>Special symbol</span>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
