import React from 'react';
import { Globe, Check } from 'lucide-react';
import { SUPPORTED_CURRENCIES } from '../../constants/currencies';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import Badge from '../ui/Badge';

export const CurrencySelector = ({
  selectedCurrency = 'ETB',
  onChange,
  disabled = false,
}) => {
  return (
    <Card className="border-slate-200">
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <div>
            <CardTitle className="text-base sm:text-lg">Display Currency Preference</CardTitle>
            <CardDescription className="text-xs">
              Choose your preferred display currency for transactions, reports, and summary cards.
            </CardDescription>
          </div>
          <Badge variant="info" className="shrink-0">
            Default: ETB (Br)
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Currencies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SUPPORTED_CURRENCIES.map((curr) => {
            const isSelected = selectedCurrency === curr.code;
            return (
              <button
                key={curr.code}
                type="button"
                disabled={disabled}
                onClick={() => onChange && onChange(curr.code)}
                className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                  isSelected
                    ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60'
                } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl shrink-0">{curr.flag}</span>
                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 text-sm">{curr.code}</span>
                      <span className="font-mono text-xs text-slate-500 font-semibold">({curr.symbol})</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{curr.name}</p>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center shrink-0 ml-2">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Currency Formatting Policy Note */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-start gap-2.5">
          <Globe className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
          <span>
            <strong>Display Policy:</strong> Currency preference defines formatting and symbols across your financial dashboard and transactions. As specified in the architectural guidelines, transactions are tracked in their recorded amounts without synthetic or silent live currency conversion.
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrencySelector;
