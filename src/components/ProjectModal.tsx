import { useState } from 'react';
import { DemoProject, ProjectImage } from '../types';
import {
  X,
  Smartphone,
  Monitor,
  ShieldCheck,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Images,
  Maximize2,
  CheckCircle2,
  ExternalLink,
  Laptop,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { WebsiteScreenshotMock } from './WebsiteScreenshotMock';

interface ProjectModalProps {
  project: DemoProject | null;
  onClose: () => void;
  onRequestSimilar: (projectName: string, sector: string) => void;
}

export default function ProjectModal({ project, onClose, onRequestSimilar }: ProjectModalProps) {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [isPhotoLightboxOpen, setIsPhotoLightboxOpen] = useState<boolean>(false);
  const { t, language } = useLanguage();

  if (!project) return null;

  // Build the complete array of website screen captures for this project:
  const allPhotos: ProjectImage[] = [
    {
      url: project.imageUrl,
      caption: language === 'fr' ? 'Page d’accueil du site web (Hero, accroche & CTA)' : 'Showcase website homepage (Hero, value prop & CTA)',
      category: language === 'fr' ? 'Page d’Accueil' : 'Homepage',
      mockView: 'hero',
    },
    ...(project.gallery || []).slice(1),
  ];

  const currentPhoto = allPhotos[selectedPhotoIndex] || allPhotos[0];

  const handlePrevPhoto = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedPhotoIndex((prev) => (prev > 0 ? prev - 1 : allPhotos.length - 1));
  };

  const handleNextPhoto = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedPhotoIndex((prev) => (prev < allPhotos.length - 1 ? prev + 1 : 0));
  };

  return (
    <div
      id="project-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="project-modal-content"
        className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-[#0b0e1b] border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-7 text-left scrollbar-thin scrollbar-thumb-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close Button */}
        <button
          id="close-project-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer z-20"
          aria-label={t.common.close}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="pr-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 mb-2">
            <span>{t.portfolio.modalBadge}</span>
            <span>•</span>
            <span>{project.sector}</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            {project.name}
          </h3>

          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            {project.tagline}
          </p>
        </div>

        {/* Interactive Bar: View Switcher (Desktop/Mobile) & Website Screen Counter */}
        <div className="flex items-center justify-between mt-5 mb-4 pt-4 border-t border-white/10 flex-wrap gap-3">
          {/* Switcher */}
          <div className="flex items-center gap-2 bg-black/50 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setViewMode('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'desktop'
                  ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>{t.portfolio.modalDesktop}</span>
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'mobile'
                  ? 'bg-purple-600 text-white font-semibold shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{t.portfolio.modalMobile}</span>
            </button>
          </div>

          {/* Website Screens count info */}
          <div className="flex items-center gap-3 text-xs">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/10 text-slate-300">
              <Laptop className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-semibold text-white">{allPhotos.length}</span>
              <span>{language === 'fr' ? 'écrans & pages du site web' : 'website pages & views'}</span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{t.portfolio.modalResponsiveBadge}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Mockup Viewport */}
        <div className="rounded-2xl border border-white/10 bg-[#07080f] overflow-hidden shadow-inner mb-6">
          {/* Browser Address Bar */}
          <div className="bg-[#121526] px-4 py-2.5 border-b border-white/10 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <div className="flex-1 max-w-sm mx-auto bg-black/50 px-3 py-1 rounded text-[11px] text-slate-400 font-mono text-center truncate">
              https://demo.nexivo.com/{project.id}
            </div>
            <span className="text-[11px] font-mono text-emerald-400 hidden sm:inline">SSL Secure 256-bit</span>
          </div>

          {/* Mockup Content Viewport */}
          <div
            className={`transition-all duration-300 mx-auto ${
              viewMode === 'mobile'
                ? 'max-w-xs border-x-4 border-t-8 border-b-8 border-slate-800 my-4 rounded-[2.5rem] p-2 bg-[#0a0d1a] shadow-2xl'
                : 'w-full p-2 sm:p-5'
            }`}
          >
            {/* Main Interactive Stage: Displays the live functional website UI simulation */}
            <div className="relative rounded-2xl overflow-hidden border border-white/15 mb-4 shadow-2xl group bg-black">
              <div className={`relative ${viewMode === 'mobile' ? 'min-h-[380px]' : 'min-h-[340px] sm:min-h-[420px]'} w-full overflow-hidden flex flex-col justify-between`}>
                
                {/* Live Website UI Screenshot Mockup */}
                <WebsiteScreenshotMock
                  projectId={project.id}
                  viewType={currentPhoto.mockView || 'hero'}
                  isMobile={viewMode === 'mobile'}
                />

                {/* Top Overlay Badge */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <div className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-xs font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: project.accentColor }} />
                    <span>{project.name}</span>
                  </div>

                  {currentPhoto.category && (
                    <span className="px-3 py-1 rounded-full bg-blue-600/90 backdrop-blur-md border border-blue-400/40 text-[11px] font-semibold text-white shadow-md">
                      {currentPhoto.category}
                    </span>
                  )}
                </div>

                {/* Left / Right Carousel Navigation Arrows */}
                <button
                  onClick={handlePrevPhoto}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm opacity-90 hover:opacity-100 hover:scale-105 z-10"
                  aria-label="Écran précédent"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                  onClick={handleNextPhoto}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm opacity-90 hover:opacity-100 hover:scale-105 z-10"
                  aria-label="Écran suivant"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                {/* Bottom Screen Caption Callout */}
                <div className="bg-black/80 backdrop-blur-md px-4 py-2.5 border-t border-white/10 flex items-center justify-between gap-3 text-left">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-blue-400 uppercase tracking-wider">
                      <span>{language === 'fr' ? 'Écran du site' : 'Website Screen'} {selectedPhotoIndex + 1} / {allPhotos.length}</span>
                      <span>•</span>
                      <span>{currentPhoto.category || project.sector}</span>
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-white truncate max-w-xl">
                      {currentPhoto.caption}
                    </div>
                  </div>

                  <button
                    onClick={() => setIsPhotoLightboxOpen(true)}
                    className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{language === 'fr' ? 'Plein écran' : 'Full size'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Screens Thumbnail Strip (Only visible inside project modal) */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Laptop className="w-3.5 h-3.5 text-blue-400" />
                  <span>
                    {language === 'fr'
                      ? 'Écrans du site web (cliquez pour prévisualiser la page) :'
                      : 'Website Pages & Screens (click to preview) :'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  {selectedPhotoIndex + 1} / {allPhotos.length}
                </span>
              </div>

              {/* Thumbnails Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {allPhotos.map((item, idx) => {
                  const isActive = idx === selectedPhotoIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedPhotoIndex(idx)}
                      className={`relative rounded-xl overflow-hidden p-2.5 border-2 transition-all cursor-pointer group text-left flex flex-col justify-between ${
                        isActive
                          ? 'border-blue-500 bg-blue-950/40 shadow-lg shadow-blue-500/30 ring-2 ring-blue-400/50 scale-[1.02]'
                          : 'border-white/10 bg-white/[0.03] opacity-70 hover:opacity-100 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-[10px] font-mono text-blue-400 font-bold">
                          Page 0{idx + 1}
                        </span>
                        {isActive && (
                          <div className="w-3.5 h-3.5 rounded-full bg-blue-500 flex items-center justify-center text-white">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>

                      <div className="text-[11px] font-bold text-white truncate w-full mb-0.5">
                        {item.category || `Vue ${idx + 1}`}
                      </div>

                      <div className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
                        {item.caption}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Website Action Bar Simulation */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-white/[0.05] to-white/[0.02] border border-white/10 mb-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold shadow-md shadow-blue-600/30">
                  {language === 'fr' ? 'Bouton d’Action & Réservation' : 'CTA & Booking Action'}
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  WhatsApp Direct
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                {language === 'fr' ? 'Score Performance Google :' : 'Google Performance Score :'} <span className="text-emerald-400 font-bold">99/100</span>
              </div>
            </div>

            {/* Highlights Grid inside Mock */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {project.highlights.map((h, i) => (
                <div key={i} className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs">
                  <div className="text-blue-400 font-bold mb-1">0{i + 1}.</div>
                  <div className="text-slate-200 font-medium">{h}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Bottom Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
          <div>
            <div className="text-xs text-slate-400">{t.portfolio.modalInspired}</div>
            <div className="text-sm font-bold text-white">
              {t.portfolio.modalTailorMessage}
            </div>
          </div>

          <button
            id="modal-request-similar-btn"
            onClick={() => {
              onRequestSimilar(project.name, project.sector);
              onClose();
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer transition-transform hover:scale-[1.02]"
          >
            <span>{t.portfolio.modalCta}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Full-Screen Lightbox for the website screen if clicked */}
      {isPhotoLightboxOpen && (
        <div
          id="photo-lightbox-modal"
          className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsPhotoLightboxOpen(false)}
        >
          <button
            onClick={() => setIsPhotoLightboxOpen(false)}
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer z-30"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative w-full max-w-4xl max-h-[85vh] flex flex-col items-center p-4 bg-[#0a0d1a] border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full h-[55vh] overflow-y-auto rounded-xl border border-white/10">
              <WebsiteScreenshotMock
                projectId={project.id}
                viewType={currentPhoto.mockView || 'hero'}
                isMobile={false}
              />
            </div>

            <div className="mt-4 text-center">
              <span className="px-3 py-1 rounded-full bg-blue-600 text-xs font-semibold text-white mr-2">
                {currentPhoto.category || project.sector}
              </span>
              <span className="text-white text-sm sm:text-base font-semibold">
                {currentPhoto.caption}
              </span>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={handlePrevPhoto}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> {language === 'fr' ? 'Écran précédent' : 'Previous screen'}
              </button>
              <span className="text-xs text-slate-400">
                {selectedPhotoIndex + 1} / {allPhotos.length}
              </span>
              <button
                onClick={handleNextPhoto}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1 cursor-pointer"
              >
                {language === 'fr' ? 'Écran suivant' : 'Next screen'} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
