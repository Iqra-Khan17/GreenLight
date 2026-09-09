import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Compass,
  FileSpreadsheet,
  Flame,
  HelpCircle,
  Lightbulb,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Zap,
} from 'lucide-react';
import { IdeaVerdict, DecisionType } from '../types';
import { ScoreBar } from './ScoreBar';
import { EvidenceCard } from './EvidenceCard';
import { Blueprint } from './Blueprint';

interface VerdictProps {
  verdicts: IdeaVerdict[];
  onNewPitch: () => void;
  onChallengeAgain: (verdict: IdeaVerdict) => void;
}

function useCountUp(target: number, duration: number = 1000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = target;
    if (start === end) {
      setCount(end);
      return;
    }

    const stepTime = 20;
    const totalSteps = duration / stepTime;
    const increment = (end - start) / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if ((increment > 0 && start >= end) || (increment < 0 && start <= end)) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [target, duration]);

  return count;
}

export const Verdict: React.FC<VerdictProps> = ({
  verdicts,
  onNewPitch,
  onChallengeAgain,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showBlueprint, setShowBlueprint] = useState(false);
  const [lampSettled, setLampSettled] = useState(false);

  const activeVerdict = verdicts[selectedIndex] || verdicts[0];
  const animatedScore = useCountUp(activeVerdict?.score || 0, 1100);

  // When active verdict changes, trigger lamp slam -> corner settle
  useEffect(() => {
    setLampSettled(false);
    const timer = setTimeout(() => {
      setLampSettled(true);
    }, 1100);
    return () => clearTimeout(timer);
  }, [activeVerdict?.id]);

  if (!activeVerdict) return null;

  const isGreenlight = activeVerdict.decision === 'greenlight';
  const isRework = activeVerdict.decision === 'rework';
  const isPass = activeVerdict.decision === 'pass';

  const getDecisionStamp = (decision: DecisionType) => {
    switch (decision) {
      case 'greenlight':
        return {
          icon: '🟢',
          text: 'greenlight',
          color: '#C6F400',
          bg: 'bg-[#C6F400]/10',
          border: 'border-[#C6F400]/40',
          textColor: 'text-[#C6F400]',
        };
      case 'rework':
        return {
          icon: '🟡',
          text: 'rework',
          color: '#FFB020',
          bg: 'bg-[#FFB020]/10',
          border: 'border-[#FFB020]/40',
          textColor: 'text-[#FFB020]',
        };
      case 'pass':
        return {
          icon: '🔴',
          text: 'pass',
          color: '#FF4D4D',
          bg: 'bg-[#FF4D4D]/10',
          border: 'border-[#FF4D4D]/40',
          textColor: 'text-[#FF4D4D]',
        };
    }
  };

  const stamp = getDecisionStamp(activeVerdict.decision);

  return (
    <section className="relative min-h-screen w-full pt-28 pb-24 px-6 md:px-10 bg-black text-white selection:bg-[#C6F400] selection:text-black">
      {/* 1.2s Full Screen Flash according to verdict decision */}
      <div
        key={`flash-${activeVerdict.id}`}
        className={`fixed inset-0 pointer-events-none z-50 ${
          isGreenlight
            ? 'animate-[screenFlashGreen_1.2s_ease-out_forwards]'
            : isRework
            ? 'animate-[screenFlashAmber_1.2s_ease-out_forwards]'
            : 'animate-[screenFlashRed_1.2s_ease-out_forwards]'
        }`}
        aria-hidden="true"
      />

      {/* GREENLIGHT Lamp: Slams on in center, then settles into corner indicator */}
      {isGreenlight && (
        <motion.div
          key={`lamp-${activeVerdict.id}`}
          initial={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            x: '-50%',
            y: '-50%',
            scale: 2.8,
            opacity: 0,
            zIndex: 60,
          }}
          animate={
            lampSettled
              ? {
                  position: 'fixed',
                  top: '24px',
                  right: '28px',
                  left: 'auto',
                  x: 0,
                  y: 0,
                  scale: 1,
                  opacity: 1,
                  zIndex: 35,
                }
              : {
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  x: '-50%',
                  y: '-50%',
                  scale: 2.5,
                  opacity: 1,
                  zIndex: 60,
                }
          }
          transition={{
            duration: lampSettled ? 0.75 : 0.2,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="pointer-events-none select-none flex items-center justify-center"
          aria-label="camera green light indicator"
        >
          {/* Expanding glow bloom when centered */}
          {!lampSettled && (
            <div className="absolute -inset-10 rounded-full border border-[#C6F400]/60 animate-ping pointer-events-none" />
          )}

          {/* Horizontal lens flare when centered */}
          {!lampSettled && (
            <div className="absolute w-80 h-[2px] bg-gradient-to-r from-transparent via-[#C6F400] to-transparent shadow-[0_0_24px_#C6F400] pointer-events-none" />
          )}

          {/* Machined Metal Rim Studio Signal Lamp */}
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-b from-[#777] via-[#2a2a2a] to-[#0a0a0a] p-[3px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.5),0_0_24px_rgba(198,244,0,0.6),0_10px_30px_rgba(0,0,0,0.8)] flex items-center justify-center">
            <div className="w-full h-full rounded-full border border-black/80 bg-black flex items-center justify-center p-[2px]">
              <div className="w-full h-full rounded-full bg-[#C6F400] shadow-[0_0_16px_#C6F400,0_0_32px_rgba(198,244,0,0.9)] relative overflow-hidden animate-pulse">
                <div className="absolute top-[12%] left-[16%] w-[40%] h-[30%] rounded-full bg-white/70 blur-[0.5px]" />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Slow Drifting Radial Glow matched to decision */}
      <div
        className="radial-drift-glow pointer-events-none top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          background: `radial-gradient(circle, ${stamp.color}15 0%, ${stamp.color}00 70%)`,
        }}
        aria-hidden="true"
      />

      <div className="max-w-5xl mx-auto w-full relative z-10">
        {/* Top Intelligence Meta */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-white/50">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stamp.color }} />
            <span>EXECUTIVE VERDICT DOSSIER</span>
            <span className="text-white/20">|</span>
            <span className="lowercase">{activeVerdict.originalIdea.format}</span>
          </div>

          {/* If Multiple Ideas: Rank switcher pills */}
          {verdicts.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-white/40 mr-1 lowercase">ranked concepts:</span>
              {verdicts.map((v, idx) => {
                const s = getDecisionStamp(v.decision);
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={v.id}
                    id={`verdict-rank-tab-${idx}`}
                    onClick={() => {
                      setSelectedIndex(idx);
                      setShowBlueprint(false);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 lowercase ${
                      isSelected
                        ? 'bg-white text-black font-semibold shadow-lg'
                        : 'bg-[#111111] text-white/70 hover:text-white border border-white/10'
                    }`}
                  >
                    <span>#{v.rank}</span>
                    <span className="text-xs">{s.icon}</span>
                    <span className="text-white/40 text-[10px]">{v.score}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* The Money Screen: Huge Decision Stamp + Giant Score in 3D Card */}
        <div className="card-3d-wrap mb-12">
          <motion.div
            key={activeVerdict.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="card-3d relative bg-[#0A0A0A]/95 rounded-3xl p-6 sm:p-12 shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-10">
              {/* Left: Decision Stamp */}
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-white/40 mb-3">
                  OFFICIAL DETERMINATION
                </div>
                <div
                  className={`inline-flex items-center gap-3 px-6 py-2.5 rounded-full ${stamp.bg} border ${stamp.border} ${stamp.textColor} shadow-lg`}
                >
                  <span className="text-2xl">{stamp.icon}</span>
                  <span className="font-headline font-extrabold text-2xl sm:text-3xl tracking-tight uppercase">
                    {stamp.text}
                  </span>
                </div>
                <p className="text-xs font-mono text-white/40 mt-3 lowercase">
                  format: {activeVerdict.originalIdea.format} · target: {activeVerdict.originalIdea.audience || 'open cultural audience'}
                </p>
              </div>

              {/* Right: Giant Score /100 with count-up */}
              <div className="flex items-baseline gap-2 select-none">
                <div className="font-headline font-extrabold text-7xl sm:text-9xl tracking-[-0.05em] leading-none text-white">
                  {animatedScore}
                </div>
                <div className="font-mono text-2xl sm:text-3xl text-white/30 font-bold">
                  /100
                </div>
              </div>
            </div>

            {/* Original Concept Line */}
            <div className="mb-8 p-4 rounded-2xl bg-black/50 border border-white/5">
              <span className="text-xs font-mono text-white/40 block mb-1 lowercase">
                tested concept:
              </span>
              <p className="font-body text-sm sm:text-base text-white/90 leading-relaxed lowercase">
                "{activeVerdict.originalIdea.concept}"
              </p>
            </div>

            {/* Executive Note in Large Italic-Feeling Type */}
            <div className="mb-10 pb-8 border-b border-white/10">
              <span className="text-xs font-mono uppercase tracking-widest text-white/40 block mb-3">
                EXECUTIVE NOTE
              </span>
              <p className="font-headline font-bold text-xl sm:text-2xl md:text-3xl text-white/90 leading-relaxed italic tracking-tight lowercase">
                "{activeVerdict.executiveNote}"
              </p>
            </div>

            {/* Grid of 7 Dimension Bars */}
            <div className="mb-10">
              <ScoreBar
                dimensions={activeVerdict.dimensions}
                decision={activeVerdict.decision}
              />
            </div>

            {/* Primary Action Buttons: "challenge this idea" · "build production blueprint" */}
            <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-white/10">
              <button
                id="verdict-challenge-idea-btn"
                onClick={() => onChallengeAgain(activeVerdict)}
                className="px-6 py-3.5 rounded-full bg-[#111111] hover:bg-white/10 text-white font-body text-xs sm:text-sm border border-white/10 hover:border-white/30 transition-all duration-300 flex items-center gap-2 lowercase"
              >
                <RotateCcw className="w-4 h-4 text-[#C6F400]" />
                <span>challenge this idea again</span>
              </button>

              <button
                id="verdict-toggle-blueprint-btn"
                onClick={() => setShowBlueprint((prev) => !prev)}
                className="px-8 py-3.5 rounded-full bg-white hover:bg-[#C6F400] text-black font-headline font-bold text-xs sm:text-sm tracking-tight transition-all duration-300 hover:scale-[1.02] shadow-xl flex items-center gap-2 lowercase btn-green-glow"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>{showBlueprint ? 'hide production blueprint' : 'build production blueprint'}</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Blueprint Dossier Panel (Toggle) */}
        <AnimatePresence>
          {showBlueprint && (
            <Blueprint
              blueprint={activeVerdict.blueprint}
              onClose={() => setShowBlueprint(false)}
            />
          )}
        </AnimatePresence>

        {/* Deep Analysis Sections with 3D Luxury Cards */}
        <div className="space-y-8 mt-12">
          {/* Section: Why Now & What Already Exists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-3d-wrap">
              <div className="card-3d bg-[#0A0A0A] rounded-3xl p-6 sm:p-8 h-full">
                <div className="flex items-center gap-2 text-xs font-mono text-[#C6F400] mb-3 uppercase tracking-wider">
                  <Flame className="w-4 h-4" />
                  <span>why now / cultural velocity</span>
                </div>
                <h3 className="font-headline font-bold text-xl text-white mb-3 lowercase">
                  why now
                </h3>
                <p className="text-sm text-white/70 font-body leading-relaxed lowercase">
                  {activeVerdict.whyNow}
                </p>
              </div>
            </div>

            <div className="card-3d-wrap">
              <div className="card-3d bg-[#0A0A0A] rounded-3xl p-6 sm:p-8 h-full">
                <div className="flex items-center gap-2 text-xs font-mono text-white/40 mb-3 uppercase tracking-wider">
                  <Compass className="w-4 h-4" />
                  <span>landscape scan</span>
                </div>
                <h3 className="font-headline font-bold text-xl text-white mb-3 lowercase">
                  what already exists
                </h3>
                <p className="text-sm text-white/70 font-body leading-relaxed lowercase">
                  {activeVerdict.whatAlreadyExists}
                </p>
              </div>
            </div>
          </div>

          {/* Section: What's Missing / Content Gap */}
          <div className="card-3d-wrap">
            <div className="card-3d bg-[#0A0A0A] rounded-3xl p-6 sm:p-8">
              <div className="flex items-center gap-2 text-xs font-mono text-[#C6F400] mb-3 uppercase tracking-wider">
                <Zap className="w-4 h-4" />
                <span>unmet viewer hunger</span>
              </div>
              <h3 className="font-headline font-bold text-xl text-white mb-3 lowercase">
                what’s missing
              </h3>
              <p className="text-sm sm:text-base text-white/80 font-body leading-relaxed lowercase">
                {activeVerdict.contentGap}
              </p>
            </div>
          </div>

          {/* Section: The Contrarian ("your biggest weakness is...") */}
          <div className="card-3d-wrap">
            <div className="card-3d bg-[#0A0A0A] rounded-3xl p-6 sm:p-8 relative overflow-hidden">
              <div className="flex items-center gap-2 text-xs font-mono text-[#FF4D4D] mb-3 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>THE CONTRARIAN AUTOPSY</span>
              </div>
              <h3 className="font-headline font-bold text-xl sm:text-2xl text-white mb-3 lowercase">
                your biggest weakness is…
              </h3>
              <p className="text-sm sm:text-base text-white/90 font-body leading-relaxed italic lowercase">
                {activeVerdict.contrarianCase}
              </p>
            </div>
          </div>

          {/* Section: Better Angle */}
          <div className="card-3d-wrap">
            <div className="card-3d bg-[#0A0A0A] rounded-3xl p-6 sm:p-8">
              <div className="flex items-center gap-2 text-xs font-mono text-[#C6F400] mb-3 uppercase tracking-wider">
                <Lightbulb className="w-4 h-4" />
                <span>STRATEGIC PIVOT RECOMMENDATION</span>
              </div>
              <h3 className="font-headline font-bold text-xl sm:text-2xl text-white mb-2 lowercase">
                better angle: {activeVerdict.recommendedAngle.title}
              </h3>
              <p className="text-sm sm:text-base text-white/80 font-body leading-relaxed mb-4 lowercase">
                {activeVerdict.recommendedAngle.description}
              </p>
              <div className="p-4 rounded-2xl bg-black/60 border border-white/5 text-xs font-mono text-[#C6F400] lowercase">
                <span className="text-white/40">why it scores higher: </span>
                {activeVerdict.recommendedAngle.whyItScoresHigher}
              </div>
            </div>
          </div>

          {/* Section: Strengths & Risks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-3d-wrap">
              <div className="card-3d bg-[#0A0A0A] rounded-3xl p-6 h-full">
                <span className="text-xs font-mono text-[#C6F400] block mb-3 uppercase tracking-wider">
                  COMPETITIVE MOATS
                </span>
                <ul className="space-y-2.5 text-xs sm:text-sm text-white/80 font-body lowercase">
                  {activeVerdict.strengths.map((str, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#C6F400] shrink-0 mt-0.5" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="card-3d-wrap">
              <div className="card-3d bg-[#0A0A0A] rounded-3xl p-6 h-full">
                <span className="text-xs font-mono text-[#FFB020] block mb-3 uppercase tracking-wider">
                  DOWNSTREAM HAZARDS
                </span>
                <ul className="space-y-2.5 text-xs sm:text-sm text-white/80 font-body lowercase">
                  {activeVerdict.risks.map((risk, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ShieldAlert className="w-4 h-4 text-[#FFB020] shrink-0 mt-0.5" />
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Section: Evidence Cards */}
          <div className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-mono text-white/50 uppercase tracking-wider">
                <Compass className="w-4 h-4 text-[#C6F400]" />
                <span>EVIDENCE & LIVE WEB CITATIONS</span>
              </div>
              <span className="text-xs font-mono text-white/30 lowercase">
                {activeVerdict.sources.length > 0
                  ? `${activeVerdict.sources.length} sources indexed`
                  : 'parallel search unavailable'}
              </span>
            </div>

            {activeVerdict.sources && activeVerdict.sources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                {activeVerdict.sources.map((src, i) => (
                  <EvidenceCard key={i} source={src} />
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-[#0A0A0A] border border-white/10 text-center flex flex-col items-center justify-center gap-2">
                <Compass className="w-6 h-6 text-white/20 mb-1" />
                <span className="font-mono text-xs text-white/60 lowercase tracking-wide">
                  parallel search unavailable
                </span>
                <span className="text-[11px] font-mono text-white/30 lowercase">
                  live research index was not queried or returned no citations
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation Control */}
        <div className="mt-16 pt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={onNewPitch}
            className="px-8 py-3.5 rounded-full bg-white hover:bg-[#C6F400] text-black font-headline font-bold text-xs sm:text-sm tracking-tight transition-all duration-300 hover:scale-[1.02] shadow-xl lowercase btn-green-glow"
          >
            pitch another concept
          </button>

          <span className="text-xs font-mono text-white/40 lowercase">
            greenlight executive suite · before you produce it, let AI challenge it.
          </span>
        </div>
      </div>
    </section>
  );
};
