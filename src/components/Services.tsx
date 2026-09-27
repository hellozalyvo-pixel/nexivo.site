import { Globe, Palette, Smartphone, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import ScrollReveal from './ScrollReveal';

const ICONS_MAP: Record<string, typeof Globe> = {
  Globe: Globe,
  Palette: Palette,
  Smartphone: Smartphone,
  Zap: Zap,
};

interface ServicesProps {
  onOpenQuote: () => void;
}

export default function Services({ onOpenQuote }: ServicesProps) {
  const { t, servicesData } = useLanguage();

  return (
    <section id="services" className="py-24 relative">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(37,99,235,0.14)_0%,transparent_70%)] blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal yOffset={35}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 mb-4">
              <span>{t.services.badge}</span>
            </div>
            <h2
              id="services-title"
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-display"
            >
              <span className="text-3d-heading inline-block mr-2">
                {t.services.titlePart1}
              </span>{' '}
              <span className="text-cyan-300 text-3d-cyan-glow inline-block">
                {t.services.titleHighlight}
              </span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-200 text-3d-subtitle">
              {t.services.subtitle}
            </p>
          </div>
        </ScrollReveal>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesData.map((service, index) => {
            const IconComponent = ICONS_MAP[service.icon] || Globe;
            return (
              <ScrollReveal key={service.id} delay={index * 0.1} yOffset={40} className="h-full">
                <div
                  id={`service-card-${service.id}`}
                  className="group relative rounded-2xl p-6 sm:p-7 bg-[#070b1a]/80 hover:bg-[#0c1228] border border-blue-900/30 hover:border-blue-400/40 backdrop-blur-sm transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-950/40 h-full"
                >
                  {/* Top Accent Line on Hover */}
                  <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div>
                    {/* Icon Box */}
                    <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:text-blue-300 group-hover:scale-110 transition-all duration-300 mb-5">
                      <IconComponent className="w-6 h-6" />
                    </div>

                    {/* Card Title */}
                    <h3 className="text-xl font-bold text-white font-display mb-3 group-hover:text-blue-300 transition-colors">
                      {service.title}
                    </h3>

                    {/* Card Description */}
                    <p className="text-sm text-slate-400 leading-relaxed mb-6">
                      {service.description}
                    </p>
                  </div>

                  {/* Sub-benefits list */}
                  {service.benefits && service.benefits.length > 0 && (
                    <div className="pt-4 border-t border-white/5 space-y-2">
                      {service.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Bottom prompt strip */}
        <ScrollReveal delay={0.3} yOffset={25}>
          <div className="mt-12 text-center">
            <button
              onClick={onOpenQuote}
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 group cursor-pointer"
            >
              <span>{t.faq.stillQuestions}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
