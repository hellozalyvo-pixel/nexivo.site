import { useState } from 'react';
import { Star, Send, X, CheckCircle2, Mail, Sparkles, MessageSquare } from 'lucide-react';
import { sendRatingEmail, generateRatingMailtoUrl, RatingPayload } from '../services/emailService';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';

interface RatingProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderType: 'website' | 'change';
  clientName: string;
  clientEmail: string;
  orderSummary: string;
}

export default function RatingProposalModal({
  isOpen,
  onClose,
  orderType,
  clientName,
  clientEmail,
  orderSummary,
}: RatingProposalModalProps) {
  const { language } = useLanguage();
  const { showNotification } = useToast();

  const [stars, setStars] = useState<number>(5);
  const [hoveredStars, setHoveredStars] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const currentDisplayStars = hoveredStars !== null ? hoveredStars : stars;

  const getStarLabel = (count: number) => {
    if (language === 'fr') {
      switch (count) {
        case 1:
          return '1/5 — À améliorer';
        case 2:
          return '2/5 — Passable';
        case 3:
          return '3/5 — Bien';
        case 4:
          return '4/5 — Très bien';
        case 5:
        default:
          return '5/5 — Excellent / Parfait !';
      }
    } else {
      switch (count) {
        case 1:
          return '1/5 — Needs improvement';
        case 2:
          return '2/5 — Fair';
        case 3:
          return '3/5 — Good';
        case 4:
          return '4/5 — Very good';
        case 5:
        default:
          return '5/5 — Excellent / Outstanding!';
      }
    }
  };

  const payload: RatingPayload = {
    stars,
    clientName,
    clientEmail,
    orderType,
    orderSummary,
    comment,
  };

  const handleSendRating = async () => {
    setSending(true);
    try {
      await sendRatingEmail(payload);
      setSubmitted(true);
      showNotification(
        language === 'fr'
          ? `Merci pour votre note de ${stars}/5 étoiles ! Elle a bien été envoyée à nexivo.site@gmail.com.`
          : `Thank you for your ${stars}/5 star rating! It was sent to nexivo.site@gmail.com.`,
        {
          title: language === 'fr' ? 'Note transmise !' : 'Rating submitted!',
          duration: 6000,
        }
      );
    } catch (err) {
      console.error('Erreur lors de l’envoi de la note:', err);
      setSubmitted(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      id="rating-proposal-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="rating-proposal-modal-content"
        className="relative w-full max-w-lg rounded-3xl bg-[#090d1f] border border-amber-500/30 p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.2)] text-white overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-32 bg-amber-500/15 blur-3xl pointer-events-none" />

        {/* Close / Ne pas noter Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label={language === 'fr' ? 'Fermer' : 'Close'}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          /* Thank You Screen */
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto mb-4 shadow-lg shadow-emerald-500/20 animate-in zoom-in-95">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-extrabold text-white font-display mb-2">
              {language === 'fr' ? 'Merci pour votre note !' : 'Thank you for your rating!'}
            </h3>

            <div className="flex items-center justify-center gap-1.5 text-amber-400 text-lg mb-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-6 h-6 ${
                    s <= stars ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                  }`}
                />
              ))}
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 max-w-sm mx-auto">
              {language === 'fr'
                ? 'Votre note a été transmise directement à nexivo.site@gmail.com. Votre avis nous aide à offrir un service d’élite.'
                : 'Your rating was sent directly to nexivo.site@gmail.com. Your feedback helps us deliver elite service.'}
            </p>

            <button
              type="button"
              id="rating-modal-close-after-submit"
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              {language === 'fr' ? 'Consulter le récapitulatif de ma commande' : 'View order summary'}
            </button>
          </div>
        ) : (
          /* Rating Form Screen */
          <div>
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {language === 'fr'
                  ? 'COMMANDE VALIDÉE • VOTRE AVIS'
                  : 'ORDER VALIDATED • YOUR FEEDBACK'}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-white font-display leading-tight mb-2">
              {language === 'fr'
                ? 'Notez Nexivo sur 5 étoiles'
                : 'Rate Nexivo out of 5 stars'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
              {language === 'fr'
                ? 'Votre commande a bien été enregistrée ! Prenez 5 secondes pour nous attribuer une note. Elle sera envoyée à nexivo.site@gmail.com :'
                : 'Your order has been recorded! Take 5 seconds to rate your experience. It will be sent to nexivo.site@gmail.com:'}
            </p>

            {/* Interactive Stars Selector */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 mb-5 text-center">
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
                {[1, 2, 3, 4, 5].map((starNum) => {
                  const isFilled = starNum <= currentDisplayStars;
                  return (
                    <button
                      key={starNum}
                      type="button"
                      id={`rating-star-btn-${starNum}`}
                      onMouseEnter={() => setHoveredStars(starNum)}
                      onMouseLeave={() => setHoveredStars(null)}
                      onClick={() => setStars(starNum)}
                      aria-label={`${starNum} étoiles`}
                      className="p-1 sm:p-1.5 rounded-lg transition-transform hover:scale-125 active:scale-95 focus:outline-none cursor-pointer"
                    >
                      <Star
                        className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors duration-150 ${
                          isFilled
                            ? 'text-amber-400 fill-amber-400 filter drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]'
                            : 'text-slate-600 hover:text-amber-300/50'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="text-sm font-bold text-amber-300 transition-all font-display">
                {getStarLabel(currentDisplayStars)}
              </div>
            </div>

            {/* Optional Comment Input */}
            <div className="mb-6">
              <label
                htmlFor="rating-comment-input"
                className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                  <span>
                    {language === 'fr'
                      ? 'Commentaire ou retour d’expérience'
                      : 'Comment or feedback'}
                  </span>
                </span>
                <span className="text-[10px] text-slate-400">
                  {language === 'fr' ? '(Optionnel)' : '(Optional)'}
                </span>
              </label>
              <textarea
                id="rating-comment-input"
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={
                  language === 'fr'
                    ? 'Un mot sur votre expérience, vos attentes ou vos impressions...'
                    : 'A word about your experience, expectations or thoughts...'
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-400/50 transition-colors"
              />
            </div>

            {/* Recipient Notice */}
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-6 bg-blue-950/30 px-3 py-2 rounded-lg border border-blue-500/20">
              <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>
                {language === 'fr' ? 'Destinataire officiel :' : 'Official recipient:'}{' '}
                <strong className="text-blue-300">nexivo.site@gmail.com</strong>
              </span>
            </div>

            {/* Action Buttons: Envoyer la note OU Ne pas noter */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                id="rating-submit-btn"
                onClick={handleSendRating}
                disabled={sending}
                className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/25 transition-all cursor-pointer active:scale-[0.99] disabled:opacity-50"
              >
                {sending ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>{language === 'fr' ? 'Envoi...' : 'Sending...'}</span>
                  </span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>
                      {language === 'fr'
                        ? `Envoyer ma note (${stars}/5 ⭐)`
                        : `Submit my rating (${stars}/5 ⭐)`}
                    </span>
                  </>
                )}
              </button>

              <button
                type="button"
                id="rating-skip-btn"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              >
                {language === 'fr' ? 'Ne pas noter' : 'Do not rate'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
