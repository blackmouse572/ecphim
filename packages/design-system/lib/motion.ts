/**
 * EcPhim Motion System
 * 
 * High-impact animation presets focused on orchestrated page loads
 * and smooth transitions. One well-orchestrated moment beats
 * scattered micro-interactions.
 */

import type { Variants, Transition } from 'motion/react';

// Base timing curves for cinematic feel
export const easings = {
  // Smooth, elegant ease for most animations
  smooth: [0.4, 0, 0.2, 1] as const,
  // Snappy entrance with gentle settle
  entrance: [0, 0, 0.2, 1] as const,
  // Quick exit
  exit: [0.4, 0, 1, 1] as const,
  // Bouncy, playful feel
  bounce: [0.34, 1.56, 0.64, 1] as const,
  // Sharp, immediate response
  sharp: [0.4, 0, 0.6, 1] as const,
} as const;

// Duration presets (in seconds)
export const durations = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
  cinematic: 1.2,
} as const;

// Stagger delay for orchestrated reveals
export const stagger = {
  fast: 0.05,
  normal: 0.1,
  slow: 0.15,
  dramatic: 0.2,
} as const;

// Default transition preset
export const defaultTransition: Transition = {
  duration: durations.normal,
  ease: easings.smooth,
};

// ============================================
// FADE VARIANTS
// ============================================

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: durations.normal, ease: easings.smooth }
  },
  exit: { 
    opacity: 0,
    transition: { duration: durations.fast, ease: easings.exit }
  }
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: durations.normal, ease: easings.entrance }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { duration: durations.fast, ease: easings.exit }
  }
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: durations.normal, ease: easings.entrance }
  },
  exit: { 
    opacity: 0, 
    y: 10,
    transition: { duration: durations.fast, ease: easings.exit }
  }
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: durations.normal, ease: easings.entrance }
  },
  exit: { 
    opacity: 0, 
    x: 20,
    transition: { duration: durations.fast, ease: easings.exit }
  }
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: durations.normal, ease: easings.entrance }
  },
  exit: { 
    opacity: 0, 
    x: -20,
    transition: { duration: durations.fast, ease: easings.exit }
  }
};

// ============================================
// SCALE VARIANTS
// ============================================

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: durations.normal, ease: easings.entrance }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: durations.fast, ease: easings.exit }
  }
};

export const scaleInBounce: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: durations.slow, ease: easings.bounce }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    transition: { duration: durations.fast, ease: easings.exit }
  }
};

// ============================================
// SLIDE VARIANTS
// ============================================

export const slideInUp: Variants = {
  hidden: { y: '100%' },
  visible: { 
    y: 0,
    transition: { duration: durations.slow, ease: easings.smooth }
  },
  exit: { 
    y: '100%',
    transition: { duration: durations.normal, ease: easings.exit }
  }
};

export const slideInDown: Variants = {
  hidden: { y: '-100%' },
  visible: { 
    y: 0,
    transition: { duration: durations.slow, ease: easings.smooth }
  },
  exit: { 
    y: '-100%',
    transition: { duration: durations.normal, ease: easings.exit }
  }
};

export const slideInLeft: Variants = {
  hidden: { x: '-100%' },
  visible: { 
    x: 0,
    transition: { duration: durations.slow, ease: easings.smooth }
  },
  exit: { 
    x: '-100%',
    transition: { duration: durations.normal, ease: easings.exit }
  }
};

export const slideInRight: Variants = {
  hidden: { x: '100%' },
  visible: { 
    x: 0,
    transition: { duration: durations.slow, ease: easings.smooth }
  },
  exit: { 
    x: '100%',
    transition: { duration: durations.normal, ease: easings.exit }
  }
};

// ============================================
// STAGGERED CONTAINER VARIANTS
// ============================================

