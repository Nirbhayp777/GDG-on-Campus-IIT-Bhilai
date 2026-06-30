import React, { useState } from 'react';
import { Mail, MapPin, Linkedin, Instagram, Github, Youtube, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { ContactMessage } from '../types';
import ScrambleText from './ScrambleText';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  
  // Storing messages in reactive memory to simulate a real inbox
  const [submittedMessages, setSubmittedMessages] = useState<ContactMessage[]>([
    {
      id: 'm-init-1',
      name: 'Harish Dewangan',
      email: 'harishd@iitbhilai.ac.in',
      message: 'When will the Cloud Study Jams start? Is prior docker experience needed?',
      timestamp: '2026-06-05, 4:10 PM'
    },
    {
      id: 'm-init-2',
      name: 'Simran Saini',
      email: 'simrans@iitbhilai.ac.in',
      message: 'I am from Metallurgy branch, can I join the AI/ML research cohort?',
      timestamp: '2026-06-06, 11:35 AM'
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setStatus('submitting');

    // Simulate server side delays
    setTimeout(() => {
      const newMessage: ContactMessage = {
        id: `m-${Date.now()}`,
        name,
        email,
        message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today'
      };

      setSubmittedMessages((prev) => [newMessage, ...prev]);
      setStatus('success');
      
      // Clear form inputs
      setName('');
      setEmail('');
      setMessage('');
    }, 1200);
  };

  return (
    <section id="contact" className="relative py-20 overflow-hidden bg-black">

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading matching other sections & left aligned */}
        <div className="text-left mb-16 max-w-4xl">
          <h2 className="text-4xl sm:text-6xl font-display font-extrabold text-white leading-none">
            <ScrambleText text="Get In Touch" />
          </h2>
          <div className="h-1.5 w-24 bg-gradient-to-r from-brand-blue via-brand-red to-brand-green mt-6 rounded-full" />
          <p className="text-lg sm:text-xl font-sans font-normal text-zinc-300 mt-8 leading-relaxed">
            Have questions or partnership suggestions? Submit a query message and our core team will respond promptly.
          </p>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left panel: Info Coordinates & Social Handles */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-12">
            
            <div className="space-y-8">
              <h3 className="text-xl font-display font-bold text-white leading-tight uppercase tracking-wider">
                IIT Bhilai Chapter <br />
                <span className="text-zinc-500 font-sans font-normal text-sm normal-case tracking-normal">Communication Coordinates</span>
              </h3>
              <p className="text-sm font-sans text-zinc-400 leading-relaxed">
                For partnerships, speaker sponsorships, solution collaborations, or academic issues, reach out through the specified official channels. Or join our chapter on the community hub.
              </p>

              {/* Direct Metrics List */}
              <div className="space-y-6 pt-4 border-t border-zinc-800/60">
                                {/* Physical Address of IIT Bhilai */}
                <div className="flex items-start gap-4 pb-6 border-b border-zinc-800/60">
                  <MapPin size={20} className="text-[#4285F4] mt-1 flex-shrink-0" />
                  <div>
                    <span className="text-zinc-300 text-xs font-display uppercase tracking-wider block">Campus Location</span>
                    <p className="text-zinc-400 text-sm font-sans mt-2 leading-relaxed">
                      Indian Institute of Technology Bhilai, <br />
                      Kutelabhata, Khapri, Durg, <br />
                      Chhattisgarh, India - 491001
                    </p>
                  </div>
                </div>

                {/* Email Address */}
                <div className="flex items-start gap-4 pb-6">
                  <Mail size={20} className="text-[#4285F4] mt-1 flex-shrink-0" />
                  <div>
                    <span className="text-zinc-300 text-xs font-display uppercase tracking-wider block">E-mail</span>
                    <a 
                       id="contact-email-link"
                       href="mailto:gdg@iitbhilai.ac.in" 
                       className="text-[#4285F4] hover:text-white text-sm font-sans block mt-2 hover:underline transition-colors"
                    >
                      gdg@iitbhilai.ac.in
                    </a>
                    <span className="text-[10px] text-zinc-500 font-mono italic mt-1 block">Primary communication box</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Social Media Grids */}
            <div className="space-y-4 pt-8 border-t border-zinc-800/60">
              <h4 className="text-xs font-display text-zinc-500 uppercase tracking-widest font-bold">
                GDG IIT Bhilai Handles
              </h4>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                <a
                  id="social-linkedin"
                  href="https://linkedin.com/company/gdg-iit-bhilai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-zinc-400 hover:text-[#0A66C2] text-xs font-sans font-medium transition-colors duration-300"
                >
                  <Linkedin size={14} />
                  <span>LinkedIn</span>
                </a>
                <a
                  id="social-instagram"
                  href="https://instagram.com/gdg_iit_bhilai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-zinc-400 hover:text-[#E1306C] text-xs font-sans font-medium transition-colors duration-300"
                >
                  <Instagram size={14} />
                  <span>Instagram</span>
                </a>
                <a
                  id="social-github"
                  href="https://github.com/gdg-iit-bhilai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-zinc-400 hover:text-[#ffffff] text-xs font-sans font-medium transition-colors duration-300"
                >
                  <Github size={14} />
                  <span>GitHub</span>
                </a>
                <a
                  id="social-youtube"
                  href="https://youtube.com/@gdg_iit_bhilai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-zinc-400 hover:text-[#FF0000] text-xs font-sans font-medium transition-colors duration-300"
                >
                  <Youtube size={14} />
                  <span>YouTube</span>
                </a>
              </div>
            </div>

          </div>

          {/* Right panel: Minimal line-based form module */}
          <div className="lg:col-span-7">
            <div className="relative w-full h-full flex flex-col justify-between">
              
              {/* Core Form Element */}
              {status !== 'success' ? (
                <form id="contact-submission-form" onSubmit={handleSubmit} className="space-y-8">
                  <div className="pb-4 border-b border-zinc-800/60">
                    <span className="text-white font-display font-bold text-sm uppercase tracking-wider block">
                      Send Query Message
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label htmlFor="contact-name" className="text-xs font-sans text-zinc-400 font-semibold tracking-wider uppercase">
                        Full Name / Student ID
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Rahul Sharma"
                        className="w-full px-0 py-3 bg-transparent border-b border-zinc-800 text-white placeholder-zinc-600 text-sm outline-none focus:border-[#4285F4] transition-all duration-300 rounded-none font-sans"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="contact-email" className="text-xs font-sans text-zinc-400 font-semibold tracking-wider uppercase">
                        Personal / Academic Email Link
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="rahul@iitbhilai.ac.in"
                        className="w-full px-0 py-3 bg-transparent border-b border-zinc-800 text-white placeholder-zinc-600 text-sm outline-none focus:border-[#4285F4] transition-all duration-300 rounded-none font-sans"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="contact-message" className="text-xs font-sans text-zinc-400 font-semibold tracking-wider uppercase">
                      What is on your mind?
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type details of your technical query or workshop sponsorship concept..."
                      className="w-full px-0 py-3 bg-transparent border-b border-zinc-800 text-white placeholder-zinc-600 text-sm outline-none focus:border-[#4285F4] resize-none transition-all duration-300 rounded-none font-sans"
                    />
                  </div>

                  <div className="flex justify-center w-full pt-4">
                    <button
                      id="contact-submit-btn"
                      type="submit"
                      disabled={status === 'submitting'}
                    >
                      {status === 'submitting' ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          <span>Verifying Coordinates...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Message to Core Crew</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <motion.div
                  id="contact-form-success"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-start text-left py-4 space-y-6"
                >
                  <div className="p-3 rounded-full bg-zinc-900 text-[#4285F4] border border-zinc-800/80">
                    <CheckCircle2 size={32} />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-2xl font-display font-bold text-white">
                      Coordinates Received Successfully!
                    </h3>
                    <p className="text-sm font-sans text-zinc-400 leading-relaxed max-w-lg">
                      Thank you! Your message has been routed to the student core coordinators of GDG IIT Bhilai. We will reach back to you within 24 hours.
                    </p>
                  </div>

                  <button
                    id="submit-another-query-btn"
                    onClick={() => setStatus('idle')}
                    className="text-xs font-display font-bold text-zinc-400 hover:text-[#4285F4] transition-colors cursor-pointer"
                  >
                    Submit another query message
                  </button>
                </motion.div>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
