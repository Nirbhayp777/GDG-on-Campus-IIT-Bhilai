import { useState, useEffect, useRef } from 'react';
import { Smartphone, Layers, Cloud, BrainCircuit, Globe, Database, Target, Code, Network, Users, LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { techStack } from '../data';
import ScrambleText from './ScrambleText';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, LucideIcon> = {
  Smartphone: Smartphone,
  Layers: Layers,
  Cloud: Cloud,
  BrainCircuit: BrainCircuit,
  Globe: Globe,
  Database: Database,
};

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const cards = cardsRef.current.filter((el): el is HTMLDivElement => el !== null);
    if (cards.length === 0) return;

    let mm: any;

    const initScrollTrigger = () => {
      mm = gsap.matchMedia();

      // Set initial layover states for cards 1, 2, 3
      gsap.set(cards.slice(1), {
        y: 320,
        opacity: 0,
        scale: 0.92,
      });

      // Desktop: Pin entire about section while stacking cards
      mm.add("(min-width: 1024px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80px',
            end: `+=${cards.length * 210}`,
            pin: true,
            pinSpacing: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          }
        });

        cards.forEach((card, idx) => {
          if (idx === 0) return;

          tl.to(card, {
            y: idx * 16,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: 'none',
          }, `card-${idx}`);

          for (let j = 0; j < idx; j++) {
            tl.to(cards[j], {
              scale: 1 - (idx - j) * 0.035,
              y: j * 16 - (idx - j) * 6,
              duration: 1,
              ease: 'none',
            }, `card-${idx}`);
          }
        });
      });

      // Mobile/Tablet: Scroll reveal stacking without pinning
      mm.add("(max-width: 1023px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: cardsContainerRef.current,
            start: 'top 75%',
            end: 'bottom 40%',
            scrub: true,
          }
        });

        cards.forEach((card, idx) => {
          if (idx === 0) return;

          tl.to(card, {
            y: idx * 12,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: 'none',
          }, `card-${idx}`);

          for (let j = 0; j < idx; j++) {
            tl.to(cards[j], {
              scale: 1 - (idx - j) * 0.03,
              y: j * 12 - (idx - j) * 4,
              duration: 1,
              ease: 'none',
            }, `card-${idx}`);
          }
        });
      });

      ScrollTrigger.refresh();
    };

    // Delay initialization to let the parent component's ScrollSmoother.create call complete first
    const timer = setTimeout(() => {
      initScrollTrigger();
    }, 200);

    return () => {
      clearTimeout(timer);
      if (mm) {
        mm.revert();
      }
    };
  }, []);

  const objectives = [
    {
      title: 'Developer Curation',
      desc: 'We empower students through regular hands-on workshops, peer-led mentoring, and intense developer hackathons.',
      icon: Code,
    },
    {
      title: 'Ecosystem Integration',
      desc: 'We connect students directly with industry experts, official Google Cloud tracks, and global tech pathways.',
      icon: Network,
    },
    {
      title: 'Real-World Impact',
      desc: 'We build functional, tangible software solutions to tackle complex, real-world community challenges.',
      icon: Target,
    },
    {
      title: 'Vibrant Collaboration',
      desc: 'We foster an open, inclusive workspace for engineers to brainstorm, build prototypes, and scale their ideas.',
      icon: Users,
    }
  ];

  return (
    <section ref={sectionRef} id="about" className="relative pt-12 pb-12 overflow-hidden bg-black">
      
      {/* Background Glow */}
      <div className="absolute top-1/3 left-10 w-80 h-80 bg-brand-blue/10 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-left mb-16 max-w-4xl">
          <h2 className="text-4xl sm:text-6xl font-display font-extrabold text-white leading-none">
            <ScrambleText text="Who We Are & What We Do" />
          </h2>
          <div className="h-1.5 w-24 bg-gradient-to-r from-brand-blue via-brand-red to-brand-green mt-6 rounded-full" />
          
          {/* Condensed Core Community Paragraph - Out in the open under the title */}
          <p className="text-lg sm:text-xl font-sans font-normal text-zinc-300 mt-8 leading-relaxed">
            We are the primary student-led developer network at IIT Bhilai, bridging the gap between computer science theory and real-world system deployments using Google technologies.
          </p>
        </div>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left panel: 4 Objectives stacked / grid */}
          <div className="lg:col-span-7 space-y-8">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
                <ScrambleText text="Our Core Objectives" />
              </h3>
            </div>
            
            <div className="relative w-full pb-16">
              <div 
                ref={cardsContainerRef}
                className="relative w-full h-[280px] sm:h-[320px]"
              >
                {objectives.map((obj, idx) => {
                  const ObjIcon = obj.icon;
                  return (
                    <div
                      key={obj.title}
                      ref={(el) => {
                        if (el) cardsRef.current[idx] = el;
                      }}
                      className="absolute inset-x-0 top-0 w-full h-full group bg-[#09090b] border border-zinc-800 p-6 sm:p-8 rounded-xl flex flex-col items-center text-center justify-center hover:border-[#4285F4]/80 hover:shadow-[0_0_40px_rgba(66,133,244,0.22)] transition-[border-color,box-shadow] duration-500 overflow-hidden"
                      style={{ 
                        zIndex: idx,
                      }}
                    >
                      {/* Default subtle grey top-left radial spotlight */}
                      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_55%)] pointer-events-none" />

                      {/* Hover Google Blue top-left radial spotlight */}
                      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,rgba(66,133,244,0.32),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      <div className="relative z-10 flex flex-col items-center w-full">
                        {/* Minimalist icon container */}
                        <div className="mb-4 sm:mb-6 text-zinc-500 group-hover:text-[#4285F4] transition-colors duration-500">
                          <ObjIcon size={42} strokeWidth={1.25} />
                        </div>

                        {/* Title */}
                        <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2 sm:mb-4">
                          {obj.title}
                        </h4>

                        {/* Description */}
                        <p className="text-xs sm:text-base font-semibold text-zinc-200 group-hover:text-zinc-100 transition-colors duration-300 leading-relaxed max-w-sm sm:max-w-xs">
                          {obj.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right panel: Rotating Tech Wheel popping out from the right */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-end relative pt-8 lg:pt-0 lg:self-stretch lg:mt-auto">
            <RotatingTechWheel />
          </div>

        </div>
      </div>
    </section>
  );
}

function RotatingTechWheel() {
  const [angle, setAngle] = useState(0);
  const [hoveredTech, setHoveredTech] = useState<typeof techStack[0] | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [radius, setRadius] = useState(130);
  const [isVisible, setIsVisible] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const velocityRef = useRef(0.18);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setRadius(110);
      } else if (window.innerWidth < 1024) {
        setRadius(150);
      } else if (window.innerWidth < 1280) {
        setRadius(205);
      } else {
        setRadius(250);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let animationId: number;
    const targetVelocity = isPaused ? 0 : 0.18;
    const lerpFactor = 0.012;

    const updateRotation = () => {
      velocityRef.current += (targetVelocity - velocityRef.current) * lerpFactor;
      
      if (isPaused && Math.abs(velocityRef.current) < 0.0005) {
        velocityRef.current = 0;
      }

      setAngle((prev) => (prev + velocityRef.current) % 360);
      animationId = requestAnimationFrame(updateRotation);
    };

    animationId = requestAnimationFrame(updateRotation);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused, isVisible]);

  const getCoordinates = (index: number) => {
    const baseAngle = index * 60; // 6 items
    const currentAngle = (baseAngle + angle) % 360;
    const rad = (currentAngle * Math.PI) / 180;
    const x = Math.cos(rad) * radius;
    const y = Math.sin(rad) * radius;
    return { x, y };
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] lg:w-[560px] lg:h-[560px] xl:w-[680px] xl:h-[680px] flex items-center justify-center lg:-mr-28 xl:-mr-36 mt-4 lg:mt-0 -translate-y-6 sm:-translate-y-10 lg:-translate-y-16 xl:-translate-y-24 transition-all duration-300 rounded-full overflow-hidden"
    >
      {/* Central Hub */}
      <div className="relative w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] lg:w-[270px] lg:h-[270px] xl:w-[330px] xl:h-[330px] flex flex-col items-center justify-center p-3 sm:p-4 lg:p-6 z-30 transition-all duration-300 overflow-hidden">
        {/* Hub glowing aura */}
        {hoveredTech && (
          <div 
            className="absolute inset-[30%] rounded-full filter blur-md transition-all duration-500 opacity-30 pointer-events-none"
            style={{ 
              backgroundColor: `${hoveredTech.colorClass}25`,
              boxShadow: `0 0 16px 4px ${hoveredTech.colorClass}15`
            }}
          />
        )}

        {hoveredTech ? (
          <motion.div 
            key={hoveredTech.id}
            initial={{ opacity: 0, scale: 0.9, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="flex flex-col items-center justify-center text-center z-20 w-full"
          >
            <span style={{ color: hoveredTech.colorClass }} className="p-0">
              {(() => {
                const TechIcon = iconMap[hoveredTech.iconName] || Smartphone;
                return <TechIcon className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 transition-all duration-300" />;
              })()}
            </span>
            <span className="text-xs sm:text-sm lg:text-lg xl:text-xl font-display font-extrabold text-white mt-1 lg:mt-2 leading-tight">
              {hoveredTech.name}
            </span>
          </motion.div>
        ) : (
          <motion.div 
            key="default-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center z-20 w-full px-2"
          >
            <h3 className="text-sm sm:text-lg lg:text-xl xl:text-2xl font-display font-bold text-white tracking-tight leading-snug whitespace-pre-line">
              <ScrambleText text={"Technologies We\nExplore"} />
            </h3>
          </motion.div>
        )}
      </div>

      {/* Rotating Icons */}
      {techStack.map((tech, idx) => {
        const TechIcon = iconMap[tech.iconName] || Smartphone;
        const { x, y } = getCoordinates(idx);
        const isHovered = hoveredTech?.id === tech.id;
        
        return (
          <div
            key={tech.id}
            className="absolute transition-all duration-100 ease-out"
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              zIndex: isHovered ? 35 : 20
            }}
            onMouseEnter={() => {
              setHoveredTech(tech);
              setIsPaused(true);
            }}
            onMouseLeave={() => {
              setHoveredTech(null);
              setIsPaused(false);
            }}
          >
            <div 
              className="relative flex items-center justify-center rounded-full cursor-pointer transition-all duration-300"
              style={{
                width: '80px',
                height: '80px',
                backgroundColor: 'transparent',
                borderColor: 'transparent',
                transform: isHovered ? 'scale(1.3)' : 'scale(1)'
              }}
            >
              <TechIcon 
                className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 xl:w-14 xl:h-14 transition-all duration-300"
                style={{ color: tech.colorClass }} 
              />
            </div>
          </div>
        );
      })}

      {/* Creative Overlapping Layer on the bottom right */}
      <div 
        className="absolute bottom-0 right-0 w-[52%] h-[52%] bg-gradient-to-br from-zinc-950/95 via-black to-black shadow-2xl z-25 pointer-events-none flex flex-col items-end justify-end p-4 sm:p-6"
        style={{
          borderTopLeftRadius: '100%',
        }}
      >
        {/* SVG for glowing, fading-at-ends blue outline along the circular top-left curve */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="blueGlowGrad" x1="0" y1="100" x2="100" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
              <stop offset="15%" stopColor="#3b82f6" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#00f0ff" stopOpacity="1" />
              <stop offset="85%" stopColor="#3b82f6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Thick Glow Layer (Back) */}
          <path 
            d="M 0 100 A 100 100 0 0 1 100 0" 
            fill="none" 
            stroke="url(#blueGlowGrad)" 
            strokeWidth="6" 
            className="opacity-40 blur-md"
          />
          
          {/* Medium Glow Layer (Middle) */}
          <path 
            d="M 0 100 A 100 100 0 0 1 100 0" 
            fill="none" 
            stroke="url(#blueGlowGrad)" 
            strokeWidth="3" 
            className="opacity-70 blur-sm"
          />
          
          {/* Core Sharp Line (Front) */}
          <path 
            d="M 0 100 A 100 100 0 0 1 100 0" 
            fill="none" 
            stroke="url(#blueGlowGrad)" 
            strokeWidth="1.2" 
            className="opacity-100"
          />
        </svg>
        
        {/* Subtle tech micro details */}
        <div className="relative flex flex-col items-end select-none">
          <span className="text-[8px] font-mono tracking-widest text-brand-green uppercase animate-pulse">System Active</span>
          <span className="text-[9px] font-display font-black text-white/40 tracking-wider">IIT BHILAI</span>
        </div>
      </div>
    </div>
  );
}
