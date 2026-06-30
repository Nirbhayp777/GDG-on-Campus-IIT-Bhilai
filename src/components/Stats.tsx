import React, { useRef, useEffect } from 'react';
import { Users, BookOpen, Sparkles, Code, LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { statsData } from '../data';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Map icon name string to Lucide component
const iconMap: Record<string, LucideIcon> = {
  Users: Users,
  BookOpen: BookOpen,
  Sparkles: Sparkles,
  Code: Code,
};

interface StatNumberProps {
  value: string;
}

export function StatNumber({ value }: StatNumberProps) {
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // Parse the number and any suffix (like '+')
    const numericPart = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
    const suffix = value.replace(/[0-9]/g, '');

    const obj = { val: 0 };

    const anim = gsap.to(obj, {
      val: numericPart,
      duration: 1.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 95%',
        once: true,
      },
      onUpdate: () => {
        if (el) {
          el.innerText = Math.floor(obj.val).toLocaleString() + suffix;
        }
      }
    });

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, [value]);

  return (
    <span ref={elementRef} className="will-change-[contents]">
      0{value.replace(/[0-9]/g, '')}
    </span>
  );
}

export default function Stats() {
  return (
    <section 
      id="stats" 
      className="relative w-full pt-32 pb-12 z-20 overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.2) 25%, rgba(0, 0, 0, 0.5) 38%, rgba(0, 0, 0, 0.8) 45%, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 1) 100%)',
      }}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Outer borderless minimal container */}
        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 items-center">
          {statsData.map((stat, idx) => {
            const IconComponent = iconMap[stat.iconName] || Users;
            
            return (
              <div key={stat.id} className="relative flex flex-col md:flex-row items-center justify-center w-full group">
                
                {/* Main Content Area */}
                <motion.div
                  id={`stat-item-${stat.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="flex flex-col items-center text-center select-none cursor-default py-4 px-2"
                >
                  {/* Floating subtle icon with gentle colorful aura on group hover */}
                  <div className="relative mb-3 flex items-center justify-center">
                    <div className={`absolute -inset-2 rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-500 bg-current ${stat.colorClass}`} />
                    <span className={`relative text-gray-400 transition-colors duration-300 group-hover:text-white ${stat.colorClass}`}>
                      <IconComponent size={20} className="stroke-[1.75]" />
                    </span>
                  </div>

                  {/* Giant Metric Value with subtle text glow on hover */}
                  <h3 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-white tracking-tight leading-none transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.25)]">
                    <StatNumber value={stat.count} />
                  </h3>

                  {/* Label text */}
                  <p className="text-xs sm:text-sm font-sans font-medium text-gray-400 mt-2 tracking-wide max-w-[150px] leading-snug group-hover:text-gray-300 transition-colors duration-300">
                    {stat.label}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
