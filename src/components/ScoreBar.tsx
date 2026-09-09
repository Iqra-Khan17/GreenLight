import React from 'react';
import { motion } from 'motion/react';
import { DimensionScores, DIMENSION_LABELS, DecisionType } from '../types';

interface ScoreBarProps {
  dimensions: DimensionScores;
  decision: DecisionType;
}

export const ScoreBar: React.FC<ScoreBarProps> = ({ dimensions, decision }) => {
  const keys = Object.keys(DIMENSION_LABELS) as (keyof DimensionScores)[];

  const getAccentColor = () => {
    switch (decision) {
      case 'greenlight':
        return '#C6F400';
      case 'rework':
        return '#FFB020';
      case 'pass':
        return '#FF4D4D';
      default:
        return '#C6F400';
    }
  };

  const accent = getAccentColor();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-mono text-white/40 pb-2 border-b border-white/5 lowercase">
        <span>dimension metrics</span>
        <span>points / max weight</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {keys.map((key) => {
          const info = DIMENSION_LABELS[key];
          const val = dimensions[key] || 0;
          const pct = Math.min(100, Math.round((val / info.max) * 100));

          return (
            <div key={key} className="card-3d-wrap">
              <div
                className="card-3d bg-[#0A0A0A] rounded-2xl p-4 transition-all"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <span className="font-headline font-semibold text-sm text-white capitalize">
                      {info.label}
                    </span>
                    <p className="text-[11px] text-white/40 font-body lowercase">
                      {info.desc}
                    </p>
                  </div>
                  <div className="font-mono text-sm font-bold flex items-baseline gap-1">
                    <span className="text-white">{val}</span>
                    <span className="text-white/30 text-xs">/{info.max}</span>
                  </div>
                </div>

                {/* Bar track */}
                <div className="w-full bg-[#111111] h-1.5 rounded-full overflow-hidden mt-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: accent,
                      boxShadow: `0 0 10px ${accent}40`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
