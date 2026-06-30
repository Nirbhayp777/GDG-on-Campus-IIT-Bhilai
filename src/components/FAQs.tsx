import { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { faqData } from '../data';
import ScrambleText from './ScrambleText';

export default function FAQs() {
  const [openId, setOpenId] = useState<string | null>('f1');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const filteredFAQs = faqData.filter((item) => {
    const rawSearch = searchQuery.toLowerCase();
    return (
      item.question.toLowerCase().includes(rawSearch) ||
      item.answer.toLowerCase().includes(rawSearch) ||
      item.category.toLowerCase().includes(rawSearch)
    );
  });

  return (
    <section id="faqs" className="relative pt-16 pb-20 overflow-hidden bg-black">

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading matching other sections & left aligned */}
        <div className="text-left mb-[40px] max-w-4xl">
          <h2 className="text-[28.8px] sm:text-[48px] font-display font-extrabold text-white leading-none">
            <ScrambleText text="Frequently Asked Questions" />
          </h2>
          <div className="h-1.5 w-24 bg-gradient-to-r from-brand-blue via-brand-red to-brand-green mt-[19.2px] rounded-full" />
          <p className="text-[14.4px] sm:text-[16px] font-sans font-normal text-zinc-300 mt-[25.6px] leading-relaxed">
            Have questions about GDG on Campus IIT Bhilai? Explore answers to common queries about recruitment, workshops, eligibility, and how to get involved.
          </p>
        </div>

        {/* Dynamic FAQ Search Bar - Sleek minimal line layout */}
        <div id="faq-search-box" className="relative max-w-2xl mb-12">
          <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none text-zinc-500">
            <Search size={18} />
          </div>
          <input
            id="faq-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search queries, categories, eligibility..."
            className="w-full pl-8 pr-16 py-3 text-sm bg-transparent border-b border-zinc-800 text-white placeholder-zinc-500 outline-none focus:border-[#4285F4] transition-all duration-300 font-sans"
          />
          {searchQuery && (
            <button
              id="faq-search-clear"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 flex items-center text-xs text-zinc-400 hover:text-[#4285F4] font-sans"
            >
              Clear Search
            </button>
          )}
        </div>

        {/* FAQs List Accordion - Clean line layout matching preceding sections */}
        <div className="max-w-4xl space-y-0 border-t border-zinc-800/60">
          <AnimatePresence mode="popLayout">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((item) => {
                const isOpen = openId === item.id;
                
                return (
                  <motion.div
                    id={`faq-accordion-item-${item.id}`}
                    key={item.id}
                    layout="position"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className="border-b border-zinc-800/60 transition-all duration-300"
                  >
                    {/* Accordion toggle header */}
                    <button
                      id={`faq-accordion-btn-${item.id}`}
                      onClick={() => toggleAccordion(item.id)}
                      className="w-full flex items-center justify-between py-6 text-left transition-colors font-semibold group focus:outline-none"
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-white text-base sm:text-lg font-display font-bold leading-tight group-hover:text-zinc-300 transition-colors duration-300">
                          {item.question}
                        </span>
                      </div>
                      
                      <div className="text-zinc-500 group-hover:text-[#4285F4] transition-colors ml-4 flex-shrink-0">
                        {isOpen ? (
                          <span className="text-[#4285F4]"><ChevronUp size={18} /></span>
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </div>
                    </button>

                    {/* Collapsible Answer Content */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`faq-accordion-content-${item.id}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <div className="pb-6 pt-1 pr-4 text-sm font-sans text-zinc-400 font-normal leading-relaxed pl-4">
                            {item.answer}

                            {/* Category Indicator Tag */}
                            <div className="mt-4 flex items-center justify-between text-[11px] text-zinc-500 tracking-wide font-medium">
                              <span>
                                CATEGORY: <span className="text-[#4285F4] font-mono font-semibold uppercase">{item.category}</span>
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </motion.div>
                );
              })
            ) : (
              <motion.div
                id="faq-not-found"
                className="py-12 text-center text-zinc-500 font-medium border-b border-zinc-800/60"
              >
                No results found matching "{searchQuery}"
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
