import React from 'react';
import { motion, type Variants } from 'motion/react';

export type TextRevealEffect = 'words' | 'lift' | 'glow' | 'slide-up' | 'shimmer';

interface TextRevealProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  delay?: number;
  duration?: number;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  effect?: TextRevealEffect;
  once?: boolean;
}

export default function TextReveal({
  children,
  id,
  className = '',
  delay = 0,
  duration = 0.6,
  as: Component = 'div',
  effect = 'lift',
  once = true,
}: TextRevealProps) {
  const isString = typeof children === 'string';

  // Word-by-word cascading reveal
  if (isString && effect === 'words') {
    const words = (children as string).trim().split(/\s+/);
    return (
      <Component id={id} className={`${className} inline-block`}>
        <motion.span
          initial="hidden"
          whileInView="visible"
          viewport={{ once, amount: 0.1 }}
          transition={{ staggerChildren: 0.045, delayChildren: delay }}
          className="inline-block"
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              variants={{
                hidden: {
                  opacity: 0,
                  y: 20,
                  filter: 'blur(6px)',
                  scale: 0.94,
                  transition: { duration: 0.18, ease: [0, 0, 0.2, 1] },
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  scale: 1,
                  transition: {
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  },
                },
              }}
              className="inline-block mr-[0.28em] will-change-transform"
            >
              {word}
            </motion.span>
          ))}
        </motion.span>
      </Component>
    );
  }

  // Pre-configured dynamic effects for typography
  const variantsMap: Record<Exclude<TextRevealEffect, 'words'>, Variants> = {
    lift: {
      hidden: {
        opacity: 0,
        y: 26,
        filter: 'blur(8px)',
        scale: 0.97,
        transition: { duration: 0.2, ease: [0, 0, 0.2, 1] },
      },
      visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        scale: 1,
        transition: {
          duration,
          delay,
          ease: [0.16, 1, 0.3, 1],
        },
      },
    },
    'slide-up': {
      hidden: {
        opacity: 0,
        y: 35,
        filter: 'blur(5px)',
        transition: { duration: 0.2, ease: [0, 0, 0.2, 1] },
      },
      visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
          duration,
          delay,
          ease: [0.2, 1, 0.3, 1],
        },
      },
    },
    glow: {
      hidden: {
        opacity: 0,
        y: 18,
        filter: 'blur(10px) brightness(1.6)',
        transition: { duration: 0.2, ease: [0, 0, 0.2, 1] },
      },
      visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px) brightness(1)',
        transition: {
          duration,
          delay,
          ease: [0.16, 1, 0.3, 1],
        },
      },
    },
    shimmer: {
      hidden: {
        opacity: 0,
        y: 20,
        filter: 'blur(6px)',
        letterSpacing: '0.04em',
        transition: { duration: 0.2, ease: [0, 0, 0.2, 1] },
      },
      visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        letterSpacing: '0em',
        transition: {
          duration: duration * 1.1,
          delay,
          ease: [0.16, 1, 0.3, 1],
        },
      },
    },
  };

  const selectedVariant = (effect !== 'words' && variantsMap[effect]) ? variantsMap[effect] : variantsMap.lift;
  const MotionComponent = motion[Component] || motion.div;

  return (
    <MotionComponent
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.1 }}
      variants={selectedVariant}
      className={`${className} will-change-transform`}
    >
      {children}
    </MotionComponent>
  );
}
