import { useState, useRef, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { CurrencyCode } from '../types';
import { ChevronDown, Check } from 'lucide-react';

interface CurrencySelectorProps {
  variant?: 'navbar' | 'compact' | 'drawer';
}

export default function CurrencySelector({ variant = 'navbar' }: CurrencySelectorProps) {
  const { currency, setCurrency, availableCurrencies, currentCurrencyInfo } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (code: CurrencyCode) => {
    setCurrency(code);
    setIsOpen(false);
  };

  // Drawer variant for mobile menu: clean grid/list
  if (variant === 'drawer') {
    return (
      <div id="currency-selector-drawer" className="w-full space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1 flex items-center justify-between">
          <span>Devise d'affichage</span>
          <span className="text-[10px] text-blue-400 font-mono">Base: MAD (DH)</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {availableCurrencies.map((curr) => {
            const isSelected = curr.code === currency;
            return (
              <button
                key={curr.code}
                id={`drawer-currency-opt-${curr.code.toLowerCase()}`}
                type="button"
                onClick={() => setCurrency(curr.code)}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm'
                    : 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none">{curr.flag}</span>
                  <div className="text-left">
                    <span className="font-bold">{curr.code}</span>
                    <span className="text-slate-400 ml-1 text-[11px]">({curr.symbol})</span>
                  </div>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Compact variant for mobile top bar (flag + code)
  if (variant === 'compact') {
    return (
      <div ref={dropdownRef} className="relative inline-block text-left">
        <button
          id="compact-currency-toggle"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-semibold text-white transition-colors cursor-pointer"
          aria-haspopup="true"
          aria-expanded={isOpen}
          title="Changer la devise"
        >
          <span className="text-sm leading-none">{currentCurrencyInfo.flag}</span>
          <span>{currentCurrencyInfo.code}</span>
          <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div
            id="compact-currency-dropdown"
            className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0a0d1a] border border-white/15 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl"
          >
            <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase text-slate-400 border-b border-white/10 mb-1">
              Choisir une devise
            </div>
            {availableCurrencies.map((curr) => {
              const isSelected = curr.code === currency;
              return (
                <button
                  key={curr.code}
                  id={`compact-opt-${curr.code.toLowerCase()}`}
                  type="button"
                  onClick={() => handleSelect(curr.code)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600/20 text-white font-bold border border-blue-500/30'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base leading-none">{curr.flag}</span>
                    <div>
                      <span className="font-semibold text-white">{curr.code}</span>
                      <span className="text-slate-400 text-[11px] ml-1.5">— {curr.name}</span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-blue-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Standard navbar variant (Desktop & Tablet)
  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        id="navbar-currency-toggle"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-white/20 text-xs font-semibold text-white transition-all cursor-pointer shadow-sm"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="text-base leading-none">{currentCurrencyInfo.flag}</span>
        <span className="font-bold tracking-wide">{currentCurrencyInfo.shortLabel}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          id="navbar-currency-dropdown"
          className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#090c18]/95 border border-white/15 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-2xl"
        >
          <div className="px-3 py-2 text-[10px] font-bold tracking-wider uppercase text-slate-400 border-b border-white/10 mb-1 flex items-center justify-between">
            <span>Devise d'affichage</span>
            <span className="text-blue-400 font-mono font-normal">Réf: MAD (DH)</span>
          </div>

          <div className="space-y-1">
            {availableCurrencies.map((curr) => {
              const isSelected = curr.code === currency;
              return (
                <button
                  key={curr.code}
                  id={`nav-opt-${curr.code.toLowerCase()}`}
                  type="button"
                  onClick={() => handleSelect(curr.code)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-white font-bold border border-blue-500/40 shadow-sm'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg leading-none">{curr.flag}</span>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-white text-sm">{curr.code}</span>
                        <span className="text-slate-400 font-medium text-xs">({curr.symbol})</span>
                      </div>
                      <span className="text-slate-400 text-[11px] font-normal leading-tight">
                        {curr.name}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-white/10 px-3 py-1 text-[10px] text-slate-400 leading-tight">
            🇲🇦 Prix de référence officiel ZALYVO en Dirham (MAD).
          </div>
        </div>
      )}
    </div>
  );
}
