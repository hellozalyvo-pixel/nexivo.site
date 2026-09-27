import { useState, useId, FormEvent } from 'react';
import { SITE_CONFIG, HOSTING_DURATIONS_CONFIG, SUPPLEMENTS_CONFIG } from '../config';
import { HostingDuration, HostingOption, BrandingChoice } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { sendWebsiteOrderEmail, generateDirectMailtoUrl, WebsiteOrderPayload } from '../services/emailService';
import FileUploadZone from './FileUploadZone';
import ScrollReveal from './ScrollReveal';
import RatingProposalModal from './RatingProposalModal';
import InlineRatingCard from './InlineRatingCard';
import {
  Check,
  CheckCircle2,
  Sparkles,
  Send,
  MessageCircle,
  Banknote,
  ShieldCheck,
  Calendar,
  Mail,
  Clock,
  Video,
  Instagram,
  Facebook,
  MapPin,
  PhoneCall,
  PlusCircle,
  Palette,
  AlertCircle,
  Crown,
  Zap,
  Gem,
} from 'lucide-react';

interface OrderConfiguratorProps {
  initialPlan?: 'starter' | 'pro' | 'business';
  initialHostingOption?: HostingOption;
  initialHostingDuration?: HostingDuration;
}

const SUPPLEMENT_ICONS: Record<string, React.ElementType> = {
  whatsapp: MessageCircle,
  tiktok: Video,
  instagram: Instagram,
  facebook: Facebook,
  maps: MapPin,
  call: PhoneCall,
};

