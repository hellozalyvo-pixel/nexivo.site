import {
  Check,
  Sparkles,
  ArrowRight,
  Shield,
  Info,
  MessageCircle,
  Video,
  Instagram,
  Facebook,
  MapPin,
  PhoneCall,
  PlusCircle,
  Palette,
  RefreshCw,
  Crown,
  Zap,
  Gem,
} from 'lucide-react';
import { PricingPlan } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import ScrollReveal from './ScrollReveal';

interface PricingProps {
  onSelectPlan: (planId: 'starter' | 'pro' | 'business') => void;
}

const SUPPLEMENT_ICONS: Record<string, React.ElementType> = {
  whatsapp: MessageCircle,
  tiktok: Video,
  instagram: Instagram,
  facebook: Facebook,
  maps: MapPin,
  call: PhoneCall,
};

export default function Pricing({ onSelectPlan }: PricingProps) {
  const { t, pricingPlans, supplementsData, language } = useLanguage();
  const { starter, pro, business } = pricingPlans;
  const plans: PricingPlan[] = [starter, pro, business];
  const { formatPrice, currency, currentCurrencyInfo } = useCurrency();

  const scrollToConfigurator = () => {
    const el = document.getElementById('commander');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="tarifs" className="py-24 relative">
      {/* Background glow behind center card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[520px] bg-[radial-gradient(circle,rgba(37,99,235,0.18)_0%,rgba(30,58,138,0.08)_50%,transparent_75%)] blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal yOffset={35}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 mb-4">
              <span>{t.pricing.badge}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-300 font-normal">
                {t.pricing.currencyLabel} {currentCurrencyInfo.flag} {currentCurrencyInfo.code}
              </span>
            </div>
            <h2
              id="pricing-title"
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-display"
            >
              <span className="text-3d-heading inline-block mr-2">
                {t.pricing.titlePart1}
              </span>{' '}
              <span className="text-cyan-300 text-3d-cyan-glow inline-block">
                {t.pricing.titleHighlight}
              </span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-200 max-w-2xl mx-auto text-3d-subtitle">
              {t.pricing.subtitle}
            </p>
          </div>
        </ScrollReveal>

        {/* 3 Pricing Cards Grid with Progressively Styled Backgrounds */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => {
            const isStarter = plan.id === 'starter';
            const isPro = plan.id === 'pro';
            const isBusiness = plan.id === 'business';
            const formattedPrice = formatPrice(plan.basePriceMAD);

            // Container card styling: More expensive = richer, more stylish background & effects
            let cardClasses = '';
            if (isStarter) {
              // Starter (3 500 DH): Clean, refined dark tech midnight canvas with subtle sky blue radial glow
              cardClasses =
                'bg-gradient-to-b from-[#0b1226]/95 via-[#070b18]/95 to-[#04060d] border border-blue-900/30 hover:border-sky-500/40 shadow-xl shadow-blue-950/20 backdrop-blur-md';
            } else if (isPro) {
              // Pro (5 000 DH): High-energy electric sapphire & vibrant indigo nebula with dual neon border
              cardClasses =
                'bg-gradient-to-b from-[#102257] via-[#0b1438] to-[#070c22] border-2 border-blue-500/80 shadow-2xl shadow-blue-600/30 ring-1 ring-cyan-400/40 lg:-translate-y-3';
            } else {
              // Business (7 000 DH - L'OFFRE LA PLUS CHÈRE): Supreme VIP luxury royal velvet obsidian, golden-amber & imperial amethyst glow with gilded chromatic border
              cardClasses =
                'bg-gradient-to-b from-[#1f0e38] via-[#120826] to-[#090314] border-2 border-amber-400/60 hover:border-amber-300 shadow-2xl shadow-purple-950/90 hover:shadow-purple-700/50 ring-2 ring-amber-400/30 hover:ring-amber-300/60 lg:-translate-y-1.5';
            }

            return (
              <ScrollReveal key={plan.id} delay={index * 0.12} yOffset={40} className="h-full">
                <div
                  id={`pricing-card-${plan.id}`}
                  className={`relative rounded-3xl p-8 transition-all duration-300 flex flex-col justify-between h-full overflow-hidden group ${cardClasses}`}
                >
                  {/* Custom Background Light Effects - Distinct for each tier */}
                  {isStarter && (
                    <>
                      <div className="absolute -top-24 -left-24 w-56 h-56 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute -bottom-24 -right-24 w-56 h-56 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
                    </>
                  )}

                  {isPro && (
                    <>
                      {/* Pro Electric Aura: Dual radial glows + light sweep */}
                      <div className="absolute -top-28 -right-20 w-72 h-72 bg-blue-500/25 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/35 transition-colors" />
                      <div className="absolute top-1/2 -left-20 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.22)_0%,transparent_65%)] pointer-events-none" />
                      <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />
                    </>
                  )}

                  {isBusiness && (
                    <>
                      {/* Business Supreme Luxury: Golden Celestial flare + Imperial Amethyst nebula + Starlight sheen */}
                      <div className="absolute -top-32 -right-20 w-80 h-80 bg-gradient-to-br from-amber-400/30 via-purple-600/20 to-transparent rounded-full blur-3xl pointer-events-none group-hover:from-amber-400/40 transition-colors" />
                      <div className="absolute -bottom-24 -left-20 w-80 h-80 bg-gradient-to-tr from-purple-600/30 via-fuchsia-600/20 to-transparent rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.18)_0%,transparent_60%)] pointer-events-none" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.2)_0%,transparent_60%)] pointer-events-none" />
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-400/10 via-transparent to-transparent pointer-events-none" />
                    </>
                  )}

                  {/* Top Badge: Customized based on tier hierarchy */}
                  {isStarter && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3.5 py-0.5 rounded-full bg-slate-900 border border-sky-500/30 text-sky-300 text-[10px] font-bold shadow-md shadow-black/40">
                      <Zap className="w-3 h-3 text-sky-400" />
                      <span>{language === 'fr' ? 'Offre Essentielle' : 'Starter Package'}</span>
                    </div>
                  )}

                  {isPro && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white text-xs font-bold shadow-lg shadow-blue-600/40 border border-cyan-400/40">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{plan.badge || (language === 'fr' ? '★ LE PLUS POPULAIRE' : '★ MOST POPULAR')}</span>
                    </div>
                  )}

                  {isBusiness && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-purple-600 to-amber-500 text-white text-xs font-black shadow-xl shadow-amber-500/30 border border-amber-300/60 tracking-wider uppercase">
                      <Crown className="w-3.5 h-3.5 text-amber-200 fill-amber-300" />
                      <span>{language === 'fr' ? '👑 HAUT DE GAMME VIP' : '👑 ULTIMATE VIP'}</span>
                    </div>
                  )}

                  <div className="relative z-10">
                    {/* Tier Subtitle Tag */}
                    <div className="mb-3">
                      {isStarter && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-[10px] font-bold uppercase tracking-wider text-sky-400">
                          <Zap className="w-3 h-3 text-sky-400" />
                          <span>{language === 'fr' ? 'Site Vitrine Standard' : 'Standard Showcase'}</span>
                        </span>
                      )}
                      {isPro && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                          <Sparkles className="w-3 h-3 text-cyan-300" />
                          <span>{language === 'fr' ? 'Performance & Conversion' : 'High Conversion'}</span>
                        </span>
                      )}
                      {isBusiness && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-400/40 text-[10px] font-black uppercase tracking-wider text-amber-300">
                          <Gem className="w-3 h-3 text-amber-300" />
                          <span>{language === 'fr' ? 'Expérience Sans Concession' : 'All-Inclusive Elite'}</span>
                        </span>
                      )}
                    </div>

                    {/* Plan Name */}
                    <div className="flex items-center justify-between mb-2">
                      <h3
                        className={`text-2xl sm:text-3xl font-extrabold tracking-wide font-display ${
                          isBusiness
                            ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-purple-200 to-white'
                            : isPro
                            ? 'text-white drop-shadow-[0_2px_8px_rgba(59,130,246,0.3)]'
                            : 'text-white'
                        }`}
                      >
                        {plan.name}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-300 mb-6 min-h-[36px] leading-relaxed">
                      {plan.description}
                    </p>

                    {/* Price Display */}
                    <div className="mb-6 pb-6 border-b border-white/10">
                      <div className="flex items-baseline gap-2">
                        <span
                          id={`pricing-price-${plan.id}`}
                          className={`text-4xl sm:text-5xl font-extrabold font-display tracking-tight transition-all text-3d-stat ${
                            isBusiness
                              ? 'text-amber-100'
                              : isPro
                              ? 'text-white text-3d-cyan-glow'
                              : 'text-white'
                          }`}
                        >
                          {formattedPrice}
                        </span>
                      </div>

                      {/* Reference in MAD if another currency is active */}
                      {currency !== 'MAD' && (
                        <div className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1.5 font-mono">
                          <span className="text-slate-400">{language === 'fr' ? 'Réf. officielle :' : 'Official ref:'}</span>
                          <span className={`font-semibold ${isBusiness ? 'text-amber-300' : 'text-blue-300'}`}>
                            {plan.basePriceMAD.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US')} DH
                          </span>
                        </div>
                      )}

                      {plan.period && (
                        <span className="text-xs font-medium text-slate-400 mt-1 block">
                          {plan.period}
                        </span>
                      )}
                    </div>

                    {/* Features List */}
                    <div className="space-y-3.5 mb-8">
                      <div className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                        {t.pricing.includedTitle}
                      </div>
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-sm text-slate-200">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                              isBusiness
                                ? 'bg-gradient-to-br from-amber-500/25 to-purple-500/25 border border-amber-400/50 text-amber-300 shadow-sm shadow-amber-500/20'
                                : isPro
                                ? 'bg-blue-500/25 border border-cyan-400/40 text-cyan-300 shadow-sm shadow-blue-500/30'
                                : 'bg-sky-500/10 border border-sky-500/25 text-sky-400'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <span className="leading-tight">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="relative z-10">
                    <button
                      id={`pricing-select-${plan.id}`}
                      onClick={() => onSelectPlan(plan.id)}
                      className={`w-full py-4 px-6 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                        isBusiness
                          ? 'bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:from-amber-400 hover:via-purple-500 hover:to-indigo-500 text-white font-black shadow-xl shadow-purple-600/35 hover:shadow-amber-500/50 border border-amber-300/40 hover:-translate-y-0.5'
                          : isPro
                          ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-400 text-white shadow-xl shadow-blue-600/35 hover:shadow-blue-500/50 border border-cyan-300/40 hover:-translate-y-0.5'
                          : 'bg-gradient-to-r from-blue-700/60 to-slate-800/80 hover:from-blue-600 hover:to-blue-700 text-white border border-blue-500/30 hover:border-blue-400/60 shadow-md shadow-blue-950/40'
                      }`}
                    >
                      <span>{plan.ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                      <Shield className={`w-3 h-3 ${isBusiness ? 'text-amber-400' : 'text-emerald-400'}`} />
                      <span className={isBusiness ? 'text-amber-200/80' : ''}>
                        {language === 'fr' ? 'Devis & contrat détaillé sans engagement' : 'Detailed quote with zero commitment'}
                      </span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Mention demandée sous les tarifs */}
        <ScrollReveal delay={0.2} yOffset={20}>
          <div className="mt-10 max-w-2xl mx-auto text-center">
            <div
              id="pricing-currency-disclaimer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-slate-400 leading-relaxed shadow-sm"
            >
              <Info className="w-4 h-4 text-blue-400 shrink-0" />
              <span>
                {language === 'fr'
                  ? 'Les conversions dans les autres devises sont indicatives. Le prix final peut être confirmé dans le devis.'
                  : 'Conversions in other currencies are indicative. Final price is confirmed on your quotation.'}
              </span>
            </div>
          </div>
        </ScrollReveal>

        {/* CATÉGORIE SUPPLÉMENT (50 DH chacun) */}
        <div id="pricing-supplements-section" className="mt-20 pt-16 border-t border-white/10">
          <ScrollReveal yOffset={30}>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.pricing.supplementsBadge}</span>
                <span className="text-slate-400">•</span>
                <span className="text-emerald-300 font-bold">50 DH / {language === 'fr' ? 'chacun' : 'each'}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
                {t.pricing.supplementsTitle}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                  {t.pricing.supplementsTitleHighlight}
                </span>
              </h3>
              <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
                {t.pricing.supplementsSubtitle}
              </p>
            </div>
          </ScrollReveal>

          {/* Branding Banner: Logo & Nom de l'entreprise */}
          <ScrollReveal delay={0.1} yOffset={30}>
            <div className="mb-8 rounded-2xl p-6 bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-blue-500/10 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
                  <Palette className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {language === 'fr' ? 'Nouveau supplément' : 'New Add-on'}
                    </span>
                    <span className="text-xs font-bold text-slate-300">
                      {language === 'fr' ? 'Choix obligatoire au configurateur' : 'Mandatory selection in configurator'}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white">
                    {language === 'fr'
                      ? 'Création du Logo & Nom de l’entreprise'
                      : 'Company Logo & Brand Name Creation'}
                  </h4>
                  <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
                    {language === 'fr'
                      ? `Si vous souhaitez que Zalyvo conçoive votre logo sur-mesure et recherche votre nom de marque : +${formatPrice(500)}. Si vous avez déjà vos éléments, c’est 100% gratuit (0 DH) !`
                      : `If you want Zalyvo to design your custom logo and create your brand name: +${formatPrice(500)}. If you already have your own assets, it is 100% free (0 DH)!`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-white/10">
                <div className="text-right">
                  <div className="text-xs text-slate-400">{language === 'fr' ? 'Option' : 'Option'}</div>
                  <div className="font-extrabold text-amber-300 font-mono text-sm">+{formatPrice(500)} / 0 DH</div>
                </div>
                <button
                  type="button"
                  onClick={scrollToConfigurator}
                  className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>{language === 'fr' ? 'Choisir' : 'Select'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Supplements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {supplementsData.map((supp, idx) => {
              const IconComp = SUPPLEMENT_ICONS[supp.id] || Sparkles;
              const formattedPrice = formatPrice(supp.basePriceMAD);

              return (
                <ScrollReveal key={supp.id} delay={idx * 0.08} yOffset={30} className="h-full">
                  <div
                    id={`supplement-pricing-item-${supp.id}`}
                    className="group relative rounded-2xl p-6 bg-[#0a0d18] border border-white/10 hover:border-emerald-500/40 hover:bg-[#0d1222] transition-all duration-300 flex flex-col justify-between h-full"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                          <IconComp className="w-5 h-5" />
                        </div>
                        <div className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-xs font-mono">
                          +{formattedPrice}
                        </div>
                      </div>

                      <h4 className="text-base font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                        {supp.name}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {supp.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                      <span className="text-slate-400">
                        {currency !== 'MAD' ? `(200 DH ${language === 'fr' ? 'officiel' : 'official'})` : (language === 'fr' ? 'Option à la carte' : 'A la carte add-on')}
                      </span>
                      <button
                        type="button"
                        onClick={scrollToConfigurator}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                      >
                        <span>{t.pricing.supplementsAddBtn}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          <ScrollReveal delay={0.2} yOffset={25}>
            <div className="mt-8 text-center">
              <button
                id="pricing-configure-supplements-btn"
                onClick={scrollToConfigurator}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-bold shadow-lg shadow-emerald-600/25 transition-all duration-300 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>
                  {language === 'fr'
                    ? 'Configurer ma commande avec mes suppléments'
                    : 'Configure my order with add-ons'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </ScrollReveal>
        </div>

        {/* Bannière Pack Changement (1 500 DH) */}
        <ScrollReveal delay={0.2} yOffset={35}>
          <div id="pricing-pack-changement-banner" className="mt-16 max-w-5xl mx-auto rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#120f26] via-[#0d1326] to-[#0b1022] border border-amber-500/30 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                  <span>{language === 'fr' ? 'MODIFICATION DE SITE EXISTANT' : 'EXISTING SITE MODIFICATION'}</span>
                </div>
                <h3 className="text-2xl font-extrabold text-white font-display">
                  {language === 'fr' ? 'Pack Changement — 1 500 DH' : 'Change Pack — 1,500 DH'}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {language === 'fr'
                    ? 'Vous avez déjà un site web créé et souhaitez changer son design, ses textes ou le moderniser ? Commandez le Pack Changement sans option d’hébergement ni suppléments imposés.'
                    : 'Already have a website and want to revamp its design, update content or modernize it? Order the Change Pack without mandatory hosting or add-ons.'}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 shrink-0">
                <div className="text-2xl font-extrabold text-amber-400 font-display">
                  {formatPrice(1500)}
                  <span className="text-xs text-slate-400 font-normal ml-2">
                    {language === 'fr' ? 'tarif fixe' : 'fixed price'}
                  </span>
                </div>
                <a
                  href="#changement"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-sm shadow-xl shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <span>{language === 'fr' ? 'Commander le Pack Changement' : 'Order Change Pack'}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
