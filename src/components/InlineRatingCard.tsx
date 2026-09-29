import { useState } from 'react';
import { Star, Send, CheckCircle2, Mail, Sparkles, MessageSquare, EyeOff } from 'lucide-react';
import { sendRatingEmail, RatingPayload } from '../services/emailService';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';

interface InlineRatingCardProps {
  orderType: 'website' | 'change';
  clientName: string;
  clientEmail: string;
  orderSummary: string;
  className?: string;
}

export default function InlineRatingCard({
  orderType,
  clientName,
  clientEmail,
  orderSummary,
  className = '',
}: InlineRatingCardProps) {
  const { language } = useLanguage();
  const { showNotification } = useToast();

  const [stars, setStars] = useState<number>(5);
  const [hoveredStars, setHoveredStars] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return (
      <div className="py-2 text-center text-xs text-slate-500">
        <button
          type="button"
          onClick={() => setDismissed(false)}
          className="text-amber-400 hover:underline cursor-pointer inline-flex items-center gap-1.5"
        >
          <Star className="w-3.5 h-3.5" />
          <span>
            {language === 'fr'
              ? 'Vous souhaitez finalement laisser une note sur 5 étoiles ?'
              : 'Would you like to leave a 5-star rating after all?'}
          </span>
        </button>
      </div>
    );
  }

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
          ? `Merci pour votre note de ${stars}/5 étoiles ! Elle a bien été envoyée à web.nexivo@gmail.com.`
          : `Thank you for your ${stars}/5 star rating! It was sent to web.nexivo@gmail.com.`,
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
      id={`inline-rating-card-${orderType}`}
      className={`rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-[#0c1228] via-[#0b0f20] to-[#120f26] border border-amber-500/30 shadow-xl relative overflow-hidden text-left ${className}`}
    >
      {/* Decorative subtle ambient light */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/10 blur-3xl pointer-events-none" />

      {submitted ? (
        <div className="text-center py-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto mb-3 shadow-md">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h4 className="text-lg font-bold text-white font-display mb-1">
            {language === 'fr' ? 'Merci beaucoup pour votre note !' : 'Thank you for your rating!'}
          </h4>
          <div className="flex items-center justify-center gap-1 text-amber-400 my-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-5 h-5 ${
                  s <= stars ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-slate-300 max-w-sm mx-auto">
            {language === 'fr'
              ? 'Votre note a bien été transmise à web.nexivo@gmail.com.'
              : 'Your rating has been successfully sent to web.nexivo@gmail.com.'}
          </p>
        </div>
      ) : (
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-semibold mb-1.5">
                <Sparkles className="w-3 h-3" />
                <span>{language === 'fr' ? 'Votre avis compte' : 'Your feedback matters'}</span>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-white font-display">
                {language === 'fr'
                  ? 'Notez Nexivo sur 5 étoiles'
                  : 'Rate Nexivo out of 5 stars'}
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="text-slate-400 hover:text-slate-200 text-xs inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? 'Ne pas noter' : 'Do not rate'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-300 mb-4">
            {language === 'fr'
              ? 'Votre note sera directement transmise à web.nexivo@gmail.com :'
              : 'Your rating will be sent directly to web.nexivo@gmail.com:'}
          </p>

          {/* Interactive Stars */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/10 mb-4">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((starNum) => {
                const isFilled = starNum <= currentDisplayStars;
                return (
                  <button
                    key={starNum}
                    type="button"
                    onMouseEnter={() => setHoveredStars(starNum)}
                    onMouseLeave={() => setHoveredStars(null)}
                    onClick={() => setStars(starNum)}
                    aria-label={`${starNum} étoiles`}
                    className="p-1 rounded-lg transition-transform hover:scale-125 cursor-pointer focus:outline-none"
                  >
                    <Star
                      className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                        isFilled
                          ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                          : 'text-slate-600 hover:text-amber-300/60'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="text-xs sm:text-sm font-bold text-amber-300 font-display">
              {getStarLabel(currentDisplayStars)}
            </div>
          </div>

          {/* Optional comment */}
          <div className="mb-4">
            <label
              htmlFor={`rating-comment-${orderType}`}
              className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1.5"
            >
              <MessageSquare className="w-3 h-3 text-blue-400" />
              <span>{language === 'fr' ? 'Commentaire (optionnel) :' : 'Comment (optional):'}</span>
            </label>
            <input
              id={`rating-comment-${orderType}`}
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                language === 'fr'
                  ? 'Ex: Super service, rapide et clair...'
                  : 'E.g. Great service, fast and clear...'
              }
              className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400/50 transition-colors"
            />
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/5">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <Mail className="w-3 h-3 text-amber-400 shrink-0" />
              <span>
                {language === 'fr' ? 'Envoyé à :' : 'Sent to:'}{' '}
                <strong className="text-slate-200">web.nexivo@gmail.com</strong>
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setDismissed(true)}
                className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold cursor-pointer transition-all text-center"
              >
                {language === 'fr' ? 'Ne pas noter' : 'Do not rate'}
              </button>

              <button
                type="button"
                onClick={handleSendRating}
                disabled={sending}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 text-xs font-extrabold shadow-md shadow-amber-500/20 cursor-pointer transition-all disabled:opacity-50"
              >
                {sending ? (
                  <span>{language === 'fr' ? 'Envoi...' : 'Sending...'}</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>
                      {language === 'fr'
                        ? `Envoyer la note (${stars}/5 ⭐)`
                        : `Submit rating (${stars}/5 ⭐)`}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
