import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Scale, Cpu, Search } from 'lucide-react';
import { DIMENSION_LABELS } from '../types';

interface MethodModalProps {
  isOpen: boolean;
  activeTab: 'method' | 'evidence';
  onClose: () => void;
  onSelectTab: (tab: 'method' | 'evidence') => void;
}

export const MethodModal: React.FC<MethodModalProps> = ({
  isOpen,
  activeTab,
  onClose,
  onSelectTab,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-3xl w-full max-h-[85vh] overflow-y-auto bg-[#0A0A0A] border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl text-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#C6F400]" />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectTab('method')}
                  className={`font-headline font-bold text-lg sm:text-xl tracking-tight transition-colors lowercase ${
                    activeTab === 'method' ? 'text-[#C6F400]' : 'text-white/40 hover:text-white'
                  }`}
                >
                  the method
                </button>
                <span className="text-white/20">·</span>
                <button
                  onClick={() => onSelectTab('evidence')}
                  className={`font-headline font-bold text-lg sm:text-xl tracking-tight transition-colors lowercase ${
                    activeTab === 'evidence' ? 'text-[#C6F400]' : 'text-white/40 hover:text-white'
                  }`}
                >
                  evidence protocol
                </button>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="mt-6 space-y-6">
            {activeTab === 'method' ? (
              <>
                <div className="p-4 rounded-2xl bg-[#111111]/70 border border-white/5">
                  <p className="font-body text-xs sm:text-sm text-white/80 leading-relaxed lowercase">
                    traditional media development relies on gut feeling and yes-men. GREENLIGHT functions as a ruthless studio development executive designed to say no early, before thousands of production hours and capital are squandered.
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase tracking-widest text-[#C6F400] mb-3">
                    THE 7 SCORING DIMENSIONS (100 TOTAL PTS)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(DIMENSION_LABELS).map(([key, info]) => (
                      <div
                        key={key}
                        className="p-3.5 rounded-xl bg-black border border-white/5"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-headline font-bold text-xs text-white capitalize">
                            {info.label}
                          </span>
                          <span className="font-mono text-xs text-[#C6F400]">
                            {info.max} pts
                          </span>
                        </div>
                        <p className="text-[11px] text-white/50 font-body lowercase">
                          {info.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-black border border-white/5 space-y-2">
                  <h5 className="text-xs font-mono text-white/40 uppercase">
                    DETERMINATION CRITERIA
                  </h5>
                  <div className="flex flex-col gap-1.5 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-[#C6F400]">🟢 GREENLIGHT (≥ 75)</span>
                      <span className="text-white/40">— immediate production priority</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#FFB020]">🟡 REWORK (54–74)</span>
                      <span className="text-white/40">— compelling hook requiring structural focus</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#FF4D4D]">🔴 PASS (&lt; 54)</span>
                      <span className="text-white/40">— saturated or economically non-defensible</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="p-4 rounded-2xl bg-[#111111]/70 border border-white/5">
                  <p className="font-body text-xs sm:text-sm text-white/80 leading-relaxed lowercase">
                    we never fabricate URLs or hallucinate citations. every claim, competitor scan, and market gap is evaluated against indexed cultural datasets and live web queries.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-black border border-white/5">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#C6F400] mb-1.5 lowercase">
                      <Search className="w-4 h-4" />
                      <span>parallel search indexing</span>
                    </div>
                    <p className="text-xs text-white/70 font-body lowercase">
                      our pipeline isolates competitive video releases, recent journalistic investigations, and social media discourse velocity. When parallel search integration is pending, citations are transparently labeled as index pending rather than fabricated.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-black border border-white/5">
                    <div className="flex items-center gap-2 text-xs font-mono text-white/40 mb-1.5 lowercase">
                      <Scale className="w-4 h-4 text-[#C6F400]" />
                      <span>the contrarian autopsy rule</span>
                    </div>
                    <p className="text-xs text-white/70 font-body lowercase">
                      every greenlight dossier requires an uncompromising contrarian case that pinpoints the single most devastating cognitive blind spot of the pitch.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-white/10 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-full bg-white text-black font-semibold text-xs transition-all hover:bg-white/90 lowercase"
            >
              close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
