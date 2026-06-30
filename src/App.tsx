import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollSmoother from 'gsap/ScrollSmoother';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import About from './components/About';
import Team from './components/Team';
import Events from './components/Events';
import Gallery from './components/Gallery';
import FAQs from './components/FAQs';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { scrollToTarget } from './utils/scroll';
import AnimatedBackgroundTool from './components/AnimatedBackgroundTool';

// Register standard free and premium plugins
gsap.registerPlugin(ScrollToPlugin, ScrollTrigger, ScrollSmoother);

export default function App() {
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);

  // Initialize ScrollSmoother
  useEffect(() => {
    const smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 3.0,
      normalizeScroll: true,
      effects: true,
    });

    window.smootherInstance = smoother;

    return () => {
      smoother.kill();
      window.smootherInstance = undefined;
    };
  }, []);

  // Parallax ScrollTrigger for entire hero section
  useEffect(() => {
    const container = heroContainerRef.current;
    const content = heroContentRef.current;
    if (!container || !content) return;

    const anim = gsap.fromTo(content,
      { y: 0 },
      {
        y: 240, // Translating DOWN as we scroll DOWN slows down its upward movement relative to the viewport/user
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.0, // Mild dampening for smooth feel
          invalidateOnRefresh: true,
        }
      }
    );

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, []);

  // Setup keyboard navigation for smooth scrolling between main landing sections using arrow keys or the space bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keydown events inside input controls, forms, or text areas
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
         target.tagName === 'TEXTAREA' ||
         target.tagName === 'SELECT' ||
         target.hasAttribute('contenteditable') ||
         target.getAttribute('contenteditable') === 'true')
      ) {
        return;
      }

      const keysToIntercept = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', ' ', 'PageDown', 'PageUp', 'Home', 'End'];
      if (!keysToIntercept.includes(e.key)) return;

      // Define our navigation sections in correct layouts sequence
      const sectionIds = ['hero', 'about', 'events', 'gallery', 'team', 'faqs', 'contact'];

      // Extract each section's actual target vertical scroll coordinates (including sticky navbar offset compensation)
      const sections = sectionIds
        .map(id => {
          const el = document.getElementById(id);
          if (!el) return null;
          return {
            id,
            element: el,
            y: el.getBoundingClientRect().top + window.scrollY - 80
          };
        })
        .filter((pos): pos is { id: string; element: HTMLElement; y: number } => pos !== null)
        .sort((a, b) => a.y - b.y);

      if (sections.length === 0) return;

      const currentY = window.scrollY;

      if (
        e.key === 'ArrowDown' || 
        e.key === 'ArrowRight' || 
        e.key === 'PageDown' || 
        (e.key === ' ' && !e.shiftKey)
      ) {
        // Scroll to next section below the current viewport with a 15px threshold to guarantee smooth step-snapping
        const nextSec = sections.find(sec => sec.y > currentY + 15);
        if (nextSec) {
          e.preventDefault();
          scrollToTarget(nextSec.element, 800, -80);
        }
      } else if (
        e.key === 'ArrowUp' || 
        e.key === 'ArrowLeft' || 
        e.key === 'PageUp' || 
        (e.key === ' ' && e.shiftKey)
      ) {
        // Scroll to previous section above the current viewport
        const prevSec = [...sections].reverse().find(sec => sec.y < currentY - 15);
        if (prevSec) {
          e.preventDefault();
          scrollToTarget(prevSec.element, 800, -80);
        }
      } else if (e.key === 'Home') {
        e.preventDefault();
        scrollToTarget(sections[0].element, 800, -80);
      } else if (e.key === 'End') {
        e.preventDefault();
        scrollToTarget(sections[sections.length - 1].element, 800, -80);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    // Sleek, modern pure black chassis
    <div className="relative min-h-screen text-white bg-black">
      
      {/* Navigation Bar (Fixed - placed outside the scrollable body so it stays strictly fixed in viewport) */}
      <Navbar />

      {/* Main Page Content Body */}
      <div id="smooth-wrapper" className="w-full relative overflow-hidden">
        <div id="smooth-content" className="relative font-sans">

          {/* Floating Sparkles decorative layers */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] z-0" />

          {/* Layout Modules */}
          <div>
            
            {/* Hero Section Layer (Relative container with smooth parallax) */}
            <div ref={heroContainerRef} className="relative h-screen w-full overflow-hidden z-0 bg-black">
              <div ref={heroContentRef} className="relative w-full h-full">
                {/* The animated dynamic halo backdrop */}
                <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                  <AnimatedBackgroundTool 
                    effect="Halo Gradient"
                    color1="#1e295d"
                    color2="#2c1a53"
                    color3="#0e1726"
                    animate={true}
                  />
                  {/* Extremely soft gradient mask so background elements shine through scrolling Stats translucent layer */}
                  <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/10 via-black/5 to-transparent z-10" />
                </div>

                <div className="relative z-10 h-full w-full">
                  <Hero />
                </div>
              </div>
            </div>

            {/* Scrolling Curtain Layer (Slide-over content with transparent-to-black blend) */}
            <div className="relative z-10 -mt-[25vh] pointer-events-none">
              
              {/* Minimal KPI stat cards shifting into the page */}
              <Stats />

              {/* Main content body with solid black bg */}
              <div className="relative z-10 bg-black pointer-events-auto">
                {/* About Section - What GDG does at IIT Bhilai */}
                <About />

                {/* Events Schedule Section (Upcoming and Past) */}
                <Events />

                {/* Gallery Segment */}
                <Gallery />

                {/* Team Segment */}
                <Team />

                {/* Collapsible FAQ Segment */}
                <FAQs />

                {/* Secure Message and Contact segment */}
                <Contact />

                {/* Global Footer */}
                <Footer />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

