import { ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import ScrollReveal from './ScrollReveal';

interface FinalCtaProps {
  onOpenQuote: () => void;
}

export default function FinalCta({ onOpenQuote }: FinalCtaProps) {
  const { t } = useLanguage();

  return (
    <section id="cta-final" className="py-28 relative overflow-hidden">
      {/* Intense sapphire blue backlight aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[520px] bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.24)_0%,rgba(30,58,138,0.12)_45%,transparent_70%)] blur-[100px] rounded-full pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <ScrollReveal yOffset={35}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/40 border border-blue-500/30 text-xs font-semibold text-blue-300 mb-8 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.finalCta.badge}</span>
          </div>

          {/* Title */}
          <h2
            id="final-cta-title"
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight font-display mb-6"
          >
            {t.finalCta.titlePart1}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-indigo-200">
              {t.finalCta.titleHighlight}
            </span>
          </h2>

          {/* Text */}
          <p
            id="final-cta-text"
            className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {t.finalCta.subtitle}
          </p>

          {/* Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="final-cta-button"
              onClick={onOpenQuote}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-9 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 border border-blue-400/30 hover:-translate-y-0.5 cursor-pointer group"
            >
              <span>{t.finalCta.button}</span>
              <ArrowRight className="w-5 h-5 text-white/90 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
