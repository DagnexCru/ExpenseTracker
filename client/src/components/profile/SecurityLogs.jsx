import React from 'react';
import { ShieldCheck, Lock, Cookie, Server, CheckCircle2 } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import Badge from '../ui/Badge';

export const SecurityLogs = () => {
  const securityFeatures = [
    {
      title: 'Password Hashing & Salting',
      value: 'bcrypt (10 Salt Rounds)',
      icon: Lock,
      status: 'Active',
      description: 'Passwords are automatically hashed before MongoDB storage and never returned in API payloads.',
    },
    {
      title: 'Session Token Standard',
      value: 'JWT (HMAC-SHA256)',
      icon: ShieldCheck,
      status: 'Active',
      description: 'Cryptographically signed tokens containing user claims with configurable 7-day expiration.',
    },
    {
      title: 'Cookie Transport Security',
      value: 'HttpOnly; SameSite=Lax; Path=/',
      icon: Cookie,
      status: 'Enforced',
      description: 'Mitigates XSS token extraction via document.cookie and blocks Cross-Site Request Forgery.',
    },
    {
      title: 'CORS & Origin Isolation',
      value: 'Strict Origin Allowlist with Credentials',
      icon: Server,
      status: 'Enforced',
      description: 'Only authorized origins (http://localhost:5173) can access REST endpoints with cookie credentials.',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Security & Architecture Compliance</CardTitle>
          <CardDescription>
            Active cryptographic protections and transport safeguards in SpendWise Phase 2
          </CardDescription>
        </div>
        <Badge variant="success" dot={true}>
          4 Guards Active
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {securityFeatures.map((feat) => {
          const Icon = feat.icon;
          return (
            <div
              key={feat.title}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-800">{feat.title}</h4>
                    <span className="text-[10px] font-mono bg-slate-200/60 text-slate-700 px-1.5 py-0.5 rounded">
                      {feat.value}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
              <Badge variant="success">{feat.status}</Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default SecurityLogs;
