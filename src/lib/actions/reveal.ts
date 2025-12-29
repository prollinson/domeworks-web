/**
 * Scroll reveal action using IntersectionObserver
 * Elements slide up and fade in when they enter the viewport
 *
 * Usage: <div use:reveal> or <div use:reveal={{ delay: 200, stagger: true }}>
 */

interface RevealOptions {
  /** Delay before animation starts (ms) */
  delay?: number
  /** Duration of animation (ms) */
  duration?: number
  /** Distance to translate from (px) */
  distance?: number
  /** Whether to stagger children */
  stagger?: boolean
  /** Delay between staggered children (ms) */
  staggerDelay?: number
  /** Threshold for intersection (0-1) */
  threshold?: number
  /** Only animate once */
  once?: boolean
}

const defaultOptions: RevealOptions = {
  delay: 0,
  duration: 600,
  distance: 20,
  stagger: false,
  staggerDelay: 100,
  threshold: 0.1,
  once: true
}

export function reveal(node: HTMLElement, options: RevealOptions = {}) {
  const opts = { ...defaultOptions, ...options }

  // Set initial styles
  node.style.opacity = '0'
  node.style.transform = `translateY(${opts.distance}px)`
  node.style.transition = `opacity ${opts.duration}ms ease-out, transform ${opts.duration}ms ease-out`
  node.style.transitionDelay = `${opts.delay}ms`

  // If staggering, set up children
  if (opts.stagger) {
    const children = node.children
    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement
      child.style.opacity = '0'
      child.style.transform = `translateY(${opts.distance}px)`
      child.style.transition = `opacity ${opts.duration}ms ease-out, transform ${opts.duration}ms ease-out`
      child.style.transitionDelay = `${opts.delay! + (i * opts.staggerDelay!)}ms`
    }
    // Parent should be visible immediately if staggering children
    node.style.opacity = '1'
    node.style.transform = 'translateY(0)'
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (opts.stagger) {
            // Animate children
            const children = node.children
            for (let i = 0; i < children.length; i++) {
              const child = children[i] as HTMLElement
              child.style.opacity = '1'
              child.style.transform = 'translateY(0)'
            }
          } else {
            // Animate node itself
            node.style.opacity = '1'
            node.style.transform = 'translateY(0)'
          }

          if (opts.once) {
            observer.unobserve(node)
          }
        } else if (!opts.once) {
          // Reset if not once-only
          if (opts.stagger) {
            const children = node.children
            for (let i = 0; i < children.length; i++) {
              const child = children[i] as HTMLElement
              child.style.opacity = '0'
              child.style.transform = `translateY(${opts.distance}px)`
            }
          } else {
            node.style.opacity = '0'
            node.style.transform = `translateY(${opts.distance}px)`
          }
        }
      })
    },
    { threshold: opts.threshold }
  )

  observer.observe(node)

  return {
    destroy() {
      observer.disconnect()
    },
    update(newOptions: RevealOptions) {
      Object.assign(opts, newOptions)
    }
  }
}
