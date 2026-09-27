import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { CheckCircle2, Clock, X, Sparkles } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export interface ToastOptions {
  title?: string;
  duration?: number; // en ms (défaut: 7000ms)
}

interface ToastContextType {
  showNotification: (message: string, options?: ToastOptions) => void;
  hideNotification: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastData {
  id: number;
  message: string;
  title: string;
  duration: number;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastData | null>(null);
  const [visible, setVisible] = useState(false);
  const { t } = useLanguage();

  const hideNotification = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      setToast(null);
    }, 300);
  }, []);

  const showNotification = useCallback((message: string, options?: ToastOptions) => {
    const title = options?.title || t.toast.titleContact;
    const duration = options?.duration || 7000;
    const newToast: ToastData = {
      id: Date.now(),
      message,
      title,
      duration,
    };

    setToast(newToast);
    setVisible(true);
  }, [t.toast.titleContact]);

  // Auto-dismiss après la durée spécifiée
  useEffect(() => {
    if (!toast || !visible) return;

    const timer = setTimeout(() => {
      hideNotification();
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast, visible, hideNotification]);

  return (
    <ToastContext.Provider value={{ showNotification, hideNotification }}>
      {children}

      {/* Petite notification flottante sur l'écran du client */}
      {toast && (
        <div
          id="client-screen-toast-notification"
          role="status"
          aria-live="polite"
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[92vw] sm:w-[490px] max-w-lg transition-all duration-300 pointer-events-auto ${
            visible
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
          }`}
        >
          <div className="relative overflow-hidden rounded-2xl bg-[#0b1022]/95 backdrop-blur-xl border border-emerald-500/40 p-4 sm:p-5 shadow-2xl shadow-emerald-950/80 text-white">
            {/* Ambient glow accent */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none -z-10" />
            
            <div className="flex items-start gap-3.5">
              {/* Badge icône succès pulsant */}
              <div className="shrink-0 w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20 mt-0.5">
                <CheckCircle2 className="w-5 h-5 animate-pulse" />
              </div>

              {/* Contenu textuel de la notif */}
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-white font-display tracking-tight">
                    {toast.title}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-[10px] font-semibold text-emerald-300 border border-emerald-500/25">
                    <Clock className="w-2.5 h-2.5" />
                    24h
                  </span>
                </div>

                {/* Phrase exacte demandée par l'utilisateur */}
                <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                  {toast.message}
                </p>

                <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
                  <Sparkles className="w-3 h-3 text-blue-400" />
                  <span>{t.toast.teamNote}</span>
                </div>
              </div>

              {/* Bouton pour fermer manuellement */}
              <button
                type="button"
                onClick={hideNotification}
                className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label={t.toast.closeAria}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Barre de progression temporelle */}
            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300"
                style={{
                  animation: `toast-progress ${toast.duration}ms linear forwards`,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