export default function OrderConfigurator({
  initialPlan = 'pro',
  initialHostingOption = 'client',
  initialHostingDuration = '12m',
}: OrderConfiguratorProps) {
  const { currency, formatPrice } = useCurrency();
  const { showNotification } = useToast();
  const { t, supplementsData, language } = useLanguage();

  // Step 1: Formula
  const [selectedFormula, setSelectedFormula] = useState<'starter' | 'pro' | 'business'>(initialPlan);

  // Step 2: Hosting
  const [hostingType, setHostingType] = useState<HostingOption>(initialHostingOption);
  const [hostingDuration, setHostingDuration] = useState<HostingDuration>(initialHostingDuration);

  // Step 3: Supplements (50 DH each)
  const [selectedSupplements, setSelectedSupplements] = useState<string[]>([]);

  // Mandatory branding choice: Logo & Nom de l'entreprise
  const [brandingChoice, setBrandingChoice] = useState<BrandingChoice | null>(null);
  const [brandingError, setBrandingError] = useState(false);

  // Step 4: Information
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [country, setCountry] = useState(language === 'fr' ? 'Maroc' : 'Morocco');
  const [activityType, setActivityType] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [exampleFiles, setExampleFiles] = useState<File[]>([]);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);

  // Form IDs for accessibility
  const idPrefix = useId();
  const lastNameId = `${idPrefix}-lastName`;
  const firstNameId = `${idPrefix}-firstName`;
  const companyId = `${idPrefix}-company`;
  const emailId = `${idPrefix}-email`;
  const whatsappId = `${idPrefix}-whatsapp`;
  const countryId = `${idPrefix}-country`;
  const activityTypeId = `${idPrefix}-activityType`;
  const projectDescriptionId = `${idPrefix}-projectDescription`;

  // Toggle supplement selection
  const toggleSupplement = (suppId: string) => {
    setSelectedSupplements((prev) =>
      prev.includes(suppId) ? prev.filter((id) => id !== suppId) : [...prev, suppId]
    );
  };

  // Pricing calculations
  const currentPlan = SITE_CONFIG.pricing[selectedFormula];
  const siteCreationMAD = currentPlan.basePriceMAD;

  const hostingMAD =
    hostingType === 'zalyvo' ? HOSTING_DURATIONS_CONFIG[hostingDuration].basePriceMAD : 0;

  // 200 DH per supplement item
  const supplementsMAD = selectedSupplements.length * 200;

  // 500 DH if Zalyvo creates the logo & company name, 0 DH if own
  const brandingMAD = brandingChoice === 'with_branding' ? 500 : 0;

  const totalMAD = siteCreationMAD + hostingMAD + supplementsMAD + brandingMAD;

  // Formatted amounts in the chosen currency
  const formattedCreationPrice = formatPrice(siteCreationMAD);
  const formattedHostingPrice = formatPrice(hostingMAD);
  const formattedSupplementsPrice = formatPrice(supplementsMAD);
  const formattedBrandingPrice = brandingChoice === 'with_branding' ? formatPrice(500) : '0 DH';
  const formattedTotalPrice = formatPrice(totalMAD);

  const selectedDurationInfo = HOSTING_DURATIONS_CONFIG[hostingDuration];

  const hostingSummary =
    hostingType === 'client'
      ? (language === 'fr' ? 'Option 1 — Payé directement par le client à son hébergeur' : 'Option 1 — Paid directly by client to hosting provider')
      : (language === 'fr' ? `Option 2 — ${selectedDurationInfo.label} avec Zalyvo` : `Option 2 — ${selectedDurationInfo.label} with Zalyvo`);

  const supplementsSummary =
    selectedSupplements.length > 0
      ? selectedSupplements
          .map((id) => {
            const item = supplementsData.find((s) => s.id === id);
            return item ? item.name : (SUPPLEMENTS_CONFIG[id]?.name || id);
          })
          .join(', ')
      : (language === 'fr' ? 'Aucun supplément' : 'No supplement');

  const brandingSummary =
    brandingChoice === 'with_branding'
      ? (language === 'fr' ? 'Création du Logo & Nom par Zalyvo (+500 DH)' : 'Logo & Company Name creation by Zalyvo (+500 DH)')
      : (language === 'fr' ? 'Fournis par le client (0 DH - Gratuit)' : 'Provided by client (0 DH - Free)');

  const effectiveCompany =
    company.trim() ||
    (brandingChoice === 'with_branding'
      ? (language === 'fr' ? 'À concevoir par Zalyvo (option +500 DH)' : 'To be created by Zalyvo (+500 DH option)')
      : '');

  const exampleFilesSummary =
    exampleFiles.length > 0
      ? `${exampleFiles.length} fichier(s) joint(s) (${exampleFiles.map((f) => f.name).slice(0, 5).join(', ')}${
          exampleFiles.length > 5 ? '...' : ''
        })`
      : language === 'fr'
      ? 'Aucun exemple joint (optionnel)'
      : 'No example attached (optional)';

  const orderPayload: WebsiteOrderPayload = {
    firstName,
    lastName,
    company: effectiveCompany,
    email,
    whatsapp,
    country,
    activityType,
    projectDescription,
    exampleFilesSummary,
    exampleFilesNames: exampleFiles.map((f) => f.name),
    formulaName: currentPlan.name,
    creationPrice: formattedCreationPrice,
    hostingSummary,
    hostingPrice: hostingType === 'client' ? (language === 'fr' ? '0 DH (Géré par le client)' : '0 DH (Managed by client)') : formattedHostingPrice,
    brandingChoice: brandingChoice || 'own_branding',
    brandingPrice: formattedBrandingPrice,
    supplements: selectedSupplements,
    supplementsSummary,
    supplementsPrice: selectedSupplements.length > 0 ? formattedSupplementsPrice : '0 DH',
    totalPrice: formattedTotalPrice,
    totalMAD,
    paymentMethod: language === 'fr' ? 'Paiement en cash selon conditions convenues' : 'Cash payment according to agreed terms',
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Mandatory choice: user must select either with_branding or own_branding
    if (!brandingChoice) {
      setBrandingError(true);
      const errEl = document.getElementById('branding-choice-section');
      if (errEl) {
        errEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      showNotification(t.order.brandingValidationMsg, {
        title: language === 'fr' ? 'Choix obligatoire requis' : 'Mandatory selection required',
        duration: 5000,
      });
      return;
    }

    setBrandingError(false);
    setLoading(true);

    try {
      // Envoi de l'intégralité de la description du site web à zalyvo.site@gmail.com
      await sendWebsiteOrderEmail(orderPayload);
    } catch (err) {
      console.error('Erreur lors de la transmission :', err);
    } finally {
      setLoading(false);
      setSubmitted(true);
      setShowRatingModal(true);
      // Notification flottante sur l'écran du client
      const notifMsg = language === 'fr' 
        ? 'Votre message a bien été envoyé et sera répondu sous 24h.' 
        : 'Your message has been successfully sent and will be answered within 24h.';
      const notifTitle = language === 'fr' ? 'Demande de site transmise !' : 'Website inquiry transmitted!';
      showNotification(notifMsg, {
        title: notifTitle,
        duration: 8000,
      });
    }
  };

  // Pre-filled WhatsApp message based on the exact configuration
  const generateWhatsAppConfirmationUrl = () => {
    const isFr = language === 'fr';
    const text = isFr
      ? `Bonjour Zalyvo ! Je viens d'envoyer ma demande détaillée de site web :%0A%0A*RÉCAPITULATIF DE COMMANDE*%0A- *Client* : ${encodeURIComponent(
          firstName + ' ' + lastName
        )}%0A- *Entreprise* : ${encodeURIComponent(effectiveCompany || 'Non précisé')}%0A- *Pays* : ${encodeURIComponent(
          country
        )}%0A- *Activité* : ${encodeURIComponent(
          activityType || 'Non précisé'
        )}%0A- *Formule choisie* : ${currentPlan.name} (${formattedCreationPrice})%0A- *Logo & Nom d'entreprise* : ${encodeURIComponent(
          brandingSummary
        )}%0A- *Hébergement* : ${encodeURIComponent(
          hostingSummary
        )}%0A- *Suppléments (${selectedSupplements.length})* : ${encodeURIComponent(
          supplementsSummary + (selectedSupplements.length > 0 ? ` (+${formattedSupplementsPrice})` : '')
        )}%0A- *Exemples / Fichiers* : ${encodeURIComponent(
          exampleFilesSummary
        )}%0A- *Total estimé* : ${encodeURIComponent(
          formattedTotalPrice
        )}%0A- *Mode de règlement* : Paiement en cash%0A%0A*Description du projet* :%0A${encodeURIComponent(
          projectDescription || 'Voir formulaire'
        )}%0A%0APouvez-vous me recontacter pour valider mon projet sous 24h ? Merci !`
      : `Hello Zalyvo! I have just sent my detailed website order inquiry:%0A%0A*ORDER SUMMARY*%0A- *Client*: ${encodeURIComponent(
          firstName + ' ' + lastName
        )}%0A- *Company*: ${encodeURIComponent(effectiveCompany || 'Not specified')}%0A- *Country*: ${encodeURIComponent(
          country
        )}%0A- *Industry*: ${encodeURIComponent(
          activityType || 'Not specified'
        )}%0A- *Plan chosen*: ${currentPlan.name} (${formattedCreationPrice})%0A- *Logo & Company Name*: ${encodeURIComponent(
          brandingSummary
        )}%0A- *Hosting*: ${encodeURIComponent(
          hostingSummary
        )}%0A- *Add-ons (${selectedSupplements.length})*: ${encodeURIComponent(
          supplementsSummary + (selectedSupplements.length > 0 ? ` (+${formattedSupplementsPrice})` : '')
        )}%0A- *Examples / Files*: ${encodeURIComponent(
          exampleFilesSummary
        )}%0A- *Estimated Total*: ${encodeURIComponent(
          formattedTotalPrice
        )}%0A- *Payment method*: Cash payment%0A%0A*Project Description*:%0A${encodeURIComponent(
          projectDescription || 'See inquiry form'
        )}%0A%0ACould you please contact me within 24h to review my project? Thank you!`;

    return `https://wa.me/${SITE_CONFIG.contact.whatsappRawNumber}?text=${text}`;
  };

  return (
    <section id="commande" className="py-24 relative bg-[#050508] border-t border-white/5">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[160px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/10 blur-[160px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal yOffset={35}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.order.badge}</span>
            </div>

            <h2
              id="order-config-title"
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-display"
            >
              {t.order.titlePart1}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                {t.order.titleHighlight}
              </span>
            </h2>

            <p className="mt-4 text-base sm:text-lg text-slate-300">
              {t.order.subtitle}
            </p>
          </div>
        </ScrollReveal>

        {submitted ? (
          /* Confirmation Message conforme */
          <div className="max-w-2xl mx-auto p-8 sm:p-12 rounded-3xl bg-[#0b0e1b] border border-emerald-500/30 text-center shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-6 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display mb-2">
              {t.order.successTitle}
            </h3>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold mb-5">
              <Clock className="w-4 h-4" />
              <span>{t.order.success24hBadge}</span>
            </div>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 font-normal">
              {t.order.successText1}{' '}
              <span className="text-white font-semibold underline decoration-blue-400">zalyvo.site@gmail.com</span>.{' '}
              {t.order.successText2}
            </p>

            {/* Recap Box inside Success */}
            <div className="text-left p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10 mb-8 space-y-3 text-sm text-slate-300">
              <div className="flex justify-between items-center pb-2 border-b border-white/5 text-xs text-slate-400">
                <span>{language === 'fr' ? 'Client :' : 'Client:'}</span>
                <span className="font-medium text-white">{firstName} {lastName} {company ? `(${company})` : ''}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>{language === 'fr' ? 'Coordonnées :' : 'Contact:'}</span>
                <span className="font-mono text-white">{email} • {whatsapp}</span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-white/5">
                <span className="text-slate-400">{t.order.successFormulaLabel}</span>
                <span className="font-bold text-white uppercase">{currentPlan.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">{t.order.recapSiteCreation}</span>
                <span className="font-bold text-white">{formattedCreationPrice}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-slate-400 shrink-0">{t.order.recapBranding}</span>
                <span className={`font-bold text-right ${brandingChoice === 'with_branding' ? 'text-amber-300' : 'text-slate-300'}`}>
                  {brandingChoice === 'with_branding' ? `+${formattedBrandingPrice}` : '0 DH'}
                </span>
              </div>
              {selectedSupplements.length > 0 && (
                <div className="flex justify-between items-start">
                  <span className="text-slate-400 shrink-0">
                    {t.order.recapSupplements} ({selectedSupplements.length})
                  </span>
                  <span className="font-bold text-right text-emerald-300">
                    +{formattedSupplementsPrice}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-start">
                <span className="text-slate-400 shrink-0">{t.order.successHostingLabel}</span>
                <span className="font-bold text-right text-white">
                  {hostingType === 'client' ? (
                    <span className="text-emerald-400">{t.order.optClientPrice}</span>
                  ) : (
                    <span className="text-purple-300">
                      {selectedDurationInfo.label} {language === 'fr' ? 'avec Zalyvo +' : 'with Zalyvo +'} {formattedHostingPrice}
                    </span>
                  )}
                </span>
              </div>
              {exampleFiles.length > 0 && (
                <div className="flex justify-between items-start">
                  <span className="text-slate-400 shrink-0">{t.order.recapExampleFiles}</span>
                  <span className="font-semibold text-right text-blue-300">
                    {exampleFiles.length} {language === 'fr' ? 'fichier(s) joint(s)' : 'attached file(s)'}
                  </span>
                </div>
              )}
              <div className="pt-2.5 border-t border-white/10 flex justify-between items-center text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                <span>{t.order.recapTotal}</span>
                <span>{formattedTotalPrice}</span>
              </div>
              {currency !== 'MAD' && (
                <div className="text-[11px] text-slate-400 text-right font-mono">
                  {language === 'fr' ? 'Réf. en DH :' : 'Ref. in MAD:'} {totalMAD.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US')} DH
                </div>
              )}

              {/* Description transmise */}
              {projectDescription && (
                <div className="pt-3 border-t border-white/10">
                  <div className="text-xs font-semibold text-slate-400 mb-1">
                    {t.order.successDescLabel}
                  </div>
                  <div className="text-xs text-slate-200 bg-black/40 p-3 rounded-xl border border-white/5 whitespace-pre-wrap max-h-36 overflow-y-auto font-mono">
                    {projectDescription}
                  </div>
                </div>
              )}
            </div>

            {/* Proposition de noter Zalyvo sur 5 étoiles */}
            <div className="mb-8">
              <InlineRatingCard
                orderType="website"
                clientName={`${firstName} ${lastName}`.trim() || 'Client'}
                clientEmail={email}
                orderSummary={`${currentPlan.name} (${formattedTotalPrice})`}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3.5 justify-center">
              <a
                href={generateWhatsAppConfirmationUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t.order.successWhatsAppBar}</span>
              </a>

              <a
                href={generateDirectMailtoUrl(orderPayload)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-semibold text-sm border border-blue-500/30 transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>{t.order.successMailtoBtn}</span>
              </a>

              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-medium text-xs border border-white/10 transition-all cursor-pointer"
              >
                <span>{t.order.successEditBtn}</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
            {/* Left 8 Cols: 4 Steps */}
            <ScrollReveal delay={0.1} yOffset={35} className="lg:col-span-8 space-y-8">
              {/* ÉTAPE 1 : Choisissez votre formule */}
              <div className="rounded-3xl p-6 sm:p-8 bg-[#090b14] border border-white/10 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h3 className="text-xl font-bold text-white font-display">
                    {t.order.step1Title}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(['starter', 'pro', 'business'] as const).map((planKey) => {
                    const plan = SITE_CONFIG.pricing[planKey];
                    const isSelected = selectedFormula === planKey;
                    const priceFormatted = formatPrice(plan.basePriceMAD);

                    const isStarter = planKey === 'starter';
                    const isPro = planKey === 'pro';
                    const isBusiness = planKey === 'business';

                    let cardStyle = '';
                    if (isStarter) {
                      cardStyle = isSelected
                        ? 'bg-gradient-to-b from-[#0e1836] to-[#060b18] border-sky-400 ring-2 ring-sky-400/30 shadow-lg shadow-sky-950/40'
                        : 'bg-[#091024]/60 border-blue-950/50 hover:border-sky-500/30';
                    } else if (isPro) {
                      cardStyle = isSelected
                        ? 'bg-gradient-to-b from-[#13286b] via-[#0d1c4d] to-[#070e26] border-blue-400 ring-2 ring-blue-400/40 shadow-xl shadow-blue-600/30'
                        : 'bg-[#0d1636]/60 border-blue-900/40 hover:border-blue-400/40';
                    } else {
                      cardStyle = isSelected
                        ? 'bg-gradient-to-b from-[#2a134d] via-[#1a0a33] to-[#0c0419] border-amber-400 ring-2 ring-amber-400/50 shadow-xl shadow-purple-900/50'
                        : 'bg-[#180d2c]/60 border-purple-900/40 hover:border-amber-400/40';
                    }

                    return (
                      <div
                        key={planKey}
                        id={`order-plan-choice-${planKey}`}
                        onClick={() => setSelectedFormula(planKey)}
                        className={`cursor-pointer rounded-2xl p-5 border transition-all relative overflow-hidden flex flex-col justify-between ${cardStyle}`}
                      >
                        {/* Background light glow based on tier */}
                        {isPro && (
                          <div className="absolute -top-12 -right-12 w-28 h-28 bg-blue-500/20 rounded-full blur-xl pointer-events-none" />
                        )}
                        {isBusiness && (
                          <div className="absolute -top-12 -right-12 w-28 h-28 bg-amber-400/20 rounded-full blur-xl pointer-events-none" />
                        )}

                        <div>
                          {/* Mini header badge */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5">
                              {isStarter && <Zap className="w-3.5 h-3.5 text-sky-400" />}
                              {isPro && <Sparkles className="w-3.5 h-3.5 text-cyan-300" />}
                              {isBusiness && <Crown className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />}
                              <span
                                className={`font-bold tracking-wide text-base ${
                                  isBusiness
                                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-purple-200'
                                    : 'text-white'
                                }`}
                              >
                                {plan.name}
                              </span>
                            </div>

                            <div
                              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                isSelected
                                  ? isBusiness
                                    ? 'border-amber-400 bg-amber-500 text-black font-bold'
                                    : 'border-blue-400 bg-blue-600 text-white'
                                  : 'border-white/30'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3" />}
                            </div>
                          </div>

                          <div
                            className={`text-xl font-extrabold font-display mb-1 ${
                              isBusiness
                                ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-white'
                                : isPro
                                ? 'text-cyan-300'
                                : 'text-sky-400'
                            }`}
                          >
                            {priceFormatted}
                          </div>

                          <div className="text-[11px] text-slate-400 mb-2">
                            <span>{language === 'fr' ? 'Création du site web' : 'Website creation'}</span>
                            {currency !== 'MAD' && (
                              <span
                                className={`block text-[10px] font-mono ${
                                  isBusiness ? 'text-amber-300/90' : 'text-blue-300'
                                }`}
                              >
                                Réf: {plan.basePriceMAD.toLocaleString('fr-FR')} DH
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-xs text-slate-300 leading-tight line-clamp-2 mt-2 pt-2 border-t border-white/5">
                          {plan.description}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ÉTAPE 2 : Choisissez votre hébergement */}
              <div className="rounded-3xl p-6 sm:p-8 bg-[#090b14] border border-white/10 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h3 className="text-xl font-bold text-white font-display">
                    {t.order.step2Title}
                  </h3>
                </div>

                <div className="space-y-4">
                  {/* Option 2.1: Je paie mon hébergement directement */}
                  <label
                    id="order-hosting-choice-client"
                    className={`flex items-start gap-4 p-5 rounded-2xl border cursor-pointer transition-all ${
                      hostingType === 'client'
                        ? 'bg-gradient-to-r from-blue-950/30 to-purple-950/20 border-blue-500 ring-1 ring-blue-500/40'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="hostingType"
                      checked={hostingType === 'client'}
                      onChange={() => setHostingType('client')}
                      className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500 bg-black/40 border-white/30 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-white text-base mb-1">
                        {t.order.optClientTitle}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {t.order.optClientDesc}
                      </p>
                    </div>
                  </label>

                  {/* Option 2.2: Je choisis une durée avec Zalyvo */}
                  <label
                    id="order-hosting-choice-zalyvo"
                    className={`flex items-start gap-4 p-5 rounded-2xl border cursor-pointer transition-all ${
                      hostingType === 'zalyvo'
                        ? 'bg-gradient-to-r from-purple-950/30 to-blue-950/20 border-purple-500 ring-1 ring-purple-500/40'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="hostingType"
                      checked={hostingType === 'zalyvo'}
                      onChange={() => setHostingType('zalyvo')}
                      className="mt-1 w-4 h-4 text-purple-600 focus:ring-purple-500 bg-black/40 border-white/30 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-white text-base mb-1 flex items-center justify-between">
                        <span>{t.order.optZalyvoTitle}</span>
                        {hostingType === 'zalyvo' && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                            {language === 'fr' ? 'Durée sélectionnée' : 'Selected duration'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4">
                        {t.order.optZalyvoDesc}
                      </p>

                      {/* Sous-section Durée si Zalyvo choisi */}
                      {hostingType === 'zalyvo' && (
                        <div className="mt-4 pt-4 border-t border-purple-500/20 animate-in fade-in duration-200">
                          <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-purple-400" />
                            <span>{language === 'fr' ? 'Choisissez votre durée :' : 'Choose your duration:'}</span>
                          </div>

                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
                            {(['1m', '3m', '6m', '12m', '24m', '48m'] as const).map((durKey) => {
                              const dur = HOSTING_DURATIONS_CONFIG[durKey];
                              const isDurSelected = hostingDuration === durKey;
                              return (
                                <button
                                  key={durKey}
                                  type="button"
                                  id={`order-duration-btn-${durKey}`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setHostingDuration(durKey);
                                  }}
                                  className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                                    isDurSelected
                                      ? 'bg-purple-600 border-purple-400 text-white shadow-md shadow-purple-500/30'
                                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                                  }`}
                                >
                                  {dur.label}
                                </button>
                              );
                            })}
                          </div>

                          {/* Dynamic Hosting Price Feedback */}
                          <div className="p-3.5 rounded-xl bg-purple-900/30 border border-purple-500/30 flex items-center justify-between text-xs">
                            <span className="text-slate-300">
                              {language === 'fr' ? `Coût d'hébergement (${selectedDurationInfo.label}) :` : `Hosting fee (${selectedDurationInfo.label}):`}
                            </span>
                            <span className="text-sm font-extrabold text-white">
                              {formattedHostingPrice}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* ÉTAPE 3 : Suppléments & Options à la carte (+50 DH chacun) */}
              <div className="rounded-3xl p-6 sm:p-8 bg-[#090b14] border border-white/10 shadow-lg">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                      3
                    </span>
                    <h3 className="text-xl font-bold text-white font-display">
                      {t.order.step3SupplementsTitle}
                    </h3>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-xs">
                    <span>50 DH / {language === 'fr' ? 'chacun' : 'each'}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mb-6">
                  {t.order.step3SupplementsSub}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                  {supplementsData.map((supp) => {
                    const isChecked = selectedSupplements.includes(supp.id);
                    const IconComp = SUPPLEMENT_ICONS[supp.id] || Sparkles;
                    const itemFormattedPrice = formatPrice(supp.basePriceMAD);

                    return (
                      <div
                        key={supp.id}
                        id={`order-supplement-toggle-${supp.id}`}
                        onClick={() => toggleSupplement(supp.id)}
                        className={`cursor-pointer rounded-2xl p-4 border transition-all select-none flex flex-col justify-between ${
                          isChecked
                            ? 'bg-gradient-to-b from-emerald-950/40 to-[#0b101c] border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-500/10'
                            : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                                isChecked
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-white/5 text-slate-400 border border-white/10'
                              }`}
                            >
                              <IconComp className="w-4 h-4" />
                            </div>

                            <div
                              className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                isChecked
                                  ? 'border-emerald-400 bg-emerald-600 text-white'
                                  : 'border-white/30 bg-black/30'
                              }`}
                            >
                              {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </div>

                          <div className="font-bold text-white text-sm mb-1.5 leading-snug">
                            {supp.name}
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                            {supp.description}
                          </p>
                        </div>

                        <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
                          <span className="text-slate-400 text-[11px]">
                            {isChecked
                              ? (language === 'fr' ? 'Sélectionné' : 'Selected')
                              : (language === 'fr' ? 'Cliquer pour ajouter' : 'Click to add')}
                          </span>
                          <span
                            className={`font-mono font-bold text-xs ${
                              isChecked ? 'text-emerald-400' : 'text-slate-300'
                            }`}
                          >
                            +{itemFormattedPrice}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Counter of selected supplements */}
                <div className="mt-4 p-3.5 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-300">
                    {language === 'fr'
                      ? `Suppléments sélectionnés : ${selectedSupplements.length} option(s)`
                      : `Selected add-ons: ${selectedSupplements.length} item(s)`}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-400 font-mono">
                    +{formattedSupplementsPrice}
                  </span>
                </div>

                {/* Option Logo et Nom de l'entreprise - CHOIX OBLIGATOIRE */}
                <div
                  id="branding-choice-section"
                  className={`mt-6 pt-6 border-t ${
                    brandingError
                      ? 'border-red-500/50 p-4 rounded-2xl bg-red-950/20'
                      : 'border-white/10'
                  } transition-all`}
                >
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
                        <Palette className="w-4 h-4" />
                      </div>
                      <h4 className="text-base font-bold text-white">
                        {t.order.brandingTitle}
                      </h4>
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                        brandingChoice
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                          : 'bg-amber-500/20 border-amber-500/40 text-amber-300 animate-pulse'
                      }`}
                    >
                      {brandingChoice
                        ? (language === 'fr' ? '✓ Choix validé' : '✓ Selection made')
                        : t.order.brandingRequiredBadge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    {t.order.brandingSub}
                  </p>

                  {brandingError && (
                    <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{t.order.brandingValidationMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Option 1: Oui, création par Zalyvo (+50 DH) */}
                    <div
                      id="branding-option-with"
                      onClick={() => {
                        setBrandingChoice('with_branding');
                        setBrandingError(false);
                      }}
                      className={`cursor-pointer rounded-2xl p-4 sm:p-5 border transition-all select-none flex flex-col justify-between ${
                        brandingChoice === 'with_branding'
                          ? 'bg-gradient-to-b from-amber-950/40 to-[#0b101c] border-amber-500 ring-2 ring-amber-500/30 shadow-lg shadow-amber-500/10'
                          : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                                brandingChoice === 'with_branding'
                                  ? 'border-amber-400 bg-amber-500 text-black'
                                  : 'border-white/30 bg-black/40'
                              }`}
                            >
                              {brandingChoice === 'with_branding' && (
                                <div className="w-2 h-2 rounded-full bg-black" />
                              )}
                            </div>
                            <span className="font-bold text-white text-sm">
                              {t.order.brandingOptionWithTitle}
                            </span>
                          </div>
                          <span className="font-mono font-extrabold text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {t.order.brandingOptionWithPrice}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed pl-7">
                          {t.order.brandingOptionWithDesc}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/10 pl-7 flex items-center justify-between text-xs">
                        <span className="text-slate-400">
                          {brandingChoice === 'with_branding'
                            ? (language === 'fr' ? 'Option cochée' : 'Option checked')
                            : (language === 'fr' ? 'Cliquer pour choisir' : 'Click to select')}
                        </span>
                        <span className="font-mono font-bold text-amber-400 text-xs">
                          +{formatPrice(500)}
                        </span>
                      </div>
                    </div>

                    {/* Option 2: Non, j'ai déjà mon logo et nom (0 DH - Gratuit) */}
                    <div
                      id="branding-option-own"
                      onClick={() => {
                        setBrandingChoice('own_branding');
                        setBrandingError(false);
                      }}
                      className={`cursor-pointer rounded-2xl p-4 sm:p-5 border transition-all select-none flex flex-col justify-between ${
                        brandingChoice === 'own_branding'
                          ? 'bg-gradient-to-b from-blue-950/40 to-[#0b101c] border-blue-500 ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/10'
                          : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                                brandingChoice === 'own_branding'
                                  ? 'border-blue-400 bg-blue-600 text-white'
                                  : 'border-white/30 bg-black/40'
                              }`}
                            >
                              {brandingChoice === 'own_branding' && (
                                <div className="w-2 h-2 rounded-full bg-white" />
                              )}
                            </div>
                            <span className="font-bold text-white text-sm">
                              {t.order.brandingOptionOwnTitle}
                            </span>
                          </div>
                          <span className="font-mono font-extrabold text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {t.order.brandingOptionOwnPrice}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed pl-7">
                          {t.order.brandingOptionOwnDesc}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/10 pl-7 flex items-center justify-between text-xs">
                        <span className="text-slate-400">
                          {brandingChoice === 'own_branding'
                            ? (language === 'fr' ? 'Option cochée' : 'Option checked')
                            : (language === 'fr' ? 'Cliquer pour choisir' : 'Click to select')}
                        </span>
                        <span className="font-mono font-bold text-emerald-400 text-xs">
                          0 DH ({language === 'fr' ? 'Gratuit' : 'Free'})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ÉTAPE 4 : Vos informations */}
              <div className="rounded-3xl p-6 sm:p-8 bg-[#090b14] border border-white/10 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                    4
                  </span>
                  <h3 className="text-xl font-bold text-white font-display">
                    {t.order.step4Title}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor={lastNameId} className="block text-xs font-medium text-slate-300 mb-1.5">
                      {t.order.labelLastName}
                    </label>
                    <input
                      id={lastNameId}
                      required
                      type="text"
                      placeholder={t.order.phLastName}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white text-sm outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label htmlFor={firstNameId} className="block text-xs font-medium text-slate-300 mb-1.5">
                      {t.order.labelFirstName}
                    </label>
                    <input
                      id={firstNameId}
                      required
                      type="text"
                      placeholder={t.order.phFirstName}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white text-sm outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                      <label htmlFor={companyId} className="block text-xs font-medium text-slate-300">
                        {brandingChoice === 'with_branding'
                          ? t.order.labelCompanyOptional
                          : t.order.labelCompany}
                      </label>
                      {brandingChoice === 'with_branding' && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {language === 'fr' ? 'Optionnel (Zalyvo s’en charge)' : 'Optional (Zalyvo handles this)'}
                        </span>
                      )}
                    </div>
                    <input
                      id={companyId}
                      required={brandingChoice !== 'with_branding'}
                      type="text"
                      placeholder={
                        brandingChoice === 'with_branding'
                          ? t.order.phCompanyOptional
                          : t.order.phCompany
                      }
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white text-sm outline-none transition-all placeholder:text-slate-400"
                    />
                    {brandingChoice === 'with_branding' && (
                      <p className="text-[11px] text-amber-300/80 mt-1.5 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 shrink-0" />
                        <span>{t.order.companyOptionalHint}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={emailId} className="block text-xs font-medium text-slate-300 mb-1.5">
                      {t.order.labelEmail}
                    </label>
                    <input
                      id={emailId}
                      required
                      type="email"
                      placeholder={t.order.phEmail}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white text-sm outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label htmlFor={whatsappId} className="block text-xs font-medium text-slate-300 mb-1.5">
                      {t.order.labelWhatsApp}
                    </label>
                    <input
                      id={whatsappId}
                      required
                      type="tel"
                      placeholder={t.order.phWhatsApp}
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white text-sm outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label htmlFor={countryId} className="block text-xs font-medium text-slate-300 mb-1.5">
                      {t.order.labelCountry}
                    </label>
                    <input
                      id={countryId}
                      required
                      type="text"
                      placeholder={language === 'fr' ? 'Maroc, France, etc.' : 'Morocco, UK, USA, etc.'}
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white text-sm outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor={activityTypeId} className="block text-xs font-medium text-slate-300 mb-1.5">
                      {t.order.labelActivity}
                    </label>
                    <input
                      id={activityTypeId}
                      required
                      type="text"
                      placeholder={t.order.phActivity}
                      value={activityType}
                      onChange={(e) => setActivityType(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white text-sm outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor={projectDescriptionId} className="block text-xs font-medium text-slate-300 mb-1.5">
                      {t.order.labelDesc}
                    </label>
                    <textarea
                      id={projectDescriptionId}
                      rows={3}
                      placeholder={t.order.phDesc}
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white text-sm outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>

                  {/* Fichiers d'exemples / Inspirations de sites web (Optionnel) */}
                  <div className="sm:col-span-2 pt-2 border-t border-white/10">
                    <FileUploadZone
                      id="order-configurator-example-files"
                      files={exampleFiles}
                      onFilesChange={setExampleFiles}
                      label={t.order.labelExampleFiles}
                      badge={t.order.labelExampleFilesOptional}
                      badgeColor="optional"
                      hint={t.order.exampleFilesHint}
                      required={false}
                      language={language}
                    />
                  </div>
                </div>
              </div>

              {/* ÉTAPE 5 : Mode de paiement */}
              <div className="rounded-3xl p-6 sm:p-8 bg-[#090b14] border border-white/10 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                    5
                  </span>
                  <h3 className="text-xl font-bold text-white font-display">
                    {t.order.step5Title}
                  </h3>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <Banknote className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-base mb-1 flex items-center gap-2">
                      <span>💵 {language === 'fr' ? 'Paiement en cash' : 'Cash Payment'}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                        {language === 'fr' ? 'Sécurisé' : 'Secure'}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {language === 'fr'
                        ? '« Le paiement est effectué directement auprès de Zalyvo selon les conditions convenues pour votre commande. »'
                        : '"Payment is made directly with Zalyvo according to agreed order terms."'}
                    </p>
                    <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{language === 'fr' ? 'Aucune carte bancaire requise sur le site web. Transaction transparente et sans intermédiaire.' : 'No credit card required online. Direct, transparent and trusted transaction.'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Right 4 Cols: Sticky RÉCAPITULATIF DE COMMANDE */}
            <ScrollReveal delay={0.2} yOffset={35} className="lg:col-span-4 sticky top-28 space-y-6">
              <div className="rounded-3xl p-6 sm:p-7 bg-[#0b0e1b] border border-blue-500/30 shadow-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                  <h3 className="text-lg font-bold text-white font-display">
                    {language === 'fr' ? 'Récapitulatif de commande' : 'Order Summary'}
                  </h3>
                  <span className="text-xs text-blue-400 font-mono">ZALYVO</span>
                </div>

                {/* Formule */}
                <div className="space-y-3 text-xs sm:text-sm text-slate-300 pb-5 border-b border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">{language === 'fr' ? 'Formule :' : 'Plan:'}</span>
                    <span className="font-bold text-white uppercase">{currentPlan.name}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">{t.order.recapSiteCreation}</span>
                    <span className="font-extrabold text-white text-base">{formattedCreationPrice}</span>
                  </div>

                  {/* Logo & Nom de l'entreprise */}
                  <div className="flex justify-between items-start pt-1">
                    <span className="text-slate-400 shrink-0">{t.order.recapBranding}</span>
                    <span className="font-bold text-right">
                      {brandingChoice === 'with_branding' ? (
                        <span className="text-amber-300 font-mono">+{formattedBrandingPrice}</span>
                      ) : brandingChoice === 'own_branding' ? (
                        <span className="text-emerald-400 font-normal">
                          0 DH ({language === 'fr' ? 'Client' : 'Client'})
                        </span>
                      ) : (
                        <span className="text-amber-400/80 italic text-xs">
                          {language === 'fr' ? 'À choisir *' : 'To select *'}
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between items-start pt-1">
                    <span className="text-slate-400 shrink-0">
                      {t.order.recapSupplements}
                      {selectedSupplements.length > 0 && (
                        <span className="text-emerald-400 font-semibold ml-1">
                          ({selectedSupplements.length})
                        </span>
                      )}
                    </span>
                    <span className="font-bold text-right">
                      {selectedSupplements.length > 0 ? (
                        <span className="text-emerald-300">+{formattedSupplementsPrice}</span>
                      ) : (
                        <span className="text-slate-500 font-normal">
                          {language === 'fr' ? '0 DH (Aucun)' : '0 DH (None)'}
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between items-start pt-1">
                    <span className="text-slate-400 shrink-0">{t.order.recapHosting}</span>
                    <span className="font-bold text-right">
                      {hostingType === 'client' ? (
                        <span className="text-emerald-400">{t.order.optClientPrice}</span>
                      ) : (
                        <span className="text-purple-300">
                          {selectedDurationInfo.label} {language === 'fr' ? 'avec Zalyvo +' : 'with Zalyvo +'} {formattedHostingPrice}
                        </span>
                      )}
                    </span>
                  </div>

                  {exampleFiles.length > 0 && (
                    <div className="flex justify-between items-start pt-1">
                      <span className="text-slate-400 shrink-0">{t.order.recapExampleFiles}</span>
                      <span className="text-blue-300 font-semibold text-right">
                        {exampleFiles.length} {language === 'fr' ? 'fichier(s)' : 'file(s)'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="py-5 border-b border-white/10">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-base font-bold text-white">{t.order.recapTotal}</span>
                    <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-display">
                      {formattedTotalPrice}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 text-right">
                    {language === 'fr' ? 'Calculé automatiquement' : 'Automatically computed'}
                  </div>
                  {currency !== 'MAD' && (
                    <div className="text-[11px] text-slate-400 text-right mt-0.5">
                      <span>{language === 'fr' ? 'Réf. de base : ' : 'Base ref: '}</span>
                      <span className="font-mono text-slate-300">{totalMAD.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US')} DH</span>
                    </div>
                  )}
                </div>

                {/* Mode de règlement */}
                <div className="pt-4 mb-6">
                  <div className="text-xs text-slate-400 mb-1">{t.order.recapPaymentMode}</div>
                  <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                    <Banknote className="w-4 h-4" />
                    <span>{language === 'fr' ? 'Paiement en cash à la commande' : 'Cash payment upon order'}</span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  id="order-submit-btn"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span>{t.order.submitLoading}</span>
                  ) : (
                    <>
                      <span>{t.order.submitButton}</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-slate-400 text-center mt-4">
                  {language === 'fr'
                    ? "Confirmation et validation finale par WhatsApp avec l'équipe Zalyvo."
                    : 'Final confirmation and validation via WhatsApp with the Zalyvo team.'}
                </p>
              </div>
            </ScrollReveal>
          </form>
        )}
      </div>

      {/* Proposition modale de noter Zalyvo sur 5 étoiles juste après commande */}
      <RatingProposalModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        orderType="website"
        clientName={`${firstName} ${lastName}`.trim() || 'Client'}
        clientEmail={email}
        orderSummary={`${currentPlan.name} (${formattedTotalPrice})`}
      />
    </section>
  );
}
