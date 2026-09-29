import {
  PricingPlan,
  SupplementItem,
  ServiceItem,
  TimelineStep,
  DemoProject,
  FaqItem,
  WhyFeature,
  CurrencyCode,
  CurrencyInfo,
  HostingDuration,
  HostingDurationInfo,
} from './types';

// ============================================================================
// CONFIGURATION DES DEVISES & TAUX DE CHANGE CONFIGURABLES
// ============================================================================
export const DEFAULT_CURRENCY: CurrencyCode = 'MAD';

export const CURRENCIES_CONFIG: Record<CurrencyCode, CurrencyInfo> = {
  MAD: {
    code: 'MAD',
    name: 'Dirham marocain',
    symbol: 'DH',
    flag: '🇲🇦',
    shortLabel: 'MAD — DH',
    rateAgainstMAD: 1.0,
  },
  EUR: {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    flag: '🇫🇷',
    shortLabel: 'EUR — €',
    rateAgainstMAD: 0.09396, // 1 MAD ≈ 0.094 EUR => 3 500 DH ≈ 330 €
  },
  USD: {
    code: 'USD',
    name: 'Dollar américain',
    symbol: '$',
    flag: '🇺🇸',
    shortLabel: 'USD — $',
    rateAgainstMAD: 0.11074, // 1 MAD ≈ 0.111 USD => 3 500 DH ≈ 390 $
  },
  GBP: {
    code: 'GBP',
    name: 'Livre sterling',
    symbol: '£',
    flag: '🇬🇧',
    shortLabel: 'GBP — £',
    rateAgainstMAD: 0.0839, // 1 MAD ≈ 0.084 GBP => 3 500 DH ≈ 295 £
  },
};

/**
 * Fonction de conversion et de formatage des prix.
 * - Le prix de référence de base est TOUJOURS en MAD (DH).
 * - Les conversions sont arrondies proprement (au multiple de 5 le plus proche) pour un rendu professionnel.
 * - Les devises étrangères sont préfixées par '≈' comme demandé.
 */
export function formatCurrencyPrice(
  basePriceMAD: number,
  targetCurrency: CurrencyCode
): { formatted: string; amount: number; isBaseCurrency: boolean } {
  if (targetCurrency === 'MAD') {
    return {
      formatted: `${basePriceMAD.toLocaleString('fr-FR')} DH`,
      amount: basePriceMAD,
      isBaseCurrency: true,
    };
  }

  const curr = CURRENCIES_CONFIG[targetCurrency];
  const exact = basePriceMAD * curr.rateAgainstMAD;
  // Arrondi propre au multiple de 5 pour les devises étrangères (140 €, 165 $, 125 £...)
  const rounded = Math.max(5, Math.round(exact / 5) * 5);

  let formatted = '';
  switch (targetCurrency) {
    case 'USD':
      formatted = `≈ ${rounded.toLocaleString('fr-FR')} $`;
      break;
    case 'GBP':
      formatted = `≈ ${rounded.toLocaleString('fr-FR')} £`;
      break;
    case 'EUR':
    default:
      formatted = `≈ ${rounded.toLocaleString('fr-FR')} €`;
      break;
  }

  return {
    formatted,
    amount: rounded,
    isBaseCurrency: false,
  };
}

/**
 * ============================================================================
 * TARIFS D'HÉBERGEMENT AVEC NEXIVO (CONFIGURABLES)
 * Les prix sont définis en MAD et convertibles automatiquement.
 * ============================================================================
 */
