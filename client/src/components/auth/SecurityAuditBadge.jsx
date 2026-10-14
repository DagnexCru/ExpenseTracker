import React from 'react';

/**
 * Compact visual security badge highlighting active cryptographic and cookie defenses.
 */
export const SecurityAuditBadge = () => {
  return (
    <div className="p-3.5 bg-white border border-[#EDE4D9] rounded-xl space-y-2 text-xs shadow-sm">
      <div className="flex items-center justify-between text-slate-800 font-medium">
        <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Active Security Defenses
        </span>
        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Phase 2 Verified</span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
        <div className="flex items-center gap-1.5">
          <span>🛡️</span>
          <span>Bcrypt 10 Salt Rounds</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>🍪</span>
          <span>HTTP-Only Cookies</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>🔑</span>
          <span>JWT 7-Day Expiration</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>🧼</span>
          <span>toJSON Hash Stripping</span>
        </div>
      </div>
    </div>
  );
};

export default SecurityAuditBadge;
