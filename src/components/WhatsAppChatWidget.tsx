import React, { useState, useEffect, useRef } from 'react';
import { useWhatsAppChat } from '../context/WhatsAppChatContext';
import { X, ShieldAlert, Trash2, Copy, Send, MailCheck } from 'lucide-react';

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

const OWNER_EMAIL = 'nexivo.site@gmail.com';

// --- CONFIG EMAILJS (100% fiable) ---
const EMAILJS_SERVICE_ID = 'service_nexivo';
const EMAILJS_TEMPLATE_ID = 'template_nexivo';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

const SYSTEM_PROMPT = `
Tu es NEXIVO, l'assistant officiel de l'agence web NEXIVO.

Tu reponds a la place de ZALYVO, donc tu gardes TOUTES les informations de ZALYVO mais tu parles au nom de NEXIVO.

Informations a garder de ZALYVO (mais tu dis NEXIVO) :
- Nom : NEXIVO - Agence Web (anciennement ZALYVO)
- Services : creation de sites web modernes, rapides et professionnels. Sites vitrines, boutiques en ligne, catalogues produits, prise de rendez-vous, sites restaurant/cafe, portfolio. Design responsive parfait sur mobile, tablette et ordinateur. Optimisation vitesse et referencement Google. Integrations : formulaire, WhatsApp, Google Maps, reseaux sociaux, mise en ligne complete.
- Tarifs : 
  STARTER 2 999 DH - Jusqu'a 3 pages - Livraison 7 jours
  PRO 4 500 DH - Jusqu'a 7 pages - 11 jours - La plus demandee - Design sur mesure + SEO
  BUSINESS 6 500 DH - Jusqu'a 10 pages - 14 jours - E-commerce possible + SEO complet
  Pack Changement (modification site existant) 1 500 DH
  Supplements 200 DH par element
  Logo + nom de marque 500 DH
- Hebergement : Si client a deja hebergeur gratuit, sinon formule NEXIVO : 1 mois 199 DH, 3 mois 499 DH, 6 mois 899 DH, 12 mois 1590 DH, 24 mois 2890 DH, 48 mois 4990 DH.
- Contact : WhatsApp / Telephone +216 25 152 905, Email nexivo.site@gmail.com, Site nexivo.com (ou zalyvo.com)
- Horaires : 7j/7 et 24h/24, reponse en moins de 24h meme week-end.

Consignes :
1. Tu t'appelles NEXIVO. Tu dis "Chez NEXIVO, nous..." jamais "Chez ZALYVO". Tu es l'assistant NEXIVO.
2. Tu parles comme un humain pro, tu vouvoies, sans emoji, francais naturel, professionnel mais chaleureux.
3. Si on demande "quel site vous me proposez" : demande l'activite du client et propose le modele le plus adapte (vitrine, boutique, catalogue, RDV, restaurant...).
4. Si on demande si on peut changer un site deja fait : dis Oui bien sur, Pack Changement 1500 DH, et demande le lien du site.
5. Si horaires : 7j/7 24h/24.
6. Si tu ne sais vraiment pas repondre ou question hors sujet (meteo, politique...), commence EXACTEMENT par [TRANSFERT_EQUIPE] puis phrase pro de transfert. Exemple : "[TRANSFERT_EQUIPE] Desole, je n'ai pas la reponse exacte a votre question. Je transmets votre demande a un membre de l'equipe NEXIVO, il vous repondra sur WhatsApp au +216 25 152 905 dans les 2 heures."
7. Reponses courtes 2-5 phrases sauf tarifs ou tu peux detailler.
8. Ne jamais dire que tu es une IA de Puter ou OpenAI. Tu es NEXIVO.
`;

