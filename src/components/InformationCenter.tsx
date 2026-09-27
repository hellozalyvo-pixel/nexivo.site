import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useWhatsAppChat } from '../context/WhatsAppChatContext';
import {
  INFO_CATEGORIES,
  INFO_ARTICLES_FR,
  INFO_ARTICLES_EN,
  CategoryDefinition,
} from '../data/informationData';
import { ActivePage, InfoArticle, InfoCategory } from '../types';
import ScrollReveal from './ScrollReveal';
import DomainSection from './DomainSection';
import HostingSection from './HostingSection';
import FaqSection from './FaqSection';
import {
  Search,
  X,
  Sparkles,
  Globe,
  Server,
  CreditCard,
  Clock,
  RefreshCw,
  ShieldCheck,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Layers,
  HardDrive,
  CheckCircle,
  DollarSign,
  Calendar,
  Zap,
  Smartphone,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

interface InformationCenterProps {
  onNavigate: (page: ActivePage, anchorId?: string) => void;
}

// Icon mapper helper
const renderIcon = (iconName: string, className: string = 'w-5 h-5') => {
  switch (iconName) {
    case 'Globe':
      return <Globe className={className} />;
    case 'Server':
      return <Server className={className} />;
    case 'CreditCard':
      return <CreditCard className={className} />;
    case 'Clock':
      return <Clock className={className} />;
    case 'RefreshCw':
      return <RefreshCw className={className} />;
    case 'ShieldCheck':
      return <ShieldCheck className={className} />;
    case 'HelpCircle':
      return <HelpCircle className={className} />;
    case 'Layers':
      return <Layers className={className} />;
    case 'HardDrive':
      return <HardDrive className={className} />;
    case 'CheckCircle':
      return <CheckCircle className={className} />;
    case 'DollarSign':
      return <DollarSign className={className} />;
    case 'Calendar':
      return <Calendar className={className} />;
    case 'Zap':
      return <Zap className={className} />;
    case 'Smartphone':
      return <Smartphone className={className} />;
    default:
      return <BookOpen className={className} />;
  }
};

export default function InformationCenter({ onNavigate }: InformationCenterProps) {
  const { language } = useLanguage();
  const { openChat } = useWhatsAppChat();

  const [activeCategory, setActiveCategory] = useState<InfoCategory>('all');
  const [searchInput, setSearchInput] = useState<string>('');
  const [appliedSearch, setAppliedSearch] = useState<string>('');
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null);

  // Pick dataset based on language
  const allArticles = useMemo(() => {
    return language === 'fr' ? INFO_ARTICLES_FR : INFO_ARTICLES_EN;
  }, [language]);

  // Handle instant or button click search
  const handleExecuteSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAppliedSearch(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setAppliedSearch('');
  };

  const handleSelectSuggestedKeyword = (keyword: string) => {
    setSearchInput(keyword);
    setAppliedSearch(keyword);
  };

  // Filter articles based on active category & applied search query
  const filteredArticles = useMemo(() => {
    return allArticles.filter((article) => {
      // Category filter
      const matchesCategory =
        activeCategory === 'all' || article.category === activeCategory;

      if (!matchesCategory) return false;

      // Text search filter
      const query = appliedSearch.toLowerCase().trim();
      if (!query) return true;

      const titleMatch = article.title.toLowerCase().includes(query);
      const shortAnswerMatch = article.shortAnswer.toLowerCase().includes(query);
      const detailsMatch = article.fullDetails.some((d) =>
        d.toLowerCase().includes(query)
      );
      const tagsMatch = article.tags.some((t) => t.toLowerCase().includes(query));

      return titleMatch || shortAnswerMatch || detailsMatch || tagsMatch;
    });
  }, [allArticles, activeCategory, appliedSearch]);

  // Count items per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allArticles.length };
    INFO_CATEGORIES.forEach((cat) => {
      if (cat.id !== 'all') {
        counts[cat.id] = allArticles.filter((a) => a.category === cat.id).length;
      }
    });
    return counts;
  }, [allArticles]);

  const toggleArticle = (id: string) => {
    setExpandedArticleId((prev) => (prev === id ? null : id));
  };

  // Suggested keywords in French & English
  const suggestedKeywords =
    language === 'fr'
      ? ['Nom de domaine', 'Hébergement', 'Prix 3 500 DH', 'Pack 1 500 DH', 'Délais', 'Propriété 100%']
      : ['Domain name', 'Web hosting', 'Price 3,500 DH', 'Pack 1,500 DH', 'Turnaround', 'Ownership'];

  return (
    <div id="page-information-center" className="min-h-screen pt-24 pb-20">
      {/* Background Lighting */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumb & Return to Home */}
        <div className="flex items-center justify-between pb-6 border-b border-white/5 mb-8">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-blue-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>{language === 'fr' ? 'Accueil' : 'Home'}</span>
            </button>
            <span>/</span>
            <span className="text-white font-medium">
              {language === 'fr' ? 'Centre d’Information & Guides' : 'Information Center & Guides'}
            </span>
          </div>

          <button
            onClick={() => onNavigate('home')}
            className="text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
          >
            ← {language === 'fr' ? 'Retour au site principal' : 'Back to main website'}
          </button>
        </div>

        {/* HERO SECTION OF INFORMATION CENTER */}
        <ScrollReveal yOffset={25}>
          <div className="text-center max-w-4xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-semibold text-blue-400 mb-4 shadow-lg shadow-blue-500/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {language === 'fr'
                  ? 'BASE DE CONNAISSANCES & GUIDES OFFICIELS'
                  : 'OFFICIAL KNOWLEDGE BASE & GUIDES'}
              </span>
            </div>

            <h1
              id="info-center-main-title"
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-display mb-4"
            >
              <span className="text-3d-heading inline-block mr-2">
                {language === 'fr' ? 'Toutes les' : 'All Official'}
              </span>{' '}
              <span className="text-cyan-300 text-3d-cyan-glow inline-block mr-2">
                {language === 'fr' ? 'Informations & Règles' : 'Information & Rules'}
              </span>{' '}
              <span className="text-3d-heading inline-block">
                {language === 'fr' ? 'sur vos projets' : 'about your website'}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl mx-auto text-3d-subtitle">
              {language === 'fr'
                ? 'Trouvez immédiatement toutes les réponses détaillées sur les noms de domaine, l’hébergement, les tarifs, les délais de livraison et le Pack Changement.'
                : 'Instantly find clear, detailed answers regarding domain names, hosting options, official pricing, delivery timelines, and Pack Changement.'}
            </p>
          </div>
        </ScrollReveal>

        {/* ========================================================================= */}
        {/* BARRE DE RECHERCHE D'INFORMATIONS AVEC BOUTON DE RECHERCHE (EN HAUT)     */}
        {/* ========================================================================= */}
        <ScrollReveal yOffset={20} delay={0.1}>
          <div className="max-w-3xl mx-auto mb-10">
            <form
              onSubmit={handleExecuteSearch}
              id="info-search-form"
              className="relative flex items-center bg-[#090b14] border border-blue-500/30 rounded-2xl p-2 shadow-2xl shadow-blue-900/20 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all"
            >
              <div className="pl-3.5 pr-2 text-blue-400 shrink-0">
                <Search className="w-5 h-5" />
              </div>

              <input
                type="text"
                id="info-search-input"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  // Dynamic live search as you type
                  setAppliedSearch(e.target.value);
                }}
                placeholder={
                  language === 'fr'
                    ? 'Rechercher une info (ex: nom de domaine, hébergement, 1 500 DH, délais, propriété, cash)...'
                    : 'Search information (e.g. domain name, hosting, 1,500 DH, timeline, ownership, cash)...'
                }
                className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-400 outline-none px-2 py-2"
              />

              {searchInput && (
                <button
                  type="button"
                  id="info-clear-search-btn"
                  onClick={handleClearSearch}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer mr-1"
                  title={language === 'fr' ? 'Effacer la recherche' : 'Clear search'}
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* BOUTON DE RECHERCHE DÉDIÉ */}
              <button
                type="submit"
                id="info-search-submit-btn"
                className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>{language === 'fr' ? 'Rechercher' : 'Search'}</span>
              </button>
            </form>

            {/* Mots-clés suggérés en accès rapide */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="text-slate-400 font-medium">
                {language === 'fr' ? 'Sujets fréquents :' : 'Popular topics:'}
              </span>
              {suggestedKeywords.map((kw) => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => handleSelectSuggestedKeyword(kw)}
                  className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-blue-600/20 border border-white/10 hover:border-blue-500/30 text-slate-300 hover:text-blue-300 transition-all cursor-pointer text-[11px]"
                >
                  {kw}
                </button>
              ))}
            </div>

            {/* Compteur de résultats si recherche active */}
            {appliedSearch && (
              <div className="mt-4 flex items-center justify-between p-3 rounded-xl bg-blue-950/30 border border-blue-500/20 text-xs">
                <span className="text-blue-300">
                  {language === 'fr'
                    ? `${filteredArticles.length} résultat(s) trouvé(s) pour « ${appliedSearch} »`
                    : `${filteredArticles.length} result(s) found for "${appliedSearch}"`}
                </span>
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="text-slate-400 hover:text-white underline cursor-pointer"
                >
                  {language === 'fr' ? 'Réinitialiser la recherche' : 'Reset search'}
                </button>
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* ========================================================================= */}
        {/* BARRE DE CATÉGORIES (GATERGORIES)                                          */}
        {/* ========================================================================= */}
        <ScrollReveal yOffset={20} delay={0.15}>
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {language === 'fr' ? 'Filtrer par Catégorie' : 'Filter by Category'}
              </h2>
              <span className="text-xs text-slate-400">
                {categoryCounts[activeCategory] || 0} {language === 'fr' ? 'guides' : 'guides'}
              </span>
            </div>

            {/* Category Pills Grid */}
            <div
              id="info-categories-bar"
              className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5"
            >
              {INFO_CATEGORIES.map((cat: CategoryDefinition) => {
                const isActive = activeCategory === cat.id;
                const count = categoryCounts[cat.id] ?? 0;

                return (
                  <button
                    key={cat.id}
                    id={`cat-btn-${cat.id}`}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all cursor-pointer relative group ${
                      isActive
                        ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-600/20 ring-1 ring-blue-400/40'
                        : 'bg-[#090b14] border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 transition-transform group-hover:scale-110 ${
                        isActive
                          ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
                          : 'bg-white/5 text-slate-400 group-hover:text-blue-400'
                      }`}
                    >
                      {renderIcon(cat.icon, 'w-4 h-4')}
                    </div>

                    <span className="text-xs font-bold leading-tight mb-1">
                      {language === 'fr' ? cat.labelFr : cat.labelEn}
                    </span>

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                        isActive
                          ? 'bg-blue-500/30 text-blue-200'
                          : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* ========================================================================= */}
        {/* GRILLE D'ARTICLES ET FICHES D'INFORMATIONS FILTRÉES                       */}
        {/* ========================================================================= */}
        <div className="space-y-6">
          {filteredArticles.length === 0 ? (
            /* Aucun résultat trouvé */
            <div className="text-center py-16 px-4 rounded-3xl bg-[#090b14] border border-white/10">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto mb-4">
                <HelpCircle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {language === 'fr'
                  ? 'Aucune information ne correspond à votre recherche'
                  : 'No information matches your search'}
              </h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
                {language === 'fr'
                  ? `Aucun guide trouvé pour « ${appliedSearch} » dans la catégorie sélectionnée. Essayez un autre mot-clé ou contactez directement notre assistant.`
                  : `No guide found for "${appliedSearch}" in this category. Try another keyword or contact our assistant directly.`}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    handleClearSearch();
                    setActiveCategory('all');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  {language === 'fr' ? 'Réinitialiser tous les filtres' : 'Reset all filters'}
                </button>
                <button
                  type="button"
                  onClick={() => openChat()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>
                    {language === 'fr'
                      ? 'Poser ma question sur WhatsApp'
                      : 'Ask my question on WhatsApp'}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            /* Liste des fiches d'informations */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredArticles.map((article: InfoArticle, idx: number) => {
                const isExpanded = expandedArticleId === article.id;

                return (
                  <ScrollReveal
                    key={article.id}
                    delay={idx * 0.05}
                    yOffset={25}
                    className="flex flex-col"
                  >
                    <div className="flex-1 rounded-3xl bg-[#090b14] border border-white/10 hover:border-blue-500/30 p-6 sm:p-7 transition-all duration-300 shadow-xl flex flex-col justify-between">
                      <div>
                        {/* Header of Card */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                            {renderIcon(article.iconName, 'w-5 h-5')}
                          </div>
                          {article.badge && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[11px] font-semibold">
                              {article.badge}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-white font-display mb-3 leading-snug">
                          {article.title}
                        </h3>

                        {/* Short Answer (Prominent) */}
                        <p className="text-sm font-medium text-blue-200/90 bg-blue-950/20 border border-blue-500/20 rounded-xl p-3.5 mb-4 leading-relaxed">
                          {article.shortAnswer}
                        </p>

                        {/* Expandable Deep Details */}
                        {isExpanded && (
                          <div className="pt-2 pb-4 space-y-2.5 text-xs text-slate-300 border-t border-white/5 animate-in fade-in-50 duration-200">
                            {article.fullDetails.map((detail, dIdx) => (
                              <div key={dIdx} className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                <span className="leading-relaxed">{detail}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-2 mt-4">
                        <button
                          type="button"
                          onClick={() => toggleArticle(article.id)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer py-1"
                        >
                          <span>
                            {isExpanded
                              ? language === 'fr'
                                ? 'Masquer les détails'
                                : 'Hide details'
                              : language === 'fr'
                              ? 'Voir les détails complets'
                              : 'View full details'}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5 text-blue-400" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </button>

                        {/* Contextual Action Button */}
                        {article.actionType === 'order' && (
                          <button
                            type="button"
                            onClick={() => onNavigate('order')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                          >
                            <span>{language === 'fr' ? 'Commander' : 'Order'}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}

                        {article.actionType === 'changement' && (
                          <button
                            type="button"
                            onClick={() => onNavigate('changement')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                          >
                            <span>{language === 'fr' ? 'Pack 1 500 DH' : 'Pack 1,500 DH'}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}

                        {article.actionType === 'domain' && (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveCategory('domain');
                              const el = document.getElementById('domain-detailed-section');
                              if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                          >
                            <span>{language === 'fr' ? 'Guide domaine' : 'Domain guide'}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}

                        {article.actionType === 'whatsapp' && (
                          <button
                            type="button"
                            onClick={() => openChat()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>{language === 'fr' ? 'WhatsApp' : 'WhatsApp'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SECTIONS DÉTAILLÉES INTÉGRÉES SUR LA PAGE D'INFORMATIONS                  */}
        {/* (Explications Noms de domaine, Hébergement interactif, FAQ)               */}
        {/* ========================================================================= */}
        <div className="mt-20 pt-16 border-t border-white/10 space-y-20">
          {/* Section Noms de domaine */}
          <div id="domain-detailed-section">
            <DomainSection />
          </div>

          {/* Section Hébergement & Serveurs avec sélecteur de durée interactif */}
          <div id="hosting-detailed-section">
            <HostingSection
              onSelectHosting={(opt, dur) => {
                onNavigate('order');
              }}
            />
          </div>

          {/* Section FAQ Accordéons */}
          <div id="faq-detailed-section">
            <FaqSection />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* EN-TÊTE D'ASSISTANCE WHATSAPP & SUPPORT SI QUESTION PARTICULIÈRE         */}
        {/* ========================================================================= */}
        <ScrollReveal yOffset={30}>
          <div className="mt-16 rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-[#0c1229] via-[#090b14] to-[#120e24] border border-blue-500/30 shadow-2xl relative overflow-hidden text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-400 mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{language === 'fr' ? 'Support Disponible 7j/7' : 'Support Available 7/7'}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-white font-display mb-3">
              {language === 'fr'
                ? 'Une question spécifique ou un projet sur-mesure ?'
                : 'Have a specific question or a tailored project?'}
            </h3>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed">
              {language === 'fr'
                ? 'Notre équipe d’experts web et notre assistant WhatsApp répondent à vos questions en moins de 24h avec des conseils personnalisés.'
                : 'Our web experts and WhatsApp assistant respond to your questions within 24 hours with personalized guidance.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                id="info-whatsapp-support-btn"
                onClick={() => openChat()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>
                  {language === 'fr'
                    ? 'Discuter avec l’Assistant Zalyvo'
                    : 'Chat with Zalyvo Assistant'}
                </span>
              </button>

              <button
                type="button"
                id="info-go-order-btn"
                onClick={() => onNavigate('order')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all cursor-pointer"
              >
                <span>{language === 'fr' ? 'Configurer mon site web' : 'Configure my website'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