export const HOSTING_DURATIONS_CONFIG: Record<HostingDuration, HostingDurationInfo> = {
  '1m': {
    id: '1m',
    label: '1 mois',
    months: 1,
    basePriceMAD: 199,
  },
  '3m': {
    id: '3m',
    label: '3 mois',
    months: 3,
    basePriceMAD: 499,
  },
  '6m': {
    id: '6m',
    label: '6 mois',
    months: 6,
    basePriceMAD: 899,
    badge: 'Populaire',
  },
  '12m': {
    id: '12m',
    label: '12 mois',
    months: 12,
    basePriceMAD: 1590,
    badge: 'Recommandé',
  },
  '24m': {
    id: '24m',
    label: '24 mois',
    months: 24,
    basePriceMAD: 2890,
    badge: 'Économique',
  },
  '48m': {
    id: '48m',
    label: '48 mois',
    months: 48,
    basePriceMAD: 4990,
    badge: 'Sérénité',
  },
};

/**
 * ============================================================================
 * OPTIONS & SUPPLÉMENTS À LA CARTE (200 DH CHACUN)
 * ============================================================================
 */
export const SUPPLEMENTS_CONFIG: Record<string, SupplementItem> = {
  whatsapp: {
    id: 'whatsapp',
    name: 'Avoir son WhatsApp dans son site',
    description: 'Bouton flottant officiel WhatsApp pour discuter en direct et convertir instantanément vos visiteurs.',
    basePriceMAD: 200,
    icon: 'MessageCircle',
  },
  tiktok: {
    id: 'tiktok',
    name: 'Avoir son TikTok inscrit dans le site',
    description: 'Intégration du lien et badge officiel TikTok pour rediriger vos clients vers vos vidéos et votre communauté.',
    basePriceMAD: 200,
    icon: 'Video',
  },
  instagram: {
    id: 'instagram',
    name: 'Avoir son Instagram inscrit dans le site',
    description: 'Intégration du profil Instagram avec lien direct pour développer vos abonnés et valoriser vos visuels.',
    basePriceMAD: 200,
    icon: 'Instagram',
  },
  facebook: {
    id: 'facebook',
    name: 'Avoir son Facebook inscrit dans le site',
    description: 'Lien direct et badge officiel vers votre page entreprise Facebook.',
    basePriceMAD: 200,
    icon: 'Facebook',
  },
  maps: {
    id: 'maps',
    name: 'Avoir Google Maps dans son site',
    description: 'Carte interactive Google Maps pour guider vos visiteurs directement vers votre adresse physique.',
    basePriceMAD: 200,
    icon: 'MapPin',
  },
  call: {
    id: 'call',
    name: 'Bouton d’appel direct 1-clic',
    description: 'Bouton d’appel téléphonique immédiat sur smartphone en 1 clic pour vous joindre sans attendre.',
    basePriceMAD: 200,
    icon: 'PhoneCall',
  },
};

/**
 * ============================================================================
 * CONFIGURATION DU SITE NEXIVO
 * ============================================================================
 */
