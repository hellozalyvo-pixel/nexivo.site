import { motion, useScroll, useSpring } from 'motion/react';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Background track */}
      <div className="absolute inset-0 bg-white/[0.04]" />

      {/* Animated gradient progress bar */}
      <motion.div
        className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 origin-left shadow-[0_0_14px_rgba(6,182,212,0.9)]"
        style={{ scaleX }}
      />
    </div>
  );
}
