import { useState, useEffect } from 'react';
import { CurrencyProvider } from './context/CurrencyContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ToastProvider } from './context/ToastContext';
import { WhatsAppChatProvider } from './context/WhatsAppChatContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import HowItWorks from './components/HowItWorks';
import Pricing from './components/Pricing';
import HostingSection from './components/HostingSection';
import DomainSection from './components/DomainSection';
import OrderConfigurator from './components/OrderConfigurator';
import Portfolio from './components/Portfolio';
import WhyNexivo from './components/WhyNexivo';
import FaqSection from './components/FaqSection';
import ContactSection from './components/ContactSection';
import FinalCta from './components/FinalCta';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import WhatsAppChatWidget from './components/WhatsAppChatWidget';
import InformationCenter from './components/InformationCenter';
import ScrollReveal from './components/ScrollReveal';
import ScrollProgress from './components/ScrollProgress';
import Decor3D from './components/Decor3D';
import { ActivePage, HostingDuration, HostingOption } from './types';
import { Search, Sparkles, ArrowRight, BookOpen, Layers, CheckCircle2, MessageCircle, RefreshCw } from 'lucide-react';

function MainAppContent() {
  const { language } = useLanguage();

  // Helper to determine initial page from window.location.hash
  const getInitialPage = (): ActivePage => {
    if (typeof window === 'undefined') return 'home';
    const hash = window.location.hash.toLowerCase();
    if (hash.includes('info') || hash.includes('guide')) return 'info';
    if (hash.includes('portfolio') || hash.includes('realisation')) return 'portfolio';
    if (hash.includes('order') || hash.includes('commande') || hash.includes('tarif')) return 'order';
    if (hash.includes('changement') || hash.includes('refonte')) return 'changement';
    return 'home';
  };

  const [activePage, setActivePage] = useState<ActivePage>(getInitialPage);
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro' | 'business'>('pro');
  const [hostingOption, setHostingOption] = useState<HostingOption>('client');
  const [hostingDuration, setHostingDuration] = useState<HostingDuration>('12m');
  const [selectedProject, setSelectedProject] = useState<string>('');

  // Synchronize active page with hash change
  useEffect(() => {
    const handleHashChange = () => {
      const page = getInitialPage();
      setActivePage(page);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: ActivePage, anchorId?: string) => {
    setActivePage(page);
    window.location.hash = `#/${page}`;
    if (anchorId) {
      setTimeout(() => {
        const el = document.getElementById(anchorId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectPlan = (planId: 'starter' | 'pro' | 'business') => {
    setSelectedPlan(planId);
    navigateTo('order', 'commande');
  };

  const handleSelectHosting = (option: HostingOption, duration: HostingDuration) => {
    setHostingOption(option);
    setHostingDuration(duration);
    navigateTo('order', 'commande');
  };

  const handleSelectProjectForQuote = (projectName: string, sector: string) => {
    setSelectedProject(`${projectName} (${sector})`);
    navigateTo('order', 'commande');
  };

  return (
    <div className="min-h-screen bg-cyber-blue-canvas text-slate-100 flex flex-col selection:bg-blue-500 selection:text-white relative overflow-x-hidden">
      {/* Dynamic Scroll Progress Bar */}
      <ScrollProgress />

      {/* Global Ambient Lighting & Cyber Multi-Blue 3D Backdrop (Deep Obsidian Atmosphere) */}
      <div className="fixed inset-0 bg-grid-cyber-matrix opacity-35 pointer-events-none -z-20" />
      {/* Luminescent Cyan & Sapphire Zenith Subtle Arc */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] bg-[radial-gradient(ellipse_80%_50%_at_50%_-15%,rgba(6,182,212,0.12)_0%,rgba(37,99,235,0.14)_35%,transparent_70%)] pointer-events-none -z-10" />
      {/* Subtle Sky-Blue Right Nebula */}
      <div className="fixed top-1/4 -right-48 w-[650px] h-[650px] bg-[radial-gradient(circle,rgba(56,189,248,0.06)_0%,transparent_65%)] blur-[160px] rounded-full pointer-events-none -z-10" />
      {/* Deep Violet-Blue Left Glow */}
      <div className="fixed bottom-1/3 -left-48 w-[650px] h-[650px] bg-[radial-gradient(circle,rgba(99,102,241,0.06)_0%,transparent_65%)] blur-[160px] rounded-full pointer-events-none -z-10" />
      {/* Deep Obsidian Black Vignette Anchor */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,1,5,0.85)_100%)] pointer-events-none -z-10" />

      {/* Futuristic 3D Cyber Decor Environment with Parallax & Perspective Grid */}
      <Decor3D />

      {/* Navigation Bar with Multi-Page switching */}
      <Navbar
        activePage={activePage}
        onNavigate={navigateTo}
        onOpenQuote={() => navigateTo('order', 'commande')}
      />

      {/* Main Content Rendered According to Active Page */}
      <main className="flex-1">
        {/* ========================================================================= */}
        {/* PAGE 1: CENTRE D'INFORMATION & GUIDES (RECHERCHE + CATÉGORIES EN HAUT)     */}
        {/* ========================================================================= */}
        {activePage === 'info' && (
          <InformationCenter onNavigate={navigateTo} />
        )}

        {/* ========================================================================= */}
        {/* PAGE 2: NOS RÉALISATIONS (PORTFOLIO DÉDIÉ)                                 */}
        {/* ========================================================================= */}
        {activePage === 'portfolio' && (
          <div className="pt-28 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
              <div className="flex items-center gap-2 text-xs text-slate-400 pb-4 border-b border-white/5 mb-8">
                <button
                  onClick={() => navigateTo('home')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  {language === 'fr' ? 'Accueil' : 'Home'}
                </button>
                <span>/</span>
                <span className="text-white font-medium">
                  {language === 'fr' ? 'Nos Réalisations' : 'Our Portfolio'}
                </span>
              </div>
            </div>

            <Portfolio onSelectProjectForQuote={handleSelectProjectForQuote} />

            <div className="mt-12 text-center">
              <button
                type="button"
                onClick={() => navigateTo('order', 'commande')}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all cursor-pointer"
              >
                <span>{language === 'fr' ? 'Configurer mon site avec ce style' : 'Configure my site in this style'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 3: TARIFS & COMMANDE (CONFIGURATEUR SUR MESURE)                       */}
        {/* ========================================================================= */}
        {activePage === 'order' && (
          <div className="pt-28 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
              <div className="flex items-center gap-2 text-xs text-slate-400 pb-4 border-b border-white/5 mb-8">
                <button
                  onClick={() => navigateTo('home')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  {language === 'fr' ? 'Accueil' : 'Home'}
                </button>
                <span>/</span>
                <span className="text-white font-medium">
                  {language === 'fr' ? 'Tarifs & Commande' : 'Pricing & Order'}
                </span>
              </div>
            </div>

            {/* Tarifs Selector */}
            <Pricing onSelectPlan={(plan) => setSelectedPlan(plan)} />

            {/* Hébergement — Choix du client */}
            <HostingSection onSelectHosting={handleSelectHosting} />

            {/* Votre nom de domaine */}
            <DomainSection />

            {/* Configurateur de commande */}
            <div className="mt-12" id="commande">
              <OrderConfigurator
                key={`${selectedPlan}-${hostingOption}-${hostingDuration}`}
                initialPlan={selectedPlan}
                initialHostingOption={hostingOption}
                initialHostingDuration={hostingDuration}
              />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 4: PACK CHANGEMENT (1 500 DH) & CONTACT                               */}
        {/* ========================================================================= */}
        {activePage === 'changement' && (
          <div className="pt-28 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
              <div className="flex items-center gap-2 text-xs text-slate-400 pb-4 border-b border-white/5 mb-8">
                <button
                  onClick={() => navigateTo('home')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  {language === 'fr' ? 'Accueil' : 'Home'}
                </button>
                <span>/</span>
                <span className="text-white font-medium">
                  {language === 'fr' ? 'Pack Changement (1 500 DH)' : 'Pack Changement (1,500 DH)'}
                </span>
              </div>
            </div>

            <ContactSection />
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 5: ACCUEIL (PAGE PRINCIPALE COMPACTE ET ÉLÉGANTE)                     */}
        {/* ========================================================================= */}
        {activePage === 'home' && (
          <>
            {/* Hero Section */}
            <Hero
              onOpenQuote={() => navigateTo('order', 'commande')}
              onNavigate={navigateTo}
            />

            {/* Services Section */}
            <Services onOpenQuote={() => navigateTo('order', 'commande')} />

            {/* Comment ça marche (Timeline 4 étapes) */}
            <HowItWorks />

            {/* Pourquoi Nexivo ? (Nos engagements de transparence et propriété) */}
            <WhyNexivo />

            {/* ======================================================================= */}
            {/* PORTAIL DES ESPACES & SERVICES NEXIVO (ACCÈS AUX NOUVELLES PAGES)      */}
            {/* ======================================================================= */}
            <section className="py-20 relative z-10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ScrollReveal yOffset={30}>
                  <div className="text-center max-w-3xl mx-auto mb-14">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 mb-3">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{language === 'fr' ? 'Nos Espaces Dédiés' : 'Our Dedicated Sections'}</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
                      {language === 'fr'
                        ? 'Explorez toutes nos solutions sur leurs pages dédiées'
                        : 'Explore all our solutions on their dedicated pages'}
                    </h2>
                    <p className="mt-3 text-sm sm:text-base text-slate-300">
                      {language === 'fr'
                        ? 'Accédez directement à l’espace de votre choix pour découvrir nos projets, calculer vos tarifs ou consulter nos guides techniques.'
                        : 'Navigate directly to your desired space to view demo projects, calculate pricing, or browse our knowledge guides.'}
                    </p>
                  </div>
                </ScrollReveal>

                {/* 4 Cards Grid linking to dedicated pages */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Card 1: Réalisations */}
                  <ScrollReveal delay={0.1} yOffset={30}>
                    <div className="h-full rounded-2xl p-6 bg-[#080d21]/90 border border-blue-900/30 hover:border-blue-400/50 hover:bg-[#0d1433] transition-all duration-300 flex flex-col justify-between group shadow-xl hover:-translate-y-1">
                      <div>
                        <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-5 group-hover:scale-105 transition-transform">
                          <Layers className="w-6 h-6" />
                        </div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-blue-400 mb-1">
                          {language === 'fr' ? 'Portfolio' : 'Portfolio'}
                        </div>
                        <h3 className="text-lg font-bold text-white font-display mb-2">
                          {language === 'fr' ? 'Nos Réalisations' : 'Our Projects'}
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed mb-6">
                          {language === 'fr'
                            ? 'Découvrez nos maquettes interactives par secteur : restauration, immobilier, fitness, consulting et e-commerce.'
                            : 'Explore our interactive demo designs across restaurants, real estate, fitness, consulting, and e-commerce.'}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => navigateTo('portfolio')}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 hover:border-blue-500 text-xs font-semibold transition-all cursor-pointer"
                      >
                        <span>{language === 'fr' ? 'Voir les réalisations' : 'View projects'}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </ScrollReveal>

                  {/* Card 2: Tarifs & Commande */}
                  <ScrollReveal delay={0.15} yOffset={30}>
                    <div className="h-full rounded-2xl p-6 bg-[#080d21]/90 border border-blue-900/30 hover:border-blue-400/50 hover:bg-[#0d1433] transition-all duration-300 flex flex-col justify-between group shadow-xl hover:-translate-y-1">
                      <div>
                        <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-5 group-hover:scale-105 transition-transform">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 mb-1">
                          {language === 'fr' ? '3 500 DH à 7 000 DH' : '3,500 DH to 7,000 DH'}
                        </div>
                        <h3 className="text-lg font-bold text-white font-display mb-2">
                          {language === 'fr' ? 'Tarifs & Commande' : 'Pricing & Ordering'}
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed mb-6">
                          {language === 'fr'
                            ? 'Formules Starter, Pro et Business. Simulez votre tarif en temps réel et configurez votre site sans aucun abonnement forcé.'
                            : 'Starter, Pro, and Business plans. Calculate your price in real-time and configure your site with zero forced subscriptions.'}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => navigateTo('order', 'commande')}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 hover:border-indigo-500 text-xs font-semibold transition-all cursor-pointer"
                      >
                        <span>{language === 'fr' ? 'Calculer mon devis' : 'Calculate my quote'}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </ScrollReveal>

                  {/* Card 3: Pack Changement */}
                  <ScrollReveal delay={0.2} yOffset={30}>
                    <div className="h-full rounded-2xl p-6 bg-[#080d21]/90 border border-amber-900/30 hover:border-amber-400/50 hover:bg-[#121124] transition-all duration-300 flex flex-col justify-between group shadow-xl hover:-translate-y-1">
                      <div>
                        <div className="w-12 h-12 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-105 transition-transform">
                          <RefreshCw className="w-6 h-6" />
                        </div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-1">
                          {language === 'fr' ? '1 500 DH Fixe' : '1,500 DH Flat'}
                        </div>
                        <h3 className="text-lg font-bold text-white font-display mb-2">
                          {language === 'fr' ? 'Pack Changement' : 'Redesign Pack'}
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed mb-6">
                          {language === 'fr'
                            ? 'Vous possédez déjà un site internet ? Rajeunissez-le sous 7 jours avec un design ultra moderne et un référencement optimal.'
                            : 'Already have a website? Refresh it in 7 days with a cutting-edge aesthetic and optimized speed.'}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => navigateTo('changement')}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/30 hover:border-amber-500 text-xs font-semibold transition-all cursor-pointer"
                      >
                        <span>{language === 'fr' ? 'Découvrir le Pack' : 'Explore the Pack'}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </ScrollReveal>

                  {/* Card 4: Centre d'Information & FAQ */}
                  <ScrollReveal delay={0.25} yOffset={30}>
                    <div className="h-full rounded-2xl p-6 bg-[#080d21]/90 border border-sky-900/30 hover:border-sky-400/50 hover:bg-[#0c142c] transition-all duration-300 flex flex-col justify-between group shadow-xl hover:-translate-y-1">
                      <div>
                        <div className="w-12 h-12 rounded-2xl bg-sky-600/20 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-5 group-hover:scale-105 transition-transform">
                          <BookOpen className="w-6 h-6" />
                        </div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-sky-400 mb-1">
                          {language === 'fr' ? 'Recherche & Guides' : 'Search & Guides'}
                        </div>
                        <h3 className="text-lg font-bold text-white font-display mb-2">
                          {language === 'fr' ? 'Centre d’Information' : 'Information Center'}
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed mb-6">
                          {language === 'fr'
                            ? 'Moteur de recherche dédié, explications sur les domaines (100% à vous), serveurs et toutes les questions fréquentes.'
                            : 'Dedicated search bar, detailed domain ownership rules, server specs, and frequently asked questions.'}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => navigateTo('info')}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600/20 hover:bg-sky-600 text-sky-300 hover:text-white border border-sky-500/30 hover:border-sky-500 text-xs font-semibold transition-all cursor-pointer"
                      >
                        <span>{language === 'fr' ? 'Consulter les infos' : 'Browse knowledge'}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            </section>

            {/* CTA Final */}
            <FinalCta onOpenQuote={() => navigateTo('order', 'commande')} />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={navigateTo} />

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp />

      {/* Interactive WhatsApp Chatbot Widget */}
      <WhatsAppChatWidget />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <CurrencyProvider>
        <ToastProvider>
          <WhatsAppChatProvider>
            <MainAppContent />
          </WhatsAppChatProvider>
        </ToastProvider>
      </CurrencyProvider>
    </LanguageProvider>
  );
}