export const SITE_CONFIG = {
  brandName: 'NEXIVO',
  tagline: 'Création de sites web modernes pour entreprises et entrepreneurs.',
  domain: 'nexivo.com',
  
  // Coordonnées de contact direct
  contact: {
    email: 'web.nexivo@gmail.com',
    whatsappNumber: '+212 715 878 163',
    whatsappRawNumber: '212715878163',
    phoneNumber: '+212 715 878 163',
    phoneRawNumber: '+212715878163',
    defaultWhatsAppMessage: 'Bonjour NEXIVO, je souhaite échanger au sujet de la création de mon site web.',
    whatsappUrl: 'https://wa.me/212715878163?text=Bonjour%20NEXIVO%2C%20je%20souhaite%20un%20devis%20pour%20la%20cr%C3%A9ation%20de%20mon%20site%20web.',
    assistantUrl: '/whatsapp',
    location: 'International (À distance)',
    responseDelay: 'Réponse rapide sous 24h',
  },

  // Réseaux Sociaux
  socials: {
    instagram: 'https://instagram.com/nexivo_agency',
    tiktok: 'https://tiktok.com/@nexivo',
  },

  // ==========================================================================
  // TARIFS OFFICIELS NEXIVO (EXACTEMENT EN DH)
  // Ces prix correspondent UNIQUEMENT à la création du site web.
  // L'hébergement est proposé séparément et au choix du client.
  // ==========================================================================
  pricing: {
    starter: {
      id: 'starter' as const,
      name: 'STARTER',
      basePriceMAD: 2999, // EXACTEMENT 2 999 DH (Jusqu'à 3 pages, rendu sous 7 jours)
      period: 'Création du site web',
      description: 'L’essentiel pour lancer la présence en ligne de votre activité : jusqu’à 3 pages avec rendu sous 7 jours.',
      features: [
        'Jusqu’à 3 pages personnalisées',
        'Rendu & livraison sous 7 jours',
        'Site vitrine professionnel & moderne',
        'Design 100% responsive (mobile, tablette, PC)',
        'Formulaire de contact',
        'Optimisation mobile & vitesse',
        'Mise en ligne & configuration',
      ],
      ctaText: 'Choisir STARTER',
      highlighted: false,
    } satisfies PricingPlan,

    pro: {
      id: 'pro' as const,
      name: 'PRO',
      basePriceMAD: 4500, // EXACTEMENT 4 500 DH (Jusqu'à 7 pages, rendu sous 11 jours)
      period: 'Création du site web',
      badge: 'L’offre la plus choisie',
      description: 'La solution complète plébiscitée : jusqu’à 7 pages sur-mesure avec rendu garanti sous 11 jours.',
      features: [
        'Tout le contenu de STARTER',
        'Jusqu’à 7 pages complètes',
        'Rendu & livraison sous 11 jours',
        'Design sur-mesure & soigné',
        'SEO de base & indexation Google',
        'Animations fluides & interactives',
        'Optimisation avancée des performances',
      ],
      ctaText: 'Choisir PRO',
      highlighted: true,
    } satisfies PricingPlan,

    business: {
      id: 'business' as const,
      name: 'BUSINESS',
      basePriceMAD: 6500, // EXACTEMENT 6 500 DH (Jusqu'à 10 pages, rendu sous 14 jours)
      period: 'Création du site web',
      badge: 'Sur-mesure',
      description: 'Pour les entreprises et projets ambitieux : jusqu’à 10 pages élaborées avec rendu garanti sous 14 jours.',
      features: [
        'Site entièrement personnalisé & sur-mesure',
        'Jusqu’à 10 pages élaborées',
        'Rendu & livraison sous 14 jours',
        'Fonctionnalités avancées & modules',
        'E-commerce ou catalogue possible',
        'SEO complet & optimisation technique',
        'Intégrations personnalisées (formulaires, APIs)',
        'Support prioritaire & accompagnement dédié',
      ],
      ctaText: 'Choisir BUSINESS',
      highlighted: false,
    } satisfies PricingPlan,
  },
};

/**
 * SECTION SERVICES
 */
export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'web-creation',
    icon: 'Globe',
    title: 'Création de sites web',
    description: 'Sites modernes, responsive et adaptés à votre activité.',
  },
  {
    id: 'custom-design',
    icon: 'Palette',
    title: 'Design personnalisé',
    description: 'Une identité visuelle adaptée à votre entreprise.',
  },
  {
    id: 'mobile-experience',
    icon: 'Smartphone',
    title: 'Expérience mobile',
    description: 'Votre site fonctionne parfaitement sur smartphone, tablette et ordinateur.',
  },
  {
    id: 'performance',
    icon: 'Zap',
    title: 'Performance',
    description: 'Sites rapides et optimisés pour offrir une bonne expérience aux visiteurs.',
  },
];

/**
 * SECTION COMMENT ÇA MARCHE (Votre site en 4 étapes)
 */
