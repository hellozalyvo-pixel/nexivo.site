import { useState, useEffect } from 'react';

export default function Decor3D() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to range [-1, 1]
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x: nx, y: ny });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const parallaxX = mousePos.x * 15;
  const parallaxY = mousePos.y * 15;

  return (
    <div
      id="decor-3d-environment"
      className="fixed inset-0 pointer-events-none overflow-hidden -z-10 select-none"
      aria-hidden="true"
    >
      {/* 0. Cyber Blue Nebula Auroras - Subdued & Deepened for Dark Midnight Theme */}
      <div className="absolute -top-40 left-[8%] w-[750px] h-[750px] rounded-full aurora-blue-1 opacity-45 pointer-events-none" />
      <div className="absolute top-[32%] -right-36 w-[700px] h-[700px] rounded-full aurora-blue-2 opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-120px] left-[20%] w-[750px] h-[650px] rounded-full aurora-blue-3 opacity-35 pointer-events-none" />
      
      {/* Deep Dark Abyssal Pocket (pure obsidian midnight contrast) */}
      <div className="absolute top-[15%] right-[10%] w-[700px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,1,5,0.95)_0%,rgba(1,3,10,0.75)_50%,transparent_80%)] blur-[90px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.06)_0%,rgba(29,78,216,0.05)_30%,rgba(0,2,8,0.85)_60%,transparent_85%)] blur-[120px] pointer-events-none" />

      {/* 3D Undulating Luminescent Energy Ribbon */}
      <div className="absolute top-[38%] left-[-10%] w-[120vw] h-[120px] wave-ribbon-3d pointer-events-none opacity-40" />

      {/* 1. Volumetric 3D Light Beams - Subdued Dark Cyber Aesthetic */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[700px] light-beam-3d opacity-25" />
      <div
        className="absolute -top-40 right-[-100px] w-[650px] h-[750px] light-beam-3d opacity-20"
        style={{ transform: 'skewX(25deg) rotate(15deg)' }}
      />

      {/* 2. 3D Perspective Cyber-Grid Floor at the bottom / horizon */}
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[160vw] max-w-[2400px] h-[580px] perspective-container-3d overflow-hidden">
        {/* Horizon glow line & laser ribbon */}
        <div className="absolute top-[28%] left-1/2 -translate-x-1/2 w-[90%] h-[3px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_35px_rgba(6,182,212,1)] z-10 animate-pulse" />
        <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-[70%] h-[45px] bg-gradient-to-r from-transparent via-blue-500/35 to-transparent blur-lg z-10" />

        {/* Receding infinite 3D grid plane */}
        <div
          className="w-full h-[850px] grid-plane-3d"
          style={{
            transform: `rotateX(72deg) translateZ(0) translate(${parallaxX * 0.3}px, ${
              parallaxY * 0.2
            }px)`,
          }}
        />
      </div>

      {/* 3. Floating 3D Geometric Shapes with Parallax */}
      <div
        className="absolute inset-0 transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(${parallaxX * 0.5}px, ${parallaxY * 0.5}px, 0)`,
        }}
      >
        {/* TOP-LEFT 3D FLOATING CUBE (Emerald / Sapphire glow) */}
        <div className="absolute top-[18%] left-[6%] sm:left-[8%] float-3d-slow opacity-75 hidden md:block">
          <div className="w-14 h-14 relative cube-3d-wrap">
            {/* Front */}
            <div
              className="absolute inset-0 rounded-lg border border-sky-400/60 bg-gradient-to-br from-blue-600/20 to-transparent backdrop-blur-[2px] shadow-[0_0_20px_rgba(56,189,248,0.25)]"
              style={{ transform: 'translateZ(28px)' }}
            />
            {/* Back */}
            <div
              className="absolute inset-0 rounded-lg border border-blue-500/40 bg-blue-950/30"
              style={{ transform: 'rotateY(180deg) translateZ(28px)' }}
            />
            {/* Right */}
            <div
              className="absolute inset-0 rounded-lg border border-indigo-400/50 bg-gradient-to-tr from-indigo-600/20 to-transparent"
              style={{ transform: 'rotateY(90deg) translateZ(28px)' }}
            />
            {/* Left */}
            <div
              className="absolute inset-0 rounded-lg border border-cyan-400/40 bg-cyan-950/20"
              style={{ transform: 'rotateY(-90deg) translateZ(28px)' }}
            />
            {/* Top */}
            <div
              className="absolute inset-0 rounded-lg border border-blue-300/60 bg-white/10"
              style={{ transform: 'rotateX(90deg) translateZ(28px)' }}
            />
            {/* Bottom */}
            <div
              className="absolute inset-0 rounded-lg border border-blue-600/30 bg-black/40"
              style={{ transform: 'rotateX(-90deg) translateZ(28px)' }}
            />
          </div>
          <div className="w-16 h-3 mx-auto mt-6 bg-blue-500/20 rounded-full blur-md" />
        </div>

        {/* TOP-RIGHT 3D GYROSCOPE / ORBITAL RINGS */}
        <div className="absolute top-[14%] right-[5%] sm:right-[10%] float-3d-delayed opacity-80 hidden lg:block">
          <div className="w-36 h-36 relative flex items-center justify-center">
            {/* Outer Ring */}
            <div className="absolute inset-0 rounded-full border border-blue-400/50 gyro-ring-1 shadow-[0_0_25px_rgba(96,165,250,0.3)]" />
            {/* Inner Ring */}
            <div className="absolute inset-3 rounded-full border border-cyan-300/60 gyro-ring-2 shadow-[0_0_20px_rgba(6,182,212,0.4)]" />
            {/* Innermost Ring */}
            <div className="absolute inset-7 rounded-full border border-purple-400/40 gyro-ring-3" />
            {/* Central glowing core sphere */}
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_25px_rgba(56,189,248,0.9)] animate-pulse" />
          </div>
        </div>

        {/* MID-RIGHT 3D PURPLE AMETHYST CUBE */}
        <div className="absolute top-[52%] right-[4%] float-3d-slow opacity-60 hidden md:block">
          <div className="w-12 h-12 relative cube-3d-wrap-reverse">
            {/* Front */}
            <div
              className="absolute inset-0 rounded-md border border-purple-400/60 bg-purple-600/15 backdrop-blur-[2px] shadow-[0_0_15px_rgba(168,85,247,0.3)]"
              style={{ transform: 'translateZ(24px)' }}
            />
            {/* Back */}
            <div
              className="absolute inset-0 rounded-md border border-purple-600/30 bg-purple-950/20"
              style={{ transform: 'rotateY(180deg) translateZ(24px)' }}
            />
            {/* Right */}
            <div
              className="absolute inset-0 rounded-md border border-indigo-400/40 bg-indigo-600/20"
              style={{ transform: 'rotateY(90deg) translateZ(24px)' }}
            />
            {/* Left */}
            <div
              className="absolute inset-0 rounded-md border border-fuchsia-400/40 bg-fuchsia-950/20"
              style={{ transform: 'rotateY(-90deg) translateZ(24px)' }}
            />
            {/* Top */}
            <div
              className="absolute inset-0 rounded-md border border-purple-300/50 bg-white/10"
              style={{ transform: 'rotateX(90deg) translateZ(24px)' }}
            />
            {/* Bottom */}
            <div
              className="absolute inset-0 rounded-md border border-purple-700/30 bg-black/40"
              style={{ transform: 'rotateX(-90deg) translateZ(24px)' }}
            />
          </div>
          <div className="w-14 h-3 mx-auto mt-5 bg-purple-600/20 rounded-full blur-md" />
        </div>

        {/* MID-LEFT 3D DIAMOND PRISM */}
        <div className="absolute top-[65%] left-[5%] float-3d-delayed opacity-70 hidden lg:block">
          <div className="relative w-16 h-16 flex items-center justify-center">
            {/* Holographic Wireframe Prism */}
            <div
              className="w-12 h-12 border-2 border-cyan-400/50 bg-cyan-500/10 rotate-45 rounded-lg shadow-[0_0_30px_rgba(34,211,238,0.35)]"
              style={{
                transform: `rotate45 rotateX(${parallaxY * 20}deg) rotateY(${parallaxX * 20}deg)`,
              }}
            />
            <div className="absolute w-8 h-8 border border-blue-400/60 rotate-12 rounded-md animate-spin duration-1000" />
            <div className="absolute w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_12px_cyan]" />
          </div>
        </div>

        {/* 3D LUMINESCENT FLOATING SPHERES (Multi-couleur Bleu Luminescent & Bleu Foncé) */}
        {/* Sphere 1: Electric Luminescent Cyan & Deep Navy (Top-Right) */}
        <div className="absolute top-[26%] right-[7%] sm:right-[12%] hidden sm:block pointer-events-none">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full orb-3d-cyan" />
          <div className="w-20 h-4 mx-auto mt-4 bg-cyan-400/25 rounded-full blur-md" />
        </div>

        {/* Sphere 2: Vibrant Sapphire & Midnight Indigo (Mid-Left) */}
        <div className="absolute top-[44%] left-[3%] sm:left-[6%] hidden sm:block pointer-events-none">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full orb-3d-sapphire" />
          <div className="w-16 h-4 mx-auto mt-3 bg-blue-500/25 rounded-full blur-md" />
        </div>

        {/* Sphere 3: Deep Abyssal Dark Blue with Luminescent Rim (Bottom-Right) */}
        <div className="absolute top-[76%] right-[5%] sm:right-[9%] hidden md:block pointer-events-none">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full orb-3d-deep" />
          <div className="w-24 h-5 mx-auto mt-4 bg-blue-600/30 rounded-full blur-lg" />
        </div>

        {/* Sphere 4: Mini Luminescent Beacon (Top-Left) */}
        <div className="absolute top-[10%] left-[22%] hidden lg:block pointer-events-none">
          <div className="w-9 h-9 rounded-full orb-3d-cyan opacity-80" />
        </div>

        {/* SCATTERED 3D LIGHT DUST PARTICLES */}
        <div className="absolute top-[25%] left-[22%] w-1.5 h-1.5 rounded-full bg-blue-300/70 shadow-[0_0_8px_#60a5fa] animate-ping duration-1000" />
        <div className="absolute top-[40%] right-[25%] w-1 h-1 rounded-full bg-cyan-300/80 shadow-[0_0_6px_#22d3ee] animate-pulse" />
        <div className="absolute top-[75%] left-[30%] w-2 h-2 rounded-full bg-indigo-400/60 shadow-[0_0_10px_#818cf8]" />
        <div className="absolute top-[82%] right-[18%] w-1.5 h-1.5 rounded-full bg-emerald-400/60 shadow-[0_0_8px_#34d399] animate-pulse" />
      </div>

      {/* 4. Ambient Radial Volumetric Gradient Mesh */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.14)_0%,rgba(14,30,74,0.06)_50%,transparent_75%)] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0%,transparent_70%)] blur-[120px] pointer-events-none" />
    </div>
  );
}
