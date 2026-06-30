import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger to guarantee it is active for this component's lifecycle
gsap.registerPlugin(ScrollTrigger);

interface ParallaxProps {
  children: React.ReactNode;
  speed?: number; // Distance in pixels to animate (e.g., -100 yields natural upward lag, 100 pushes downward)
  fromY?: number; // Custom starting Y transform
  toY?: number;   // Custom ending Y transform
  className?: string; // Standard styling classes
  style?: React.CSSProperties; // Standard style binding
  startHook?: string; // Trigger start (default: "top bottom" -> starts animating as soon as scroll enters viewport)
  endHook?: string; // Trigger end (default: "bottom top" -> completes animation as item leaves viewport)
  key?: React.Key; // React identification key
}

/**
 * Parallax wraps any interactive element or layout block and applies high-efficiency, 
 * hardware-accelerated (translate3d) scroll positions without breaking native layouts.
 */
export default function Parallax({ 
  children, 
  speed = 50, 
  fromY,
  toY,
  className = '', 
  style, 
  startHook = 'top bottom', 
  endHook = 'bottom top'
}: ParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const target = targetRef.current;
    if (!container || !target) return;

    const startY = fromY !== undefined ? fromY : -speed;
    const endY = toY !== undefined ? toY : speed;

    // Direct hardware accelerated translation bound to window scroll percentage
    const animation = gsap.fromTo(target,
      { y: startY },
      {
        y: endY,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: startHook,
          end: endHook,
          scrub: 1.0, // Mild dampening (1.0s catchup) to guarantee silky fluid motion
          invalidateOnRefresh: true,
        }
      }
    );

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, [speed, fromY, toY, startHook, endHook]);

  return (
    <div 
      ref={containerRef} 
      className={`relative overflow-visible ${className}`} 
      style={style}
    >
      <div ref={targetRef} className="w-full h-full will-change-transform">
        {children}
      </div>
    </div>
  );
}
