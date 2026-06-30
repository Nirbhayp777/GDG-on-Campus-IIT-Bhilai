import React from 'react';
import { motion } from 'motion/react';
import { scrollToTarget } from '../utils/scroll';
import HeroParticles from './HeroParticles';
import { GdgLogo } from './GdgLogo';
import MagneticButton from './MagneticButton';
import Parallax from './Parallax';
import ScrambleText from './ScrambleText';

export default function Hero() {
  const handleScrollToEvents = (e?: React.MouseEvent) => {
    e?.preventDefault();
    const element = document.getElementById('events');
    if (element) {
      scrollToTarget(element, 800, -85);
    }
  };

  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden bg-transparent"
    >
      {/* Animated Parallax Background spheres simulating 3D spatial depth */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Red sphere drifting up slowly */}
        <div className="absolute top-[20%] left-[8%] w-40 h-40">
          <Parallax speed={-60}>
            <div className="w-full h-full rounded-full bg-red-500/10 blur-[40px] md:blur-[60px]" />
          </Parallax>
        </div>
        
        {/* Blue sphere drifting down faster */}
        <div className="absolute top-[25%] right-[10%] w-56 h-56">
          <Parallax speed={50}>
            <div className="w-full h-full rounded-full bg-blue-500/10 blur-[60px] md:blur-[80px]" />
          </Parallax>
        </div>

        {/* Yellow glowing coin ball drifting up very subtle */}
        <div className="absolute bottom-[20%] left-[12%] w-32 h-32">
          <Parallax speed={-25}>
            <div className="w-full h-full rounded-full bg-yellow-500/10 blur-[35px] md:blur-[50px]" />
          </Parallax>
        </div>

        {/* Green ball drifting down slow */}
        <div className="absolute bottom-[25%] right-[15%] w-48 h-48">
          <Parallax speed={35}>
            <div className="w-full h-full rounded-full bg-green-500/10 blur-[50px] md:blur-[70px]" />
          </Parallax>
        </div>
      </div>

      {/* Interactive 3D Google Coloured dust particle backdrop */}
      <HeroParticles />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 pt-4 sm:pt-8 pb-4">
        <div className="flex flex-col items-center text-center space-y-5 -translate-y-10 sm:-translate-y-16">
          
          {/* Animated GDG Logo Stage - Made Static & Increased Size dramatically */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, cubicBezier: [0.16, 1, 0.3, 1] }}
            className="relative w-[450px] h-[250px] sm:w-[580px] sm:h-[320px] max-w-full flex items-center justify-center overflow-visible select-none -mt-8 -mb-10"
          >
            {/* Soft backdrop glow themed with Google Colors */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-red-500/5 to-yellow-500/5 rounded-full blur-3xl opacity-20 pointer-events-none" />
            
            <div 
              className="absolute transform scale-[0.9] sm:scale-[1.15] origin-center"
              style={{ width: 500, height: 320 }}
            >
              <GdgLogo activeState="logo" isHeroLogo={true} />
            </div>
          </motion.div>

          {/* Main Title with Google Sans feel */}
          <motion.div
            id="hero-title"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="space-y-4"
          >
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold text-white tracking-tight leading-none">
              <ScrambleText text="GDG on Campus" duration={1.2} /> <br />
              <span className="text-gradient-google">
                <ScrambleText text="IIT Bhilai" duration={1.2} delay={0.25} />
              </span>
            </h1>
            <p className="text-xs sm:text-sm font-sans font-medium text-gray-400 tracking-[0.12em] uppercase mt-2">
              Google Developer Groups • Indian Institute of Technology Bhilai
            </p>
          </motion.div>

          {/* Inspiring Quotes Carousel / Presentation */}
          <motion.div
            id="hero-quote-box"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.0, delay: 0.3 }}
            className="w-full max-w-md bg-[#141416]/10 backdrop-blur-md py-2.5 px-4 rounded-xl border border-white/20 shadow-sm relative group"
          >
            <p className="text-xs sm:text-sm font-sans italic text-gray-400 leading-relaxed font-semibold">
              Design. Develop. Deliver. Shaping the future of technology, together.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            id="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto -mx-4"
          >
            <div className="relative z-10">
              <MagneticButton
                label="Join our Chapter"
                link="https://gdg.community.dev/gdg-on-campus-indian-institute-of-technology-bhilai-india/"
                linkTarget="_blank"
                glass={true}
                textColor="#ffffff"
                showIcon={true}
                icon="arrow-up-right"
                iconSize={15}
                iconGap={8}
                iconAnimation="slide"
                borderRadius={100}
                padding="14px 28px"
                font={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                }}
                hover={{
                  backgroundColor: "#ffffff",
                  textColor: "#000000",
                  scale: 1.05,
                }}
                pressed={{
                  backgroundColor: "#ffffff",
                  textColor: "#000000",
                  scale: 0.95,
                }}
                hoverFill={true}
                hoverFillColor="#ffffff"
                magnetStrength={20}
                stiffness={160}
                damping={15}
              />
            </div>
            <div className="relative z-10">
              <MagneticButton
                label="Upcoming Events"
                onClick={handleScrollToEvents}
                glass={true}
                disableMagnet={true}
                textColor="#ffffff"
                showIcon={true}
                icon="calendar"
                iconSize={15}
                iconGap={8}
                iconAnimation="bounce"
                borderRadius={100}
                padding="14px 28px"
                font={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                }}
                hover={{
                  backgroundColor: "#ffffff",
                  textColor: "#000000",
                  scale: 1.05,
                }}
                pressed={{
                  backgroundColor: "#ffffff",
                  textColor: "#000000",
                  scale: 0.95,
                }}
                hoverFill={true}
                hoverFillColor="#ffffff"
                magnetStrength={20}
                stiffness={160}
                damping={15}
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