export const TIMELINE_DATA: TimelineStep[] = [
  {
    step: '01',
    title: 'Discussion',
    description: 'Vous nous expliquez votre entreprise et vos besoins.',
    details: 'Un premier échange pour comprendre vos objectifs, vos cibles et les spécificités de votre activité.',
  },
  {
    step: '02',
    title: 'Design',
    description: 'Nous créons la structure et le design de votre site.',
    details: 'Conception ergonomique et esthétique avec une palette de couleurs et typographies soignées.',
  },
  {
    step: '03',
    title: 'Développement',
    description: 'Nous transformons le design en véritable site web.',
    details: 'Programmation propre, intégration fluide, interconnexion WhatsApp et optimisation mobile.',
  },
  {
    step: '04',
    title: 'Mise en ligne',
    description: 'Nous configurons et mettons votre site en ligne.',
    details: 'Déploiement sur votre hébergement, tests complets et accompagnement lors du lancement.',
  },
];

/**
 * SECTION POURQUOI NEXIVO (4 éléments)
 */
export const WHY_NEXIVO_DATA: WhyFeature[] = [
  {
    title: 'Design moderne',
    description: 'Des sites avec une apparence professionnelle.',
    icon: 'Sparkles',
  },
  {
    title: 'Responsive',
    description: 'Adapté à tous les écrans.',
    icon: 'Smartphone',
  },
  {
    title: 'Accompagnement',
    description: 'Nexivo vous accompagne pendant votre projet.',
    icon: 'HeartHandshake',
  },
  {
    title: 'Sur mesure',
    description: 'Chaque site est adapté aux besoins de l’entreprise.',
    icon: 'Layers',
  },
];
export const WHY_ZALYVO_DATA = WHY_NEXIVO_DATA;

/**
 * SECTION RÉALISATIONS (Projets de démonstration)
 */
