import React from 'react';
import { motion } from 'motion/react';
import { ScreenState } from '../types';

interface NavbarProps {
  currentScreen: ScreenState;
  onNavigate: (screen: ScreenState) => void;
  onOpenMethod: (tab?: 'method' | 'evidence') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  onOpenMethod,
}) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-30 px-6 md:px-10 pt-6 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        {/* Left Pill: Custom Aperture/Clapper Mark + greenlight */}
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          id="nav-brand-button"
          onClick={() => onNavigate('hero')}
          className="group flex items-center gap-3 px-4 py-2.5 bg-[#0A0A0A]/90 hover:bg-[#111111] backdrop-blur-md rounded-full border border-white/10 transition-all duration-300 shadow-2xl hover:border-white/20"
          title="greenlight development executive"
        >
          {/* Custom Minimal Aperture / Clapper Icon */}
          <div className="w-5 h-5 flex items-center justify-center text-[#C6F400] transition-transform duration-500 group-hover:rotate-45">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <circle cx="12" cy="12" r="9" />
              <line x1="14.31" y1="8" x2="20.05" y2="17.94" />
              <line x1="9.69" y1="8" x2="21.17" y2="8" />
              <line x1="7.38" y1="12" x2="13.12" y2="2.06" />
              <line x1="9.69" y1="16" x2="3.95" y2="6.06" />
              <line x1="14.31" y1="16" x2="2.83" y2="16" />
              <line x1="16.62" y1="12" x2="10.88" y2="21.94" />
            </svg>
          </div>
          <span className="font-headline font-bold text-sm tracking-tight text-white lowercase">
            greenlight
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#C6F400] animate-pulse" />
        </motion.button>

        {/* Center Pill: room · method · evidence (hidden on mobile) */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          id="nav-center-menu"
          aria-label="studio controls"
          className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-[#0A0A0A]/90 backdrop-blur-md rounded-full border border-white/10 text-xs text-white/70"
        >
          <button
            id="nav-link-room"
            onClick={() => onNavigate('room')}
            className={`px-3 py-1 rounded-full transition-all duration-200 lowercase ${
              currentScreen === 'room'
                ? 'text-[#C6F400] bg-white/5 font-medium'
                : 'hover:text-white hover:bg-white/5'
            }`}
          >
            room
          </button>
          <span className="text-white/20">·</span>
          <button
            id="nav-link-method"
            onClick={() => onOpenMethod('method')}
            className="px-3 py-1 rounded-full transition-all duration-200 hover:text-white hover:bg-white/5 lowercase"
          >
            method
          </button>
          <span className="text-white/20">·</span>
          <button
            id="nav-link-evidence"
            onClick={() => onOpenMethod('evidence')}
            className="px-3 py-1 rounded-full transition-all duration-200 hover:text-white hover:bg-white/5 lowercase"
          >
            evidence
          </button>
        </motion.nav>

        {/* Right CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3"
        >
          {currentScreen === 'verdict' ? (
            <button
              id="nav-action-new-button"
              onClick={() => onNavigate('room')}
              className="px-5 py-2 rounded-full bg-[#C6F400] text-black font-semibold text-xs tracking-tight transition-all duration-300 hover:scale-[1.03] hover:bg-[#d4fa1e] shadow-lg shadow-[#C6F400]/10 lowercase btn-green-glow"
            >
              pitch new idea
            </button>
          ) : currentScreen === 'room' ? (
            <button
              id="nav-action-overview-button"
              onClick={() => onNavigate('hero')}
              className="px-5 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 font-medium text-xs tracking-tight transition-all duration-300 border border-white/10 lowercase"
            >
              overview
            </button>
          ) : (
            <button
              id="nav-action-enter-button"
              onClick={() => onNavigate('room')}
              className="px-5 py-2 rounded-full bg-white text-black font-semibold text-xs tracking-tight transition-all duration-300 hover:scale-[1.03] hover:bg-white/90 shadow-lg shadow-white/5 lowercase btn-green-glow"
            >
              enter the room
            </button>
          )}
        </motion.div>
      </div>
    </header>
  );
};
