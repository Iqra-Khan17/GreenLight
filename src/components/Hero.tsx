import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import heroBg from '../assets/images/hero_portal_bg_1788961974950.jpg';

interface HeroProps {
  onEnterRoom: () => void;
  onExploreMethod: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onEnterRoom, onExploreMethod }) => {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between pt-28 pb-10 px-4 sm:px-6 md:px-10 overflow-hidden bg-black text-white selection:bg-[#C6F400] selection:text-black">
      {/* Cinematic Dark Sci-Fi Landscape Background:
          - High-contrast near-black obsidian rocky terrain
          - Vivid emerald atmospheric fog and volumetric lighting
          - Distinct glowing lime-green doorway portal on the right
          - Carefully sculpted gradient keeping the left headline area deep black & legible while letting the portal shine
      */}
      <div
        className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden"
        aria-hidden="true"
      >
        {/* Cinematic landscape plate with enhanced contrast, saturation, and visibility */}
        <div
          className="absolute inset-0 w-full h-full opacity-45 sm:opacity-50 transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center right',
            backgroundRepeat: 'no-repeat',
            filter: 'contrast(1.25) brightness(1.06) saturate(1.20)',
          }}
        />

        {/* Volumetric emerald & lime glow bloom directly amplifying the portal on the right */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              'radial-gradient(circle at 82% 48%, rgba(198, 244, 0, 0.16) 0%, rgba(16, 185, 129, 0.08) 32%, transparent 68%)',
          }}
        />

        {/* Sculpted directional gradient:
            - Deep obsidian black on the left (0% - 45%) for pristine typographic readability
            - Open clarity on the right (65% - 90%) to showcase the portal and landscape
            - Seamless top/bottom cinematic fade into the pure black frame */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              'linear-gradient(90deg, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.90) 38%, rgba(0,0,0,0.65) 60%, rgba(0,0,0,0.15) 82%, rgba(0,0,0,0.45) 100%), linear-gradient(180deg, rgba(0,0,0,0.80) 0%, transparent 18%, transparent 82%, rgba(0,0,0,0.98) 100%)',
          }}
        />
      </div>

      {/* Huge Faint Typographic Watermarks */}
      <div
        className="watermark-text absolute top-10 -left-10 text-[18vw] leading-none pointer-events-none select-none z-0"
        aria-hidden="true"
      >
        REWORK
      </div>
      <div
        className="watermark-text absolute -bottom-10 -right-10 text-[20vw] leading-none pointer-events-none select-none text-right z-0"
        aria-hidden="true"
      >
        PASS
      </div>

      {/* Slow Drifting Radial Glow Behind Headlines */}
      <div
        className="radial-drift-glow pointer-events-none top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
        aria-hidden="true"
      />

      {/* Center Cinematic Content */}
      <div className="relative z-10 max-w-5xl mx-auto w-full my-auto flex flex-col items-start justify-center">
        {/* Studio Status Pill */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A0A0A] border border-white/10 text-xs text-white/70 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#C6F400]" />
          <span className="font-mono text-[11px] tracking-wider uppercase text-white/50">
            INT. INTELLIGENCE ROOM
          </span>
          <span className="text-white/20">|</span>
          <span className="lowercase">the ai development executive</span>
        </motion.div>

        {/* Staggered Giant Words (lowercase) */}
        <div className="flex flex-col mb-8 select-none w-full max-w-full">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-headline font-extrabold text-[clamp(1.85rem,6.2vw,5rem)] tracking-[-0.04em] leading-[0.95] text-white/40 lowercase"
          >
            don’t
          </motion.h1>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="font-headline font-extrabold text-[clamp(1.85rem,6.2vw,5rem)] tracking-[-0.04em] leading-[0.95] text-white/70 lowercase"
          >
            just make it.
          </motion.h1>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="font-headline font-extrabold text-[clamp(2rem,7.2vw,6.2rem)] tracking-[-0.04em] leading-[0.96] text-white lowercase flex items-baseline max-w-full whitespace-nowrap"
          >
            <span className="relative inline-block">
              greenlight
              {/* Film-set camera tally signal lamp top-right of the word "greenlight" */}
              <div
                className="absolute -top-2 sm:-top-3 md:-top-4 -right-2 sm:-right-3 md:-right-4 flex items-center justify-center pointer-events-none select-none"
                aria-label="film-set camera green light signal"
              >
                {/* Horizontal lens flare */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 sm:w-20 md:w-28 h-[1.5px] bg-gradient-to-r from-transparent via-[#C6F400] to-transparent tally-lens-flare pointer-events-none" />

                {/* Soft expanding glow ring */}
                <div className="absolute inset-0 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full border border-[#C6F400]/70 tally-glow-ring pointer-events-none" />

                {/* Circular lamp with machined metal rim */}
                <div className="relative w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-b from-[#666666] via-[#2a2a2a] to-[#0d0d0d] p-[2px] sm:p-[2.5px] shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.4),0_2px_8px_rgba(0,0,0,0.9)] flex items-center justify-center">
                  {/* Outer bevel ring */}
                  <div className="w-full h-full rounded-full border border-black/80 bg-black flex items-center justify-center p-[1.5px]">
                    {/* Glass bulb lens that pops bright #C6F400 every 4s */}
                    <div className="w-full h-full rounded-full tally-lamp-core relative overflow-hidden">
                      {/* Glass specular arc */}
                      <div className="absolute top-[10%] left-[15%] w-[45%] h-[30%] rounded-full bg-white/60 blur-[0.5px]" />
                    </div>
                  </div>
                </div>
              </div>
            </span>
            <span className="ml-2 sm:ml-3 md:ml-4">it</span>
            <span className="text-[#C6F400]">.</span>
          </motion.h1>
        </div>

        {/* Short Line Under */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl font-body leading-relaxed mb-10 lowercase"
        >
          ai that can say no. research the live web. challenge the concept. decide what deserves production.
        </motion.p>

        {/* Action Controls */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.40, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center gap-4"
        >
          <button
            id="hero-enter-room-cta"
            onClick={onEnterRoom}
            className="group px-8 py-4 rounded-full bg-white text-black font-headline font-bold text-sm tracking-tight transition-all duration-300 hover:scale-[1.02] hover:bg-[#C6F400] shadow-2xl flex items-center gap-3 lowercase btn-green-glow"
          >
            <span>enter the room</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          <button
            id="hero-method-cta"
            onClick={onExploreMethod}
            className="px-6 py-4 rounded-full bg-[#0A0A0A] hover:bg-[#111111] text-white/70 hover:text-white border border-white/10 font-body text-sm transition-all duration-300 backdrop-blur-md lowercase"
          >
            read the methodology
          </button>
        </motion.div>
      </div>

      {/* Bottom Stats Line */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.85 }}
        className="relative z-10 max-w-7xl mx-auto w-full pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/40 lowercase"
      >
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C6F400]" />
          <span>ideas in. evidence out.</span>
        </div>

        <div className="flex items-center gap-2 tracking-wide">
          <span className="text-[#C6F400]">greenlight</span>
          <span className="text-white/20">·</span>
          <span className="text-[#FFB020]">rework</span>
          <span className="text-white/20">·</span>
          <span className="text-[#FF4D4D]">pass</span>
        </div>
      </motion.footer>
    </section>
  );
};
