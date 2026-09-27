import { SITE_CONFIG } from '../config';
import { ArrowUp, Instagram, MessageCircle, Mail, Sparkles, BookOpen, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useWhatsAppChat } from '../context/WhatsAppChatContext';
import { ActivePage } from '../types';
import ScrollReveal from './ScrollReveal';

interface FooterProps {
  onNavigate?: (page: ActivePage, anchorId?: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const { t, language } = useLanguage();
  const { openChat } = useWhatsAppChat();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (page: ActivePage, anchorId?: string) => {
    if (onNavigate) {
      onNavigate(page, anchorId);
    } else {
      scrollToTop();
    }
  };

  return (
    <footer id="main-footer" className="bg-[#030407] border-t border-white/10 pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal yOffset={25}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/5">
            {/* Brand Col */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 p-[1.5px] shadow-lg shadow-blue-500/20">
                  <div className="w-full h-full bg-[#07080f] rounded-[10px] flex items-center justify-center">
                    <span className="font-extrabold text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                      Z
                    </span>
                  </div>
                </div>
                <span className="text-xl font-extrabold tracking-wider text-white font-display">
                  {SITE_CONFIG.brandName}
                </span>
              </div>

              <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                {t.footer.tagline}
              </p>

              <div className="pt-2 text-xs text-slate-400">
                {t.footer.officialSite} <span className="text-slate-300 font-mono">{SITE_CONFIG.domain}</span>
              </div>

              {/* Direct Link to Information Center */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleLinkClick('info')}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 hover:text-white hover:bg-blue-500/20 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>
                    {language === 'fr'
                      ? 'Consulter le Centre d’Information & FAQ'
                      : 'Browse Information Center & FAQ'}
                  </span>
                </button>
              </div>
            </div>

            {/* Quick Links & Pages */}
            <div className="md:col-span-3 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-white font-display">
                {language === 'fr' ? 'Pages & Navigation' : 'Pages & Navigation'}
              </div>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    type="button"
                    onClick={() => handleLinkClick('home')}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {t.navbar.home}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleLinkClick('info')}
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors cursor-pointer text-left flex items-center gap-1.5"
                  >
                    <span>{language === 'fr' ? 'Centre d’Information' : 'Information Center'}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold">
                      {language === 'fr' ? 'Recherche & Guides' : 'Search & Guides'}
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleLinkClick('portfolio')}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {t.navbar.portfolio}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleLinkClick('order')}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {t.navbar.pricing}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleLinkClick('changement')}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {t.navbar.changement || 'Pack Changement (1 500 DH)'}
                  </button>
                </li>
              </ul>
            </div>

            {/* Practical Topics in Information Center */}
            <div className="md:col-span-2 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-white font-display">
                {language === 'fr' ? 'Guides d’Information' : 'Information Guides'}
              </div>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    type="button"
                    onClick={() => handleLinkClick('info')}
                    className="text-slate-400 hover:text-blue-300 transition-colors cursor-pointer text-left"
                  >
                    {language === 'fr' ? '• Noms de domaine' : '• Domain names'}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleLinkClick('info')}
                    className="text-slate-400 hover:text-blue-300 transition-colors cursor-pointer text-left"
                  >
                    {language === 'fr' ? '• Hébergement client vs Zalyvo' : '• Client vs Zalyvo hosting'}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleLinkClick('info')}
                    className="text-slate-400 hover:text-blue-300 transition-colors cursor-pointer text-left"
                  >
                    {language === 'fr' ? '• Tarifs officiels' : '• Official pricing'}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleLinkClick('info')}
                    className="text-slate-400 hover:text-blue-300 transition-colors cursor-pointer text-left"
                  >
                    {language === 'fr' ? '• Délais de livraison' : '• Delivery turnaround'}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleLinkClick('info')}
                    className="text-slate-400 hover:text-blue-300 transition-colors cursor-pointer text-left"
                  >
                    {language === 'fr' ? '• Propriété & Sécurité' : '• Ownership & Security'}
                  </button>
                </li>
              </ul>
            </div>

            {/* Socials & Direct Contact */}
            <div className="md:col-span-2 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-white font-display">
                {language === 'fr' ? 'Contact' : 'Contact'}
              </div>
              <div className="flex flex-col gap-2.5 text-sm">
                <a
                  id="footer-instagram-link"
                  href={SITE_CONFIG.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-slate-400 hover:text-pink-400 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <span>Instagram</span>
                </a>

                <a
                  id="footer-tiktok-link"
                  href={SITE_CONFIG.socials.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center font-bold text-xs">
                    TT
                  </div>
                  <span>TikTok</span>
                </a>

                <button
                  type="button"
                  id="footer-whatsapp-link"
                  onClick={() => openChat()}
                  className="inline-flex items-center gap-2.5 text-slate-400 hover:text-emerald-400 transition-colors group cursor-pointer text-left"
                  title={language === 'fr' ? 'Ouvrir l’Assistant WhatsApp ZALYVO' : 'Open ZALYVO WhatsApp Assistant'}
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-300 group-hover:text-emerald-400 font-medium text-xs">
                      {language === 'fr' ? 'Assistant WhatsApp' : 'WhatsApp Assistant'}
                    </span>
                    <Sparkles className="w-3 h-3 text-emerald-400 group-hover:rotate-12 transition-transform" />
                  </div>
                </button>

                <a
                  id="footer-email-link"
                  href={`mailto:${SITE_CONFIG.contact.email}`}
                  className="inline-flex items-center gap-2.5 text-slate-400 hover:text-purple-400 transition-colors text-xs truncate"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="truncate">{SITE_CONFIG.contact.email}</span>
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © 2026 Zalyvo — {t.common.allRightsReserved}
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
            aria-label={t.footer.backToTop}
          >
            <span>{t.footer.backToTop}</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
