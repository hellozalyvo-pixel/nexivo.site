import React from 'react';
import { motion, type HTMLMotionProps, type Variants } from 'motion/react';

export type ScrollRevealVariant = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';

interface ScrollRevealProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
  duration?: number;
  variant?: ScrollRevealVariant;
  blur?: boolean;
  once?: boolean;
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  yOffset = 30,
  duration = 0.6,
  variant = 'up',
  blur = true,
  once = true, // Critical: elements stay permanently visible once scrolled into view
  ...props
}: ScrollRevealProps) {
  const getInitialY = () => {
    if (variant === 'up') return yOffset;
    if (variant === 'down') return -yOffset;
    if (variant === 'scale') return yOffset * 0.35;
    return 0;
  };

  const getInitialX = () => {
    if (variant === 'left') return yOffset;
    if (variant === 'right') return -yOffset;
    return 0;
  };

  const variants: Variants = {
    hidden: {
      opacity: 0,
      filter: blur ? 'blur(8px)' : 'none',
      y: getInitialY(),
      x: getInitialX(),
      scale: variant === 'scale' ? 0.94 : 1,
    },
    visible: {
      opacity: 1,
      filter: blur ? 'blur(0px)' : 'none',
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.08 }}
      variants={variants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
