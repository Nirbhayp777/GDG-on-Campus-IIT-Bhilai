import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrambleText from './ScrambleText';

gsap.registerPlugin(ScrollTrigger);

// --- Interfaces ---
interface PhotoItem {
  url: string;
  title: string;
  date: string;
  tag: string;
}

interface SyncScrollSliderProps {
  rowCount: number;
  gap: number;
  imgWidth: number;
  imgHeight: number;
  borderRadius: number;
  speed: number;
}

interface SyncScrollSliderRowProps {
  key?: string;
  mediaList: PhotoItem[];
  rowRef: React.RefObject<HTMLDivElement | null>;
  gap: number;
  imgWidth: number;
  imgHeight: number;
  borderRadius: number;
  rowIndex: number;
  onItemClick: (item: PhotoItem, indexInRow: number, rowIndex: number) => void;
}

// 1. Helper function to check if a file URL is a video
const isVideo = (url: string) => {
  if (!url) return false;
  return (
    url.match(/\.(mp4|webm|ogg|mov|m4v)/i) !== null ||
    url.includes("videos%") ||
    url.includes(".mp4")
  );
};

// 2. Extracted Sub-Component for a Single Slider Row
function SyncScrollSliderRow({
  mediaList,
  rowRef,
  gap,
  imgWidth,
  imgHeight,
  borderRadius,
  rowIndex,
  onItemClick,
}: SyncScrollSliderRowProps) {
  // SMART DUPLICATION LOGIC
  const MIN_REQUIRED = 8;
  let extendedList: PhotoItem[] = [];

  if (mediaList.length > 0) {
    if (mediaList.length >= MIN_REQUIRED) {
      extendedList = [...mediaList];
    } else {
      extendedList = [...mediaList];
      while (extendedList.length < MIN_REQUIRED) {
        const remaining = MIN_REQUIRED - extendedList.length;
        extendedList = extendedList.concat(
          mediaList.slice(0, remaining)
        );
      }
    }
  }

  return (
    <div
      ref={rowRef}
      style={{
        display: "flex",
        gap: `${gap}px`,
        width: "max-content",
        transform: rowIndex % 2 === 0 ? "translateX(-5%)" : "translateX(-25%)",
        willChange: "transform",
      }}
    >
      {extendedList.map((item, index) => {
        const isMediaVideo = isVideo(item.url);

        const sharedStyles: React.CSSProperties = {
          width: `${imgWidth}px`,
          height: `${imgHeight}px`,
          objectFit: "cover",
          borderRadius: `${borderRadius}px`,
          cursor: "pointer",
        };

        const hoverAnimation = {
          scale: 1.04,
          y: -4,
          filter: "brightness(1.08)",
        };

        const hoverTransition = {
          type: "spring",
          stiffness: 150,
          damping: 25,
          mass: 0.8,
        };

        return (
          <motion.div
            key={`${item.url}-${index}`}
            whileHover={hoverAnimation}
            transition={hoverTransition}
            onClick={() => onItemClick(item, index, rowIndex)}
            className="inline-block relative group"
            style={{ willChange: "transform" }}
          >
            {isMediaVideo ? (
              <video
                src={item.url}
                style={sharedStyles}
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <img
                src={item.url}
                alt={item.title}
                style={sharedStyles}
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

// 3. Main Gallery Component
export default function Gallery({
  rowCount = 3,
  gap = 20,
  imgWidth = 280,
  imgHeight = 175,
  borderRadius = 16,
  speed = 4,
}: Partial<SyncScrollSliderProps>) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  useEffect(() => {
    if (typeof document !== "undefined") {
      setPortalTarget(document.body);
    }
  }, []);

  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const row3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      if (row1Ref.current) {
        gsap.fromTo(row1Ref.current,
          { x: "-5%" },
          {
            x: "-25%",
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.5,
              invalidateOnRefresh: true,
            }
          }
        );
      }

      if (row2Ref.current) {
        gsap.fromTo(row2Ref.current,
          { x: "-25%" },
          {
            x: "-5%",
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.5,
              invalidateOnRefresh: true,
            }
          }
        );
      }

      if (row3Ref.current) {
        gsap.fromTo(row3Ref.current,
          { x: "-5%" },
          {
            x: "-25%",
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.5,
              invalidateOnRefresh: true,
            }
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  // High quality curated Unsplash photography for GDG IIT Bhilai visual showcase
  const row1Media: PhotoItem[] = [
    {
      url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800',
      title: 'GenAI Study Jam Launch',
      date: 'May 2026',
      tag: 'GenAI Keynote'
    },
    {
      url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800',
      title: 'Group Hackathon Solutions',
      date: 'March 2026',
      tag: 'Solutions'
    },
    {
      url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800',
      title: 'Tech Event Presentation',
      date: 'April 2026',
      tag: 'Lightning Talks'
    },
    {
      url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800',
      title: 'Core Dev Brainstorming',
      date: 'February 2026',
      tag: 'Ideation'
    }
  ];

  const row2Media: PhotoItem[] = [
    {
      url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800',
      title: 'Hands-on Coding Cohort',
      date: 'April 2026',
      tag: 'Codelabs'
    },
    {
      url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
      title: 'Peer Collaborations',
      date: 'May 2026',
      tag: 'Peer Learning'
    },
    {
      url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
      title: 'Hackathon Workshop Coding',
      date: 'March 2026',
      tag: 'Build Phase'
    },
    {
      url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800',
      title: 'Weekly Standup & Sync',
      date: 'January 2026',
      tag: 'Operations'
    }
  ];

  const row3Media: PhotoItem[] = [
    {
      url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=800',
      title: 'Annual GDG Chapter Meet',
      date: 'June 2026',
      tag: 'Annual Assembly'
    },
    {
      url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800',
      title: 'Tech Panel Discussions',
      date: 'May 2026',
      tag: 'Panel Discussion'
    },
    {
      url: 'https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&q=80&w=800',
      title: 'Audience Q&A Session',
      date: 'April 2026',
      tag: 'Q&A Round'
    },
    {
      url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800',
      title: 'Problem Curation Lab',
      date: 'February 2026',
      tag: 'Design Sprints'
    }
  ];

  const rowRefs = [row1Ref, row2Ref, row3Ref];

  const visibleRows = [
    { key: "row-1", ref: rowRefs[0], media: row1Media },
    { key: "row-2", ref: rowRefs[1], media: row2Media },
    { key: "row-3", ref: rowRefs[2], media: row3Media },
  ].slice(0, rowCount);

  // Construct a flattened list of unique items for clean lightbox sequencing
  const universalPlaylist = visibleRows.reduce<PhotoItem[]>((acc, row) => {
    return acc.concat(row.media);
  }, []);

  const handleItemClick = (
    item: PhotoItem,
    indexInRow: number,
    rowIndex: number
  ) => {
    const originalMediaArray = visibleRows[rowIndex].media;
    const originalIndex = indexInRow % originalMediaArray.length;

    let flatIndex = 0;
    for (let i = 0; i < rowIndex; i++) {
      flatIndex += visibleRows[i].media.length;
    }
    flatIndex += originalIndex;

    setCurrentIndex(flatIndex);
  };

  const nextSlide = () => {
    if (currentIndex !== null) {
      setCurrentIndex((currentIndex + 1) % universalPlaylist.length);
    }
  };

  const prevSlide = () => {
    if (currentIndex !== null) {
      setCurrentIndex((currentIndex - 1 + universalPlaylist.length) % universalPlaylist.length);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (currentIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "Escape") setCurrentIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  const activePhoto = currentIndex !== null ? universalPlaylist[currentIndex] : null;

  return (
    <section id="gallery" className="relative pt-12 pb-24 overflow-hidden bg-transparent" ref={sectionRef}>
      {/* Background Accent Globe Blur */}
      <div 
        className="absolute top-1/2 left-2/3 w-80 h-80 bg-[#4285F4]/5 rounded-full filter blur-[120px] pointer-events-none" 
        style={{ transform: "translate3d(0, 0, 0)", willChange: "transform" }}
      />

      <div className="relative w-full">
        {/* Section Heading matching About & Events styling */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-[40px]">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-[28.8px] sm:text-[48px] font-display font-extrabold text-white leading-none">
              <ScrambleText text="Life at GDG IIT Bhilai" />
            </h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-brand-red via-brand-yellow to-brand-green mt-[19.2px] rounded-full mx-auto" />
            <p className="text-[14.4px] sm:text-[16px] font-sans font-normal text-zinc-300 mt-[25.6px] leading-relaxed">
              Snapshots of our workshops, speaker sessions, solution development hours, and peer hackfests.
            </p>
          </div>
        </div>

        {/* Sync Scroll Slider Rows Container */}
        <div 
          className="flex flex-col select-none overflow-hidden" 
          style={{ gap: `${gap}px` }}
        >
          {visibleRows.map((row, rIdx) => (
            <SyncScrollSliderRow
              key={row.key}
              mediaList={row.media}
              rowRef={row.ref}
              gap={gap}
              imgWidth={imgWidth}
              imgHeight={imgHeight}
              borderRadius={borderRadius}
              rowIndex={rIdx}
              onItemClick={handleItemClick}
            />
          ))}
        </div>
      </div>

      {/* --- PORTALED FANCYBOX-STYLE LIGHTBOX --- */}
      {portalTarget &&
        createPortal(
          <AnimatePresence mode="wait">
            {currentIndex !== null && activePhoto && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setCurrentIndex(null)}
                className="fixed inset-0 bg-[#0a0a0b]/95 z-[99999] flex justify-center items-center backdrop-blur-xl cursor-zoom-out select-none p-4 sm:p-6"
              >
                {/* Close Button */}
                <button
                  id="gallery-close-btn"
                  onClick={() => setCurrentIndex(null)}
                  className="absolute top-6 right-6 p-2 rounded-full bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 transition-colors z-[100000] focus:outline-none cursor-pointer"
                  aria-label="Close Lightbox"
                >
                  <X size={18} />
                </button>

                {/* PREVIOUS NAVIGATION BUTTON */}
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(24, 24, 27, 0.9)" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    prevSlide();
                  }}
                  className="absolute left-4 sm:left-6 bg-zinc-900/85 border border-zinc-800/80 text-white w-11 h-11 rounded-full cursor-pointer flex items-center justify-center backdrop-blur-md transition-all z-50"
                >
                  <ChevronLeft size={20} />
                </motion.button>

                {/* CENTRAL MEDIA BLOCK - Responsive modern card */}
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 0.96, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -10 }}
                  transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative max-w-4xl w-full rounded-2xl overflow-hidden border border-zinc-800/80 bg-[#09090b] shadow-2xl flex flex-col md:flex-row items-stretch cursor-default"
                >
                  {/* Media Section */}
                  <div className="md:w-2/3 max-h-[50vh] md:max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
                    {isVideo(activePhoto.url) ? (
                      <video
                        src={activePhoto.url}
                        controls
                        autoPlay
                        muted
                        className="w-full h-full object-contain mx-auto max-h-[50vh] md:max-h-[70vh]"
                      />
                    ) : (
                      <img
                        src={activePhoto.url}
                        alt={activePhoto.title}
                        className="w-full h-full object-contain mx-auto max-h-[50vh] md:max-h-[70vh]"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>

                  {/* Attributes Panel Section */}
                  <div className="md:w-1/3 p-6 sm:p-8 flex flex-col justify-between bg-[#0a0a0c]/80 backdrop-blur-md border-t md:border-t-0 md:border-l border-zinc-900">
                    <div className="space-y-5">
                      <div className="flex items-center justify-end">
                        <span className="text-xs text-zinc-500 font-mono">
                          {currentIndex + 1} / {universalPlaylist.length}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-display font-bold text-white leading-tight">
                        {activePhoto.title}
                      </h3>

                      <div className="flex items-center gap-2 text-xs font-sans text-zinc-400">
                        <Calendar size={13} className="text-zinc-500" />
                        <span className="font-medium">{activePhoto.date}</span>
                      </div>

                      <p className="text-xs sm:text-sm font-sans text-zinc-400 font-normal leading-relaxed pt-2">
                        An official capture of peer collaborations and structural solutions development under Google Developer Groups on Campus IIT Bhilai. Codelab repositories and slides can be retrieved from your local GDG portal.
                      </p>
                    </div>

                    <div className="pt-6 border-t border-zinc-900 mt-6 flex items-center justify-between">
                      <span className="text-[10px] font-sans text-zinc-500 font-medium">IIT Bhilai Chapter</span>
                      <button
                        id="lightbox-internal-dismiss"
                        onClick={() => setCurrentIndex(null)}
                        className="text-xs font-sans text-zinc-400 hover:text-white hover:underline focus:outline-none cursor-pointer"
                      >
                        Dismiss Viewer
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* NEXT NAVIGATION BUTTON */}
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(24, 24, 27, 0.9)" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    nextSlide();
                  }}
                  className="absolute right-4 sm:right-6 bg-zinc-900/85 border border-zinc-800/80 text-white w-11 h-11 rounded-full cursor-pointer flex items-center justify-center backdrop-blur-md transition-all z-50"
                >
                  <ChevronRight size={20} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>,
          portalTarget
        )}
    </section>
  );
}
