import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
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
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div id="floating-whatsapp-container" className="fixed bottom-5 sm:bottom-6 right-4 sm:right-6 z-40 flex items-center gap-3">
      {/* Small interactive invitation popup */}
      {!tooltipDismissed && !isOpen && (
        <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#0d1222]/95 border border-emerald-500/30 shadow-2xl text-xs text-slate-200 backdrop-blur-md animate-in slide-in-from-bottom-2 duration-300">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-medium">{t.floatingWhatsApp.invitation}</span>
          <button
            onClick={() => setTooltipDismissed(true)}
            className="text-slate-400 hover:text-white p-0.5 ml-0.5 cursor-pointer transition-colors"
            aria-label={language === 'fr' ? 'Fermer notification' : 'Close notification'}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button with authentic WhatsApp branding */}
      <button
        type="button"
        id="floating-whatsapp-fab"
        onClick={toggleChat}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 group cursor-pointer relative ${
          isOpen
            ? 'bg-[#202c33] text-white border border-emerald-500/40 hover:bg-[#111b21] rotate-90 shadow-emerald-500/20'
            : 'bg-[#25D366] hover:bg-[#20bd5a] text-white hover:scale-105 shadow-emerald-500/40'
        }`}
        aria-label={t.floatingWhatsApp.ariaLabel}
        title={
          isOpen
            ? language === 'fr' ? 'Fermer l’assistant' : 'Close assistant'
            : language === 'fr' ? 'Ouvrir l’Assistant WhatsApp NEXIVO' : 'Open NEXIVO WhatsApp Assistant'
        }
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white transition-transform -rotate-90" />
        ) : (
          <>
            {/* WhatsApp Official SVG Logo */}
            <svg
              viewBox="0 0 24 24"
              width="30"
              height="30"
              fill="currentColor"
              className="drop-shadow-sm group-hover:scale-110 transition-transform"
            >
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.04 3.67C14.24 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16C10.66 20.16 9.3 19.8 8.1 19.09L7.81 18.92L4.69 19.74L5.52 16.7L5.33 16.39C4.54 15.14 4.12 13.55 4.12 11.91C4.12 7.37 7.82 3.67 12.04 3.67ZM8.73 7.34C8.54 7.34 8.24 7.41 7.98 7.69C7.72 7.97 7 8.65 7 10.02C7 11.39 8 12.72 8.14 12.91C8.28 13.1 10.1 15.9 12.87 17.1C13.53 17.38 14.05 17.55 14.45 17.68C15.11 17.89 15.72 17.86 16.2 17.79C16.73 17.71 17.84 17.12 18.07 16.47C18.3 15.82 18.3 15.26 18.23 15.14C18.16 15.02 17.97 14.95 17.69 14.81C17.41 14.67 16.03 13.99 15.77 13.9C15.51 13.81 15.33 13.76 15.14 14.04C14.95 14.32 14.42 14.95 14.26 15.14C14.1 15.33 13.93 15.35 13.65 15.21C13.37 15.07 12.47 14.78 11.4 13.82C10.57 13.08 10.01 12.16 9.85 11.88C9.69 11.6 9.83 11.45 9.97 11.31C10.1 11.18 10.26 10.97 10.4 10.81C10.54 10.65 10.59 10.53 10.68 10.35C10.77 10.16 10.73 10 10.66 9.86C10.59 9.72 10.03 8.35 9.8 7.8C9.58 7.26 9.35 7.34 9.18 7.33C9.02 7.32 8.84 7.34 8.73 7.34Z" />
            </svg>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#090b14] animate-pulse" />
          </>
        )}
      </button>
    </div>
  );
}
