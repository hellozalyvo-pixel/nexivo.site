import React, { useState, useEffect, useRef } from 'react';
import { useWhatsAppChat } from '../context/WhatsAppChatContext';
import { X, ShieldAlert, Trash2, Copy, Send, MailCheck, Maximize2, Minimize2, ExternalLink, MessageCircle } from 'lucide-react';

declare global {
  interface Window {
    puter?: {
      ai: {
        chat: (
          messages: Array<{ role: string; content: string }>,
          options?: { model?: string; stream?: boolean }
        ) => Promise<{ message: { content: string } }>;
      };
    };
    emailjs?: {
      init: (key: string) => void;
      send: (
        serviceId: string,
        templateId: string,
        templateParams: Record<string, any>
      ) => Promise<any>;
    };
  }
}

interface ChatItem {
  id: string;
  who: 'bot' | 'user';
  text: string;
  time: string;
  showQuick?: boolean;
}

interface MessageRole {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface UnansweredItem {
  question: string;
  heure: string;
  courte?: string;
  date: string;
  url: string;
}

const OWNER_EMAIL = 'web.nexivo@gmail.com';
const WHATSAPP_NUMBER = '+212 715 878 163';
const WHATSAPP_RAW_NUMBER = '212715878163';
const CONTACT_PHONE = '+212 715878163';
const MESSAGE_NON_COMPRIS =
  'Je ne peux pas répondre à cette question, je peux simplement vous donner des informations concernant NEXIVO.\n\nChez NEXIVO, nous créons des sites web modernes, rapides et professionnels. Dites-moi quelle est votre activité et je vous conseille la meilleure solution.';

// --- CONFIG EMAILJS (100% fiable) ---
const EMAILJS_SERVICE_ID = 'service_nexivo';
const EMAILJS_TEMPLATE_ID = 'template_nexivo';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

const SYSTEM_PROMPT = `
Tu es NEXIVO, l'assistant officiel de l'agence web NEXIVO.
Tu reprends TOUTES les informations du chatbot NEXIVO d'origine, mais tu réponds avec la MEME FAÇON de répondre que le chatbot RETALIA : pro, chaleureux, multilingue.

INFORMATIONS OFFICIELLES NEXIVO :
- Nom : NEXIVO - Agence Web (anciennement ZALYVO)
- Site : nexivo.com (ou zalyvo.com)
- Services : création de sites web modernes, rapides et professionnels. Sites vitrines, boutiques en ligne, catalogues produits, prise de rendez-vous, sites restaurant/café, portfolio. Design responsive parfait sur mobile, tablette et ordinateur. Optimisation vitesse et référencement Google. Intégrations : formulaire, WhatsApp, Google Maps, réseaux sociaux, mise en ligne complète.
- Tarifs : 
  STARTER 2 999 DH - Jusqu'à 3 pages - Livraison 7 jours
  PRO 4 500 DH - Jusqu'à 7 pages - 11 jours - La plus demandée - Design sur mesure + SEO
  BUSINESS 6 500 DH - Jusqu'à 10 pages - 14 jours - E-commerce possible + SEO complet
  Pack Changement (modification site existant) 1 500 DH
  Suppléments 200 DH par élément
  Logo + nom de marque 500 DH
- Hébergement : Si client a déjà hébergeur gratuit, sinon formule NEXIVO : 1 mois 199 DH, 3 mois 499 DH, 6 mois 899 DH, 12 mois 1590 DH, 24 mois 2890 DH, 48 mois 4990 DH.
- Contact IMPORTANT : 
  - Numéro ZALYVO / NEXIVO : +212 715878163 (TOUJOURS donner celui-ci si on demande le numéro de ZALYVO ou NEXIVO)
  - Email : web.nexivo@gmail.com
  - Site : nexivo.com
  - Ancien numéro +216 25 152 905 ne plus utiliser, remplacer par +212 715878163
- Horaires : 7j/7 et 24h/24, réponse en moins de 24h même week-end.

FAÇON DE RÉPONDRE - STYLE RETALIA :
1. Tu t'appelles NEXIVO. Tu dis "Chez NEXIVO, nous..." 
2. Tu parles comme un humain pro, tu vouvoies, sans emoji excessif, français naturel, professionnel mais chaleureux.
3. Tu peux répondre en français, arabe ou anglais selon la langue du client.
4. Si on demande "quel site / quel service vous me proposez" : tu demandes l'activité du client et tu proposes la solution la plus adaptée.
5. Si on demande numéro de téléphone, numéro de ZALYVO, contact, WhatsApp : tu réponds TOUJOURS +212 715878163
6. Si la question n'a pas de réponse dans tes infos NEXIVO, tu dois OBLIGATOIREMENT terminer ta réponse par [TRANSFERT_EQUIPE]. Le système va envoyer un email en arrière-plan à web.nexivo@gmail.com mais le client NE DOIT PAS le savoir. Tu ne dois jamais dire "je transmets à l'équipe" ou "j'envoie un email". Tu dois dire exactement : "Je ne peux pas répondre à cette question, je peux simplement vous donner des informations concernant NEXIVO."
`;

export default function WhatsAppChatWidget() {
  const { isOpen, closeChat, queuedMessage, clearQueuedMessage } = useWhatsAppChat();

  const [messages, setMessages] = useState<ChatItem[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [unansweredList, setUnansweredList] = useState<UnansweredItem[]>([]);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const historyRef = useRef<MessageRole[]>([{ role: 'system', content: SYSTEM_PROMPT }]);
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialisation EmailJS si configuré
  useEffect(() => {
    if (typeof window !== 'undefined' && window.emailjs && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
      try {
        window.emailjs.init(EMAILJS_PUBLIC_KEY);
      } catch (err) {
        console.log('EmailJS init error', err);
      }
    }
  }, []);

  const getTime = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Charger les questions non traitées depuis localStorage
  const loadUnanswered = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('nexivo_unanswered') || '[]');
      setUnansweredList(stored);
      return stored;
    } catch {
      setUnansweredList([]);
      return [];
    }
  };

  // Message d'accueil du bot
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          who: 'bot',
          text: `Bonjour et bienvenue chez NEXIVO.\n\nJe suis l'assistant intelligent de NEXIVO, avec la même façon de répondre que RETALIA.\n\nComment puis-je vous aider aujourd'hui ?`,
          time: getTime(),
          showQuick: true,
        },
      ]);
    }
  }, [messages.length]);

  // Messages mis en file d'attente
  useEffect(() => {
    if (isOpen && queuedMessage) {
      handleUser(queuedMessage);
      clearQueuedMessage();
    }
  }, [isOpen, queuedMessage, clearQueuedMessage]);

  // Défilement automatique
  useEffect(() => {
    if (isOpen && chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  // Focus sur le champ texte à l'ouverture
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  // Écoute des raccourcis Ctrl+Shift+A et Echap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') || (showAdminPanel && e.key === 'Escape')) {
        if (showAdminPanel) {
          setShowAdminPanel(false);
        } else {
          loadUnanswered();
          setShowAdminPanel(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAdminPanel]);

  // Envoi email multi-canaux 100% fiable
  const sendEmailToOwner = async (clientQuestion: string) => {
    const now = new Date();
    const heure = now.toLocaleString('fr-FR', {
      timeZone: 'Africa/Casablanca',
      dateStyle: 'full',
      timeStyle: 'medium',
    });
    const heureCourte = now.toLocaleString('fr-FR', { timeZone: 'Africa/Casablanca' });

    // 1. Sauvegarde locale
    try {
      const list: UnansweredItem[] = JSON.parse(
        localStorage.getItem('nexivo_unanswered') || '[]'
      );
      list.unshift({
        question: clientQuestion,
        heure,
        courte: heureCourte,
        date: now.toISOString(),
        url: window.location.href,
      });
      localStorage.setItem('nexivo_unanswered', JSON.stringify(list.slice(0, 100)));
      setUnansweredList(list.slice(0, 100));
    } catch {
      // safe fallback
    }

    const subject = `NEXIVO - Question non traitée - ${heureCourte}`;
    const message = `NOUVELLE DEMANDE CLIENT NON TRAITÉE - NEXIVO

Heure : ${heure}
Question : ${clientQuestion}
Site : ${window.location.href}
Navigateur : ${navigator.userAgent}

À répondre sur WhatsApp +212 715 878 163
Email : ${OWNER_EMAIL}`;

    console.log('Tentative envoi email pour :', clientQuestion);

    // METHODE 1 : EmailJS (la plus fiable si configurée)
    if (
      typeof window !== 'undefined' &&
      window.emailjs &&
      EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY'
    ) {
      try {
        await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          to_email: OWNER_EMAIL,
          subject: subject,
          message: message,
          question: clientQuestion,
          heure: heure,
          from_name: 'NEXIVO Bot',
        });
        console.log('Email envoyé via EmailJS');
        return true;
      } catch (e) {
        console.log('EmailJS erreur', e);
      }
    }

    // METHODE 2 : FormSubmit avec FormData (anti-adblocker)
    try {
      const formData = new FormData();
      formData.append('subject', subject);
      formData.append('message', message);
      formData.append('question', clientQuestion);
      formData.append('heure', heure);
      formData.append('_captcha', 'false');
      await fetch(`https://formsubmit.co/${OWNER_EMAIL}`, { method: 'POST', body: formData });
      console.log('Email envoyé via FormSubmit FormData');
    } catch (e) {
      console.log('FormSubmit FormData erreur', e);
    }

    // METHODE 3 : FormSubmit AJAX JSON
    try {
      await fetch(`https://formsubmit.co/ajax/${OWNER_EMAIL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          subject: subject,
          message: message,
          question: clientQuestion,
          heure: heure,
          _captcha: 'false',
        }),
      });
      console.log('Email envoyé via FormSubmit AJAX');
    } catch (e) {
      console.log('FormSubmit AJAX erreur', e);
    }

    // METHODE 4 : Webhook gratuit ntfy pour notification instantanée sur téléphone
    try {
      await fetch('https://ntfy.sh/nexivo-alerts-2025', {
        method: 'POST',
        body: `${subject}\n${clientQuestion}\n${heure}`,
        headers: { Title: 'NEXIVO - Nouvelle question' },
      });
    } catch {
      // ignore
    }
  };

  const testEmail = async () => {
    await sendEmailToOwner(
      "TEST - Ceci est un test d'envoi d'email depuis le bot NEXIVO. Heure : " +
        new Date().toLocaleString()
    );
    alert(
      "Test envoyé à web.nexivo@gmail.com ! Vérifiez votre boîte et vos SPAMS dans 1-2 minutes."
    );
    loadUnanswered();
  };

  const copyAll = () => {
    const list = loadUnanswered();
    const text = list.map((l: UnansweredItem) => `${l.heure} - ${l.question}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  const clearUnanswered = () => {
    localStorage.removeItem('nexivo_unanswered');
    setUnansweredList([]);
  };

  const askAI = async (userText: string): Promise<string> => {
    historyRef.current.push({ role: 'user', content: userText });

    // 1. Puter.js
    if (window.puter && window.puter.ai && typeof window.puter.ai.chat === 'function') {
      try {
        const response = await window.puter.ai.chat(historyRef.current, {
          model: 'gpt-4o-mini',
          stream: false,
        });
        if (response && response.message && response.message.content) {
          const answer = response.message.content;
          historyRef.current.push({ role: 'assistant', content: answer });
          if (historyRef.current.length > 12) {
            historyRef.current = [historyRef.current[0]].concat(historyRef.current.slice(-10));
          }
          if (answer.includes('[TRANSFERT_EQUIPE]')) {
            sendEmailToOwner(userText);
            return MESSAGE_NON_COMPRIS;
          }
          return answer;
        }
      } catch (e) {
        console.error('Puter AI error:', e);
      }
    }

    // 2. Server API fallback (Gemini 3.6 Flash)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: historyRef.current.slice(-8),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.answer && typeof data.answer === 'string') {
          const answer = data.answer.trim();
          historyRef.current.push({ role: 'assistant', content: answer });
          if (historyRef.current.length > 12) {
            historyRef.current = [historyRef.current[0]].concat(historyRef.current.slice(-10));
          }
          if (answer.includes('[TRANSFERT_EQUIPE]')) {
            sendEmailToOwner(userText);
            return MESSAGE_NON_COMPRIS;
          }
          return answer;
        }
      }
    } catch {
      // offline fallback
    }

    // 3. Fallback immédiat et alerte silencieuse par email
    const lower = userText.toLowerCase();
    if (lower.includes('zalyvo') && (lower.includes('num') || lower.includes('tel') || lower.includes('whatsapp') || lower.includes('contact'))) {
      return `Le numéro de ZALYVO / NEXIVO est : ${CONTACT_PHONE}\nVous pouvez nous écrire sur WhatsApp à tout moment, nous répondons 7j/7.`;
    }
    if (lower.includes('numéro') || lower.includes('numero') || lower.includes('téléphone') || lower.includes('telephone') || lower.includes('whatsapp') || lower.includes('contact')) {
      return `Vous pouvez nous contacter directement chez NEXIVO :\n\nWhatsApp / Téléphone : ${CONTACT_PHONE}\nEmail : ${OWNER_EMAIL}\nSite : nexivo.com\n\nNous vous répondons très rapidement, 7j/7.`;
    }
    if (lower.includes('tarif') || lower.includes('prix')) {
      return `Voici nos formules chez NEXIVO :\n\nSTARTER 2 999 DH - 3 pages - 7 jours\nPRO 4 500 DH - 7 pages - 11 jours (la plus demandée)\nBUSINESS 6 500 DH - 10 pages - 14 jours - E-commerce possible\n\nPack Changement 1 500 DH pour modifier un site existant.\nQuelle est votre activité ?`;
    }

    sendEmailToOwner(userText);
    return MESSAGE_NON_COMPRIS;
  };

  const handleUser = async (txt: string) => {
    const trimmed = txt.trim();
    if (!trimmed) return;

    if (trimmed.toLowerCase().includes('admin nexivo')) {
      loadUnanswered();
      setShowAdminPanel(true);
      return;
    }

    // Si clic direct sur WhatsApp
    if (trimmed === '__OPEN_WHATSAPP__') {
      const url = `https://wa.me/${WHATSAPP_RAW_NUMBER}?text=${encodeURIComponent(
        "Bonjour NEXIVO, j'aimerais échanger avec votre équipe pour un projet de site web."
      )}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    const userMsg: ChatItem = {
      id: Date.now().toString(),
      who: 'user',
      text: trimmed,
      time: getTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    const answer = await askAI(trimmed);

    setIsTyping(false);
    const botMsg: ChatItem = {
      id: (Date.now() + 1).toString(),
      who: 'bot',
      text: answer,
      time: getTime(),
      showQuick: true,
    };

    setMessages((prev) => [...prev, botMsg]);
  };

  const quickBtns: [string, string][] = [
    ['Nos services', 'Quels services proposez-vous ?'],
    ['Tarifs', 'Quels sont vos tarifs ?'],
    ['Numéro', 'Quel est votre numéro ?'],
    ['Devis', 'Je veux un devis'],
  ];

  if (!isOpen && !showAdminPanel) return null;

  return (
    <>
      {/* Panneau Admin Secret */}
      {showAdminPanel && (
        <div
          id="adminPanel"
          className="fixed inset-0 bg-black/85 z-[9999] flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAdminPanel(false);
          }}
        >
          <div className="bg-white text-slate-900 w-[520px] max-w-[95%] max-h-[85vh] overflow-y-auto rounded-2xl p-5 sm:p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-emerald-600" />
                Questions non traitées
                <span id="adminCount" className="bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full ml-1">
                  {unansweredList.length}
                </span>
              </h3>
              <button
                onClick={() => setShowAdminPanel(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 my-2.5 leading-relaxed">
              Toutes les questions que NEXIVO n'a pas su répondre. Envoyées automatiquement à <strong>{OWNER_EMAIL}</strong>.<br />
              <strong className="text-slate-800">Si tu ne reçois pas d'email :</strong> Vérifie SPAMS + désactive adblocker + clique sur "Tester envoi email".
            </p>

            <button
              onClick={testEmail}
              className="w-full sm:w-auto px-4 py-2 bg-[#0d2a54] hover:bg-[#071933] text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors mb-3 flex items-center justify-center gap-1.5 shadow-sm"
            >
              <MailCheck className="w-4 h-4" />
              Tester envoi email maintenant
            </button>

            <div id="adminList" className="mt-2.5 space-y-2 max-h-[44vh] overflow-y-auto pr-1">
              {unansweredList.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  Aucune question non traitée pour le moment.
                </div>
              ) : (
                unansweredList.map((item, i) => (
                  <div
                    key={i}
                    className="border border-slate-200 bg-slate-50/90 p-3 rounded-xl text-xs space-y-1 hover:border-slate-300 transition-colors"
                  >
                    <b className="text-emerald-700 font-semibold block">{item.courte || item.heure}</b>
                    <div className="text-slate-800 text-sm font-medium">{item.question}</div>
                    {item.url && <small className="text-slate-400 text-[11px] block truncate">{item.url}</small>}
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2.5 items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAdminPanel(false)}
                  className="px-4 py-2 bg-[#333] hover:bg-black text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                >
                  Fermer
                </button>
                <button
                  onClick={copyAll}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1 border border-slate-200"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiedNotification ? 'Copié !' : 'Copier tout'}
                </button>
              </div>

              <button
                onClick={clearUnanswered}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1 border border-red-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Effacer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Docked WhatsApp Chatbot Widget on the Right */}
      {isOpen && (
        <div
          id="nexivo-ia-assistant-container"
          className={
            isExpanded
              ? 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200'
              : 'fixed bottom-22 sm:bottom-24 right-3 sm:right-6 z-50 flex flex-col items-end pointer-events-auto animate-in slide-in-from-bottom-4 duration-300'
          }
          onClick={(e) => {
            if (isExpanded && e.target === e.currentTarget) {
              closeChat();
            }
          }}
        >
          {/* Main WhatsApp Phone Window */}
          <div
            className={`flex flex-col bg-[#efeae2] overflow-hidden shadow-2xl transition-all duration-300 border border-[#1f2c34]/60 ${
              isExpanded
                ? 'w-[450px] max-w-[95%] h-[90vh] max-h-[820px] rounded-3xl border-8 border-[#1f2c34]'
                : 'w-[390px] sm:w-[410px] max-w-[calc(100vw-24px)] h-[580px] max-h-[calc(100vh-120px)] rounded-2xl sm:rounded-3xl shadow-emerald-950/40'
            }`}
          >
            {/* Header: Authentic WhatsApp Dark Teal/Grey Theme */}
            <div className="bg-[#202c33] text-white px-3.5 py-3 flex items-center justify-between gap-3 shadow-md z-10 border-b border-white/5">
              {/* Avatar + Info */}
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-[#0d2a54] flex items-center justify-center font-black text-white text-lg shadow-sm border border-blue-400/30 flex-shrink-0">
                    N
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#25D366] border-2 border-[#202c33]" />
                </div>

                <div className="truncate">
                  <div className="font-bold text-sm tracking-wide text-white flex items-center gap-1.5 truncate">
                    <span>NEXIVO - Assistant</span>
                    <span className="inline-block px-1.5 py-0.2 text-[9px] font-semibold bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/30">
                      IA 24/7
                    </span>
                  </div>
                  <div className="text-[11px] text-[#25D366] flex items-center gap-1 font-medium truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse inline-block" />
                    <span>En ligne - Réponse rapide 7j/7</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons in Header */}
              <div className="flex items-center gap-1 text-slate-300">
                {/* Direct WhatsApp link */}
                <a
                  href={`https://wa.me/${WHATSAPP_RAW_NUMBER}?text=${encodeURIComponent(
                    "Bonjour NEXIVO, j'aimerais échanger avec votre équipe pour un projet de site web."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-emerald-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Ouvrir sur WhatsApp direct"
                  aria-label="Ouvrir sur WhatsApp direct"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                </a>

                {/* Standalone page /whatsapp */}
                <a
                  href="/whatsapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors hidden sm:inline-flex"
                  title="Ouvrir la page dédiée /whatsapp"
                  aria-label="Ouvrir la page dédiée"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {/* Expand / Minimize toggle */}
                <button
                  type="button"
                  onClick={() => setIsExpanded((prev) => !prev)}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors hidden sm:inline-flex cursor-pointer"
                  title={isExpanded ? 'Réduire dans le coin' : 'Agrandir au centre'}
                  aria-label={isExpanded ? 'Réduire' : 'Agrandir'}
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={closeChat}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer ml-0.5"
                  title="Fermer"
                  aria-label="Fermer le chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Body with Authentic WhatsApp Doodle Pattern */}
            <div
              ref={chatRef}
              id="nexivo-chat-scroll"
              className="flex-1 overflow-y-auto p-3.5 space-y-3"
              style={{
                backgroundColor: '#efeae2',
                backgroundImage: `url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')`,
                backgroundRepeat: 'repeat',
                backgroundSize: '380px auto',
              }}
            >
              {/* Date stamp notification */}
              <div className="text-center my-2">
                <span className="inline-block px-3 py-1 rounded-lg bg-white/70 backdrop-blur-sm text-[11px] font-semibold text-slate-600 shadow-sm border border-slate-200/50">
                  Assistant Officiel NEXIVO • En ligne
                </span>
              </div>

              {messages.map((item) => (
                <React.Fragment key={item.id}>
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-[13.5px] leading-relaxed break-words shadow-sm relative animate-in fade-in-50 duration-200 ${
                      item.who === 'user'
                        ? 'bg-[#d9fdd3] text-[#111b21] ml-auto rounded-tr-none border border-emerald-300/30'
                        : 'bg-white text-[#111b21] mr-auto rounded-tl-none border border-slate-200/60'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-normal">
                      {item.text}
                    </div>
                    <div className="text-[10px] text-slate-400 text-right mt-1.5 font-medium select-none">
                      {item.time}
                    </div>
                  </div>

                  {/* Interactive Quick Action Buttons */}
                  {item.showQuick && item.who === 'bot' && (
                    <div className="flex flex-wrap gap-1.5 my-2 animate-in fade-in duration-300">
                      {quickBtns.map((b) => (
                        <button
                          key={b[1]}
                          type="button"
                          onClick={() => handleUser(b[1])}
                          className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/95 hover:bg-[#0d2a54] text-[#0d2a54] hover:text-white border border-[#0d2a54]/40 hover:border-[#0d2a54] transition-all duration-200 shadow-sm cursor-pointer active:scale-95"
                        >
                          {b[0]}
                        </button>
                      ))}
                    </div>
                  )}
                </React.Fragment>
              ))}

              {/* Animated Typing Indicator */}
              {isTyping && (
                <div className="bg-white p-3 rounded-2xl rounded-tl-none w-16 shadow-sm border border-slate-200/60 flex items-center justify-center gap-1.5 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}
            </div>

            {/* Bottom Input Bar: Authentic WhatsApp styling */}
            <div className="bg-[#f0f2f5] p-2.5 border-t border-slate-300/60 flex flex-col gap-1.5 shadow-inner">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  id="nexivo-chat-input"
                  className="flex-1 bg-white border border-slate-300/80 rounded-full px-4 py-2.5 text-[13.5px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00a884] shadow-sm transition-all"
                  placeholder="Posez votre question à NEXIVO..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleUser(inputText);
                  }}
                />

                <button
                  type="button"
                  onClick={() => handleUser(inputText)}
                  disabled={!inputText.trim()}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-200 flex-shrink-0 cursor-pointer shadow-md ${
                    inputText.trim()
                      ? 'bg-[#0d2a54] hover:bg-[#071933] scale-100'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                  aria-label="Envoyer"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>

              {/* Direct WhatsApp Callout strip */}
              <div className="flex items-center justify-between px-1 text-[11px] text-slate-500">
                <span className="truncate">Réponse IA immédiate</span>
                <a
                  href={`https://wa.me/${WHATSAPP_RAW_NUMBER}?text=${encodeURIComponent(
                    "Bonjour NEXIVO, j'aimerais échanger directement sur WhatsApp avec votre équipe."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 hover:text-emerald-800 font-semibold hover:underline inline-flex items-center gap-1"
                >
                  <span>WhatsApp direct : {WHATSAPP_NUMBER}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
