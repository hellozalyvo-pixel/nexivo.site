import { useState, useId, FormEvent } from 'react';
import { SITE_CONFIG } from '../config';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { useWhatsAppChat } from '../context/WhatsAppChatContext';
import ScrollReveal from './ScrollReveal';
import {
  Send,
  MessageCircle,
  Mail,
  Phone,
  CheckCircle2,
  Sparkles,
  Clock,
  Banknote,
  RefreshCw,
  Check,
  AlertCircle,
  ShieldCheck,
  FileCheck,
  Layers,
} from 'lucide-react';
import FileUploadZone from './FileUploadZone';
import RatingProposalModal from './RatingProposalModal';
import InlineRatingCard from './InlineRatingCard';
import {
  sendSiteModificationOrderEmail,
  generateChangeMailtoUrl,
  ChangeOrderPayload,
} from '../services/emailService';

export default function ContactSection() {
  const { currency, formatPrice } = useCurrency();
  const { showNotification } = useToast();
  const { t, language } = useLanguage();
  const { openChat } = useWhatsAppChat();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [changeDescription, setChangeDescription] = useState('');
  const [siteFiles, setSiteFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);

  // Form IDs for accessibility
  const idPrefix = useId();
  const firstNameId = `${idPrefix}-firstName`;
  const lastNameId = `${idPrefix}-lastName`;
  const companyId = `${idPrefix}-company`;
  const emailId = `${idPrefix}-email`;
  const whatsappId = `${idPrefix}-whatsapp`;
  const changeDescriptionId = `${idPrefix}-changeDescription`;

  // Price calculations: Pack Changement = 1500 DH
  const basePriceMAD = 1500;
  const formattedPrice = formatPrice(basePriceMAD);

  const filesSummary =
    siteFiles.length > 0
      ? `${siteFiles.length} fichier(s) joint(s) (${siteFiles.map((f) => f.name).slice(0, 5).join(', ')}${
          siteFiles.length > 5 ? '...' : ''
        })`
      : language === 'fr'
      ? 'Aucun fichier joint'
      : 'No files attached';

  const orderPayload: ChangeOrderPayload = {
    firstName,
    lastName,
    company,
    email,
    whatsapp,
    changeDescription,
    filesSummary,
    attachedFilesCount: siteFiles.length,
    attachedFilesNames: siteFiles.map((f) => f.name),
    filesCount: siteFiles.length,
    filesNames: siteFiles.map((f) => f.name),
    packName: t.packChange.packName,
    price: formattedPrice,
    formattedPrice,
    priceMAD: basePriceMAD,
    paymentMethod:
      language === 'fr'
        ? 'Paiement en cash à la livraison et validation des modifications'
        : 'Cash payment upon delivery and validation of changes',
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Check mandatory file upload (must upload at least one photo or folder of the existing site)
    if (siteFiles.length === 0) {
      setFileError(true);
      const fileZone = document.getElementById('change-pack-files-uploader');
      if (fileZone) {
        fileZone.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      showNotification(
        language === 'fr'
          ? 'Veuillez joindre au moins une photo, capture ou dossier de votre site existant.'
          : 'Please attach at least one photo, screenshot or folder of your existing website.',
        {
          title: language === 'fr' ? 'Photo ou dossier requis' : 'Photo or folder required',
          duration: 6000,
        }
      );
      return;
    }

    setFileError(false);
    setLoading(true);

    try {
      await sendSiteModificationOrderEmail(orderPayload);
    } catch (err) {
      console.error('Erreur transmission Pack Changement:', err);
    } finally {
      setLoading(false);
      setSubmitted(true);
      setShowRatingModal(true);
      const notifMsg =
        language === 'fr'
          ? 'Votre commande du Pack Changement a bien été envoyée et sera traitée sous 24h.'
          : 'Your Change Pack order has been successfully sent and will be processed within 24h.';
      const notifTitle =
        language === 'fr' ? 'Commande Pack Changement reçue !' : 'Change Pack order received!';
      showNotification(notifMsg, {
        title: notifTitle,
        duration: 8000,
      });
    }
  };

  // Pre-filled direct WhatsApp general link
  const generateGeneralWhatsAppUrl = () => {
    const isFr = language === 'fr';
    const text = isFr
      ? `Bonjour Zalyvo ! Je souhaite échanger avec vous à propos d'un projet de site web ou d'une modification.`
      : `Hello Zalyvo! I would like to discuss a website project or site modification with you.`;
    return `https://wa.me/${SITE_CONFIG.contact.whatsappRawNumber}?text=${encodeURIComponent(text)}`;
  };

  // Pre-filled WhatsApp confirmation for the Pack Changement
  const generateChangeWhatsAppUrl = () => {
    const isFr = language === 'fr';
    const text = isFr
      ? `Bonjour Zalyvo ! Je viens de commander le *Pack Changement (1 500 DH)* pour mon site existant :%0A%0A*RÉCAPITULATIF DE COMMANDE*%0A- *Client* : ${encodeURIComponent(
          firstName + ' ' + lastName
        )}%0A- *Entreprise* : ${encodeURIComponent(company)}%0A- *Email* : ${encodeURIComponent(
          email
        )}%0A- *Téléphone / WhatsApp* : ${encodeURIComponent(whatsapp)}%0A- *Formule* : Pack Changement (Site existant)%0A- *Tarif fixe* : ${encodeURIComponent(
          formattedPrice
        )}%0A- *Fichiers de mon site* : ${encodeURIComponent(
          filesSummary
        )}%0A- *Mode de règlement* : Paiement en cash à la validation%0A%0A*Détail des changements souhaités* :%0A${encodeURIComponent(
          changeDescription
        )}%0A%0APouvez-vous me recontacter pour lancer les modifications sous 24h ? Merci !`
      : `Hello Zalyvo! I have just ordered the *Change Pack (1,500 DH)* for my existing website:%0A%0A*ORDER SUMMARY*%0A- *Client*: ${encodeURIComponent(
          firstName + ' ' + lastName
        )}%0A- *Company*: ${encodeURIComponent(company)}%0A- *Email*: ${encodeURIComponent(
          email
        )}%0A- *Phone / WhatsApp*: ${encodeURIComponent(whatsapp)}%0A- *Formula*: Change Pack (Existing site)%0A- *Fixed Price*: ${encodeURIComponent(
          formattedPrice
        )}%0A- *Files attached*: ${encodeURIComponent(
          filesSummary
        )}%0A- *Payment method*: Cash payment upon validation%0A%0A*Details of requested changes*:%0A${encodeURIComponent(
          changeDescription
        )}%0A%0ACould you please contact me to begin the changes within 24h? Thank you!`;

    return `https://wa.me/${SITE_CONFIG.contact.whatsappRawNumber}?text=${text}`;
  };

  return (
    <section
      id="changement"
      className="py-24 relative bg-[#07080f] border-t border-white/5 scroll-mt-12"
    >
      {/* Anchor for backwards compatibility with any #contact links */}
      <span id="contact" className="absolute -top-12 block" />

      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-amber-500/10 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal yOffset={35}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-400 mb-4">
              <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
              <span>{t.packChange.badge}</span>
            </div>

            <h2
              id="pack-changement-title"
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-display"
            >
              {t.packChange.titlePart1}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-purple-400">
                {t.packChange.titleHighlight}
              </span>
            </h2>

            <p id="pack-changement-subtitle" className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              {t.packChange.subtitle}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
          {/* Left Column: Direct WhatsApp Contact Callout + Pack Features Overview */}
          <ScrollReveal delay={0.1} yOffset={35} className="lg:col-span-5">
            <div className="space-y-6">
              {/* Direct WhatsApp Box - Always Available */}
              <div className="rounded-3xl p-7 sm:p-8 bg-gradient-to-br from-[#0b1022] via-[#0d1326] to-[#120f26] border border-emerald-500/30 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {language === 'fr' ? 'En ligne' : 'Online'}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white font-display mb-2">
                  {t.packChange.chatDirectTitle}
                </h3>

                <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                  {t.packChange.chatDirectDesc}
                </p>

                {/* Bouton Échanger sur WhatsApp */}
                <button
                  type="button"
                  id="contact-whatsapp-direct-btn"
                  onClick={() => openChat()}
                  className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all cursor-pointer active:scale-[0.99]"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{language === 'fr' ? 'Échanger avec l’Assistant Zalyvo' : 'Chat with Zalyvo Assistant'}</span>
                </button>

                {/* Contact direct coordonnees */}
                <div className="mt-6 pt-6 border-t border-white/10 space-y-3 text-xs text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <button
                      type="button"
                      onClick={() => openChat()}
                      className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                    >
                      {language === 'fr' ? 'Assistant WhatsApp ZALYVO' : 'ZALYVO WhatsApp Assistant'}
                    </button>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                    <a
                      href={`mailto:${SITE_CONFIG.contact.email}`}
                      className="hover:text-purple-400 transition-colors"
                    >
                      {SITE_CONFIG.contact.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Pack Changement Inclusions card */}
              <div className="rounded-3xl p-7 bg-[#090b14] border border-amber-500/20 shadow-xl space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                      {t.packChange.packName}
                    </h4>
                    <div className="text-xs text-amber-400 font-semibold font-display">
                      {formattedPrice} • {language === 'fr' ? 'Tarif unique fixe' : 'Fixed single price'}
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{t.packChange.benefit1}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{t.packChange.benefit2}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{t.packChange.benefit3}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{t.packChange.benefit4}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{t.packChange.benefit5}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-[11px] text-amber-200/90 leading-relaxed">
                  {t.packChange.benefitNote}
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Column: Complete Pack Changement Order Form ("comme l'autre paiement") */}
          <ScrollReveal delay={0.2} yOffset={35} className="lg:col-span-7">
            <div>
              <div className="rounded-3xl p-6 sm:p-8 bg-[#090b14] border border-white/10 shadow-2xl">
              {submitted ? (
                /* Success screen */
                <div className="py-6 text-center animate-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-5 shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <h3 className="text-2xl font-extrabold text-white font-display mb-2">
                    {t.packChange.successTitle}
                  </h3>

                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-4">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{t.packChange.successBadge}</span>
                  </div>

                  <p className="text-sm text-slate-300 mb-6 max-w-md mx-auto leading-relaxed">
                    {t.packChange.successDesc}
                  </p>

                  {/* Recap details */}
                  <div className="text-left p-5 rounded-2xl bg-white/[0.03] border border-white/10 mb-6 space-y-2.5 text-xs text-slate-300">
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                      <span className="text-slate-400">{language === 'fr' ? 'Client :' : 'Client:'}</span>
                      <span className="font-semibold text-white">
                        {firstName} {lastName} ({company})
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">{language === 'fr' ? 'Contact :' : 'Contact:'}</span>
                      <span className="font-mono text-white">
                        {email} • {whatsapp}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-white/5">
                      <span className="text-slate-400">{language === 'fr' ? 'Formule :' : 'Formula:'}</span>
                      <span className="font-bold text-amber-400 uppercase">{t.packChange.packName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">{t.packChange.recapPrice}</span>
                      <span className="font-bold text-white">{formattedPrice}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">{t.packChange.recapHosting}</span>
                      <span className="text-emerald-400 font-medium">{t.packChange.recapHostingFree}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">{t.packChange.recapSupplements}</span>
                      <span className="text-slate-400 font-medium">{t.packChange.recapSupplementsNone}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-white/5">
                      <span className="text-slate-400">{t.packChange.recapFiles}</span>
                      <span className="text-blue-300 font-semibold">
                        {siteFiles.length} {language === 'fr' ? 'fichier(s) joint(s)' : 'file(s) attached'}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-white/10 flex justify-between items-center text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-purple-400">
                      <span>{t.packChange.recapTotal}</span>
                      <span>{formattedPrice}</span>
                    </div>
                  </div>

                  {/* Proposition de noter Zalyvo sur 5 étoiles */}
                  <div className="mb-6">
                    <InlineRatingCard
                      orderType="change"
                      clientName={`${firstName} ${lastName}`.trim() || 'Client'}
                      clientEmail={email}
                      orderSummary={`Pack Changement 1 500 DH (${company || 'Site existant'})`}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                      id="pack-change-success-whatsapp-btn"
                      href={generateChangeWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/30 cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{t.packChange.successWhatsAppBtn}</span>
                    </a>

                    <a
                      id="pack-change-success-mailto-btn"
                      href={generateChangeMailtoUrl(orderPayload)}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-semibold text-xs border border-blue-500/30 transition-all cursor-pointer"
                    >
                      <Mail className="w-4 h-4" />
                      <span>{t.packChange.successMailtoBtn}</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setSiteFiles([]);
                      }}
                      className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold cursor-pointer transition-all"
                    >
                      {t.packChange.successNewBtn}
                    </button>
                  </div>
                </div>
              ) : (
                /* Order Form */
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div>
                      <h3 className="text-lg font-bold text-white font-display">
                        {t.packChange.formTitle}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {t.packChange.formSubtitle}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-extrabold text-amber-400 font-display">
                        {formattedPrice}
                      </div>
                      <div className="text-[10px] text-emerald-400 font-medium">
                        {language === 'fr' ? 'Paiement en cash' : 'Cash payment'}
                      </div>
                    </div>
                  </div>

                  {/* Prénom & Nom */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor={firstNameId} className="block text-xs font-medium text-slate-300 mb-1.5">
                        {t.packChange.labelFirstName} <span className="text-red-400">*</span>
                      </label>
                      <input
                        id={firstNameId}
                        required
                        type="text"
                        placeholder={t.packChange.phFirstName}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white text-sm outline-none transition-all placeholder:text-slate-400"
                      />
                    </div>

                    <div>
                      <label htmlFor={lastNameId} className="block text-xs font-medium text-slate-300 mb-1.5">
                        {t.packChange.labelLastName} <span className="text-red-400">*</span>
                      </label>
                      <input
                        id={lastNameId}
                        required
                        type="text"
                        placeholder={t.packChange.phLastName}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white text-sm outline-none transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Nom de l'entreprise */}
                  <div>
                    <label htmlFor={companyId} className="block text-xs font-medium text-slate-300 mb-1.5">
                      {t.packChange.labelCompany} <span className="text-red-400">*</span>
                    </label>
                    <input
                      id={companyId}
                      required
                      type="text"
                      placeholder={t.packChange.phCompany}
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white text-sm outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>

                  {/* Email & Téléphone / WhatsApp */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor={emailId} className="block text-xs font-medium text-slate-300 mb-1.5">
                        {t.packChange.labelEmail} <span className="text-red-400">*</span>
                      </label>
                      <input
                        id={emailId}
                        required
                        type="email"
                        placeholder="contact@entreprise.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white text-sm outline-none transition-all placeholder:text-slate-400"
                      />
                    </div>

                    <div>
                      <label htmlFor={whatsappId} className="block text-xs font-medium text-slate-300 mb-1.5">
                        {t.packChange.labelWhatsapp} <span className="text-red-400">*</span>
                      </label>
                      <input
                        id={whatsappId}
                        required
                        type="tel"
                        placeholder="+212 6..."
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white text-sm outline-none transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Description détaillée de ce que le client veut changer */}
                  <div>
                    <label htmlFor={changeDescriptionId} className="block text-xs font-medium text-slate-300 mb-1.5">
                      {t.packChange.labelDescription} <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id={changeDescriptionId}
                      required
                      rows={4}
                      placeholder={t.packChange.phDescription}
                      value={changeDescription}
                      onChange={(e) => setChangeDescription(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white text-sm outline-none transition-all placeholder:text-slate-400 leading-relaxed"
                    />
                  </div>

                  {/* Photo ou dossier du site (OBLIGATOIRE selon la consigne de l'utilisateur) */}
                  <div className="pt-2">
                    <FileUploadZone
                      id="change-pack-files-uploader"
                      files={siteFiles}
                      onFilesChange={(newFiles) => {
                        setSiteFiles(newFiles);
                        if (newFiles.length > 0) setFileError(false);
                      }}
                      label={t.packChange.labelFiles}
                      badge={t.packChange.badgeRequired}
                      badgeColor="required"
                      hint={t.packChange.filesHint}
                      required={true}
                      language={language}
                    />

                    {fileError && (
                      <div className="mt-2.5 flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3.5 py-2 rounded-xl">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{t.packChange.errorNoFiles}</span>
                      </div>
                    )}
                  </div>

                  {/* Recap Transparent (comme l'autre paiement sans hébergement ni suppléments) */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2 text-xs text-slate-300">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">{t.packChange.recapFormulaLabel}</span>
                      <span className="font-bold text-white uppercase">{t.packChange.packName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">{t.packChange.recapPrice}</span>
                      <span className="font-bold text-white">{formattedPrice}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">{t.packChange.recapHosting}</span>
                      <span className="text-emerald-400 font-medium">{t.packChange.recapHostingFree}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">{t.packChange.recapSupplements}</span>
                      <span className="text-slate-400 font-medium">{t.packChange.recapSupplementsNone}</span>
                    </div>
                    <div className="pt-2 border-t border-white/10 flex justify-between items-center text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-purple-400">
                      <span>{t.packChange.recapTotal}</span>
                      <span>{formattedPrice}</span>
                    </div>
                    {currency !== 'MAD' && (
                      <div className="text-[11px] text-slate-400 text-right font-mono">
                        {language === 'fr' ? 'Réf. fixe :' : 'Fixed ref:'} 1 500 DH
                      </div>
                    )}
                  </div>

                  {/* Mode de règlement cash */}
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
                    <Banknote className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div className="text-xs text-emerald-200">
                      <span className="font-bold text-emerald-400">
                        {language === 'fr' ? 'Règlement en cash :' : 'Cash payment:'}
                      </span>{' '}
                      {language === 'fr'
                        ? 'Paiement en cash à la livraison et validation complète de vos modifications.'
                        : 'Cash payment upon delivery and full validation of your modifications.'}
                    </div>
                  </div>

                  {/* Bouton de soumission */}
                  <button
                    id="submit-pack-changement-btn"
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold text-sm shadow-xl shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{t.packChange.submitBtn}</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t.packChange.confidentialityNote}</span>
                  </div>
                </form>
              )}
            </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Proposition modale de noter Zalyvo sur 5 étoiles juste après commande */}
      <RatingProposalModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        orderType="change"
        clientName={`${firstName} ${lastName}`.trim() || 'Client'}
        clientEmail={email}
        orderSummary={`Pack Changement 1 500 DH (${company || 'Site existant'})`}
      />
    </section>
  );
}
