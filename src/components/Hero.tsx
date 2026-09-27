import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Sparkles, Smartphone, Zap, ShieldCheck, ExternalLink, Laptop, Code2, Layers, BookOpen, Search } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import HolographicPedestal from './HolographicPedestal';
import { ActivePage } from '../types';

interface HeroProps {
  onOpenQuote: () => void;
  onNavigate?: (page: ActivePage, anchorId?: string) => void;
}

export default function Hero({ onOpenQuote, onNavigate }: HeroProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, active: false });
  const { t } = useLanguage();

  const handleMockupMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((y - cy) / cy) * -6;
    const ry = ((x - cx) / cx) * 6;
    setTilt({ rx, ry, active: true });
  };

  const handleMockupMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, active: false });
  };

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] flex items-center justify-center pt-32 pb-20 overflow-hidden"
    >
      {/* Background ambient lighting effects (Deep Dark Sapphire & Midnight ambiance) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[radial-gradient(ellipse_at_center,rgba(29,78,216,0.12)_0%,rgba(15,23,42,0.10)_50%,transparent_70%)] blur-[100px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[450px] h-[300px] bg-sky-500/[0.05] blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-1/4 w-[350px] h-[300px] bg-indigo-600/[0.06] blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-4xl mx-auto">
          {/* Subtle tech badge */}
          <ScrollReveal delay={0.05} yOffset={25}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/40 text-xs font-semibold text-slate-100 mb-8 backdrop-blur-md shadow-lg shadow-blue-950/40 text-3d-badge">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <span className="text-cyan-300 font-bold tracking-wider">ZALYVO</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-200">{t.hero.badgeText}</span>
            </div>
          </ScrollReveal>

          {/* Main Title with 3D Physical Extrusion & Luminescent Glow */}
          <ScrollReveal delay={0.15} yOffset={35}>
            <h1
              id="hero-title"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.15] mb-6 font-display"
              style={{ transform: 'translateZ(20px)' }}
            >
              <span className="text-3d-display inline-block mr-2">
                {t.hero.titlePart1}
              </span>{' '}
              <span className="text-cyan-300 text-3d-cyan-glow inline-block">
                {t.hero.titleHighlight}
              </span>
            </h1>
          </ScrollReveal>

          {/* Subtitle with 3D Depth */}
          <ScrollReveal delay={0.25} yOffset={35}>
            <p
              id="hero-subtitle"
              className="text-lg sm:text-xl text-slate-200 max-w-2xl mx-auto mb-10 leading-relaxed font-normal text-3d-subtitle"
            >
              {t.hero.subtitle}
            </p>
          </ScrollReveal>

          {/* Action Buttons */}
          <ScrollReveal delay={0.35} yOffset={35}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <button
                id="hero-cta-create"
                onClick={onOpenQuote}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-xl shadow-blue-600/25 hover:shadow-blue-600/40 border border-blue-400/30 hover:-translate-y-0.5 cursor-pointer group"
              >
                <span>{t.hero.ctaQuote}</span>
                <ArrowRight className="w-5 h-5 text-white/90 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                id="hero-cta-portfolio"
                onClick={() => {
                  if (onNavigate) {
                    onNavigate('portfolio');
                  } else {
                    const el = document.getElementById('realisations');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-slate-200 bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-blue-400/30 transition-all duration-300 backdrop-blur-sm hover:-translate-y-0.5 cursor-pointer"
              >
                <span>{t.hero.ctaPortfolio}</span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </ScrollReveal>

          {/* Under buttons feature points */}
          <ScrollReveal delay={0.42} yOffset={25}>
            <div
              id="hero-pill-features"
              className="text-xs sm:text-sm text-slate-400 font-medium tracking-wide flex items-center justify-center flex-wrap gap-2 sm:gap-3 py-2"
            >
              <span className="text-slate-200">{t.hero.pillDesign}</span>
              <span className="text-blue-500 font-bold">•</span>
              <span className="text-slate-200">{t.hero.pillMobile}</span>
              <span className="text-blue-500 font-bold">•</span>
              <span className="text-slate-200">{t.hero.pillFast}</span>
              <span className="text-blue-500 font-bold">•</span>
              <span className="text-slate-200">{t.hero.pillTailored}</span>
            </div>
          </ScrollReveal>
        </div>

        {/* 3D Computer & Modern Web Mockup Visual with 3D Hologram & Mouse Tilt */}
        <ScrollReveal delay={0.5} yOffset={50}>
        <div 
          className="mt-16 sm:mt-24 mb-12 sm:mb-16 relative max-w-5xl mx-auto"
          style={{ perspective: '1400px' }}
        >
          {/* Cybernetic Holographic Pedestal & Laser Platform */}
          <HolographicPedestal />

          {/* Levitation Floating Wrapper */}
          <div className="holo-levitate-wrap">
            {/* Interactive 3D Tilting Laptop Container */}
            <div
              onMouseMove={handleMockupMouseMove}
              onMouseLeave={handleMockupMouseLeave}
              className="relative transition-transform ease-out will-change-transform"
              style={{
                transform: tilt.active
                  ? `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale3d(1.015, 1.015, 1.015)`
                  : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
                transitionDuration: tilt.active ? '120ms' : '600ms',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Subtle ambient back-glow beneath computer */}
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/30 via-cyan-500/25 to-indigo-600/30 rounded-3xl blur-2xl opacity-80" />

            {/* Floating 3D Feature Badge Left */}
            <div 
              className="hidden lg:flex absolute -left-8 top-12 z-30 items-center gap-3 px-4 py-3 rounded-2xl bg-[#070b18]/95 border border-cyan-400/40 backdrop-blur-xl shadow-2xl shadow-black/80 float-3d-slow"
              style={{ transform: 'translateZ(45px)' }}
            >
              <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Zap className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-xs text-slate-400">{t.hero.speedTitle}</div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>{t.hero.speedBadge}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
              </div>
            </div>

            {/* Floating 3D Feature Badge Right */}
            <div 
              className="hidden lg:flex absolute -right-6 bottom-16 z-30 items-center gap-3 px-4 py-3 rounded-2xl bg-[#070b18]/95 border border-blue-400/40 backdrop-blur-xl shadow-2xl shadow-black/80 float-3d-delayed"
              style={{ transform: 'translateZ(45px)' }}
            >
              <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-xs text-slate-400">{t.hero.responsiveTitle}</div>
                <div className="text-sm font-bold text-white">{t.hero.responsiveBadge}</div>
              </div>
            </div>

            {/* Computer / Laptop Hardware Frame with 3D Depth Edges */}
            <div 
              className="relative rounded-2xl sm:rounded-3xl border border-blue-500/30 bg-[#070b18] shadow-[0_25px_60px_-15px_rgba(2,6,23,0.9),0_0_35px_rgba(37,99,235,0.25)] overflow-hidden"
              style={{ transformStyle: 'preserve-3d' }}
            >
            {/* Laptop Header Bar */}
            <div className="bg-[#0c1228] border-b border-blue-500/15 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>

              {/* Browser URL Search Bar */}
              <div className="flex-1 max-w-md mx-4 hidden sm:flex items-center justify-center px-4 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mr-2" />
                <span className="text-slate-300 font-mono">https://votre-entreprise.com</span>
                <span className="ml-auto text-[10px] text-blue-400 font-semibold uppercase">ONLINE</span>
              </div>

              {/* View Switcher: Interactive Preview / Code */}
              <div className="flex items-center gap-1 bg-black/30 p-1 rounded-lg border border-white/10 text-xs">
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'preview' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Laptop className="w-3 h-3" />
                  <span>{t.hero.tabRender}</span>
                </button>
                <button
                  onClick={() => setActiveTab('code')}
                  className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'code' ? 'bg-purple-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Code2 className="w-3 h-3" />
                  <span>{t.hero.tabArchitecture}</span>
                </button>
              </div>
            </div>

            {/* Laptop Screen Body Content */}
            <div className="p-4 sm:p-8 bg-gradient-to-b from-[#090b14] to-[#06070c] min-h-[380px] flex flex-col justify-between">
              {activeTab === 'preview' ? (
                <div className="space-y-6 animate-in fade-in duration-300">
                  {/* Mock Site Navbar */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-bold text-xs text-white">
                        Z
                      </div>
                      <span className="font-bold text-white text-sm tracking-wide">VOTRE MARQUE</span>
                    </div>
                    <div className="hidden md:flex items-center gap-4 text-xs text-slate-400">
                      <span className="text-white">{t.hero.mockNavHome}</span>
                      <span>{t.hero.mockNavServices}</span>
                      <span>{t.hero.mockNavPricing}</span>
                      <span>{t.hero.mockNavContact}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-semibold">
                        {t.hero.mockNavBook}
                      </span>
                    </div>
                  </div>

                  {/* Mock Site Hero inside screen */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-4">
                    <div className="md:col-span-7 space-y-3 text-left">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 text-[11px] font-medium">
                        <Sparkles className="w-3 h-3" />
                        <span>{t.hero.mockTag}</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white font-display leading-tight">
                        {t.hero.mockTitle}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                        {t.hero.mockSubtitle}
                      </p>
                      <div className="pt-2 flex flex-wrap items-center gap-2">
                        <span className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold shadow-md shadow-blue-600/30">
                          {t.hero.mockCta1}
                        </span>
                        <span className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-xs">
                          {t.hero.mockCta2}
                        </span>
                      </div>
                    </div>

                    {/* Mock interactive cards */}
                    <div className="md:col-span-5 grid grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-blue-500/30 transition-all text-left">
                        <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-2">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div className="text-xs font-bold text-white">{t.hero.mockCard1Title}</div>
                        <div className="text-[11px] text-slate-400 mt-1">{t.hero.mockCard1Sub}</div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-purple-500/30 transition-all text-left">
                        <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center mb-2">
                          <Zap className="w-4 h-4" />
                        </div>
                        <div className="text-xs font-bold text-white">{t.hero.mockCard2Title}</div>
                        <div className="text-[11px] text-slate-400 mt-1">{t.hero.mockCard2Sub}</div>
                      </div>
                      <div className="col-span-2 p-3.5 rounded-xl bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-white/10 text-left flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-white">{t.hero.mockCard3Title}</div>
                          <div className="text-[11px] text-slate-400">{t.hero.mockCard3Sub}</div>
                        </div>
                        <span className="text-emerald-400 text-xs font-bold bg-emerald-500/15 px-2 py-1 rounded">
                          {t.hero.mockCard3Badge}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mock Site Footer Mini Bar */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5 text-[11px] text-slate-500">
                    <span>{t.hero.mockFooterLeft}</span>
                    <span className="text-blue-400">{t.hero.mockFooterRight}</span>
                  </div>
                </div>
              ) : (
                /* Code View */
                <div className="text-left font-mono text-xs text-slate-300 space-y-2 animate-in fade-in duration-300 p-2">
                  <div className="text-slate-500">{t.hero.codeArchitectureTitle}</div>
                  <div className="text-purple-400">
                    import <span className="text-blue-400">{'{ createModernWebsite }'}</span> from <span className="text-emerald-400">'@zalyvo/engine'</span>;
                  </div>
                  <div className="py-2 text-slate-300">
                    <span className="text-blue-400">const</span> website = <span className="text-purple-400">await</span> createModernWebsite({'{'}
                    <div className="pl-4 text-slate-400">
                      client: <span className="text-emerald-300">'Your Brand'</span>,
                      mobileFirst: <span className="text-amber-400">true</span>,
                      speedOptimized: <span className="text-amber-400">true</span>,
                      customDesign: <span className="text-amber-400">true</span>,
                      callToActions: [<span className="text-emerald-300">'Quote'</span>, <span className="text-emerald-300">'WhatsApp'</span>],
                      hostingReady: <span className="text-amber-400">true</span>
                    </div>
                    {'}'});
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                    {t.hero.codeSuccess}
                  </div>
                </div>
              )}
            </div>

            {/* Laptop Base Stand */}
            <div className="bg-[#121526] h-4 border-t border-white/10 flex items-center justify-center">
              <div className="w-24 h-1 rounded-full bg-white/20" />
            </div>
          </div>
          </div>
          </div>
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
