import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import ScrollSmoother from 'gsap/ScrollSmoother';

// Register standard free plugins
gsap.registerPlugin(ScrollToPlugin);

/**
 * Ultra-performant, zero-overhead click/keyboard scrolling target jump.
 * Resolves to GSAP ScrollSmoother scrolling or window scrollTo fallback.
 */
export function scrollToTarget(target: string | number | HTMLElement, duration: number = 800, offset: number = -80) {
  const smoother = ScrollSmoother.get() || window.smootherInstance;
  
  if (smoother) {
    if (typeof target === 'number') {
      smoother.scrollTo(target, true);
    } else {
      // Use ScrollSmoother's native scrollTo with viewport position alignment.
      // Math.abs(offset) aligns the top of the element to e.g. 80px from the top of the viewport,
      // perfectly clearing our sticky navbar.
      const offsetPx = Math.abs(offset);
      smoother.scrollTo(target, true, `top ${offsetPx}px`);
    }
  } else {
    let targetY = 0;
    if (typeof target === 'number') {
      targetY = target;
    } else {
      let element: HTMLElement | null = null;
      if (typeof target === 'string') {
        const selector = target.startsWith('#') ? target : `#${target}`;
        element = document.querySelector(selector) as HTMLElement;
      } else if (target instanceof HTMLElement) {
        element = target;
      }
      
      if (element) {
        targetY = element.getBoundingClientRect().top + window.scrollY;
      } else {
        return;
      }
    }

    const finalY = targetY + offset;
    gsap.to(window, {
      scrollTo: { y: finalY, autoKill: true },
      duration: duration / 1000,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  }
}