export const DEMO_PROJECTS_DATA: DemoProject[] = [
  {
    id: "restaurant",
    name: "L’Ardoise Gourmande",
    sector: "Restaurant",
    tagline: "Bistronomie raffinée & carte de saison",
    description: "Site vitrine moderne avec menu dynamique, réservations en direct et contact WhatsApp.",
    color: "from-amber-500/20 to-orange-500/10",
    accentColor: "#f59e0b",
    imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
    mobileImageUrl: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&w=600&q=80",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
        caption: "Page d’accueil du site : Hero banner, accroche & bouton de réservation",
        category: "Maquette Page d’Accueil",
        mockView: "hero",
      },
      {
        url: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1200&q=80",
        caption: "Page Menu en ligne : Carte des entrées, plats, desserts et tarifs clairs",
        category: "Maquette Carte & Menu",
        mockView: "menu",
      },
      {
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        caption: "Module interactif de réservation de table avec confirmation automatique",
        category: "Module Réservation",
        mockView: "booking",
      },
      {
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        caption: "Page Contact & Accès : Carte Google Maps interactive, horaires et WhatsApp direct",
        category: "Page Contact & Plan",
        mockView: "hero",
      },
    ],
    tags: ["Menu interactif", "Réservation de table", "Aperçu mobile"],
    highlights: ["Carte des plats et desserts", "Bouton appel & WhatsApp", "Design immersif et chaleureux"],
    mockupType: "restaurant",
  },
  {
    id: "realestate",
    name: "Aura Prestige Immobilier",
    sector: "Agence immobilière",
    tagline: "Biens d’exception & estimations locales",
    description: "Catalogue clair valorisant les biens à la vente et location, fiches de contact et géolocalisation.",
    color: "from-blue-500/20 to-cyan-500/10",
    accentColor: "#3b82f6",
    imageUrl: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1200&q=80",
    mobileImageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1200&q=80",
        caption: "Page d’accueil de l’agence : Moteur de recherche et sélection exclusive",
        category: "Maquette Page d’Accueil",
        mockView: "hero",
      },
      {
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        caption: "Page Catalogue des biens : Grille filtrable, prix et caractéristiques",
        category: "Catalogue Biens",
        mockView: "catalog",
      },
      {
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        caption: "Module d’estimation en ligne : Formulaire pas-à-pas pour les vendeurs",
        category: "Module Estimation",
        mockView: "valuation",
      },
      {
        url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
        caption: "Fiche détaillée du bien : Galerie plein écran, visite virtuelle et contact agent",
        category: "Fiche Bien",
        mockView: "hero",
      },
    ],
    tags: ["Catalogue biens", "Demande d’estimation", "Filtres"],
    highlights: ["Galeries photos plein écran", "Formulaire d’estimation express", "Cartes de secteur"],
    mockupType: "realestate",
  },
  {
    id: "fitness",
    name: "Pulse Training Club",
    sector: "Salle de sport",
    tagline: "Coaching, cours collectifs & énergie",
    description: "Site dynamique avec planning des cours en direct, formules d’abonnement et pass d’essai offert.",
    color: "from-emerald-500/20 to-teal-500/10",
    accentColor: "#10b981",
    imageUrl: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80",
    mobileImageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80",
        caption: "Page d’accueil du club : Vidéo hero, appel à l’action et offre pass d’essai",
        category: "Maquette Page d’Accueil",
        mockView: "hero",
      },
      {
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        caption: "Page Planning des cours : Calendrier interactif et réservation de créneau",
        category: "Planning Interactif",
        mockView: "schedule",
      },
      {
        url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
        caption: "Page Tarifs & Abonnements : Grille comparative claire et souscription",
        category: "Grille Tarifaire",
        mockView: "hero",
      },
      {
        url: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&w=1200&q=80",
        caption: "Page Équipe & Coachs : Présentation des coachs certifiés et disciplines",
        category: "Équipe & Coachs",
        mockView: "hero",
      },
    ],
    tags: ["Planning hebdomadaire", "Pass d’essai", "Tarifs clairs"],
    highlights: ["Planning interactif", "Réservation instantanée", "Présentation des coachs"],
    mockupType: "fitness",
  },
  {
    id: "haircut",
    name: "Studio Ciseaux & Coiffure",
    sector: "Salon de coiffure",
    tagline: "Artisanat capillaire & soins sur-mesure",
    description: "Design minimaliste et chic mettant en avant les prestations, tarifs et prise de rendez-vous.",
    color: "from-purple-500/20 to-pink-500/10",
    accentColor: "#8b5cf6",
    imageUrl: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1200&q=80",
    mobileImageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1200&q=80",
        caption: "Page d’accueil du salon : Esthétique chic, univers visuel et bouton RDV",
        category: "Maquette Page d’Accueil",
        mockView: "hero",
      },
      {
        url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
        caption: "Page Prestations & Carte des Tarifs : Détail des soins femmes, hommes et forfaits",
        category: "Tarifs & Prestations",
        mockView: "hero",
      },
      {
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        caption: "Module Prise de Rendez-vous en ligne avec choix du coiffeur et date",
        category: "Module RDV en Ligne",
        mockView: "hero",
      },
      {
        url: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1200&q=80",
        caption: "Galerie Lookbook : Photos des réalisations et avis clients certifiés",
        category: "Lookbook Réalisations",
        mockView: "hero",
      },
    ],
    tags: ["Prise de RDV", "Tarifs prestations", "Galerie coupes"],
    highlights: ["Lookbook photos", "Intégration WhatsApp direct", "Ambiance moderne & soignée"],
    mockupType: "haircut",
  },
  {
    id: "consulting",
    name: "Apex Stratégie & Conseils",
    sector: "Entreprise de services",
    tagline: "Accompagnement financier et organisationnel B2B",
    description: "Plateforme corporate rassurante valorisant l’expertise métier, les méthodologies et la prise de contact.",
    color: "from-indigo-500/20 to-blue-500/10",
    accentColor: "#6366f1",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    mobileImageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        caption: "Page d’accueil Corporate : Présentation de l’expertise, chiffres clés et appel à l’action",
        category: "Maquette Page d’Accueil",
        mockView: "hero",
      },
      {
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        caption: "Page Pôles d’Expertise : Conseil en stratégie, fusion-acquisition et digitalisation",
        category: "Pôles d’Expertise",
        mockView: "hero",
      },
      {
        url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
        caption: "Page Études de Cas & Témoignages Dirigeants : Résultats mesurables et ROI",
        category: "Études de Cas & ROI",
        mockView: "hero",
      },
      {
        url: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1200&q=80",
        caption: "Formulaire de contact & demande d’audit préliminaire confidentiel",
        category: "Audit & Contact B2B",
        mockView: "hero",
      },
    ],
    tags: ["Solutions B2B", "Études de cas", "Audit offert"],
    highlights: ["Pôles de compétences", "Prise de rendez-vous", "Structure claire & crédible"],
    mockupType: "consulting",
  },
  {
    id: "ecommerce",
    name: "Maison Botanique",
    sector: "Boutique en ligne",
    tagline: "Plantes d’intérieur & décoration végétale",
    description: "Boutique en ligne épurée avec fiches produits soignées, panier d’achat intuitif et paiement sécurisé.",
    color: "from-teal-500/20 to-emerald-500/10",
    accentColor: "#14b8a6",
    imageUrl: "https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80",
    mobileImageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80",
        caption: "Page d’accueil de la boutique : Bannières de collections, nouveautés et promotions",
        category: "Maquette Page d’Accueil",
        mockView: "hero",
      },
      {
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        caption: "Page Catalogue E-commerce : Grille de produits avec filtres prix et catégories",
        category: "Catalogue Produits",
        mockView: "hero",
      },
      {
        url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
        caption: "Fiche Produit détaillée : Sélecteur de taille, bouton ajouter au panier et avis",
        category: "Fiche Produit",
        mockView: "hero",
      },
      {
        url: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1200&q=80",
        caption: "Tunnel de Commande : Panier d’achat intuitif et paiement sécurisé en 1 clic",
        category: "Tunnel Panier & Checkout",
        mockView: "hero",
      },
    ],
    tags: ["E-commerce", "Panier d’achat", "Fiches produits"],
    highlights: ["Catégories filtrables", "Guides d’entretien", "Tunnel de commande fluide"],
    mockupType: "ecommerce",
  },
];

