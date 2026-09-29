import { useState } from 'react';
import { Server, UserCheck, ShieldCheck, Check, Info, Calendar } from 'lucide-react';
import { HOSTING_DURATIONS_CONFIG } from '../config';
import { HostingDuration, HostingOption } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import ScrollReveal from './ScrollReveal';
import TextReveal from './TextReveal';

interface HostingSectionProps {
  onSelectHosting?: (option: HostingOption, duration: HostingDuration) => void;
}

export default function HostingSection({ onSelectHosting }: HostingSectionProps) {
  const [selectedOption, setSelectedOption] = useState<HostingOption>('client');
  const [selectedDuration, setSelectedDuration] = useState<HostingDuration>('12m');
  const { formatPrice, currency } = useCurrency();
  const { t, language } = useLanguage();

  const durationsList = Object.values(HOSTING_DURATIONS_CONFIG);
  const activeDurationInfo = HOSTING_DURATIONS_CONFIG[selectedDuration];
  const formattedHostingPrice = formatPrice(activeDurationInfo.basePriceMAD);
  const activeDurationLabel = (t.hosting.durations as Record<string, string>)[selectedDuration] || activeDurationInfo.label;

  return (
    <section id="hebergement" className="py-24 relative border-t border-blue-900/30">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-[radial-gradient(circle,rgba(37,99,235,0.16)_0%,transparent_70%)] blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal yOffset={35}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 mb-4">
              <Server className="w-3.5 h-3.5" />
              <span>{t.hosting.badge}</span>
            </div>

            <h2
              id="hosting-title"
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-display"
            >
              <TextReveal as="span" effect="words" className="inline-block mr-2">
                {t.hosting.titlePart1}
              </TextReveal>{' '}
              <TextReveal as="span" effect="glow" delay={0.12} className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-indigo-200 inline-block">
                {t.hosting.titleHighlight}
              </TextReveal>
            </h2>

            <TextReveal as="p" effect="lift" delay={0.1} className="mt-4 text-base sm:text-lg text-slate-300">
              {t.hosting.subtitle}
            </TextReveal>
          </div>
        </ScrollReveal>

        {/* 2 Interactive Options Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          {/* OPTION 1 — JE GÈRE MON HÉBERGEMENT */}
          <ScrollReveal delay={0.1} yOffset={40} className="h-full">
            <div
              id="hosting-option-client"
              onClick={() => setSelectedOption('client')}
              className={`cursor-pointer rounded-3xl p-7 sm:p-8 transition-all duration-300 flex flex-col justify-between border h-full ${
                selectedOption === 'client'
                  ? 'bg-gradient-to-b from-[#0d1636] via-[#091029] to-[#070c20] border-blue-500/80 shadow-2xl shadow-blue-950/60 ring-2 ring-blue-500/40'
                  : 'bg-[#070b19]/80 border-blue-950/40 hover:border-blue-500/30 backdrop-blur-sm'
              }`}
            >
              <div>
                {/* Option Radio Header */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                    {t.hosting.option1Badge}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                      selectedOption === 'client'
                        ? 'border-blue-400 bg-blue-600 text-white'
                        : 'border-white/30 bg-white/5'
                    }`}
                  >
                    {selectedOption === 'client' && <Check className="w-4 h-4" />}
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white font-display">
                    {t.hosting.option1Title}
                  </h3>
                </div>

                <p className="text-base text-slate-200 leading-relaxed mb-6">
                  {t.hosting.option1Desc}
                </p>

                {/* Obligatory note */}
                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-slate-300 flex items-start gap-2.5 mb-6">
                  <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>{t.hosting.option1Note}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t.hosting.option1Footer}</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* OPTION 2 — JE CHOISIS UNE DURÉE AVEC NEXIVO */}
          <ScrollReveal delay={0.2} yOffset={40} className="h-full">
            <div
              id="hosting-option-nexivo"
              onClick={() => setSelectedOption('nexivo')}
              className={`cursor-pointer rounded-3xl p-7 sm:p-8 transition-all duration-300 flex flex-col justify-between border h-full ${
                selectedOption === 'nexivo' || selectedOption === 'zalyvo'
                  ? 'bg-gradient-to-b from-[#0c1a3a] via-[#09122c] to-[#070c20] border-blue-400/80 shadow-2xl shadow-blue-950/60 ring-2 ring-blue-400/40'
                  : 'bg-[#070b19]/80 border-blue-950/40 hover:border-blue-500/30 backdrop-blur-sm'
              }`}
            >
              <div>
                {/* Option Radio Header */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                    {t.hosting.option2Badge}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                      selectedOption === 'nexivo' || selectedOption === 'zalyvo'
                        ? 'border-blue-400 bg-blue-600 text-white'
                        : 'border-white/30 bg-white/5'
                    }`}
                  >
                    {(selectedOption === 'nexivo' || selectedOption === 'zalyvo') && <Check className="w-4 h-4" />}
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Server className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white font-display">
                    {t.hosting.option2Title}
                  </h3>
                </div>

                <p className="text-base text-slate-200 leading-relaxed mb-6">
                  {t.hosting.option2Desc}
                </p>

                {/* Selector for durations */}
                <div className="mb-6">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <span>{t.hosting.option2ChooseDuration}</span>
                  </label>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {durationsList.map((dur) => (
                      <button
                        key={dur.id}
                        type="button"
                        id={`hosting-duration-btn-${dur.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOption('nexivo');
                          setSelectedDuration(dur.id);
                        }}
                        className={`py-2 px-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer border ${
                          selectedDuration === dur.id && (selectedOption === 'nexivo' || selectedOption === 'zalyvo')
                            ? 'bg-purple-600 border-purple-400 text-white shadow-md shadow-purple-500/30'
                            : 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/[0.08]'
                        }`}
                      >
                        {(t.hosting.durations as Record<string, string>)[dur.id] || dur.label}
                      </button>
                    ))}
                  </div>

                  {/* Display Selected Duration Price */}
                  <div className="mt-4 p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-400">{t.hosting.option2RatePrefix} ({activeDurationLabel}) :</div>
                      <div className="text-xl font-extrabold text-white font-display">
                        {formattedHostingPrice}
                      </div>
                    </div>
                    {currency !== 'MAD' && (
                      <div className="text-[11px] text-slate-400 text-right">
                        <span>{language === 'fr' ? 'Réf. de base : ' : 'Base ref: '}</span>
                        <span className="font-semibold text-purple-300">{activeDurationInfo.basePriceMAD} DH</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <Info className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>{t.hosting.option2Footer}</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Bottom Clarification Reminder */}
        <ScrollReveal delay={0.2} yOffset={20}>
          <div className="mt-12 max-w-3xl mx-auto p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
            <p className="text-xs sm:text-sm text-slate-300">
              « <span className="text-white font-semibold">{t.hosting.bottomQuoteHighlight}</span> »
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
