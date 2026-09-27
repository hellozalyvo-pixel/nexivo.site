import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageCode } from '../types';
import { ChevronDown, Check, Globe } from 'lucide-react';

interface LanguageSelectorProps {
  variant?: 'navbar' | 'compact' | 'drawer' | 'footer';
}

export default function LanguageSelector({ variant = 'navbar' }: LanguageSelectorProps) {
  const { language, setLanguage, availableLanguages, currentLanguageInfo } = useLanguage();
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

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
  };

  // Drawer variant for mobile menu: clean grid
  if (variant === 'drawer') {
    return (
      <div id="language-selector-drawer" className="w-full space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>{language === 'fr' ? 'Langue du site' : 'Site Language'}</span>
          </span>
          <span className="text-[10px] text-blue-400 font-mono uppercase">{currentLanguageInfo.code}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {availableLanguages.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <button
                key={lang.code}
                id={`drawer-language-opt-${lang.code}`}
                type="button"
                onClick={() => setLanguage(lang.code)}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm'
                    : 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none">{lang.flag}</span>
                  <div className="text-left">
                    <span className="font-bold">{lang.shortLabel}</span>
                    <span className="text-slate-400 ml-1 text-[11px]">({lang.nativeName})</span>
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
          id="compact-language-toggle"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-semibold text-white transition-colors cursor-pointer"
          aria-haspopup="true"
          aria-expanded={isOpen}
          title={language === 'fr' ? 'Changer la langue' : 'Change language'}
        >
          <span className="text-sm leading-none">{currentLanguageInfo.flag}</span>
          <span>{currentLanguageInfo.shortLabel}</span>
          <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div
            id="compact-language-dropdown"
            className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#0a0d1a] border border-white/15 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl"
          >
            <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase text-slate-400 border-b border-white/10 mb-1">
              {language === 'fr' ? 'Choisir une langue' : 'Select language'}
            </div>
            {availableLanguages.map((lang) => {
              const isSelected = lang.code === language;
              return (
                <button
                  key={lang.code}
                  id={`compact-lang-${lang.code}`}
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600/20 text-white font-bold'
                      : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-400" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Footer variant: elegant inline pill or selector
  if (variant === 'footer') {
    return (
      <div id="footer-language-selector" className="inline-flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/10">
        {availableLanguages.map((lang) => {
          const isSelected = lang.code === language;
          return (
            <button
              key={lang.code}
              id={`footer-lang-${lang.code}`}
              type="button"
              onClick={() => setLanguage(lang.code)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.shortLabel}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Default 'navbar' variant: modern segmented pill or dropdown toggle
  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        id="navbar-language-toggle"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-xs font-semibold text-slate-200 hover:text-white transition-all duration-200 cursor-pointer backdrop-blur-sm shadow-sm"
        aria-haspopup="true"
        aria-expanded={isOpen}
        title={language === 'fr' ? 'Changer la langue (FR / EN)' : 'Change language (FR / EN)'}
      >
        <span className="text-sm leading-none">{currentLanguageInfo.flag}</span>
        <span className="tracking-wide font-bold">{currentLanguageInfo.shortLabel}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-blue-400' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          id="navbar-language-dropdown"
          className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#0a0d1a]/95 border border-white/15 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-2xl"
        >
          <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase text-slate-400 border-b border-white/10 mb-1 flex items-center justify-between">
            <span>{language === 'fr' ? 'Langue' : 'Language'}</span>
            <Globe className="w-3 h-3 text-blue-400" />
          </div>
          {availableLanguages.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <button
                key={lang.code}
                id={`navbar-lang-opt-${lang.code}`}
                type="button"
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600/20 text-white font-bold border border-blue-500/30'
                    : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base leading-none">{lang.flag}</span>
                  <div className="text-left">
                    <span className="font-semibold text-white">{lang.nativeName}</span>
                    <span className="text-slate-400 text-[10px] ml-1.5 font-mono">[{lang.shortLabel}]</span>
                  </div>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
