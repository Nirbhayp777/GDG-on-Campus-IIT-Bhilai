import React from 'react';
import { motion } from 'motion/react';

export interface GdgLogoProps {
  activeState?: 'dots' | 'logo';
  duration?: number;
  isHeroLogo?: boolean;
}

export const GdgLogo: React.FC<GdgLogoProps> = ({ 
  activeState = 'dots', 
  duration = 1.2,
  isHeroLogo = false
}) => {
  // Constant measurements optimized & approved by the user
  const cx = 250;
  const cy = 160;
  const barThickness = 24;
  const pillWidth = 80;
  const vertexDistance = 70; // Half of 140px separation gap
  const legAngle = 30; // degrees
  const dotGap = 40; // spacing pitch

  // Framer motion Spring stiffness/damping configs
  const springTransition = {
    type: 'spring',
    stiffness: 100,
    damping: 12,
    mass: 0.8,
    duration: duration,
  };

  // Coordinates definitions
  const startLeftBlue = cx - 1.5 * dotGap - barThickness / 2;     // 178px
  const endLeftBlue = cx - vertexDistance - barThickness / 2;     // 168px

  const startLeftRed = cx - 0.5 * dotGap - barThickness / 2;      // 218px
  const endLeftRed = cx - vertexDistance - barThickness / 2;      // 168px

  const startLeftYellow = cx + 0.5 * dotGap - barThickness / 2;   // 258px
  const endLeftYellow = cx + vertexDistance - pillWidth + barThickness / 2; // 252px

  const startLeftGreen = cx + 1.5 * dotGap - barThickness / 2;    // 298px
  const endLeftGreen = cx + vertexDistance - pillWidth + barThickness / 2;  // 252px

  const isLogo = activeState === 'logo';

  // Opacity transitions for pulsing effect when in dots state
  const getTransition = (delay: number) => ({
    ...springTransition,
    opacity: isLogo
      ? { duration: 0.3 }
      : {
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
          delay: delay,
        }
  });

  return (
    <div className="relative w-[500px] h-[320px] mx-auto select-none bg-transparent flex items-center justify-center">
      
      {/* 1. RED BAR (Transforms into Left-bracket Top-leg) */}
      <motion.div
        style={{
          position: 'absolute',
          top: cy - barThickness / 2,
          height: barThickness,
          backgroundColor: '#EA4335',
          transformOrigin: `${barThickness / 2}px center`,
          zIndex: 10,
        }}
        animate={{
          left: isLogo ? endLeftRed : startLeftRed,
          width: isLogo ? pillWidth : barThickness,
          rotate: isLogo ? -legAngle : 0,
          borderRadius: barThickness / 2,
          opacity: isLogo ? 1 : [0.4, 1, 0.4],
        }}
        transition={getTransition(0.2)}
      />

      {/* 2. BLUE BAR (Transforms into Left-bracket Bottom-leg) */}
      <motion.div
        style={{
          position: 'absolute',
          top: cy - barThickness / 2,
          height: barThickness,
          backgroundColor: '#4285F4',
          transformOrigin: `${barThickness / 2}px center`,
          zIndex: 20,
        }}
        animate={{
          left: isLogo ? endLeftBlue : startLeftBlue,
          width: isLogo ? pillWidth : barThickness,
          rotate: isLogo ? legAngle : 0,
          borderRadius: barThickness / 2,
          opacity: isLogo ? 1 : [0.4, 1, 0.4],
        }}
        transition={getTransition(0)}
      />

      {/* 3. YELLOW BAR (Transforms into Right-bracket Bottom-leg) */}
      <motion.div
        style={{
          position: 'absolute',
          top: cy - barThickness / 2,
          height: barThickness,
          backgroundColor: '#FBBC05',
          transformOrigin: `calc(100% - ${barThickness / 2}px) center`,
          zIndex: 10,
        }}
        animate={{
          left: isLogo ? endLeftYellow : startLeftYellow,
          width: isLogo ? pillWidth : barThickness,
          rotate: isLogo ? -legAngle : 0,
          borderRadius: barThickness / 2,
          opacity: isLogo ? 1 : [0.4, 1, 0.4],
        }}
        transition={getTransition(0.4)}
      />

      {/* 4. GREEN BAR (Transforms into Right-bracket Top-leg) */}
      <motion.div
        style={{
          position: 'absolute',
          top: cy - barThickness / 2,
          height: barThickness,
          backgroundColor: '#34A853',
          transformOrigin: `calc(100% - ${barThickness / 2}px) center`,
          zIndex: 20,
        }}
        animate={{
          left: isLogo ? endLeftGreen : startLeftGreen,
          width: isLogo ? pillWidth : barThickness,
          rotate: isLogo ? legAngle : 0,
          borderRadius: barThickness / 2,
          opacity: isLogo ? 1 : [0.4, 1, 0.4],
        }}
        transition={getTransition(0.6)}
      />
    </div>
  );
};