/**
 * SECTION FAQ
 * Respecte rigoureusement les questions et réponses exactes demandées par NEXIVO.
 */
export const FAQ_DATA: FaqItem[] = [
  {
    question: 'Combien coûte un site ?',
    answer:
      'Nos tarifs officiels pour la création du site sont : STARTER : 3 500 DH | PRO : 5 000 DH | BUSINESS : 7 000 DH. Ces prix correspondent uniquement à la création du site web. L’hébergement est proposé séparément au choix lors de la commande (gestion directe par vos soins ou formule clé en main avec Nexivo). Vous pouvez également utiliser le sélecteur de devise en haut de page pour convertir les prix en EUR (€), USD ($) ou GBP (£).',
  },
  {
    question: 'L’hébergement est-il obligatoire avec Nexivo ?',
    answer:
      'Non. Vous pouvez acheter votre hébergement directement auprès de l’hébergeur de votre choix. Vous pouvez également choisir une durée d’hébergement proposée par Nexivo et nous régler directement en cash.',
  },
  {
    question: 'Puis-je choisir mon propre hébergeur ?',
    answer:
      'Oui. Vous pouvez choisir votre propre hébergeur et payer directement celui-ci. Nexivo pourra ensuite installer votre site sur votre hébergement.',
  },
  {
    question: 'Puis-je payer en plusieurs fois ?',
    answer: 'Les modalités de paiement sont définies avec Nexivo lors de la commande.',
  },
  {
    question: 'Le site fonctionne-t-il sur téléphone ?',
    answer: 'Oui. Tous nos sites sont conçus pour être responsive.',
  },
];

