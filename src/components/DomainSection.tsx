import { Globe, FileText, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import ScrollReveal from './ScrollReveal';
import TextReveal from './TextReveal';

export default function DomainSection() {
  const { t } = useLanguage();

  return (
    <section id="nom-de-domaine" className="py-20 relative bg-[#06070d] border-b border-white/5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal yOffset={35}>
          <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-b from-[#0e1224] to-[#080a14] border border-blue-500/20 shadow-2xl overflow-hidden">
            {/* Subtle background light effect */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none -z-0" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 mb-4">
                  <Globe className="w-3.5 h-3.5" />
                  <span>{t.domain.badge}</span>
                </div>

                <h2
                  id="domain-title"
                  className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight font-display mb-4"
                >
                  <TextReveal as="span" effect="words" className="inline-block mr-2">
                    {t.domain.titlePart1}
                  </TextReveal>{' '}
                  <TextReveal as="span" effect="glow" delay={0.12} className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 inline-block">
                    {t.domain.titleHighlight}
                  </TextReveal>
                </h2>

                <p className="text-base sm:text-lg text-slate-200 leading-relaxed mb-6">
                  {t.domain.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>{t.domain.point1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>{t.domain.point2}</span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 w-full md:w-auto">
                <div className="p-5 rounded-2xl bg-[#070913] border border-white/10 text-center md:text-left">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    {t.domain.boxLabel}
                  </div>
                  <div className="text-xl font-mono font-bold text-white mb-2">
                    votre-marque<span className="text-blue-400">.com</span> / <span className="text-purple-400">.ma</span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center justify-center md:justify-start gap-1">
                    <FileText className="w-3 h-3 text-slate-400" />
                    <span>{t.domain.boxDetails}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
