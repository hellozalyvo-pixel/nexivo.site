import { Sparkles, Smartphone, HeartHandshake, Layers, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import ScrollReveal from './ScrollReveal';

const WHY_ICONS: Record<string, typeof Sparkles> = {
  Sparkles: Sparkles,
  Smartphone: Smartphone,
  HeartHandshake: HeartHandshake,
  Layers: Layers,
};

export default function WhyZalyvo() {
  const { t, whyZalyvoData } = useLanguage();

  return (
    <section id="pourquoi-zalyvo" className="py-24 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] bg-[radial-gradient(circle,rgba(37,99,235,0.15)_0%,transparent_70%)] blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal yOffset={35}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 mb-4">
              <span>{t.whyZalyvo.badge}</span>
            </div>

            <h2
              id="why-zalyvo-title"
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-display"
            >
              {t.whyZalyvo.titlePart1}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-indigo-200">
                {t.whyZalyvo.titleHighlight}
              </span>
            </h2>

            <p className="mt-4 text-base sm:text-lg text-slate-300">
              {t.whyZalyvo.subtitle}
            </p>
          </div>
        </ScrollReveal>

        {/* 4 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyZalyvoData.map((item, idx) => {
            const IconComp = WHY_ICONS[item.icon] || Sparkles;
            return (
              <ScrollReveal key={idx} delay={idx * 0.1} yOffset={40} className="h-full">
                <div
                  id={`why-zalyvo-card-${idx}`}
                  className="group rounded-2xl p-7 bg-[#070b1a]/85 border border-blue-900/30 hover:border-blue-400/40 backdrop-blur-sm transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-950/50 h-full"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:text-blue-300 transition-all mb-5">
                      <IconComp className="w-6 h-6" />
                    </div>

                    <h3 className="text-xl font-bold text-white font-display mb-3 group-hover:text-blue-300 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-sm text-slate-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-1.5 text-xs text-blue-400">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{t.whyZalyvo.standardZalyvo}</span>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
