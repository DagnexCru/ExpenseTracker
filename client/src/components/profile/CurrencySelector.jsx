import React, { useState } from 'react';
import { Globe, Check, AlertCircle } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import Badge from '../ui/Badge';

export const CurrencySelector = ({ currentCurrency = 'ETB' }) => {
  const [selectedCurrency, setSelectedCurrency] = useState(currentCurrency);

  const currencies = [
    { code: 'ETB', name: 'Ethiopian Birr', symbol: 'ETB', flag: '🇪🇹', default: true },
    { code: 'USD', name: 'United States Dollar', symbol: '$', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  ];

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Display Currency Preference</CardTitle>
          <CardDescription>
            Select your preferred display currency for transactions and summary cards.
          </CardDescription>
        </div>
        <Badge variant="info">Default: ETB</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currencies.map((curr) => {
            const isSelected = selectedCurrency === curr.code;
            return (
              <button
                key={curr.code}
                type="button"
                onClick={() => setSelectedCurrency(curr.code)}
                className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                  isSelected
                    ? 'border-brand-600 bg-brand-50/40 ring-2 ring-brand-500/20 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{curr.flag}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{curr.code}</span>
                      <span className="font-mono text-xs text-slate-500">({curr.symbol})</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{curr.name}</p>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-500 flex items-start gap-2.5">
          <Globe className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span>
            <strong>Note:</strong> Currency preference controls display formatting. Transactions in different currencies are tracked independently and not silently auto-converted. Full profile persistence will be wired in Phase 6.
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrencySelector;
