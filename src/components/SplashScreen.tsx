import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import heroBg from '../assets/images/hero_portal_bg_1788961974950.jpg';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Automatically fade out after 1.4 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          key="splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          onClick={handleDismiss}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black cursor-pointer select-none overflow-hidden"
          aria-label="Studio loading screen"
        >
          {/* Subtle Dark Sci-Fi Background Plate with rich contrast */}
          <div
            className="absolute inset-0 pointer-events-none opacity-35"
            style={{
              backgroundImage: `url(${heroBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center right',
              filter: 'contrast(1.35) brightness(0.95) saturate(1.25)',
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.92) 80%, rgba(0,0,0,0.98) 100%)',
            }}
          />

          {/* Ambient Volumetric Green Glow */}
          <div
            className="absolute w-[500px] h-[500px] rounded-full pointer-events-none -translate-y-6"
            style={{
              background: 'radial-gradient(circle, rgba(198,244,0,0.18) 0%, rgba(16,185,129,0.06) 40%, rgba(0,0,0,0) 70%)',
            }}
          />

          {/* Minimal Film Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-2 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#C6F400] animate-ping" />
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/50">
              INT. INTELLIGENCE ROOM
            </span>
          </motion.div>

          {/* Centered Brand Mark */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-baseline relative"
          >
            <h1 className="font-headline font-black text-4xl sm:text-6xl tracking-[-0.05em] text-white lowercase">
              greenlight
            </h1>
            <span className="text-[#C6F400] text-4xl sm:text-6xl font-black">.</span>

            {/* Tally Beacon Lamp */}
            <div className="ml-2 w-2.5 h-2.5 rounded-full bg-[#C6F400] shadow-[0_0_12px_#C6F400]" />
          </motion.div>

          {/* Subtitle / System Spec */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 flex flex-col items-center gap-1.5 text-center"
          >
            <p className="font-mono text-xs text-white/40 lowercase tracking-wider">
              before you produce it, let ai challenge it
            </p>
            <span className="text-[10px] font-mono text-white/20 lowercase">
              tap anywhere to skip
            </span>
          </motion.div>

          {/* Bottom Audio/Timecode Reference */}
          <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between font-mono text-[10px] text-white/20">
            <span>TC 00:00:00:01</span>
            <span>PARALLEL SEARCH RUNTIME</span>
            <span>24 FPS</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
