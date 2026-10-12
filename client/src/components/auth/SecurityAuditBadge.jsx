import React from 'react';

/**
 * Compact visual security badge highlighting active cryptographic and cookie defenses.
 */
export const SecurityAuditBadge = () => {
  return (
    <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2 text-xs">
      <div className="flex items-center justify-between text-slate-300 font-medium">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Active Security Defenses
        </span>
        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Phase 2 Verified</span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="text-emerald-400">🛡️</span>
          <span>Bcrypt 10 Salt Rounds</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-emerald-400">🍪</span>
          <span>HTTP-Only Cookies</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-emerald-400">🔑</span>
          <span>JWT 7-Day Expiration</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-emerald-400">🧼</span>
          <span>toJSON Hash Stripping</span>
        </div>
      </div>
    </div>
  );
};

export default SecurityAuditBadge;
