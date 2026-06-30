import * as React from 'react';
import { useState, useRef, useEffect, useMemo, useLayoutEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollSmoother from 'gsap/ScrollSmoother';
import { gdgEvents } from '../data';
import { 
  Calendar, 
  MapPin, 
  User 
} from 'lucide-react';
import ScrambleText from './ScrambleText';

gsap.registerPlugin(ScrollTrigger);

export default function Events() {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  
  const sectionRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<any>(null);

  // Responsive dimensions state
  const [dimensions, setDimensions] = useState({
    itemWidth: 460,
    itemHeight: 440,
    sideItemWidth: 320,
    sideItemHeight: 400,
    gap: 50,
    blurSpread: 20,
    blurStrength: 24,
  });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      
      if (w < 640) { // Mobile
        setDimensions({
          itemWidth: 290,
          itemHeight: 420,
          sideItemWidth: 160,
          sideItemHeight: 350,
          gap: 15,
          blurSpread: 4,
          blurStrength: 8,
        });
      } else if (w < 1024) { // Tablet
        setDimensions({
          itemWidth: 380,
          itemHeight: 430,
          sideItemWidth: 240,
          sideItemHeight: 390,
          gap: 30,
          blurSpread: 12,
          blurStrength: 16,
        });
      } else { // Desktop
        setDimensions({
          itemWidth: 460,
          itemHeight: 440,
          sideItemWidth: 320,
          sideItemHeight: 400,
          gap: 50,
          blurSpread: 20,
          blurStrength: 24,
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredEvents = useMemo(() => {
    return gdgEvents.filter((event) => {
      if (filter === 'all') return true;
      if (filter === 'upcoming') return event.isUpcoming;
      if (filter === 'past') return !event.isUpcoming;
      return true;
    });
  }, [filter]);

  const renderItems = filteredEvents;
  const totalItems = filteredEvents.length;
  const scrollTarget = useRef(0);
  const rawScroll = useMotionValue(0);
  const mountRef = useRef<HTMLDivElement>(null);

  // High-fidelity physical spring for card transition
  const smoothScroll = useSpring(rawScroll, {
    stiffness: 220,
    damping: 32,
    mass: 0.4,
    restDelta: 0.001,
  });

  // GSAP ScrollTrigger Setup for clean pinning and page scroll tracking
  useLayoutEffect(() => {
    if (filteredEvents.length <= 1) {
      scrollTarget.current = 0;
      rawScroll.set(0);
      return;
    }
    
    let mm: any;
    let trigger: any;

    const initScrollTrigger = () => {
      mm = gsap.matchMedia();

      // Desktop: Pin entire events section while spinning the carousel
      mm.add("(min-width: 1024px)", () => {
        trigger = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top 80px',
          end: `+=${filteredEvents.length * 300}`,
          pin: true,
          pinSpacing: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const targetIndex = self.progress * (filteredEvents.length - 1);
            scrollTarget.current = targetIndex;
            rawScroll.set(targetIndex);
          }
        });
        triggerRef.current = trigger;
      });

      // Mobile/Tablet: Smooth scroll-reveal spinning without pinning to avoid scrolling glitches
      mm.add("(max-width: 1023px)", () => {
        trigger = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top 75%',
          end: 'bottom 25%',
          scrub: true,
          onUpdate: (self) => {
            const targetIndex = self.progress * (filteredEvents.length - 1);
            scrollTarget.current = targetIndex;
            rawScroll.set(targetIndex);
          }
        });
        triggerRef.current = trigger;
      });

      ScrollTrigger.refresh();
    };

    // Reset carousel position when active filter changes
    scrollTarget.current = 0;
    rawScroll.set(0);

    initScrollTrigger();

    return () => {
      if (mm) mm.revert();
      if (trigger) trigger.kill();
    };
  }, [filteredEvents]);

  const getTagDetails = (tag: string) => {
    const lowercaseTag = tag.toLowerCase();
    if (lowercaseTag.includes('ai') || lowercaseTag.includes('intelligence') || lowercaseTag.includes('artificial')) {
      return {
        color: '#FF6F00',
        text: 'text-[#FF6F00]',
        border: 'border-[#FF6F00]/20',
        bg: 'bg-[#FF6F00]/10',
        glow: 'rgba(255,111,0,0.18)',
      };
    }
    if (lowercaseTag.includes('cloud')) {
      return {
        color: '#4285F4',
        text: 'text-[#4285F4]',
        border: 'border-[#4285F4]/20',
        bg: 'bg-[#4285F4]/10',
        glow: 'rgba(66,133,244,0.18)',
      };
    }
    if (lowercaseTag.includes('android')) {
      return {
        color: '#3DDC84',
        text: 'text-[#3DDC84]',
        border: 'border-[#3DDC84]/20',
        bg: 'bg-[#3DDC84]/10',
        glow: 'rgba(61,220,132,0.18)',
      };
    }
    if (lowercaseTag.includes('flutter')) {
      return {
        color: '#40a3e5',
        text: 'text-[#40a3e5]',
        border: 'border-[#02569B]/20',
        bg: 'bg-[#02569B]/10',
        glow: 'rgba(2,86,155,0.18)',
      };
    }
    if (lowercaseTag.includes('firebase') || lowercaseTag.includes('web')) {
      return {
        color: '#F4B400',
        text: 'text-[#F4B400]',
        border: 'border-[#F4B400]/20',
        bg: 'bg-[#F4B400]/10',
        glow: 'rgba(244,180,0,0.18)',
      };
    }
    return {
      color: '#EA4335',
      text: 'text-[#EA4335]',
      border: 'border-[#EA4335]/20',
      bg: 'bg-[#EA4335]/10',
      glow: 'rgba(234,67,53,0.18)',
    };
  };

  return (
    <section ref={sectionRef} id="events" className="relative pt-10 pb-24 overflow-hidden bg-black select-none">
      
      {/* Background radial glows to match About section */}
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-brand-green/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-brand-red/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading matching About styling */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-8">
          <div className="text-left max-w-3xl">
            <h2 className="text-4xl sm:text-6xl font-display font-extrabold text-white leading-none">
              <ScrambleText text="Sessions & Workshops" />
            </h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-brand-red via-brand-yellow to-brand-green mt-6 rounded-full" />
            <p className="text-lg sm:text-xl font-sans font-normal text-zinc-300 mt-8 leading-relaxed">
              Explore our developer workshops, technical tracks, study jams, and community meetups designed to bridge academic study with production implementations.
            </p>
          </div>

          {/* Minimalist Filters */}
          <div className="inline-flex gap-6 border-b border-zinc-800/80 pb-2 px-4 self-start lg:self-end z-20 relative mb-4 lg:mb-0">
            {(['all', 'upcoming', 'past'] as const).map((type) => (
              <button
                id={`events-filterbtn-${type}`}
                key={type}
                onClick={() => {
                  window.blockScramble = true;
                  const smoother = ScrollSmoother.get() || window.smootherInstance;
                  if (smoother && sectionRef.current) {
                    // Instantly scroll back to the top of the events section before unpinning/recreating the ScrollTrigger.
                    // This prevents page height recalculation jumps and teleportation glitches.
                    smoother.scrollTo(sectionRef.current, false, "top 80px");
                  }
                  setFilter(type);
                  scrollTarget.current = 0;
                  rawScroll.set(0);
                  setTimeout(() => {
                    window.blockScramble = false;
                  }, 120);
                }}
                className={`relative py-1 text-xs sm:text-sm font-sans font-medium capitalize transition-all duration-200 cursor-pointer focus:outline-none ${
                  filter === type
                    ? 'text-white'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {type === 'all' ? 'All Sessions' : type === 'upcoming' ? 'Upcoming' : 'Past'}
                {filter === type && (
                  <motion.div 
                    layoutId="activeFilterBorder"
                    className="absolute bottom-[-10px] left-0 right-0 h-0.5 bg-[#4285F4]"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Carousel View Container */}
        {renderItems.length > 0 ? (
          <div 
            ref={mountRef}
            className="relative w-full h-[520px] sm:h-[550px] flex items-center justify-center overflow-hidden"
            style={{ perspective: 1200 }}
          >
            {/* Carousel Inner 3D Wrapper */}
            <div 
              className="relative w-0 h-0"
              style={{ transformStyle: "preserve-3d" }}
            >
              <AnimatePresence mode="popLayout">
                {renderItems.map((event, i) => {
                  const tagDetails = getTagDetails(event.tag);
                  const isCardHovered = hoveredCardId === `${event.id}-${i}`;

                  return (
                    <PremiumSmearCard
                      key={`card-${event.id}-${i}`}
                      event={event}
                      index={i}
                      total={totalItems}
                      smoothScroll={smoothScroll}
                      dimensions={dimensions}
                      tagDetails={tagDetails}
                      isCardHovered={isCardHovered}
                      onHoverStart={() => setHoveredCardId(`${event.id}-${i}`)}
                      onHoverEnd={() => setHoveredCardId(null)}
                    />
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Progressive Edge Gradients instead of glitchy GPU-rendered backdrop blurs */}
            <div
              className="absolute left-0 top-0 bottom-0 pointer-events-none z-30 bg-gradient-to-r from-black via-black/70 to-transparent"
              style={{
                width: `${dimensions.blurSpread}%`,
              }}
            />
            <div
              className="absolute right-0 top-0 bottom-0 pointer-events-none z-30 bg-gradient-to-l from-black via-black/70 to-transparent"
              style={{
                width: `${dimensions.blurSpread}%`,
              }}
            />
          </div>
        ) : (
          <div className="text-center py-20 bg-[#09090b] border border-zinc-900 rounded-2xl">
            <p className="text-zinc-500 font-sans text-base">No workshops found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
}

interface CardProps {
  key?: string;
  event: typeof gdgEvents[0];
  index: number;
  total: number;
  smoothScroll: any;
  dimensions: {
    itemWidth: number;
    itemHeight: number;
    sideItemWidth: number;
    sideItemHeight: number;
    gap: number;
  };
  tagDetails: {
    color: string;
    text: string;
    border: string;
    bg: string;
    glow: string;
  };
  isCardHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

function PremiumSmearCard({
  event,
  index,
  total,
  smoothScroll,
  dimensions,
  tagDetails,
  isCardHovered,
  onHoverStart,
  onHoverEnd,
}: CardProps) {
  const { itemWidth, itemHeight, sideItemWidth, sideItemHeight, gap } = dimensions;

  // Accurate linear spacing centered on the active card
  const localOffset = useTransform(smoothScroll, (v: number) => {
    return index - v;
  });

  const absOffset = useTransform(localOffset, Math.abs);

  const scale = useTransform(absOffset, [0, 1], [1, sideItemWidth / itemWidth], { clamp: true });

  // Offset placement logic
  const x = useTransform(localOffset, (o: number) => {
    const a = Math.abs(o);
    const s = Math.sign(o);

    const centerToNext = itemWidth / 2 + gap + sideItemWidth / 2;
    const sideToSide = sideItemWidth + gap;

    if (a === 0) return 0;
    if (a <= 1) {
      return s * centerToNext * a;
    } else {
      return s * (centerToNext + (a - 1) * sideToSide * 0.85);
    }
  });

  const z = useTransform(absOffset, (a) => -a * 150);

  // Rotation curvature
  const rotateY = useTransform(localOffset, (o: number) => {
    return Math.sign(o) * Math.min(Math.abs(o) * 28, 65);
  });

  // Dynamic stack depth
  const zIndexValue = useTransform(absOffset, (a) => 1000 - Math.round(a * 10));

  // Opacity fadeout on distant cards
  const visibilityOpacity = useTransform(absOffset, [0, 2.5, 3.5], [1, 0.7, 0]);

  // Dynamic border color and glow based on center alignment (Google Blue glow when centered)
  const cardBorderColor = useTransform(
    absOffset,
    [0, 0.4],
    ['#4285F4', '#18181b']
  );

  const cardBoxShadow = useTransform(
    absOffset,
    [0, 0.4],
    [
      '0px 0px 35px 5px rgba(66, 133, 244, 0.18)',
      '0px 0px 35px 5px rgba(66, 133, 244, 0)'
    ]
  );

  const centerGlowOpacity = useTransform(
    absOffset,
    [0, 0.4],
    [0.3, 0]
  );

  return (
    <motion.div
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        marginLeft: -itemWidth / 2,
        marginTop: -itemHeight / 2,
        width: itemWidth,
        height: itemHeight,
        rotateY,
        x,
        z,
        scale,
        zIndex: zIndexValue,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      className="group"
    >
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          opacity: visibilityOpacity,
          borderColor: cardBorderColor,
          boxShadow: cardBoxShadow,
        }}
        className="bg-[#09090b] border p-6 sm:p-8 rounded-2xl flex flex-col justify-between transition-[background-color] duration-500 relative overflow-hidden h-full pointer-events-auto"
      >
        {/* Centered background visual glow inside the card */}
        <motion.div 
          className="absolute -top-12 -right-12 w-32 h-32 rounded-full filter blur-3xl pointer-events-none"
          style={{ 
            backgroundColor: '#4285F4',
            opacity: centerGlowOpacity
          }}
        />

        {/* Card Content Top half */}
        <div className="overflow-hidden">
          {/* Tag & Status Badge */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-display font-semibold tracking-widest text-zinc-400 uppercase">
              {event.tag}
            </span>
            
            {event.isUpcoming ? (
              <span className="flex items-center gap-1.5 text-[10px] font-display text-[#3DDC84] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3DDC84]" />
                Upcoming
              </span>
            ) : (
              <span className="text-[10px] font-display text-zinc-500 font-semibold">
                Past Event
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-display font-bold text-white leading-tight mb-2 transition-colors duration-300 line-clamp-2">
            {event.title}
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm font-sans text-zinc-400 font-normal leading-relaxed line-clamp-3 mb-6">
            {event.description}
          </p>
        </div>

        {/* Card Meta bottom half */}
        <div className="space-y-3 border-t border-zinc-900/80 pt-4 mt-auto">
          {/* Date & Time info */}
          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-sans text-zinc-400">
            <Calendar size={12} className="text-zinc-500 flex-shrink-0" />
            <span className="truncate">
              {event.date} {event.time && `• ${event.time}`}
            </span>
          </div>

          {/* Location details */}
          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-sans text-zinc-400">
            <MapPin size={12} className="text-zinc-500 flex-shrink-0" />
            <span className="leading-tight truncate">{event.venue}</span>
          </div>

          {/* Speaker details */}
          {event.speaker && (
            <div className="flex items-center gap-2 text-[11px] sm:text-xs font-sans text-zinc-400">
              <User size={12} className="text-zinc-500 flex-shrink-0" />
              <span className="truncate">
                <span className="text-zinc-300 font-medium">{event.speaker}</span>
                {event.speakerRole && (
                  <span className="text-zinc-500"> — {event.speakerRole}</span>
                )}
              </span>
            </div>
          )}

          {/* Action Row */}
          <div className="pt-2">
            {event.isUpcoming ? (
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-sans text-zinc-500 font-medium">
                  {event.rsvpCount} registered
                </span>
                
                <a
                  href="https://gdg.community.dev/gdg-on-campus-indian-institute-of-technology-bhilai-bhilai-india/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white hover:bg-zinc-200 text-black px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 relative z-40 pointer-events-auto"
                >
                  RSVP
                </a>
              </div>
            ) : (
              <a
                href="https://gdg.community.dev/gdg-on-campus-indian-institute-of-technology-bhilai-bhilai-india/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full py-2 rounded-lg text-xs font-semibold text-zinc-300 border border-zinc-800 bg-transparent hover:bg-zinc-900 hover:text-white hover:border-zinc-700 transition-all duration-200 relative z-40 pointer-events-auto"
              >
                Access Resources
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
