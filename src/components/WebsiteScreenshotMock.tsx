import React from 'react';
import {
  Utensils,
  Building2,
  Dumbbell,
  Scissors,
  Briefcase,
  ShoppingBag,
  Star,
  Clock,
  Phone,
  Calendar,
  Search,
  CheckCircle,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  MapPin,
  Menu,
  ShoppingCart,
  ArrowRight,
  TrendingUp,
  Award,
} from 'lucide-react';

export interface WebsiteScreenshotMockProps {
  projectId: string;
  viewType: string; // e.g. 'hero' | 'menu' | 'catalog' | 'booking' | 'pricing' | 'about' | 'contact'
  isMobile?: boolean;
}

export const WebsiteScreenshotMock: React.FC<WebsiteScreenshotMockProps> = ({
  projectId,
  viewType,
  isMobile = false,
}) => {
  // RESTAURANT WEBSITES
  if (projectId === 'restaurant') {
    if (viewType === 'menu') {
      return (
        <div className="w-full h-full bg-[#120d08] text-amber-50 p-4 sm:p-6 flex flex-col justify-between select-none overflow-hidden font-sans border-t border-amber-500/20">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-amber-400" />
              <span className="font-serif tracking-widest text-xs uppercase text-amber-300 font-bold">
                Carte Gastronomique & Bistrot
              </span>
            </div>
            <span className="text-[10px] text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              Saison Automne-Hiver
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-black/40 border border-amber-500/15 p-3 rounded-lg">
              <div className="flex justify-between items-start mb-1">
                <span className="font-serif text-xs font-semibold text-white">
                  Filet de Loup de Mer Rôti
                </span>
                <span className="text-amber-400 font-mono text-xs font-bold">28 €</span>
              </div>
              <p className="text-[10px] text-stone-400">
                Émulsion d’agrumes, purée de panais vanillée et jeunes pousses croquantes.
              </p>
            </div>

            <div className="bg-black/40 border border-amber-500/15 p-3 rounded-lg">
              <div className="flex justify-between items-start mb-1">
                <span className="font-serif text-xs font-semibold text-white">
                  Côte de Bœuf Maturée
                </span>
                <span className="text-amber-400 font-mono text-xs font-bold">34 €</span>
              </div>
              <p className="text-[10px] text-stone-400">
                Jus corsé au romarin, mousseline de pommes rattes truffées.
              </p>
            </div>

            <div className="bg-black/40 border border-amber-500/15 p-3 rounded-lg">
              <div className="flex justify-between items-start mb-1">
                <span className="font-serif text-xs font-semibold text-white">
                  Risotto aux Cèpes & Parmesan
                </span>
                <span className="text-amber-400 font-mono text-xs font-bold">24 €</span>
              </div>
              <p className="text-[10px] text-stone-400">
                Riz Carnaroli crémeux, copeaux de truffe d’été et huile d’olive herbacée.
              </p>
            </div>

            <div className="bg-black/40 border border-amber-500/15 p-3 rounded-lg">
              <div className="flex justify-between items-start mb-1">
                <span className="font-serif text-xs font-semibold text-white">
                  Sphère Chocolat Grand Cru
                </span>
                <span className="text-amber-400 font-mono text-xs font-bold">14 €</span>
              </div>
              <p className="text-[10px] text-stone-400">
                Cœur coulant caramel beurre salé, glace artisanale à la fève tonka.
              </p>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-amber-500/10 flex items-center justify-between text-[11px] text-amber-200/80">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> Service continu 12h00 - 23h30
            </span>
            <span className="bg-amber-500 text-black font-bold px-2.5 py-0.5 rounded text-[10px] flex items-center gap-1 shadow">
              Commander en ligne <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      );
    }

    if (viewType === 'booking') {
      return (
        <div className="w-full h-full bg-[#18120b] text-amber-100 p-4 sm:p-6 flex flex-col justify-between font-sans">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400">
                Module de Réservation Directe
              </span>
              <h5 className="text-base font-serif font-bold text-white">
                Réservez votre table en 3 clics
              </h5>
            </div>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono px-2 py-0.5 rounded">
              Confirmation Immédiate
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
            <div className="bg-black/50 p-3 rounded-lg border border-amber-500/20 text-left">
              <span className="text-[10px] text-stone-400 block mb-1">Date choisie</span>
              <div className="font-semibold text-xs text-amber-200 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" /> Samedi 24 Octobre
              </div>
            </div>

            <div className="bg-black/50 p-3 rounded-lg border border-amber-500/20 text-left">
              <span className="text-[10px] text-stone-400 block mb-1">Nombre de couverts</span>
              <div className="font-semibold text-xs text-amber-200 flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-amber-400" /> 4 Personnes (Carré VIP)
              </div>
            </div>

            <div className="bg-black/50 p-3 rounded-lg border border-amber-500/20 text-left">
              <span className="text-[10px] text-stone-400 block mb-1">Heure de service</span>
              <div className="font-semibold text-xs text-amber-200 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> 20h30 (Dîner)
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
            <div className="text-[11px] text-stone-300">
              <strong className="text-white">Alerte SMS & WhatsApp automatique</strong> envoyée instantanément au client et au restaurateur.
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold rounded-lg text-xs shadow-lg flex items-center gap-1 shrink-0">
              Valider la réservation
            </button>
          </div>
        </div>
      );
    }

    // Default: Restaurant Hero View
    return (
      <div className="w-full h-full bg-[#100c08] text-amber-50 flex flex-col justify-between font-sans relative overflow-hidden">
        {/* Nav Bar */}
        <div className="px-5 py-3 border-b border-amber-500/20 bg-black/40 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-serif font-bold text-xs">
              LG
            </div>
            <span className="font-serif tracking-widest text-sm font-bold text-amber-100">
              L’ARDOISE GOURMANDE
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-5 text-xs text-stone-300">
            <span className="text-amber-400 font-semibold">Accueil</span>
            <span>La Carte</span>
            <span>Le Chef</span>
            <span>Vins & Cocktails</span>
            <span>Contact</span>
          </div>
          <span className="px-3 py-1 rounded bg-amber-500 text-black font-bold text-xs shadow">
            Réserver
          </span>
        </div>

        {/* Hero Body */}
        <div className="p-6 sm:p-10 flex flex-col items-start justify-center max-w-xl text-left">
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono text-[10px] tracking-widest uppercase mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400" /> Bistronomie Moderne & Saveurs d’Exception
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-extrabold text-white leading-tight mb-3">
            L'excellence culinaire au cœur de votre ville
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mb-5 leading-relaxed">
            Produits frais de saison en circuit court, cave d’exception et ambiance chaleureuse pour vos déjeuners et dîners d’affaires.
          </p>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-lg bg-amber-500 text-black font-bold text-xs shadow-lg flex items-center gap-1.5">
              Découvrir la carte du moment <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button className="px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs font-semibold">
              Visite 360° du restaurant
            </button>
          </div>
        </div>

        {/* Hero Footer Strip */}
        <div className="px-5 py-2.5 bg-black/60 border-t border-amber-500/20 flex items-center justify-between text-[11px] text-stone-400">
          <span>📍 14 Avenue des Gastronomes • Terrasse privée</span>
          <span className="text-amber-400 font-semibold flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 4.9/5 sur Google Reviews (420+ avis)
          </span>
        </div>
      </div>
    );
  }

  // REAL ESTATE WEBSITES
  if (projectId === 'realestate') {
    if (viewType === 'catalog') {
      return (
        <div className="w-full h-full bg-[#08111e] text-slate-100 p-4 sm:p-6 flex flex-col justify-between font-sans">
          <div className="flex items-center justify-between border-b border-blue-500/20 pb-3 mb-2">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Catalogue Biens d’Exception en Vente
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">Filtres : Villa • Piscine • Vue mer</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#0e1c31] border border-blue-500/20 rounded-xl overflow-hidden text-left">
              <div className="h-24 bg-gradient-to-br from-blue-900/60 to-slate-900 p-2 flex justify-between items-start">
                <span className="bg-emerald-500 text-white font-bold text-[9px] px-1.5 py-0.5 rounded">Exclusivité</span>
                <span className="bg-black/60 text-white font-mono text-[10px] px-1.5 py-0.5 rounded">1 480 000 €</span>
              </div>
              <div className="p-2.5">
                <div className="font-bold text-xs text-white">Villa Panoramique 280 m²</div>
                <div className="text-[10px] text-slate-400">Cannes Californie • 5 ch. • Piscine à débordement</div>
              </div>
            </div>

            <div className="bg-[#0e1c31] border border-blue-500/20 rounded-xl overflow-hidden text-left">
              <div className="h-24 bg-gradient-to-br from-cyan-900/60 to-slate-900 p-2 flex justify-between items-start">
                <span className="bg-blue-500 text-white font-bold text-[9px] px-1.5 py-0.5 rounded">Nouveau</span>
                <span className="bg-black/60 text-white font-mono text-[10px] px-1.5 py-0.5 rounded">890 000 €</span>
              </div>
              <div className="p-2.5">
                <div className="font-bold text-xs text-white">Penthouse Rooftop 165 m²</div>
                <div className="text-[10px] text-slate-400">Centre historique • Terrasse 90 m² • Ascenseur privé</div>
              </div>
            </div>

            <div className="bg-[#0e1c31] border border-blue-500/20 rounded-xl overflow-hidden text-left">
              <div className="h-24 bg-gradient-to-br from-indigo-900/60 to-slate-900 p-2 flex justify-between items-start">
                <span className="bg-purple-500 text-white font-bold text-[9px] px-1.5 py-0.5 rounded">Coup de cœur</span>
                <span className="bg-black/60 text-white font-mono text-[10px] px-1.5 py-0.5 rounded">620 000 €</span>
              </div>
              <div className="p-2.5">
                <div className="font-bold text-xs text-white">Maison d’Architecte 190 m²</div>
                <div className="text-[10px] text-slate-400">Domaine sécurisé • Parc arboré 1 500 m²</div>
              </div>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-blue-500/10 flex items-center justify-between text-[11px] text-slate-400">
            <span>Affichage de 24 biens disponibles dans votre secteur</span>
            <span className="text-blue-400 font-semibold cursor-pointer">Voir tous les biens récents →</span>
          </div>
        </div>
      );
    }

    if (viewType === 'valuation') {
      return (
        <div className="w-full h-full bg-[#071324] text-slate-100 p-5 flex flex-col justify-between font-sans">
          <div className="border-b border-blue-500/20 pb-3">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Outil d'estimation en ligne</span>
            <h5 className="text-base font-bold text-white">Estimez la valeur de votre bien immobilier sous 24h</h5>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
            <div className="bg-black/40 p-3 rounded-lg border border-white/10 text-left">
              <label className="text-[10px] text-slate-400 block mb-1">Type de bien</label>
              <div className="font-semibold text-xs text-white">Maison contemporaine / Villa</div>
            </div>
            <div className="bg-black/40 p-3 rounded-lg border border-white/10 text-left">
              <label className="text-[10px] text-slate-400 block mb-1">Surface habitable</label>
              <div className="font-semibold text-xs text-white">180 m² (Terrain 1 200 m²)</div>
            </div>
            <div className="bg-black/40 p-3 rounded-lg border border-white/10 text-left">
              <label className="text-[10px] text-slate-400 block mb-1">Code Postal / Ville</label>
              <div className="font-semibold text-xs text-white">06400 Cannes</div>
            </div>
          </div>

          <div className="p-3 bg-blue-600/20 border border-blue-400/30 rounded-xl flex items-center justify-between">
            <span className="text-xs text-slate-200">
              Calcul basé sur <strong>840 transactions notariales réelles</strong> dans le même quartier.
            </span>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs shadow-md">
              Obtenir mon rapport d'estimation gratuit
            </button>
          </div>
        </div>
      );
    }

    // Default: Real Estate Hero View
    return (
      <div className="w-full h-full bg-[#050c18] text-white flex flex-col justify-between font-sans relative">
        <div className="px-5 py-3 border-b border-blue-500/20 bg-black/40 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xs">
              AP
            </div>
            <span className="font-bold text-sm tracking-wider">AURA PRESTIGE IMMOBILIER</span>
          </div>
          <div className="hidden sm:flex items-center gap-5 text-xs text-slate-300">
            <span className="text-blue-400 font-semibold">Ventes</span>
            <span>Locations Prestige</span>
            <span>Estimation Gratuite</span>
            <span>Conseillers</span>
          </div>
          <span className="px-3 py-1 rounded bg-blue-600 text-white font-bold text-xs">
            01 42 68 55 00
          </span>
        </div>

        <div className="p-6 sm:p-10 max-w-xl text-left">
          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 font-mono text-[10px] tracking-widest uppercase mb-3 inline-block">
            Immobilier Haut de Gamme & Estimations Locales
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-3">
            Trouvez l'adresse d'exception qui correspond à vos exigences
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed">
            Plus de 15 ans d’accompagnement discret et personnalisé dans la transaction de résidences d'exception, penthouses et villas contemporaines.
          </p>

          <div className="bg-black/70 p-2 rounded-xl border border-white/15 flex items-center gap-2 max-w-md">
            <Search className="w-4 h-4 text-blue-400 ml-2 shrink-0" />
            <span className="text-xs text-slate-400 flex-1">Rechercher une ville, surface, budget...</span>
            <button className="px-4 py-1.5 bg-blue-600 text-white font-semibold text-xs rounded-lg shadow">
              Rechercher
            </button>
          </div>
        </div>

        <div className="px-5 py-2.5 bg-black/60 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
          <span>🏛️ 180+ Biens haut de gamme sous mandat exclusif</span>
          <span className="text-emerald-400 font-semibold">✓ Honoraires transparents & accompagnement notarié</span>
        </div>
      </div>
    );
  }

  // FITNESS WEBSITES
  if (projectId === 'fitness') {
    if (viewType === 'schedule') {
      return (
        <div className="w-full h-full bg-[#081512] text-emerald-100 p-4 sm:p-6 flex flex-col justify-between font-sans">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3 mb-2">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Planning Interactif des Cours Collectifs
              </span>
            </div>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/30">
              Mise à jour en direct
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-black/50 border border-emerald-500/20 p-3 rounded-xl text-left">
              <span className="text-[10px] font-bold text-emerald-400 block">LUNDI • 18H30</span>
              <div className="font-bold text-xs text-white my-1">Cross-Training & HIIT 45'</div>
              <div className="text-[10px] text-stone-300">Coach Marc • Studio 1 (18 places)</div>
              <span className="mt-2 inline-block px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">
                4 places restantes
              </span>
            </div>

            <div className="bg-black/50 border border-emerald-500/20 p-3 rounded-xl text-left">
              <span className="text-[10px] font-bold text-emerald-400 block">MARDI • 12H15</span>
              <div className="font-bold text-xs text-white my-1">Spinning & RPM Immersion</div>
              <div className="text-[10px] text-stone-300">Coach Sarah • Studio Vélo</div>
              <span className="mt-2 inline-block px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">
                2 places restantes
              </span>
            </div>

            <div className="bg-black/50 border border-emerald-500/20 p-3 rounded-xl text-left">
              <span className="text-[10px] font-bold text-emerald-400 block">JEUDI • 19H00</span>
              <div className="font-bold text-xs text-white my-1">Power Boxing & Renfo</div>
              <div className="text-[10px] text-stone-300">Coach David • Ring & Tatami</div>
              <span className="mt-2 inline-block px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">
                6 places restantes
              </span>
            </div>
          </div>

          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between text-xs">
            <span>Pass d'essai offert pour tester le cours de votre choix</span>
            <button className="px-4 py-1.5 bg-emerald-500 text-black font-bold rounded-lg text-xs shadow">
              Réserver mon cours d'essai gratuit
            </button>
          </div>
        </div>
      );
    }

    // Default: Fitness Hero
    return (
      <div className="w-full h-full bg-[#06120e] text-white flex flex-col justify-between font-sans relative">
        <div className="px-5 py-3 border-b border-emerald-500/20 bg-black/40 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 text-black flex items-center justify-center font-black text-xs">
              PT
            </div>
            <span className="font-extrabold text-sm tracking-widest text-emerald-400">PULSE TRAINING CLUB</span>
          </div>
          <div className="hidden sm:flex items-center gap-5 text-xs text-slate-300">
            <span className="text-emerald-400 font-semibold">Le Club</span>
            <span>Planning Cours</span>
            <span>Formules & Tarifs</span>
            <span>Coaching Privé</span>
          </div>
          <span className="px-3 py-1 rounded bg-emerald-500 text-black font-bold text-xs">
            Pass Essai Offert
          </span>
        </div>

        <div className="p-6 sm:p-10 max-w-xl text-left">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-mono text-[10px] tracking-widest uppercase mb-3 inline-block">
            Musculation • Cross-Training • Cours Collectifs
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight mb-3">
            Dépassez vos limites avec un encadrement d'élite
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mb-5 leading-relaxed">
            1 200 m² dédiés à la performance sportive, équipements guidés haut de gamme et espace bien-être avec sauna.
          </p>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-lg bg-emerald-500 text-black font-bold text-xs shadow-lg">
              Découvrir les abonnements dès 29€/mois
            </button>
            <button className="px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs font-semibold">
              Consulter le planning de la semaine
            </button>
          </div>
        </div>

        <div className="px-5 py-2.5 bg-black/60 border-t border-white/10 flex items-center justify-between text-[11px] text-stone-400">
          <span>⚡ Ouvert 7j/7 de 6h00 à 23h00 non-stop</span>
          <span className="text-emerald-400 font-semibold">✓ 15 coachs diplômés d'État à vos côtés</span>
        </div>
      </div>
    );
  }

  // HAIRCUT WEBSITES
  if (projectId === 'haircut') {
    return (
      <div className="w-full h-full bg-[#120b18] text-purple-100 flex flex-col justify-between font-sans relative">
        <div className="px-5 py-3 border-b border-purple-500/20 bg-black/40 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scissors className="w-4 h-4 text-purple-400" />
            <span className="font-serif tracking-widest text-sm font-bold text-purple-200">
              STUDIO CISEAUX & COIFFURE
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-5 text-xs text-stone-300">
            <span className="text-purple-400 font-semibold">Prestations</span>
            <span>Tarifs</span>
            <span>Lookbook</span>
            <span>Prise de RDV</span>
          </div>
          <span className="px-3 py-1 rounded bg-purple-600 text-white font-bold text-xs">
            Prendre RDV en Ligne
          </span>
        </div>

        <div className="p-6 sm:p-10 max-w-xl text-left">
          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 font-mono text-[10px] tracking-widest uppercase mb-3 inline-block">
            Artisanat Capillaire • Balayage • Barber Shop
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-white leading-tight mb-3">
            Sublimez votre style avec des soins sur-mesure
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mb-5 leading-relaxed">
            Coiffure mixte, diagnostics personnalisés du cuir chevelu et rituels botaniques respectueux de la fibre capillaire.
          </p>
          <div className="grid grid-cols-2 gap-3 max-w-sm mb-4">
            <div className="bg-black/50 p-2.5 rounded-lg border border-purple-500/20">
              <div className="text-xs font-bold text-white">Coupe & Coiffage Dame</div>
              <div className="text-[10px] text-purple-300">Dès 38 € • Soin offert</div>
            </div>
            <div className="bg-black/50 p-2.5 rounded-lg border border-purple-500/20">
              <div className="text-xs font-bold text-white">Rituel Barber Homme</div>
              <div className="text-[10px] text-purple-300">Dès 26 € • Serviette chaude</div>
            </div>
          </div>
        </div>

        <div className="px-5 py-2.5 bg-black/60 border-t border-purple-500/20 flex items-center justify-between text-[11px] text-stone-400">
          <span>✨ Produits 100% sans sulfate & huiles bio certifiées</span>
          <span className="text-purple-300 font-semibold">Prise de RDV 24h/24 par SMS & WhatsApp</span>
        </div>
      </div>
    );
  }

  // CONSULTING WEBSITES
  if (projectId === 'consulting') {
    return (
      <div className="w-full h-full bg-[#0a0f1d] text-indigo-100 flex flex-col justify-between font-sans relative">
        <div className="px-5 py-3 border-b border-indigo-500/20 bg-black/40 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-sm tracking-wider text-white">
              APEX STRATÉGIE & CONSEILS
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-5 text-xs text-slate-300">
            <span className="text-indigo-400 font-semibold">Expertises</span>
            <span>Cas Clients</span>
            <span>Méthodologie</span>
            <span>Contact B2B</span>
          </div>
          <span className="px-3 py-1 rounded bg-indigo-600 text-white font-bold text-xs">
            Demander un Audit
          </span>
        </div>

        <div className="p-6 sm:p-10 max-w-xl text-left">
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-mono text-[10px] tracking-widest uppercase mb-3 inline-block">
            Conseil en Organisation & Performance Financière
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-3">
            Accélérez la croissance durable de votre entreprise
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed">
            Nous accompagnons les dirigeants et comités de direction dans leurs choix stratégiques, restructurations et levées de fonds.
          </p>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-lg shadow-lg">
              Prendre rendez-vous avec un associé
            </button>
            <button className="px-4 py-2 bg-white/10 text-white border border-white/20 text-xs font-semibold rounded-lg">
              Télécharger notre livre blanc
            </button>
          </div>
        </div>

        <div className="px-5 py-2.5 bg-black/60 border-t border-indigo-500/20 flex items-center justify-between text-[11px] text-slate-400">
          <span>📊 +120 Entreprises accompagnées en Europe & MENA</span>
          <span className="text-indigo-300 font-semibold">Cabinet accrédité & auditeurs certifiés</span>
        </div>
      </div>
    );
  }

  // E-COMMERCE WEBSITES
  return (
    <div className="w-full h-full bg-[#081514] text-teal-100 flex flex-col justify-between font-sans relative">
      <div className="px-5 py-3 border-b border-teal-500/20 bg-black/40 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-teal-400" />
          <span className="font-serif tracking-widest text-sm font-bold text-teal-200">
            MAISON BOTANIQUE
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-5 text-xs text-stone-300">
          <span className="text-teal-400 font-semibold">Plantes Rares</span>
          <span>Pots & Décors</span>
          <span>Conseils Entretien</span>
          <span>Nouveautés</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-teal-500/20 text-teal-300 text-xs flex items-center gap-1 border border-teal-500/30">
            <ShoppingCart className="w-3.5 h-3.5" /> Panier (2)
          </span>
        </div>
      </div>

      <div className="p-6 sm:p-10 max-w-xl text-left">
        <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 font-mono text-[10px] tracking-widest uppercase mb-3 inline-block">
          Boutique Végétale • Livraison Express en 48h
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-white leading-tight mb-3">
          Apportez une respiration végétale à votre intérieur
        </h2>
        <p className="text-xs sm:text-sm text-stone-300 mb-5 leading-relaxed">
          Plantes d’intérieur faciles d’entretien, terreaux enrichis bio et pots artisanaux cuits au four.
        </p>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-teal-500 text-black font-bold text-xs rounded-lg shadow-lg">
            Découvrir la collection d’automne
          </button>
          <button className="px-4 py-2 bg-white/10 text-white border border-white/20 text-xs font-semibold rounded-lg">
            Guide d’arrosage offert
          </button>
        </div>
      </div>

      <div className="px-5 py-2.5 bg-black/60 border-t border-teal-500/20 flex items-center justify-between text-[11px] text-stone-400">
        <span>🌿 Emballage anti-casse éco-responsable breveté</span>
        <span className="text-teal-300 font-semibold">Garantie fraîcheur plante vivante 30 jours</span>
      </div>
    </div>
  );
};
