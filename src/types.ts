export type CurrencyCode = 'MAD' | 'EUR' | 'USD' | 'GBP';

export type LanguageCode = 'fr' | 'en';

export type ActivePage = 'home' | 'info' | 'portfolio' | 'order' | 'changement';

export type InfoCategory =
  | 'all'
  | 'domain'
  | 'hosting'
  | 'pricing'
  | 'process'
  | 'changement'
  | 'security'
  | 'faq';

export interface InfoArticle {
  id: string;
  category: InfoCategory;
  title: string;
  shortAnswer: string;
  fullDetails: string[];
  tags: string[];
  iconName: string;
  badge?: string;
  actionType?: 'order' | 'changement' | 'whatsapp' | 'domain';
}

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  shortLabel: string;
}

export interface CurrencyInfo {
  code: CurrencyCode;
  name: string;
  symbol: string;
  flag: string;
  shortLabel: string;
  rateAgainstMAD: number;
}

export interface PricingPlan {
  id: 'starter' | 'pro' | 'business';
  name: string;
  basePriceMAD: number; // Prix de référence NEXIVO TOUJOURS enregistré en MAD
  period?: string;
  badge?: string;
  description: string;
  features: string[];
  ctaText: string;
  highlighted?: boolean;
}

export type HostingOption = 'client' | 'nexivo' | 'zalyvo';
export type HostingDuration = '1m' | '3m' | '6m' | '12m' | '24m' | '48m';

export interface HostingDurationInfo {
  id: HostingDuration;
  label: string;
  months: number;
  basePriceMAD: number;
  badge?: string;
}

export interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  benefits?: string[];
}

export interface TimelineStep {
  step: string;
  title: string;
  description: string;
  details?: string;
}

export interface ProjectImage {
  url: string;
  caption: string;
  category?: string;
  mockView?: string;
}

export interface DemoProject {
  id: string;
  name: string;
  sector: string;
  tagline: string;
  description: string;
  color: string;
  accentColor: string;
  tags: string[];
  highlights: string[];
  previewUrl?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  gallery: ProjectImage[];
  mockupType: 'restaurant' | 'realestate' | 'fitness' | 'haircut' | 'consulting' | 'ecommerce';
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface WhyFeature {
  title: string;
  description: string;
  icon: string;
}

export interface ContactFormData {
  name: string;
  company: string;
  email: string;
  whatsapp: string;
  formula: string;
  hostingOption: string;
  hostingDuration: string;
  message: string;
}

export interface SupplementItem {
  id: string;
  name: string;
  description: string;
  basePriceMAD: number; // 200 DH chacun
  icon?: string;
}

export type BrandingChoice = 'with_branding' | 'own_branding' | '';

export interface OrderConfigData {
  formula: 'starter' | 'pro' | 'business';
  hostingType: HostingOption;
  hostingDuration: HostingDuration;
  brandingChoice: 'with_branding' | 'own_branding';
  supplements: string[];
  lastName: string;
  firstName: string;
  company: string;
  email: string;
  whatsapp: string;
  country: string;
  activityType: string;
  projectDescription: string;
  exampleFilesSummary?: string;
  exampleFilesNames?: string[];
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
  price: string;
  priceMAD: number;
  paymentMethod: string;
}


