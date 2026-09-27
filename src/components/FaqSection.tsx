import { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { SITE_CONFIG } from '../config';
import { useLanguage } from '../context/LanguageContext';
import ScrollReveal from './ScrollReveal';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // first open by default
  const { t, faqData } = useLanguage();

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 relative bg-[#050508]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-purple-600/10 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal yOffset={35}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 mb-4">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{t.faq.badge}</span>
            </div>

            <h2
              id="faq-title"
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-display"
            >
              {t.faq.titlePart1}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                {t.faq.titleHighlight}
              </span>
            </h2>

            <p className="mt-4 text-base sm:text-lg text-slate-400">
              {t.faq.subtitle}
            </p>
          </div>
        </ScrollReveal>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <ScrollReveal key={index} delay={index * 0.07} yOffset={25}>
                <div
                  id={`faq-item-${index}`}
                  className={`rounded-2xl transition-all duration-200 overflow-hidden border ${
                    isOpen
                      ? 'bg-[#0d1020] border-blue-500/40 shadow-lg shadow-blue-500/5'
                      : 'bg-[#090b14] border-white/10 hover:border-white/20'
                  }`}
                >
                  <button
                    id={`faq-question-btn-${index}`}
                    onClick={() => toggleItem(index)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base sm:text-lg font-bold text-white font-display">
                      {item.question}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen ? 'bg-blue-600 text-white rotate-180' : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div
                      id={`faq-answer-${index}`}
                      className="px-6 pb-6 pt-1 text-sm sm:text-base text-slate-300 leading-relaxed border-t border-white/5 animate-in fade-in duration-200"
                    >
                      {item.answer}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Bottom Help Box */}
        <ScrollReveal delay={0.15} yOffset={25}>
          <div className="mt-12 p-6 rounded-2xl bg-[#090b16] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <div className="text-base font-bold text-white">{t.faq.stillQuestions}</div>
              <div className="text-xs sm:text-sm text-slate-400">
                {t.faq.whatsappHelper}
              </div>
            </div>

            <a
              id="faq-whatsapp-cta"
              href={SITE_CONFIG.contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-semibold transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t.faq.whatsappBtn}</span>
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
