// Modern animation variants inspired by Apple/Microsoft design systems
export const pageTransitionVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

export const staggerContainerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

export const staggerItemVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } }
}

export const fadeInUpVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

export const scaleInVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
}

export const slideInFromLeftVariants = {
  initial: { opacity: 0, x: -40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5 } }
}

export const slideInFromRightVariants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5 } }
}

// Transition presets (Apple standard: 0.2s)
export const smoothTransition = 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)'
export const springTransition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
export const delayedTransition = 'all 0.35s cubic-bezier(0.4, 0.0, 0.2, 1)'
