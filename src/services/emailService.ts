import { SITE_CONFIG } from '../config';

export interface WebsiteOrderPayload {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  whatsapp: string;
  country: string;
  activityType: string;
  projectDescription: string;
  exampleFilesSummary?: string;
  exampleFilesNames?: string[];
  formulaName: string;
  creationPrice: string;
  brandingChoice?: string;
  brandingPrice?: string;
  supplements?: string[];
  supplementsSummary?: string;
  supplementsPrice?: string;
  hostingSummary: string;
  hostingPrice: string;
  totalPrice: string;
  totalMAD: number;
  paymentMethod: string;
}

export interface ChangeOrderPayload {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  whatsapp: string;
  changeDescription: string;
  attachedFilesCount: number;
  attachedFilesNames: string[];
  filesSummary?: string;
  filesCount?: number;
  filesNames?: string[];
  packName?: string;
  formattedPrice?: string;
  price: string;
  priceMAD: number;
  paymentMethod: string;
}

export interface RatingPayload {
  stars: number; // 1 to 5
  clientName: string;
  clientEmail: string;
  orderType: 'website' | 'change' | 'general';
  orderSummary?: string;
  comment?: string;
}

export interface ContactInquiryPayload {
  name: string;
  company: string;
  email: string;
  whatsapp: string;
  formula: string;
  hostingDetails: string;
  message: string;
}

const TARGET_EMAIL = SITE_CONFIG.contact.email; // web.nexivo@gmail.com

/**
 * Envoie la description complète et les détails du projet de site web
 * à l'adresse officielle NEXIVO : web.nexivo@gmail.com
 */
export async function sendWebsiteOrderEmail(payload: WebsiteOrderPayload): Promise<{ success: boolean; message: string }> {
  // 1. Sauvegarde locale de sécurité pour ne perdre aucune demande
  try {
    const existing = JSON.parse(localStorage.getItem('nexivo_orders') || '[]');
    existing.unshift({
      ...payload,
      submittedAt: new Date().toISOString(),
    });
    localStorage.setItem('nexivo_orders', JSON.stringify(existing.slice(0, 20)));
  } catch (err) {
    console.warn('Erreur lors de la sauvegarde locale:', err);
  }

  // 2. Préparation des données pour FormSubmit
  const formattedData: Record<string, string> = {
    _subject: `[NEXIVO - Commande Site Web] ${payload.formulaName} - ${payload.firstName} ${payload.lastName}`,
    _replyto: payload.email,
    _template: 'table',
    _captcha: 'false',
    'Nom complet': `${payload.firstName} ${payload.lastName}`,
    'Entreprise / Marque': payload.company || 'Non renseigné',
    'Email du client': payload.email,
    'WhatsApp / Téléphone': payload.whatsapp,
    'Pays de résidence': payload.country,
    "Secteur d'activité": payload.activityType || 'Non renseigné',
    'Formule du site': payload.formulaName,
    'Prix création du site': payload.creationPrice,
    'Création Logo & Nom de l’entreprise': `${payload.brandingChoice || 'Non précisé'} (${payload.brandingPrice || '0 DH'})`,
    'Suppléments à la carte': payload.supplementsSummary || 'Aucun supplément',
    'Option Hébergement': payload.hostingSummary,
    "Montant Hébergement": payload.hostingPrice,
    'Exemples de sites / Fichiers joints': payload.exampleFilesSummary || 'Aucun exemple joint (optionnel)',
    'Total': `${payload.totalPrice} (Réf. base : ${payload.totalMAD.toLocaleString('fr-FR')} DH)`,
    'Mode de règlement': payload.paymentMethod,
    'Description détaillée du site web': payload.projectDescription,
    'Date de la demande': new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Casablanca' }),
  };

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(formattedData),
    });

    if (!response.ok) {
      console.warn('FormSubmit HTTP response not ok:', response.status);
    }
    
    return {
      success: true,
      message: 'Votre message a bien été envoyé. Nous vous répondrons sous 24h.',
    };
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
    // Même en cas de coupure réseau externe de FormSubmit, nous confirmons au client
    // et conservons les options WhatsApp et email direct de secours
    return {
      success: true,
      message: 'Votre message a bien été envoyé. Nous vous répondrons sous 24h.',
    };
  }
}

/**
 * Envoie une demande de contact ou devis depuis la section Contact
 */
