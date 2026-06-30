import { useState, useEffect, useRef } from 'react';
import { Github, Linkedin, Instagram, User, ExternalLink } from 'lucide-react';
import { motion, useMotionValue } from 'motion/react';
import { teamMembers } from '../data';
import ScrambleText from './ScrambleText';

export default function Team() {
  const x = useMotionValue(0);
  const isDragging = useRef(false);
  const isHovered = useRef(false);
  const velocity = useRef(-0.75); // Constant speed to left (pixels per frame)
  const autoSpeed = -0.75;

  // Each item width is 280px, gap is 0 to align separation lines perfectly
  const cardWidth = 280;
  const gap = 0;
  const singleSetWidth = teamMembers.length * cardWidth;

  // Replicating members list 4 times guarantees a completely seamless loop track
  const extendedMembers = [
    ...teamMembers,
    ...teamMembers,
    ...teamMembers,
    ...teamMembers,
  ];

  useEffect(() => {
    let animationId: number;

    const update = () => {
      if (!isDragging.current) {
        const currentX = x.get();
        const targetVel = isHovered.current ? 0 : autoSpeed;

        // Apply decay to high velocity (inertia) from dragging
        if (Math.abs(velocity.current) > 2.0) {
          velocity.current *= 0.992; // High inertia decay for an extremely fluid drag glide
        } else {
          // Smoothly lerp low speed back to the active autoScroll or hover stop
          // Use a very gentle factor (0.015) when hovering to create a rich, heavy inertia slide to a halt
          const lerpFactor = isHovered.current ? 0.015 : 0.08;
          velocity.current += (targetVel - velocity.current) * lerpFactor;
        }

        let nextX = currentX + velocity.current;

        // Wrap around seamlessly using mathematical modulo to handle large drag offsets instantly
        if (nextX < -singleSetWidth) {
          nextX = nextX % singleSetWidth;
        } else if (nextX > 0) {
          nextX = (nextX % singleSetWidth) - singleSetWidth;
        }

        x.set(nextX);
      }

      animationId = requestAnimationFrame(update);
    };

    animationId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationId);
  }, [x, singleSetWidth]);

  const handleDragStart = () => {
    isDragging.current = true;
  };

  const handleDragEnd = (event: any, info: any) => {
    isDragging.current = false;
    // convert pixels per second to pixels per frame (at ~60 FPS)
    let dragVelocity = info.velocity.x / 60;

    // Elegant velocity boundaries so dragging doesn't feel unmanageable
    const maxVelocity = 35;
    if (dragVelocity > maxVelocity) dragVelocity = maxVelocity;
    if (dragVelocity < -maxVelocity) dragVelocity = -maxVelocity;

    velocity.current = dragVelocity;
  };

  return (
    <section id="team" className="relative pt-24 pb-16 overflow-hidden bg-black">
      
      {/* Soft aesthetic ambient background glow */}
      <div className="absolute top-1/4 left-10 w-[450px] h-[450px] bg-brand-blue/5 rounded-full filter blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[450px] h-[450px] bg-brand-purple/5 rounded-full filter blur-[140px] pointer-events-none" />

      {/* Section Header exactly matching the style and typography of the Gallery section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-[40px]">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-[28.8px] sm:text-[48px] font-display font-extrabold text-white leading-none">
            <ScrambleText text="The Leadership & Team" />
          </h2>
          <div className="h-1.5 w-24 bg-gradient-to-r from-brand-red via-brand-yellow to-brand-green mt-[19.2px] rounded-full mx-auto" />
          <p className="text-[14.4px] sm:text-[16px] font-sans font-normal text-zinc-300 mt-[25.6px] leading-relaxed">
            The dedicated students at IIT Bhilai orchestrating study tracks, hackathons, speaker events, and managing operations of our developer community.
          </p>
        </div>
      </div>

      {/* Interactive Infinite Carousel within a narrowed visibility window */}
      <div className="max-w-5xl mx-auto overflow-hidden relative select-none touch-pan-y bg-zinc-950/20">
        
        {/* Soft edge shading gradients to blend carousel edges beautifully */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-r from-black via-black/40 to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-l from-black via-black/40 to-transparent z-20 pointer-events-none" />

        <div className="overflow-visible">
          <motion.div
            drag="x"
            dragConstraints={{
              left: -singleSetWidth * 2.5,
              right: 0,
            }}
            dragElastic={0.15}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            style={{
              x,
              display: "flex",
              gap: `${gap}px`,
              width: "max-content",
              willChange: "transform",
            }}
            onMouseEnter={() => {
              isHovered.current = true;
            }}
            onMouseLeave={() => {
              isHovered.current = false;
            }}
            className="cursor-grab active:cursor-grabbing px-4"
          >
            {extendedMembers.map((member, index) => {
              return (
                <div
                  key={`${member.id}-${index}`}
                  style={{ width: `${cardWidth}px` }}
                  className="flex-shrink-0 transition-transform duration-300"
                >
                  <div className="group flex flex-col items-center p-8 text-center h-[360px] w-full justify-between relative bg-transparent">
                    {/* Minimal vertical separator line, thick in the middle and fading at the ends */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-[80%] bg-gradient-to-b from-transparent via-white/15 to-transparent pointer-events-none" />
                    
                    {/* Avatar with Custom Google Colored Ring */}
                    <div className="relative mt-2 mb-2">
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#4285F4] via-[#EA4335] to-[#FBBC05] rounded-full p-[2px] opacity-75 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-1000" />
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-black relative z-10 bg-zinc-900">
                        <img 
                          src={member.avatar} 
                          alt={member.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>

                    {/* Info text box */}
                    <div className="relative z-10 space-y-1 flex-1 flex flex-col justify-center">
                      <span className="text-[9px] font-display tracking-widest uppercase font-semibold text-[#4285F4] bg-[#4285F4]/5 border border-[#4285F4]/15 px-2 py-0.5 rounded-full inline-block mx-auto mb-2">
                        {member.team} Team
                      </span>
                      <h3 className="text-base font-display font-extrabold text-white leading-tight">
                        {member.name}
                      </h3>
                      <p className="text-xs font-sans text-zinc-400 mt-1">
                        {member.role}
                      </p>
                    </div>

                    {/* Contact Profiles Row */}
                    <div className="flex items-center justify-center gap-3 mt-4 w-full relative z-10">
                      <span
                        className="p-1.5 text-zinc-500 hover:text-white transition-all duration-300 cursor-default"
                        title="GitHub"
                      >
                        <Github size={14} />
                      </span>
                      <span
                        className="p-1.5 text-zinc-500 hover:text-[#4285F4] transition-all duration-300 cursor-default"
                        title="LinkedIn"
                      >
                        <Linkedin size={14} />
                      </span>
                      <span
                        className="p-1.5 text-zinc-500 hover:text-[#EA4335] transition-all duration-300 cursor-default"
                        title="Instagram"
                      >
                        <Instagram size={14} />
                      </span>
                    </div>

                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

      </div>

    </section>
  );
}
