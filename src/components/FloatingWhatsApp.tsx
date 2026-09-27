import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useWhatsAppChat } from '../context/WhatsAppChatContext';

export default function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);
  const [tooltipDismissed, setTooltipDismissed] = useState(false);
  const { t, language } = useLanguage();
  const { isOpen, toggleChat } = useWhatsAppChat();

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div id="floating-whatsapp-container" className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      {/* Small interactive invitation popup */}
      {!tooltipDismissed && !isOpen && (
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0d1222] border border-emerald-500/30 shadow-xl text-xs text-slate-200 animate-in slide-in-from-bottom-2 duration-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{t.floatingWhatsApp.invitation}</span>
          <button
            onClick={() => setTooltipDismissed(true)}
            className="text-slate-400 hover:text-white p-0.5 ml-1 cursor-pointer"
            aria-label={language === 'fr' ? 'Fermer notification' : 'Close notification'}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        type="button"
        id="floating-whatsapp-fab"
        onClick={toggleChat}
        className="w-14 h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-2xl shadow-emerald-500/40 hover:scale-105 transition-all duration-300 group cursor-pointer"
        aria-label={t.floatingWhatsApp.ariaLabel}
        title={language === 'fr' ? 'Ouvrir l’Assistant WhatsApp ZALYVO' : 'Open ZALYVO WhatsApp Assistant'}
      >
        <MessageCircle className="w-7 h-7 text-slate-950 fill-current group-hover:rotate-6 transition-transform" />
      </button>
    </div>
  );
}