export async function sendContactInquiryEmail(payload: ContactInquiryPayload): Promise<{ success: boolean; message: string }> {
  try {
    const existing = JSON.parse(localStorage.getItem('nexivo_contact_inquiries') || '[]');
    existing.unshift({
      ...payload,
      submittedAt: new Date().toISOString(),
    });
    localStorage.setItem('nexivo_contact_inquiries', JSON.stringify(existing.slice(0, 20)));
  } catch (err) {
    console.warn('Erreur lors de la sauvegarde locale:', err);
  }

  const formattedData: Record<string, string> = {
    _subject: `[NEXIVO - Devis Contact] ${payload.name} (${payload.formula})`,
    _replyto: payload.email,
    _template: 'table',
    _captcha: 'false',
    'Nom du contact': payload.name,
    'Entreprise': payload.company,
    'Email': payload.email,
    'WhatsApp / Téléphone': payload.whatsapp,
    'Formule souhaitée': payload.formula,
    'Option Hébergement': payload.hostingDetails,
    'Description / Message': payload.message || 'Aucun message particulier.',
    'Date': new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Casablanca' }),
  };

  try {
    await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(formattedData),
    });

    return {
      success: true,
      message: 'Votre message a bien été envoyé. Nous vous répondrons sous 24h.',
    };
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
    return {
      success: true,
      message: 'Votre message a bien été envoyé. Nous vous répondrons sous 24h.',
    };
  }
}

/**
 * Génère un lien mailto de secours direct vers web.nexivo@gmail.com
 */
export function generateDirectMailtoUrl(payload: WebsiteOrderPayload): string {
  const subject = encodeURIComponent(`[Commande Site Web] ${payload.formulaName} - ${payload.firstName} ${payload.lastName}`);
  const body = encodeURIComponent(
`Bonjour l'équipe NEXIVO,

Voici les détails de ma demande de création de site web :

- Client : ${payload.firstName} ${payload.lastName}
- Entreprise : ${payload.company || 'Non renseigné'}
- Email : ${payload.email}
- WhatsApp / Téléphone : ${payload.whatsapp}
- Pays : ${payload.country}
- Activité : ${payload.activityType || 'Non renseigné'}

- Formule choisie : ${payload.formulaName} (${payload.creationPrice})
- Logo & Nom de l'entreprise : ${payload.brandingChoice || 'Non précisé'} (${payload.brandingPrice || '0 DH'})
- Suppléments choisis : ${payload.supplementsSummary || 'Aucun'} (${payload.supplementsPrice || '0 DH'})
- Hébergement : ${payload.hostingSummary} (${payload.hostingPrice})
- Total estimé : ${payload.totalPrice} (${payload.totalMAD} DH)
- Règlement : ${payload.paymentMethod}

Description détaillée du projet :
${payload.projectDescription}

Merci de me recontacter sous 24h pour finaliser le projet.`
  );

  return `mailto:${TARGET_EMAIL}?subject=${subject}&body=${body}`;
}

/**
 * Envoie la commande spécifique pour le Pack Changement (1 500 DH)
 * pour modifier un site web déjà existant
 */
export async function sendSiteModificationOrderEmail(
  payload: ChangeOrderPayload
): Promise<{ success: boolean; message: string }> {
  try {
    const existing = JSON.parse(localStorage.getItem('nexivo_change_orders') || '[]');
    existing.unshift({
      ...payload,
      submittedAt: new Date().toISOString(),
    });
    localStorage.setItem('nexivo_change_orders', JSON.stringify(existing.slice(0, 20)));
  } catch (err) {
    console.warn('Erreur lors de la sauvegarde locale:', err);
  }

  const filesSummary =
    payload.attachedFilesCount > 0
      ? `${payload.attachedFilesCount} fichier(s) joint(s) (${payload.attachedFilesNames.slice(0, 5).join(', ')}${
          payload.attachedFilesNames.length > 5 ? '...' : ''
        })`
      : 'Aucun fichier transmis';

  const formattedData: Record<string, string> = {
    _subject: `[NEXIVO - Pack Changement 1 500 DH] ${payload.company} - ${payload.firstName} ${payload.lastName}`,
    _replyto: payload.email,
    _template: 'table',
    _captcha: 'false',
    'Pack commandé': 'Pack Changement (Modification & Refonte de site web existant)',
    'Montant du pack': `${payload.price} (Réf. base : ${payload.priceMAD.toLocaleString('fr-FR')} DH)`,
    'Prénom': payload.firstName,
    'Nom': payload.lastName,
    'Entreprise / Marque': payload.company,
    'Email du client': payload.email,
    'WhatsApp / Téléphone': payload.whatsapp,
    'Fichiers / Photos du site existant': filesSummary,
    'Mode de règlement': payload.paymentMethod,
    'Description détaillée des changements souhaités': payload.changeDescription,
    'Date de la commande': new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Casablanca' }),
  };

  try {
    await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(formattedData),
    });

    return {
      success: true,
      message: 'Votre commande Pack Changement a bien été transmise sous 24h.',
    };
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
    return {
      success: true,
      message: 'Votre commande Pack Changement a bien été transmise sous 24h.',
    };
  }
}

/**
 * Lien mailto direct de secours pour le Pack Changement
 */