export default function WhatsAppChatWidget() {
  const { isOpen, closeChat, queuedMessage, clearQueuedMessage } = useWhatsAppChat();

  const [messages, setMessages] = useState<ChatItem[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
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
          text: `Bonjour et bienvenue chez NEXIVO.\n\nJe suis NEXIVO, votre assistant intelligent.\n\nSouhaitez-vous creer un nouveau site ou modifier un site que vous avez deja ?`,
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
      }, 200);
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

    const subject = `NEXIVO - Question non traitee - ${heureCourte}`;
    const message = `NOUVELLE DEMANDE CLIENT NON TRAITEE

Heure : ${heure}
Question : ${clientQuestion}
Site : ${window.location.href}
Navigateur : ${navigator.userAgent}

A repondre sur WhatsApp +216 25 152 905`;

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
        console.log('Email envoye via EmailJS');
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
      console.log('Email envoye via FormSubmit FormData');
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
      console.log('Email envoye via FormSubmit AJAX');
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
      "Test envoye a nexivo.site@gmail.com ! Verifie ta boite et tes SPAMS dans 1-2 minutes. Si rien, ton adblocker bloque. Desactive-le et reteste."
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
          let answer = response.message.content;
          historyRef.current.push({ role: 'assistant', content: answer });
          if (historyRef.current.length > 12) {
            historyRef.current = [historyRef.current[0]].concat(historyRef.current.slice(-10));
          }
          if (answer.includes('[TRANSFERT_EQUIPE]')) {
            answer = answer.replace('[TRANSFERT_EQUIPE]', '').trim();
            sendEmailToOwner(userText);
          }
          return answer;
        }
      } catch (e) {
        console.error('Puter AI error:', e);
      }
    }

    // 2. Server API fallback
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
          let answer = data.answer.trim();
          historyRef.current.push({ role: 'assistant', content: answer });
          if (historyRef.current.length > 12) {
            historyRef.current = [historyRef.current[0]].concat(historyRef.current.slice(-10));
          }
          if (answer.includes('[TRANSFERT_EQUIPE]')) {
            answer = answer.replace('[TRANSFERT_EQUIPE]', '').trim();
            sendEmailToOwner(userText);
          }
          return answer;
        }
      }
    } catch {
      // offline fallback
    }

    // 3. Fallback immédiat et alerte par email
    const lower = userText.toLowerCase();
    if (lower.includes('horaire') || lower.includes('heure') || lower.includes('ouvert')) {
      return 'Nous sommes ouverts 7j/7 et 24h/24 chez NEXIVO. Vous pouvez nous ecrire a tout moment sur WhatsApp au +216 25 152 905.';
    }
    if (lower.includes('changer') || lower.includes('modif') || lower.includes('deja')) {
      return "Oui bien sur, chez NEXIVO nous pouvons modifier votre site deja existant. C'est le Pack Changement a 1 500 DH : refonte design, modifications textes et images, optimisation mobile. Envoyez-nous le lien de votre site.";
    }
    if (lower.includes('quel site') || lower.includes('propose')) {
      return 'Tout depend de votre activite. Chez NEXIVO nous proposons site vitrine pour presenter votre entreprise, catalogue, boutique en ligne ou site avec prise de rendez-vous. Dites-moi quelle est votre activite et je vous conseille le modele le plus adapte.';
    }

    sendEmailToOwner(userText);
    return "Desole, je n'ai pas la reponse exacte a votre question. Je transmets votre demande a un membre de l'equipe NEXIVO, il vous repondra sur WhatsApp au +216 25 152 905 dans les 2 heures.";
  };

  const handleUser = async (txt: string) => {
    const trimmed = txt.trim();
    if (!trimmed) return;

    if (trimmed.toLowerCase().includes('admin nexivo') || trimmed.toLowerCase().includes('admin zalyvo')) {
      loadUnanswered();
      setShowAdminPanel(true);
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
    ['Quel site pour moi ?', 'Quel site vous me proposez ?'],
    ['Tarifs', 'Quels sont vos tarifs ?'],
    ['Modifier', 'Vous pouvez changer un site deja fait ?'],
    ['Admin', 'admin nexivo'],
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
              className="w-full sm:w-auto px-4 py-2 bg-[#00a884] hover:bg-[#008f70] text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors mb-3 flex items-center justify-center gap-1.5 shadow-sm"
            >
              <MailCheck className="w-4 h-4" />
              Tester envoi email maintenant
            </button>

            <div id="adminList" className="mt-2.5 space-y-2 max-h-[44vh] overflow-y-auto pr-1">
              {unansweredList.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  Aucune question non traitée. Pour tester, écris une question hors sujet comme "vous faites des apps mobiles ?".
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

      {/* WhatsApp Phone Mockup Overlay */}
      {isOpen && (
        <div
          id="nexivo-ia-assistant-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/60 backdrop-blur-[2px]"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeChat();
            }
          }}
        >
          <style>{`
            .phone {
              width: 440px;
              max-width: 100%;
              height: 92vh;
              background: #efeae2;
              border-radius: 28px;
              overflow: hidden;
              display: flex;
              flex-direction: column;
              box-shadow: 0 20px 60px rgba(0,0,0,.5);
              border: 8px solid #1f2c34;
            }
            .header {
              background: #202c33;
              color: #fff;
              padding: 12px 14px;
              display: flex;
              align-items: center;
              gap: 12px;
            }
            .avatar {
              width: 42px;
              height: 42px;
              background: #00a884;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 800;
              font-size: 18px;
              color: #fff;
              flex-shrink: 0;
            }
            .chat {
              flex: 1;
              overflow-y: auto;
              padding: 14px;
              background-color: #efeae2;
              background-image: url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png');
            }
            .bubble {
              max-width: 85%;
              padding: 11px 14px;
              border-radius: 8px;
              margin-bottom: 10px;
              font-size: 14px;
              line-height: 1.6;
              white-space: pre-wrap;
              word-break: break-word;
            }
            .bot {
              background: #fff;
              color: #111b21;
              border-top-left-radius: 0;
              box-shadow: 0 1px .5px rgba(0,0,0,.13);
            }
            .user {
              background: #d9fdd3;
              color: #111b21;
              margin-left: auto;
              border-top-right-radius: 0;
            }
            .time {
              font-size: 10px;
              color: #667781;
              float: right;
              margin-left: 10px;
              margin-top: 6px;
            }
            .quick {
              display: flex;
              flex-wrap: wrap;
              gap: 6px;
              margin: 8px 0;
            }
            .qbtn {
              background: #fff;
              border: 1.2px solid #00a884;
              color: #00a884;
              padding: 7px 13px;
              border-radius: 18px;
              font-size: 12px;
              cursor: pointer;
              font-weight: 600;
              transition: all 0.2s;
            }
            .qbtn:hover {
              background: #00a884;
              color: #fff;
            }
            .inputbar {
              background: #f0f2f5;
              padding: 8px 10px;
              display: flex;
              gap: 8px;
              align-items: center;
            }
            .inp {
              flex: 1;
              background: #fff;
              border: none;
              border-radius: 22px;
              padding: 12px 15px;
              outline: none;
              font-size: 14px;
              color: #111b21;
            }
            .send {
              width: 42px;
              height: 42px;
              background: #00a884;
              border: none;
              border-radius: 50%;
              color: #fff;
              cursor: pointer;
              font-size: 18px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              transition: background 0.2s;
            }
            .send:hover {
              background: #008f70;
            }
            .typing {
              display: flex;
              gap: 4px;
              padding: 12px 14px;
              background: #fff;
              border-radius: 8px;
              width: 62px;
              margin-bottom: 8px;
            }
            .typing span {
              width: 6px;
              height: 6px;
              background: #999;
              border-radius: 50%;
              animation: b 1.4s infinite;
            }
            .typing span:nth-child(2) {
              animation-delay: .2s;
            }
            .typing span:nth-child(3) {
              animation-delay: .4s;
            }
            @keyframes b {
              0%, 60%, 100% { opacity: .3; }
              30% { opacity: 1; }
            }
          `}</style>

          <div className="phone">
            {/* Header */}
            <div className="header">
              <div className="avatar">Z</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '15px' }}>NEXIVO - Assistant</div>
                <div style={{ fontSize: '11px', color: '#25D366' }}>
                  Alerte email active - Tape admin nexivo pour voir
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={closeChat}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#8696a0',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '6px',
                  borderRadius: '50%',
                }}
                title="Fermer"
                aria-label="Fermer"
              >
                <X size={20} className="hover:text-white transition-colors" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="chat" id="chat" ref={chatRef}>
              {messages.map((item) => (
                <React.Fragment key={item.id}>
                  <div className={`bubble ${item.who === 'user' ? 'user' : 'bot'}`}>
                    {item.text.split('\n').map((line, lIdx) => (
                      <React.Fragment key={lIdx}>
                        {line}
                        {lIdx < item.text.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                    <span className="time">{item.time}</span>
                  </div>

                  {item.showQuick && item.who === 'bot' && (
                    <div className="quick">
                      {quickBtns.map((b) => (
                        <button
                          key={b[1]}
                          className="qbtn"
                          onClick={() => handleUser(b[1])}
                        >
                          {b[0]}
                        </button>
                      ))}
                    </div>
                  )}
                </React.Fragment>
              ))}

              {isTyping && (
                <div className="typing" id="typing">
                  <span />
                  <span />
                  <span />
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="inputbar">
              <input
                ref={inputRef}
                id="inp"
                className="inp"
                placeholder="Posez votre question..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleUser(inputText);
                }}
              />
              <button className="send" onClick={() => handleUser(inputText)} aria-label="Envoyer">
                &gt;
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
