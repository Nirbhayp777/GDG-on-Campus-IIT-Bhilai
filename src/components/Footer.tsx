import React from 'react';
import { ArrowUp, Heart } from 'lucide-react';
import { scrollToTarget } from '../utils/scroll';
import { GdgLogo } from './GdgLogo';

export default function Footer() {
  const scrollToTop = () => {
    scrollToTarget(0, 800);
  };

  return (
    <footer id="global-footer" className="relative border-t border-zinc-800/60 bg-[#0b0b0d] pt-12 pb-8 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Footer Logo & Disclaimer */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-2 select-none">
              {/* Google-colored Static GDG Logo */}
              <div className="relative w-16 h-10 -ml-2 mr-0.5 flex items-center justify-center overflow-visible">
                <div 
                  className="absolute transform scale-[0.38] origin-center"
                  style={{ width: 500, height: 320 }}
                >
                  <GdgLogo activeState="logo" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-display font-bold text-base sm:text-lg tracking-tight">
                  GDG <span className="text-[#4285F4] font-medium text-sm sm:text-base">on campus</span>
                </span>
                <span className="text-zinc-400 font-sans font-bold text-[10px] tracking-wider uppercase -mt-1 block">
                  IIT Bhilai
                </span>
              </div>
            </div>

            <p className="text-[11px] sm:text-xs font-sans text-zinc-500 leading-relaxed font-semibold">
              Disclaimer: GDG on Campus Indian Institute of Technology Bhilai is an independent student developer group. The activities, events, slides, workshops, and opinions structured on this portal must not be mapped or interpreted as official statements or guidelines of Google Inc.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
              GDG Chapter Links
            </h4>
            <ul className="space-y-1.5 text-xs font-sans font-medium">
              <li>
                <a
                  id="foot-link-portal"
                  href="https://gdg.community.dev/gdg-on-campus-indian-institute-of-technology-bhilai-india/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-[#4285F4] transition-colors"
                >
                  Official GDG Chapter Portal
                </a>
              </li>
              <li>
                <a
                  id="foot-link-solution"
                  href="https://developers.google.com/community/gdg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-[#4285F4] transition-colors"
                >
                  Google Developer Groups HQ
                </a>
              </li>
            </ul>
          </div>

          {/* Scroll To Top Action */}
          <div className="md:col-span-3 flex md:justify-end">
            <button
              id="footer-back-to-top"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-zinc-400 hover:text-[#4285F4] transition-colors duration-300 cursor-pointer focus:outline-none"
            >
              Back to top
              <ArrowUp size={12} className="text-[#4285F4]" />
            </button>
          </div>

        </div>

        {/* Global copyright indicator */}
        <div className="mt-12 pt-6 border-t border-zinc-800/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-sans text-zinc-500 font-medium select-none">
          <span>&copy; {new Date().getFullYear()} GDG on Campus IIT Bhilai. All Rights Reserved.</span>
          <span className="flex items-center gap-1">
            Engineered with <Heart size={10} className="text-[#4285F4] animate-pulse" /> by student developers at IIT Bhilai
          </span>
        </div>

      </div>
    </footer>
  );
}
