import * as React from 'react';
import { gsap } from 'gsap';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltFactor?: number;
  perspective?: number;
  borderRadius?: number;
  backgroundColor?: string;
  shadowColor?: string;
  shadowIntensity?: number;
  transitionDuration?: number;
  hoverScale?: number;
  glareEffect?: boolean;
  glareIntensity?: number;
  glarePosition?: number;
  glareSize?: number;
}

export default function TiltCard({
  children,
  className = '',
  tiltFactor = 12,
  perspective = 1000,
  borderRadius = 24,
  backgroundColor = 'transparent',
  shadowColor = 'rgba(0, 0, 0, 0.3)',
  shadowIntensity = 0.4,
  transitionDuration = 0.3,
  hoverScale = 1.03,
  glareEffect = true,
  glareIntensity = 0.15,
  glareSize = 75,
}: TiltCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const innerRef = React.useRef<HTMLDivElement>(null);
  const glareRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const card = cardRef.current;
    const inner = innerRef.current;
    const glare = glareRef.current;
    if (!card || !inner) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();

      // Calculate mouse position relative to card center (in percentage, -0.5 to 0.5)
      const xPct = (e.clientX - rect.left) / rect.width - 0.5;
      const yPct = (e.clientY - rect.top) / rect.height - 0.5;

      // Calculate tilt values based on mouse position
      const tiltX = -yPct * tiltFactor;
      const tiltY = xPct * tiltFactor;

      // Smoothly tilt using hardware-accelerated GSAP transforms
      gsap.to(inner, {
        rotateX: tiltX,
        rotateY: tiltY,
        boxShadow: `0 25px 50px -12px rgba(0, 0, 0, ${shadowIntensity})`,
        duration: transitionDuration,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      // Update glare position smoothly
      if (glare) {
        const glareX = 50 + xPct * 100;
        const glareY = 50 + yPct * 100;
        glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, ${glareIntensity}) 0%, rgba(255, 255, 255, 0) ${glareSize}%)`;
      }
    };

    const handleMouseEnter = () => {
      // Scale up outer card smoothly on hover
      gsap.to(card, {
        scale: hoverScale,
        duration: transitionDuration,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      // Show glare smoothly
      if (glare) {
        gsap.to(glare, {
          opacity: 1,
          duration: transitionDuration,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }

      card.addEventListener('mousemove', handleMouseMove);
    };

    const handleMouseLeave = () => {
      card.removeEventListener('mousemove', handleMouseMove);

      // Return card to center smoothly
      gsap.to(inner, {
        rotateX: 0,
        rotateY: 0,
        boxShadow: `0 10px 30px -10px ${shadowColor}`,
        duration: transitionDuration + 0.15,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      // Scale back to normal
      gsap.to(card, {
        scale: 1,
        duration: transitionDuration + 0.15,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      // Fade out glare
      if (glare) {
        gsap.to(glare, {
          opacity: 0,
          duration: transitionDuration + 0.15,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
      card.removeEventListener('mousemove', handleMouseMove);
    };
  }, [tiltFactor, transitionDuration, hoverScale, glareIntensity, glareSize, shadowIntensity, shadowColor]);

  return (
    <div
      ref={cardRef}
      className={`relative w-full h-full ${className}`}
      style={{
        perspective: `${perspective}px`,
        transformStyle: 'preserve-3d',
        borderRadius: `${borderRadius}px`,
        willChange: 'transform',
      }}
    >
      <div
        ref={innerRef}
        className="w-full h-full relative"
        style={{
          borderRadius: `${borderRadius}px`,
          backgroundColor,
          transformStyle: 'preserve-3d',
          boxShadow: `0 10px 30px -10px ${shadowColor}`,
          willChange: 'transform',
        }}
      >
        {/* Children Render */}
        <div className="w-full h-full relative z-10">
          {children}
        </div>

        {/* Glare effect overlay */}
        {glareEffect && (
          <div
            ref={glareRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 2,
              borderRadius: `${borderRadius}px`,
              opacity: 0,
              pointerEvents: 'none',
              background: `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) ${glareSize}%)`,
              willChange: 'opacity, background',
            }}
          />
        )}
      </div>
    </div>
  );
}