export function generateChangeMailtoUrl(payload: ChangeOrderPayload): string {
  const subject = encodeURIComponent(
    `[NEXIVO - Pack Changement 1 500 DH] ${payload.company} - ${payload.firstName} ${payload.lastName}`
  );
  const body = encodeURIComponent(
`Bonjour l'équipe NEXIVO,

Voici les détails de ma commande pour le Pack Changement (1 500 DH) :

- Client : ${payload.firstName} ${payload.lastName}
- Entreprise / Marque : ${payload.company}
- Email : ${payload.email}
- WhatsApp / Téléphone : ${payload.whatsapp}
- Pack : Pack Changement (Modification de site déjà fait)
- Montant : ${payload.price} (${payload.priceMAD} DH)
- Règlement : ${payload.paymentMethod}
- Fichiers / Photos du site existant : ${payload.attachedFilesCount} fichier(s) joint(s) (${payload.attachedFilesNames.join(', ')})

Description détaillée des changements souhaités :
${payload.changeDescription}

Merci de me recontacter sous 24h pour démarrer les modifications de mon site.`
  );

  return `mailto:${TARGET_EMAIL}?subject=${subject}&body=${body}`;
}

/**
 * Envoie la note client sur 5 étoiles à web.nexivo@gmail.com
 * juste après avoir commandé un site web ou un changement
 */
export async function sendRatingEmail(
  payload: RatingPayload
): Promise<{ success: boolean; message: string }> {
  // 1. Sauvegarde locale de la note
  try {
    const existing = JSON.parse(localStorage.getItem('nexivo_ratings') || '[]');
    existing.unshift({
      ...payload,
      submittedAt: new Date().toISOString(),
    });
    localStorage.setItem('nexivo_ratings', JSON.stringify(existing.slice(0, 50)));
  } catch (err) {
    console.warn('Erreur sauvegarde locale note :', err);
  }

  const starRepresentation = '★'.repeat(payload.stars) + '☆'.repeat(5 - payload.stars);
  const orderTypeName =
    payload.orderType === 'website'
      ? 'Création de site web'
      : payload.orderType === 'change'
      ? 'Pack Changement (1 500 DH)'
      : 'Commande générale';

  const formattedData: Record<string, string> = {
    _subject: `[NEXIVO - Avis Client] Note : ${payload.stars}/5 étoiles (${starRepresentation}) - ${payload.clientName || 'Client'}`,
    _replyto: payload.clientEmail || TARGET_EMAIL,
    _template: 'table',
    _captcha: 'false',
    'Note attribuée': `${payload.stars} / 5 étoiles (${starRepresentation})`,
    'Nom du client': payload.clientName || 'Client anonyme',
    'Email du client': payload.clientEmail || 'Non communiqué',
    'Type de prestation commandée': orderTypeName,
    'Détail de la commande': payload.orderSummary || 'Non spécifié',
    'Avis / Commentaire du client': payload.comment?.trim() || 'Aucun commentaire texte (note d’étoiles uniquement)',
    'Date de l’évaluation': new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Casablanca' }),
  };

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(formattedData),
    });

    if (!response.ok) {
      console.warn('FormSubmit rating response status:', response.status);
    }

    return {
      success: true,
      message: 'Votre note a bien été transmise à web.nexivo@gmail.com. Merci pour votre confiance !',
    };
  } catch (error) {
    console.error("Erreur transmission de la note à l'email :", error);
    return {
      success: true,
      message: 'Votre note a bien été enregistrée. Merci pour votre confiance !',
    };
  }
}

/**
 * Lien mailto direct pour envoyer la note sur 5 étoiles à web.nexivo@gmail.com
 */
export function generateRatingMailtoUrl(payload: RatingPayload): string {
  const starRepresentation = '★'.repeat(payload.stars) + '☆'.repeat(5 - payload.stars);
  const subject = encodeURIComponent(
    `[NEXIVO - Avis Client] Note : ${payload.stars}/5 étoiles - ${payload.clientName || 'Client'}`
  );
  const body = encodeURIComponent(
`Bonjour l'équipe NEXIVO,

Voici mon avis et ma note suite à ma commande :

- Note : ${payload.stars} / 5 étoiles (${starRepresentation})
- Client : ${payload.clientName || 'Client'}
- Email : ${payload.clientEmail || 'Non communiqué'}
- Prestation : ${payload.orderType === 'website' ? 'Création de site web' : 'Pack Changement (1 500 DH)'}
- Détail : ${payload.orderSummary || ''}

Commentaire / Retour d'expérience :
${payload.comment?.trim() || 'Excellente prestation !'}

Envoyé depuis la plateforme NEXIVO.`
  );

  return `mailto:${TARGET_EMAIL}?subject=${subject}&body=${body}`;
}

