import { useLanguage } from '../context/LanguageContext';
import { MessageSquare, PenTool, Code, Rocket, CheckCircle } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import TextReveal from './TextReveal';

const STEP_ICONS = [MessageSquare, PenTool, Code, Rocket];

export default function HowItWorks() {
  const { t, timelineData } = useLanguage();

  return (
    <section id="comment-ca-marche" className="py-24 relative overflow-hidden">
      {/* Background subtle mesh glow */}
      <div className="absolute right-0 top-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(37,99,235,0.14)_0%,transparent_70%)] blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal yOffset={35}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 mb-4">
              <span>{t.howItWorks.badge}</span>
            </div>
            <h2
              id="timeline-title"
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-display"
            >
              <TextReveal as="span" effect="words" className="inline-block mr-2">
                {t.howItWorks.titlePart1}
              </TextReveal>{' '}
              <TextReveal as="span" effect="glow" delay={0.12} className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-indigo-200 inline-block">
                {t.howItWorks.titleHighlight}
              </TextReveal>
            </h2>
            <TextReveal as="p" effect="lift" delay={0.1} className="mt-4 text-base sm:text-lg text-slate-300">
              {t.howItWorks.subtitle}
            </TextReveal>
          </div>
        </ScrollReveal>

        {/* Timeline Grid with Connecting Line */}
        <div className="relative">
          {/* Desktop horizontal connector line */}
          <div className="hidden lg:block absolute top-1/2 left-12 right-12 h-[2px] bg-gradient-to-r from-blue-500/20 via-indigo-500/30 to-blue-500/20 -translate-y-12 -z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {timelineData.map((item, index) => {
              const StepIcon = STEP_ICONS[index] || CheckCircle;
              return (
                <ScrollReveal key={item.step} delay={index * 0.1} yOffset={40} className="h-full">
                  <div
                    id={`timeline-step-${item.step}`}
                    className="group relative rounded-2xl p-6 sm:p-7 bg-[#070b1a]/85 border border-blue-900/30 hover:border-blue-400/40 backdrop-blur-sm transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-950/50 h-full"
                  >
                    <div>
                      {/* Header with Step number & Icon */}
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 font-display">
                          {item.step}
                        </span>
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400 group-hover:text-blue-300 group-hover:border-blue-400/40 transition-all">
                          <StepIcon className="w-5 h-5" />
                        </div>
                      </div>

                      {/* Step Title */}
                      <h3 className="text-xl font-bold text-white font-display mb-3">
                        {item.title}
                      </h3>

                      {/* Primary Description */}
                      <p className="text-sm font-medium text-slate-200 leading-relaxed mb-4">
                        {item.description}
                      </p>

                      {/* Extra clarification */}
                      {item.details && (
                        <p className="text-xs text-slate-400 leading-relaxed border-t border-white/5 pt-3">
                          {item.details}
                        </p>
                      )}
                    </div>

                    <div className="mt-6 flex items-center gap-2 text-[11px] font-semibold tracking-wider uppercase text-blue-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      <span>{t.common.step} {item.step}</span>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
