import { useState } from 'react';
import { DemoProject } from '../types';
import ProjectModal from './ProjectModal';
import { Sparkles, Utensils, Home, Dumbbell, Scissors, Briefcase, ShoppingBag, Eye, Laptop } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { WebsiteScreenshotMock } from './WebsiteScreenshotMock';
import ScrollReveal from './ScrollReveal';
import TextReveal from './TextReveal';

const SECTOR_ICONS: Record<string, typeof Utensils> = {
  restaurant: Utensils,
  realestate: Home,
  fitness: Dumbbell,
  haircut: Scissors,
  consulting: Briefcase,
  ecommerce: ShoppingBag,
};

interface PortfolioProps {
  onSelectProjectForQuote: (projectName: string, sector: string) => void;
}

export default function Portfolio({ onSelectProjectForQuote }: PortfolioProps) {
  const [selectedProject, setSelectedProject] = useState<DemoProject | null>(null);
  const { t, demoProjectsData } = useLanguage();

  return (
    <section id="realisations" className="py-24 relative">
      {/* Background glow */}
      <div className="absolute top-1/3 right-10 w-[550px] h-[500px] bg-[radial-gradient(circle,rgba(37,99,235,0.15)_0%,transparent_70%)] blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[450px] bg-[radial-gradient(circle,rgba(30,58,138,0.12)_0%,transparent_70%)] blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal yOffset={35}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 mb-4">
              <span>{t.portfolio.badge}</span>
            </div>

            <h2
              id="portfolio-title"
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-display"
            >
              <TextReveal as="span" effect="words" className="text-3d-heading inline-block mr-2">
                {t.portfolio.titlePart1}
              </TextReveal>{' '}
              <TextReveal as="span" effect="glow" delay={0.12} className="text-cyan-300 text-3d-cyan-glow inline-block">
                {t.portfolio.titleHighlight}
              </TextReveal>
            </h2>

            <TextReveal as="p" effect="lift" delay={0.1} className="mt-4 text-base sm:text-lg text-slate-200 text-3d-subtitle">
              {t.portfolio.subtitle}
            </TextReveal>

            {/* Mandatory Demonstration Notice */}
            <div
              id="portfolio-demo-notice"
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs sm:text-sm text-slate-300"
            >
              <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
              <span>{t.portfolio.demoNotice}</span>
            </div>
          </div>
        </ScrollReveal>

        {/* Portfolio Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {demoProjectsData.map((project, index) => {
            const IconComp = SECTOR_ICONS[project.id] || Sparkles;

            return (
              <ScrollReveal key={project.id} delay={index * 0.1} yOffset={40} className="h-full">
                <div
                  id={`portfolio-card-${project.id}`}
                  className="group relative rounded-2xl bg-[#070b1a]/85 border border-blue-900/30 hover:border-blue-400/40 backdrop-blur-sm transition-all duration-300 overflow-hidden flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-blue-950/50 h-full"
                >
                  {/* Visual Mockup Header Area with Real Website UI Simulation */}
                  <div className="relative h-60 w-full overflow-hidden border-b border-blue-900/30 group-hover:border-blue-500/40 transition-colors bg-[#060a17]">
                    {/* Miniature Browser Frame */}
                    <div className="bg-[#0c1228] px-3 py-1.5 border-b border-blue-900/30 flex items-center justify-between z-20 relative">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500/80" />
                        <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                        <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono truncate max-w-[170px] bg-black/40 px-2 py-0.5 rounded">
                        https://demo.nexivo.com/{project.id}
                      </div>
                      <span className="text-[9px] text-emerald-400 font-mono">SSL ✓</span>
                    </div>

                    {/* Real Website Screenshot Mockup Component */}
                    <div className="w-full h-[calc(100%-28px)] transform scale-[0.88] origin-top-left w-[113.6%] h-[113.6%] pointer-events-none select-none">
                      <WebsiteScreenshotMock projectId={project.id} viewType="hero" isMobile={false} />
                    </div>

                    {/* Top Bar: Sector badge & HD live render badge */}
                    <div className="absolute top-9 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
                      <div className="flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 text-[11px] text-white shadow-md">
                        <IconComp className="w-3.5 h-3.5" style={{ color: project.accentColor }} />
                        <span className="font-semibold">{project.sector}</span>
                      </div>

                      <div className="flex items-center gap-1 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 text-[10px] text-slate-300 shadow-md">
                        <Laptop className="w-3 h-3 text-blue-400" />
                        <span>{t.portfolio.badgeHD}</span>
                      </div>
                    </div>

                    {/* Hover Overlay Button to inspect all website pages */}
                    <div
                      onClick={() => setSelectedProject(project)}
                      className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 cursor-pointer z-30"
                    >
                      <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-xl cursor-pointer">
                        <Eye className="w-4 h-4" />
                        <span>{t.portfolio.interactiveDemoBadge}</span>
                      </button>
                    </div>
                  </div>

                  {/* Card Information */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 font-display group-hover:text-blue-400 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                        {project.description}
                      </p>

                      {/* Sector Specific Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-white/[0.04] text-slate-300 border border-white/10"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Card Actions: Open Full Project Modal */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                      <button
                        id={`inspect-project-btn-${project.id}`}
                        onClick={() => setSelectedProject(project)}
                        className="w-full py-2.5 px-4 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 hover:text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{t.portfolio.interactiveDemoBadge}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>

      {/* Interactive Project Modal with Desktop/Mobile simulation & real website screens */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onRequestSimilar={onSelectProjectForQuote}
        />
      )}
    </section>
  );
}
