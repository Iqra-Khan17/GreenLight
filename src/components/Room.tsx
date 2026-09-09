import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Sparkles, ArrowRight } from 'lucide-react';
import { IdeaInput, FormatType } from '../types';

interface RoomProps {
  onRunGreenlight: (ideas: IdeaInput[]) => void;
  onBackToOverview: () => void;
}

const FORMATS: FormatType[] = ['youtube', 'documentary', 'short film', 'series'];

const SAMPLE_IDEAS: IdeaInput[] = [
  {
    id: 'sample-1',
    concept:
      'a documentary about why independent software developers are disappearing, tracing how solo creators are getting quietly absorbed or crushed by algorithmic infrastructure monopolies.',
    format: 'documentary',
    audience: 'engineers, creative technologists, startup founders, and cultural observers aged 22–45',
  },
  {
    id: 'sample-2',
    concept:
      'a provocative investigative series on the illicit black market for antique movie projectors and rare 70mm archival reels hidden across former Soviet bunkers.',
    format: 'series',
    audience: 'cinephiles, historical mystery fans, and physical media preservationists',
  },
];

export const Room: React.FC<RoomProps> = ({ onRunGreenlight, onBackToOverview }) => {
  const [ideas, setIdeas] = useState<IdeaInput[]>([
    {
      id: 'idea-1',
      concept: '',
      format: 'documentary',
      audience: '',
    },
  ]);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleAddIdea = () => {
    if (ideas.length >= 3) return;
    setIdeas([
      ...ideas,
      {
        id: `idea-${Date.now()}`,
        concept: '',
        format: 'youtube',
        audience: '',
      },
    ]);
  };

  const handleRemoveIdea = (index: number) => {
    if (ideas.length <= 1) return;
    setIdeas(ideas.filter((_, idx) => idx !== index));
  };

  const updateIdea = (index: number, updates: Partial<IdeaInput>) => {
    setIdeas((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, ...updates } : item))
    );
    if (validationError) setValidationError(null);
  };

  const handleLoadSample = (sample: IdeaInput) => {
    setIdeas([
      {
        ...sample,
        id: `idea-${Date.now()}`,
      },
    ]);
    if (validationError) setValidationError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validIdeas = ideas.filter((i) => i.concept.trim().length > 0);
    if (validIdeas.length === 0) {
      setValidationError('please input at least one media idea concept before running greenlight.');
      return;
    }
    onRunGreenlight(validIdeas);
  };

  return (
    <section className="relative min-h-screen w-full pt-28 pb-20 px-6 md:px-10 bg-black text-white selection:bg-[#C6F400] selection:text-black flex flex-col justify-start">
      {/* Slow Drifting Background Radial Glow */}
      <div
        className="radial-drift-glow top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto w-full relative z-10">
        {/* Header Prompt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-white/40">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C6F400]" />
              <span>THE DEVELOPMENT ROOM</span>
            </div>

            {/* Quick Sample Inspiration */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40 hidden sm:inline lowercase">inspiration:</span>
              <button
                type="button"
                id="room-load-sample-btn"
                onClick={() => handleLoadSample(SAMPLE_IDEAS[0])}
                className="px-3 py-1 rounded-full bg-[#111111] hover:bg-white/10 text-[11px] text-white/70 hover:text-white border border-white/10 transition-colors lowercase flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-[#C6F400]" />
                <span>load sample pitch</span>
              </button>
            </div>
          </div>

          <h1 className="font-headline font-extrabold text-4xl sm:text-6xl md:text-7xl tracking-[-0.04em] leading-[0.92] text-white lowercase">
            what are you thinking of making?
          </h1>
          <p className="mt-4 text-sm sm:text-base text-white/50 lowercase">
            submit 1–3 concepts. the studio AI will research the live web, pressure-test defensibility, and return your verdict.
          </p>
        </motion.div>

        {/* Ideas Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <AnimatePresence>
            {ideas.map((idea, index) => (
              <div key={idea.id} className="card-3d-wrap">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4 }}
                  className="card-3d relative bg-[#0A0A0A]/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center font-mono text-xs text-white/70">
                        {index + 1}
                      </span>
                      <span className="text-xs font-mono tracking-wider text-white/40 lowercase">
                        {ideas.length > 1 ? `idea slot 0${index + 1} of 03` : 'primary concept'}
                      </span>
                    </div>

                    {ideas.length > 1 && (
                      <button
                        type="button"
                        id={`remove-idea-${index}`}
                        onClick={() => handleRemoveIdea(index)}
                        className="text-xs text-white/40 hover:text-[#FF4D4D] transition-colors p-1 flex items-center gap-1 lowercase"
                        title="remove this idea"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">remove</span>
                      </button>
                    )}
                  </div>

                  {/* Primary Concept Textarea */}
                  <div className="mb-6">
                    <textarea
                      id={`idea-concept-input-${index}`}
                      rows={4}
                      value={idea.concept}
                      onChange={(e) => updateIdea(index, { concept: e.target.value })}
                      placeholder="a documentary about why independent developers are disappearing…"
                      className="w-full bg-transparent text-lg sm:text-xl md:text-2xl text-white placeholder-white/25 focus:outline-none resize-none font-body leading-relaxed"
                    />
                  </div>

                  {/* Format Pills: youtube · documentary · short film · series */}
                  <div className="mb-6 pt-4 border-t border-white/5 flex flex-wrap items-center gap-2">
                    <span className="text-xs text-white/40 font-mono mr-2 lowercase">format:</span>
                    {FORMATS.map((fmt) => (
                      <button
                        type="button"
                        key={fmt}
                        id={`format-pill-${index}-${fmt.replace(/\s+/g, '-')}`}
                        onClick={() => updateIdea(index, { format: fmt })}
                        className={`px-4 py-1.5 rounded-full text-xs font-body transition-all duration-200 lowercase ${
                          idea.format === fmt
                            ? 'bg-[#C6F400] text-black font-semibold shadow-md shadow-[#C6F400]/20'
                            : 'bg-[#111111] text-white/70 hover:text-white hover:bg-white/10 border border-white/5'
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>

                  {/* Secondary optional line: audience (optional) */}
                  <div className="pt-2">
                    <label
                      htmlFor={`idea-audience-${index}`}
                      className="block text-xs font-mono text-white/40 mb-2 lowercase"
                    >
                      audience (optional)
                    </label>
                    <input
                      id={`idea-audience-${index}`}
                      type="text"
                      value={idea.audience || ''}
                      onChange={(e) => updateIdea(index, { audience: e.target.value })}
                      placeholder="e.g. millennial cinephiles, startup engineers, true-crime investigators"
                      className="w-full bg-[#111111]/70 border border-white/10 rounded-full px-5 py-2.5 text-xs sm:text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/30 font-body transition-colors"
                    />
                  </div>
                </motion.div>
              </div>
            ))}
          </AnimatePresence>

          {/* Add Another Idea Button (max 3) */}
          {ideas.length < 3 && (
            <div className="flex justify-center">
              <button
                type="button"
                id="add-another-idea-btn"
                onClick={handleAddIdea}
                className="group px-6 py-3 rounded-full bg-[#0A0A0A] hover:bg-[#111111] border border-white/10 hover:border-white/20 text-xs font-body text-white/70 hover:text-white transition-all duration-200 flex items-center gap-2 shadow-xl lowercase"
              >
                <Plus className="w-3.5 h-3.5 text-[#C6F400] transition-transform duration-200 group-hover:rotate-90" />
                <span>[+ add another idea] — {3 - ideas.length} slot{3 - ideas.length > 1 ? 's' : ''} left</span>
              </button>
            </div>
          )}

          {/* Validation Error Message */}
          {validationError && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-[#FF4D4D]/10 border border-[#FF4D4D]/30 text-xs text-[#FF4D4D] text-center lowercase font-mono"
            >
              {validationError}
            </motion.div>
          )}

          {/* Giant Button: Run Greenlight */}
          <div className="pt-6 flex flex-col items-center">
            <button
              type="submit"
              id="run-greenlight-submit-btn"
              className="group w-full sm:w-auto px-12 py-5 rounded-full bg-white hover:bg-[#C6F400] text-black font-headline font-bold text-lg sm:text-xl tracking-tight transition-all duration-300 hover:scale-[1.02] shadow-2xl flex items-center justify-center gap-3 lowercase"
            >
              <span>run greenlight</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" />
            </button>
            <p className="mt-4 text-xs font-mono text-white/30 lowercase">
              7-dimensional executive audit · live competitive scans · defensibility blueprint
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};