/**
 * Use as parent container for staggered children animations.
 * Children should use `item` variants.
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: (delay = 0.1) => ({
    opacity: 1,
    transition: {
      staggerChildren: stagger.normal,
      delayChildren: delay,
    }
  }),
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: stagger.fast,
      staggerDirection: -1,
    }
  }
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger.fast,
      delayChildren: 0.05,
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    }
  }
};

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger.slow,
      delayChildren: 0.2,
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: stagger.fast,
      staggerDirection: -1,
    }
  }
};

// Stagger item variants (use with staggerContainer)
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: durations.normal, ease: easings.entrance }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { duration: durations.fast }
  }
};

export const staggerItemScale: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: durations.normal, ease: easings.entrance }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: durations.fast }
  }
};

export const staggerItemLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: durations.normal, ease: easings.entrance }
  },
  exit: { 
    opacity: 0, 
    x: 30,
    transition: { duration: durations.fast }
  }
};

// ============================================
// PAGE TRANSITION VARIANTS
// ============================================

export const pageTransition: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    filter: 'blur(4px)',
  },
  visible: { 
    opacity: 1, 
    y: 0,
    filter: 'blur(0px)',
    transition: { 
      duration: durations.slow, 
      ease: easings.smooth,
      staggerChildren: stagger.normal,
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    filter: 'blur(4px)',
    transition: { duration: durations.normal, ease: easings.exit }
  }
};

// Hero section with dramatic entrance
export const heroReveal: Variants = {
  hidden: { 
    opacity: 0, 
    y: 60,
    scale: 0.98,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      duration: durations.slower, 
      ease: easings.entrance,
    }
  },
};

// ============================================
// INTERACTIVE VARIANTS
// ============================================

export const hoverScale = {
  scale: 1.02,
  transition: { duration: durations.fast, ease: easings.sharp }
};

export const hoverLift = {
  y: -4,
  transition: { duration: durations.fast, ease: easings.sharp }
};

export const tapScale = {
  scale: 0.98,
  transition: { duration: durations.instant }
};

export const buttonHover: Variants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.02,
    transition: { duration: durations.fast, ease: easings.sharp }
  },
  tap: { 
    scale: 0.98,
    transition: { duration: durations.instant }
  }
};

export const cardHover: Variants = {
  rest: { 
    y: 0,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  },
  hover: { 
    y: -6,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    transition: { duration: durations.normal, ease: easings.smooth }
  },
};

// ============================================
// LOADING STATES
// ============================================

export const pulseAnimation: Variants = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    }
  }
};

export const spinAnimation: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    }
  }
};

export const skeletonShimmer: Variants = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'linear',
    }
  }
};

// ============================================
// MODAL/SHEET VARIANTS
// ============================================

export const modalOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: durations.fast }
  },
  exit: { 
    opacity: 0,
    transition: { duration: durations.fast, delay: 0.1 }
  }
};

export const modalContent: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
    y: 20,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: { 
      duration: durations.normal, 
      ease: easings.entrance,
      delay: 0.05,
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    y: 10,
    transition: { duration: durations.fast, ease: easings.exit }
  }
};

export const sheetContent: Variants = {
  hidden: { x: '100%' },
  visible: { 
    x: 0,
    transition: { 
      duration: durations.normal, 
      ease: easings.smooth,
    }
  },
  exit: { 
    x: '100%',
    transition: { duration: durations.fast, ease: easings.exit }
  }
};

export const drawerContent: Variants = {
  hidden: { y: '100%' },
  visible: { 
    y: 0,
    transition: { 
      duration: durations.normal, 
      ease: easings.smooth,
    }
  },
  exit: { 
    y: '100%',
    transition: { duration: durations.fast, ease: easings.exit }
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Create custom stagger delay for individual items
 * @param index - Item index in the list
 * @param baseDelay - Base delay before stagger starts
 * @param staggerDelay - Delay between each item
 */
export const getStaggerDelay = (
  index: number, 
  baseDelay = 0.1, 
  staggerDelay = stagger.normal
): number => {
  return baseDelay + (index * staggerDelay);
};

/**
 * Create transition with custom delay
 */
export const withDelay = (delay: number, transition: Transition = defaultTransition): Transition => ({
  ...transition,
  delay,
});
