import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Terminal, Film, Clock } from 'lucide-react';
import { IdeaInput } from '../types';

interface RunningProps {
  ideas: IdeaInput[];
  onComplete: () => void;
  isAnalysisReady: boolean;
}

const STEPS = [
  { id: '01', title: '01 understanding concept', detail: 'parsing core premise, format demands, and audience psychographics' },
  { id: '02', title: '02 scanning the live web', detail: 'indexing cultural zeitgeist, trade publications, and recent launches' },
  { id: '03', title: '03 mapping competing narratives', detail: 'cross-referencing documentary releases, youtube essays, and streaming catalogs' },
  { id: '04', title: '04 finding content gaps', detail: 'isolating unaddressed questions and unmet narrative hunger' },
  { id: '05', title: '05 challenging the concept', detail: 'applying ruthless editorial contrarian stress-tests and risk models' },
  { id: '06', title: '06 calculating opportunity', detail: 'scoring 7 weighted dimensions: audience, novelty, momentum, competition, evidence, feasibility, differentiation' },
  { id: '07', title: '07 making the call', detail: 'synthesizing studio verdict, executive note, and full production blueprint' },
];

export const Running: React.FC<RunningProps> = ({
  ideas,
  onComplete,
  isAnalysisReady,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [elapsedMs, setElapsedMs] = useState(0);

  // Time elapsed counter: 00:00.0 running in top-right
  useEffect(() => {
    const startTime = performance.now();
    const interval = setInterval(() => {
      setElapsedMs(performance.now() - startTime);
    }, 40);

    return () => clearInterval(interval);
  }, []);

  const formatElapsed = (ms: number) => {
    const totalSeconds = ms / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const tenths = Math.floor((ms % 1000) / 100);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${tenths}`;
  };

  // Step advancement timer (1.2s per step)
  useEffect(() => {
    const stepDuration = 1200;
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        } else {
          return prev;
        }
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  // Check if all steps done AND analysis ready
  useEffect(() => {
    if (currentStepIndex >= STEPS.length - 1 && isAnalysisReady) {
      const timeout = setTimeout(() => {
        onComplete();
      }, 700);
      return () => clearTimeout(timeout);
    }
  }, [currentStepIndex, isAnalysisReady, onComplete]);

  // Telemetry stream generator for studio command atmosphere
  useEffect(() => {
    const stream = [
      `[init] greenlight intelligence core online`,
      `[target] ingested ${ideas.length} media pitch(es)`,
      ...ideas.map((i, idx) => `[slot-${idx + 1}] format: ${i.format} | length: ${i.concept.length} chars`),
      `[web] pinging real-time sector indices and news archives`,
      `[audit] measuring narrative saturation thresholds`,
      `[defensibility] testing audience fatigue curves`,
      `[synthesis] formulating contrarian autopsy`,
      `[blueprint] structuring act milestones and b-roll motifs`,
    ];

    let timerId: NodeJS.Timeout;
    let index = 0;
    const addLog = () => {
      if (index < stream.length) {
        setLogs((prev) => [...prev, stream[index]]);
        index++;
        timerId = setTimeout(addLog, 650);
      }
    };
    timerId = setTimeout(addLog, 300);

    return () => clearTimeout(timerId);
  }, [ideas]);

  const progressPercent = Math.min(
    100,
    Math.round(((currentStepIndex + 1) / STEPS.length) * 100)
  );

  return (
    <section className="relative min-h-screen w-full pt-28 pb-20 px-6 md:px-10 bg-black text-white selection:bg-[#C6F400] selection:text-black flex flex-col justify-center">
      {/* Drifting Radial Glow */}
      <div
        className="radial-drift-glow top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      />

      <div className="max-w-3xl mx-auto w-full relative z-10">
        {/* Studio Call Sheet Header */}
        <div className="bg-[#0A0A0A] border border-white/15 rounded-3xl p-6 mb-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 font-mono text-[11px] text-[#C6F400] uppercase tracking-widest mb-1">
                <Film className="w-3.5 h-3.5" />
                <span>STUDIO CALL SHEET · PRODUCTION EVALUATION</span>
              </div>
              <h2 className="font-headline font-bold text-xl sm:text-2xl text-white tracking-tight lowercase">
                executive review chamber
              </h2>
            </div>

            {/* Time Elapsed Counter in Top Right: 00:00.0 */}
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/80 border border-white/15 font-mono text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D4D] animate-pulse" />
              <span className="text-white/40 text-xs uppercase tracking-wider">REC</span>
              <span className="text-white font-bold tracking-wider">{formatElapsed(elapsedMs)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs font-mono text-white/50 lowercase">
            <div>
              <span className="text-white/30 block text-[10px] uppercase">SLOT COUNT</span>
              <span className="text-white/80">{ideas.length} idea{ideas.length > 1 ? 's' : ''}</span>
            </div>
            <div>
              <span className="text-white/30 block text-[10px] uppercase">OPERATIONAL STAGE</span>
              <span className="text-[#C6F400]">live synthesis</span>
            </div>
            <div>
              <span className="text-white/30 block text-[10px] uppercase">INDEX STATUS</span>
              <span className="text-white/80">real-time parallel</span>
            </div>
            <div>
              <span className="text-white/30 block text-[10px] uppercase">PROGRESS</span>
              <span className="text-white/80">{progressPercent}%</span>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full bg-[#111111] h-1.5 rounded-full overflow-hidden mb-8 border border-white/5">
          <motion.div
            className="h-full bg-[#C6F400] shadow-[0_0_12px_#C6F400]"
            initial={{ width: '5%' }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        {/* 7 Call Sheet Steps Readout */}
        <div className="space-y-3 mb-8">
          {STEPS.map((step, idx) => {
            const isDone = idx < currentStepIndex;
            const isActive = idx === currentStepIndex;
            const isPending = idx > currentStepIndex;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                className={`p-4 rounded-2xl transition-all duration-300 border ${
                  isActive
                    ? 'bg-[#0A0A0A] border-[#C6F400]/40 shadow-lg shadow-[#C6F400]/5 scale-[1.01]'
                    : isDone
                    ? 'bg-[#0A0A0A]/40 border-white/5 text-white/60'
                    : 'bg-transparent border-white/5 text-white/20'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {/* Step status indicator */}
                  <div className="pt-0.5 shrink-0">
                    {isActive ? (
                      /* Active Tally Light: circular lamp with metal rim */
                      <div className="relative w-5 h-5 rounded-full bg-gradient-to-b from-[#666] via-[#2a2a2a] to-[#0f0f0f] p-[2px] shadow-[0_0_12px_#C6F400] flex items-center justify-center">
                        <div className="w-full h-full rounded-full bg-[#C6F400] animate-pulse relative shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]" />
                      </div>
                    ) : isDone ? (
                      /* Completed Step: Dim Checkmark */
                      <CheckCircle2 className="w-4 h-4 text-white/30" />
                    ) : (
                      /* Pending */
                      <div className="w-4 h-4 rounded-full border border-white/15" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      {/* Current step copy in mono */}
                      <span
                        className={`font-mono text-xs sm:text-sm lowercase tracking-tight ${
                          isActive
                            ? 'text-white font-semibold'
                            : isDone
                            ? 'text-white/60'
                            : 'text-white/25'
                        }`}
                      >
                        {step.title}
                      </span>

                      {isActive && (
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#C6F400]/15 text-[#C6F400] border border-[#C6F400]/30 shrink-0 uppercase tracking-wider">
                          ACTIVE TALLY
                        </span>
                      )}
                      {isDone && (
                        <span className="font-mono text-[10px] text-white/30 shrink-0 lowercase">
                          verified
                        </span>
                      )}
                    </div>

                    {/* Step description in mono */}
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-2"
                      >
                        <p className="font-mono text-xs text-white/60 lowercase leading-relaxed">
                          {step.detail}
                        </p>
                        {/* Filling progress bar for currently running step */}
                        <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mt-3 border border-white/5">
                          <div className="h-full bg-[#C6F400] tally-step-filling rounded-full shadow-[0_0_8px_#C6F400]" />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Live Studio Telemetry Log Console */}
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-4 font-mono text-xs text-white/50">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/5 text-white/30 text-[11px]">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-[#C6F400]" />
              <span className="lowercase">studio execution telemetry</span>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-white/30">PARALLEL THREAD</span>
          </div>
          <div className="h-20 overflow-y-auto space-y-1 text-[11px]">
            {logs.map((log, i) => (
              <div key={i} className="flex items-center gap-2 text-white/60">
                <span className="text-[#C6F400]">›</span>
                <span className="lowercase">{log}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 text-[#C6F400] animate-pulse">
              <span>›</span>
              <span className="lowercase">synthesizing executive verdict...</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
