export default function HolographicPedestal() {
  return (
    <div
      id="holo-cyber-pedestal"
      className="absolute -bottom-24 sm:-bottom-28 left-1/2 -translate-x-1/2 w-[120%] max-w-5xl h-64 pointer-events-none select-none -z-10 flex items-center justify-center"
      style={{ perspective: '1000px' }}
      aria-hidden="true"
    >
      {/* 1. Upward Hologram Projection Cone / Vertical Light Curtain */}
      <div className="absolute bottom-20 w-[85%] h-56 holo-beam-upward pointer-events-none" />

      {/* Upward Laser Guideline Beams */}
      <div className="absolute bottom-20 left-[15%] w-[1.5px] h-48 bg-gradient-to-t from-cyan-400/80 via-blue-500/40 to-transparent shadow-[0_0_12px_#22d3ee]" />
      <div className="absolute bottom-20 right-[15%] w-[1.5px] h-48 bg-gradient-to-t from-cyan-400/80 via-blue-500/40 to-transparent shadow-[0_0_12px_#22d3ee]" />
      <div className="absolute bottom-20 left-[30%] w-[1px] h-36 bg-gradient-to-t from-cyan-300/60 to-transparent shadow-[0_0_8px_#38bdf8]" />
      <div className="absolute bottom-20 right-[30%] w-[1px] h-36 bg-gradient-to-t from-cyan-300/60 to-transparent shadow-[0_0_8px_#38bdf8]" />

      {/* 2. Concentric Layered 3D Holographic Platform (Tilted horizontally at 76deg) */}
      <div
        className="relative w-full h-full flex items-center justify-center holo-laser-pulse"
        style={{ transform: 'rotateX(76deg) translateZ(0)' }}
      >
        {/* Tier 1: Wide Ambient Floor Flare */}
        <div className="absolute w-[110%] h-[110%] rounded-full bg-gradient-to-r from-blue-600/30 via-cyan-400/35 to-indigo-600/30 blur-2xl holo-shadow-pulse" />

        {/* Tier 2: Extreme Outer Laser Perimeter */}
        <div className="absolute w-[102%] h-[102%] rounded-full border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.4)]" />

        {/* Tier 3: Outer Rotating HUD Ring (Clockwise) with dashed brackets */}
        <div className="absolute w-[94%] h-[94%] rounded-full border-2 border-dashed border-cyan-400/70 holo-spin-cw shadow-[0_0_30px_rgba(34,211,238,0.7)] flex items-center justify-center">
          {/* Tech markers on 4 poles */}
          <div className="absolute top-0 w-3 h-3 -translate-y-1/2 bg-cyan-300 rounded-full shadow-[0_0_15px_#22d3ee]" />
          <div className="absolute bottom-0 w-3 h-3 translate-y-1/2 bg-cyan-300 rounded-full shadow-[0_0_15px_#22d3ee]" />
          <div className="absolute left-0 h-3 w-3 -translate-x-1/2 bg-blue-400 rounded-full shadow-[0_0_15px_#60a5fa]" />
          <div className="absolute right-0 h-3 w-3 translate-x-1/2 bg-blue-400 rounded-full shadow-[0_0_15px_#60a5fa]" />
        </div>

        {/* Tier 4: Mid Reverse-Rotating Circuit Ring (Counter-Clockwise) */}
        <div className="absolute w-[80%] h-[80%] rounded-full border border-blue-400/60 holo-spin-ccw shadow-[0_0_25px_rgba(59,130,246,0.6)] flex items-center justify-center">
          <div className="absolute inset-2 rounded-full border border-dashed border-indigo-400/40" />
          <div className="absolute top-2 left-1/4 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]" />
          <div className="absolute bottom-2 right-1/4 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]" />
        </div>

        {/* Tier 5: High-Intensity Glowing Inner Laser Ring */}
        <div className="absolute w-[64%] h-[64%] rounded-full border-2 border-cyan-300 shadow-[0_0_40px_rgba(6,182,212,0.9),inset_0_0_30px_rgba(6,182,212,0.6)]" />

        {/* Tier 6: Central Laser Core Disc & Crosshair */}
        <div className="absolute w-[44%] h-[44%] rounded-full bg-gradient-to-r from-blue-500/40 via-cyan-300/60 to-blue-600/40 shadow-[0_0_40px_rgba(34,211,238,0.9)] flex items-center justify-center">
          {/* Laser Crosshairs */}
          <div className="w-full h-[1.5px] bg-cyan-200/80 shadow-[0_0_10px_white]" />
          <div className="absolute h-full w-[1.5px] bg-cyan-200/80 shadow-[0_0_10px_white]" />
          <div className="absolute w-6 h-6 rounded-full bg-white shadow-[0_0_20px_#22d3ee] animate-pulse" />
        </div>
      </div>

      {/* 3. Floating Light Particles / Rising Energy Sparks */}
      <div className="absolute bottom-16 left-[22%] w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_#22d3ee] animate-bounce duration-700" />
      <div className="absolute bottom-24 right-[24%] w-2 h-2 rounded-full bg-blue-300 shadow-[0_0_12px_#60a5fa] animate-pulse" />
      <div className="absolute bottom-28 left-[38%] w-1 h-1 rounded-full bg-white shadow-[0_0_8px_white] animate-ping" />
      <div className="absolute bottom-20 right-[42%] w-1.5 h-1.5 rounded-full bg-cyan-200 shadow-[0_0_10px_#67e8f9] animate-pulse" />
      <div className="absolute bottom-32 left-[48%] w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_14px_#22d3ee] animate-bounce duration-1000" />

      {/* 4. Cyber HUD Pedestal Status Labels */}
      <div className="absolute -bottom-4 left-6 hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 tracking-wider shadow-lg shadow-black/50 backdrop-blur-md">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        <span>HOLO-PEDESTAL // LEVITATION ON</span>
      </div>

      <div className="absolute -bottom-4 right-6 hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-[10px] font-mono text-blue-300 tracking-wider shadow-lg shadow-black/50 backdrop-blur-md">
        <span>QUANTUM CORE // 3D MATRIX</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
      </div>
    </div>
  );
}
