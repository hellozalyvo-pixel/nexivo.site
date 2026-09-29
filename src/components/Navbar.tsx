import { useState, useEffect } from 'react';
import { SITE_CONFIG } from '../config';
import CurrencySelector from './CurrencySelector';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '../context/LanguageContext';
import { useWhatsAppChat } from '../context/WhatsAppChatContext';
import { ActivePage } from '../types';
import { Menu, X, ArrowRight, MessageCircle, Sparkles, Search, BookOpen, Layers, ShoppingBag, RefreshCw } from 'lucide-react';

interface NavbarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage, anchorId?: string) => void;
  onOpenQuote: () => void;
}

export default function Navbar({ activePage, onNavigate, onOpenQuote }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, language } = useLanguage();
  const { openChat } = useWhatsAppChat();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { page: ActivePage; label: string; badge?: string; icon: any }[] = [
    { page: 'home', label: t.navbar.home, icon: Layers },
    {
      page: 'info',
      label: language === 'fr' ? 'Centre d’Information' : 'Information Center',
      badge: language === 'fr' ? 'Guides & FAQ' : 'Guides & FAQ',
      icon: BookOpen,
    },
    { page: 'portfolio', label: t.navbar.portfolio, icon: Layers },
    { page: 'order', label: t.navbar.pricing, icon: ShoppingBag },
    { page: 'changement', label: t.navbar.changement || 'Pack Changement', icon: RefreshCw },
  ];

  const handleNavClick = (page: ActivePage, anchorId?: string) => {
    setMobileMenuOpen(false);
    onNavigate(page, anchorId);
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#050508]/95 backdrop-blur-md border-b border-white/10 py-2.5 shadow-lg shadow-black/40'
          : 'bg-[#050508]/70 backdrop-blur-sm py-3.5 border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <button
            type="button"
            id="brand-logo-link"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 group text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-[1.5px] shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
              <div className="w-full h-full bg-[#07080f] rounded-[10px] flex items-center justify-center">
                <span className="font-extrabold text-xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  N
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-wider text-white font-display text-3d-stat">
                {SITE_CONFIG.brandName}
              </span>
              <span className="text-[10px] tracking-widest uppercase text-cyan-400 font-semibold -mt-1 text-3d-badge">
                {t.common.agencyTag}
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links (Multi-page tabs) */}
          <nav
            id="desktop-nav"
            className="hidden xl:flex items-center gap-1 bg-white/[0.04] border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md"
          >
            {navItems.map((item) => {
              const isActive = activePage === item.page;
              return (
                <button
                  key={item.page}
                  id={`nav-tab-${item.page}`}
                  type="button"
                  onClick={() => handleNavClick(item.page)}
                  className={`relative flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Semi-compact Navigation for medium screens (lg to xl) */}
          <nav className="hidden lg:flex xl:hidden items-center gap-1 bg-white/[0.04] border border-white/10 px-2.5 py-1.5 rounded-full backdrop-blur-md">
            <button
              onClick={() => handleNavClick('home')}
              className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors cursor-pointer ${
                activePage === 'home' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              {t.navbar.home}
            </button>
            <button
              onClick={() => handleNavClick('info')}
              className={`flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full transition-colors cursor-pointer ${
                activePage === 'info' ? 'bg-blue-600 text-white' : 'text-blue-300 hover:text-white'
              }`}
            >
              <Search className="w-3 h-3 text-blue-400" />
              <span>{language === 'fr' ? 'Infos & FAQ' : 'Infos & FAQ'}</span>
            </button>
            <button
              onClick={() => handleNavClick('portfolio')}
              className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors cursor-pointer ${
                activePage === 'portfolio' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              {t.navbar.portfolio}
            </button>
            <button
              onClick={() => handleNavClick('order')}
              className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors cursor-pointer ${
                activePage === 'order' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              {t.navbar.pricing}
            </button>
            <button
              onClick={() => handleNavClick('changement')}
              className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors cursor-pointer ${
                activePage === 'changement' ? 'bg-amber-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              {language === 'fr' ? 'Changement' : 'Pack Changement'}
            </button>
          </nav>

          {/* Desktop Right Actions: Info Search Shortcut + Language + Currency + WhatsApp + CTA */}
          <div className="hidden md:flex items-center gap-2">
            {/* Quick Search Button to Jump to Information Center */}
            {activePage !== 'info' && (
              <button
                type="button"
                id="nav-quick-search-info-btn"
                onClick={() => handleNavClick('info')}
                className="hidden 2xl:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-950/40 border border-blue-500/20 hover:border-blue-400/40 text-blue-300 hover:text-white text-xs font-medium transition-all cursor-pointer"
                title={language === 'fr' ? 'Rechercher une information' : 'Search information'}
              >
                <Search className="w-3.5 h-3.5 text-blue-400" />
                <span>{language === 'fr' ? 'Rechercher une info' : 'Search info'}</span>
              </button>
            )}

            {/* Language Selector (FR / EN) */}
            <LanguageSelector variant="navbar" />

            {/* Currency Selector */}
            <CurrencySelector variant="navbar" />

            {/* CTA Devis / Commander */}
            <button
              id="nav-quote-cta"
              onClick={onOpenQuote}
              className="relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-600/40 hover:-translate-y-0.5 cursor-pointer"
            >
              <span>{t.common.requestQuote}</span>
              <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Actions: Search + Language + Currency + WhatsApp + Hamburger */}
          <div className="md:hidden flex items-center gap-1.5">
            {/* Direct Quick Search on mobile header */}
            <button
              type="button"
              id="mobile-search-nav-btn"
              onClick={() => handleNavClick('info')}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                activePage === 'info'
                  ? 'bg-blue-600 border-blue-400 text-white'
                  : 'bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20'
              }`}
              title={language === 'fr' ? 'Rechercher une info' : 'Search information'}
              aria-label="Recherche information"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Direct Language Selector on mobile header */}
            <LanguageSelector variant="compact" />

            {/* Direct Currency Selector on mobile header */}
            <CurrencySelector variant="compact" />

            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu-drawer"
          className="md:hidden bg-[#07080f]/98 border-b border-white/10 backdrop-blur-xl px-4 pt-3 pb-6 animate-in slide-in-from-top-2 duration-200 space-y-4 shadow-2xl"
        >
          {/* Navigation Links by Page */}
          <div className="flex flex-col gap-1.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 pb-1">
              {language === 'fr' ? 'Navigation des pages' : 'Page Navigation'}
            </div>

            {navItems.map((item) => {
              const isActive = activePage === item.page;
              return (
                <button
                  key={item.page}
                  type="button"
                  onClick={() => handleNavClick(item.page)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-blue-600/20 border border-blue-500/40 text-white font-bold'
                      : 'text-slate-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick info search jump on mobile drawer */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => handleNavClick('info')}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-300 font-semibold text-xs cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>
                {language === 'fr'
                  ? 'Recherche & Catégories d’Informations'
                  : 'Search & Information Categories'}
              </span>
            </button>
          </div>

          {/* Language Selector inside Drawer */}
          <div className="pt-3 border-t border-white/10">
            <LanguageSelector variant="drawer" />
          </div>

          {/* Currency Selector inside Drawer */}
          <div className="pt-3 border-t border-white/10">
            <CurrencySelector variant="drawer" />
          </div>

          {/* Action buttons inside Drawer */}
          <div className="pt-2 border-t border-white/10 flex flex-col gap-2.5">
            <button
              id="mobile-quote-cta-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuote();
              }}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-md shadow-blue-600/30 cursor-pointer"
            >
              <span>{t.common.requestQuote}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              id="mobile-whatsapp-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                openChat();
              }}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t.common.openWhatsApp}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
