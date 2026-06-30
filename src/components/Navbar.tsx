import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { scrollToTarget } from '../utils/scroll';
import { GdgLogo } from './GdgLogo';
import GlowingBeamButton from './GlowingBeamButton';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  // Track scrolling to add backdrop opacity and mark active section using highly optimized scroll listener and GSAP ScrollTrigger
  useEffect(() => {
    // 1. Scrolled state indicator (threshold 20px)
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    // 2. Active section link tracker (triggers based on section thresholds)
    const sections = ['hero', 'about', 'events', 'gallery', 'team', 'faqs', 'contact'];
    const activeTriggers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      return ScrollTrigger.create({
        trigger: el,
        start: 'top 140px',
        end: 'bottom 140px',
        onToggle: (self) => {
          if (self.isActive) {
            setActiveSection(id);
          }
        },
      });
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      activeTriggers.forEach((t) => t?.kill());
    };
  }, []);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'About', href: '#about' },
    { name: 'Events', href: '#events' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Team', href: '#team' },
    { name: 'FAQs', href: '#faqs' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      scrollToTarget(element, 800, -80);
      setActiveSection(targetId);
      setIsOpen(false);
    }
  };

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'glass-navbar py-3 shadow-lg' 
          : 'bg-transparent py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-[1450px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-14">
          
          {/* Logo & Brand */}
          <a 
            id="nav-logo"
            href="#hero" 
            onClick={(e) => handleScrollTo(e, '#hero')}
            onMouseEnter={() => setIsLogoHovered(true)}
            onMouseLeave={() => setIsLogoHovered(false)}
            className="flex items-center gap-2 group focus:outline-none"
          >
            {/* Google-colored Dots/Core symbol with morphing animation on hover */}
            <div 
              className="relative w-16 h-10 -ml-2 mr-0.5 flex items-center justify-center overflow-visible select-none"
            >
              <div 
                className="absolute transform scale-[0.38] origin-center transition-transform duration-300"
                style={{ width: 500, height: 320 }}
              >
                <GdgLogo activeState={isLogoHovered ? 'logo' : 'dots'} />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-white font-display font-bold text-base sm:text-lg tracking-tight">
                  GDG <span className="text-[#667eea] font-medium text-sm sm:text-base">on campus</span>
                </span>
              </div>
              <span className="text-gray-300 font-sans font-bold text-[11px] tracking-wider uppercase -mt-1 block">
                IIT Bhilai
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div id="desktop-menu" className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  id={`nav-link-${link.name.toLowerCase()}`}
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleScrollTo(e, link.href)}
                  className={`px-1 py-1.5 text-sm font-sans font-semibold tracking-wide transition-all duration-300 ${
                    isActive
                      ? 'text-white active'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </div>

          {/* Join Chapter Button (Header CTA) */}
          <div className="hidden sm:block">
            <div className="w-[155px] h-[38px] flex items-center">
              <GlowingBeamButton
                text="Join Chapter"
                href="https://gdg.community.dev/gdg-on-campus-indian-institute-of-technology-bhilai-india/"
                openInNewTab={true}
                showIcon={true}
                iconName="ArrowUpRight"
                iconGap={6}
                sizingAndRadius={{ paddingX: 16, paddingY: 7, radius: 99 }}
                font={{
                  family: "Inter",
                  size: 13,
                  weight: 700,
                }}
                colorStyle="Custom"
                customColors={["#4285F4", "#EA4335", "#FBBC05", "#34A853"]}
                glowSettings={{
                  style: "Filled",
                  outer: 1.5,
                  inner: 1.0,
                  speed: 1.2
                }}
              />
            </div>
          </div>

          {/* Mobile Menu Actions */}
          <div className="flex items-center md:hidden gap-3">
            <a
              id="header-join-mobile-btn"
              href="https://gdg.community.dev/gdg-on-campus-indian-institute-of-technology-bhilai-india/"
              target="_blank"
              rel="noopener noreferrer"
              className="sm:hidden inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-display font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/10"
            >
              Join
              <ArrowUpRight size={10} />
            </a>
            <button
              id="hamburger-btn"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border border-white/10 focus:outline-none focus:ring-1 focus:ring-white/20"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-nav-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden glass-navbar overflow-hidden mt-1 border-t border-white/10"
          >
            <div className="px-4 pt-3 pb-5 space-y-1 sm:px-6">
              {navLinks.map((link) => (
                <a
                  id={`mobile-nav-link-${link.name.toLowerCase()}`}
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleScrollTo(e, link.href)}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-sans font-medium transition-all duration-200 ${
                    activeSection === link.href.replace('#', '')
                      ? 'bg-white/15 text-white border border-white/25 shadow-sm'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 border-t border-white/15 mt-3 px-1">
                <a
                  id="mobile-join-primary-btn"
                  href="https://gdg.community.dev/gdg-on-campus-indian-institute-of-technology-bhilai-india/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-google-glow flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-xs font-display font-medium text-white text-center shadow-lg"
                >
                  <span className="glow-bg" />
                  <span className="glow-mask" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Join IIT Bhilai Chapter
                    <ArrowUpRight size={14} />
                  </span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
