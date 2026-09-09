import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Film,
  Camera,
  CheckCircle2,
  Users,
  Radio,
  FileText,
  Copy,
  Check,
  Clapperboard,
  Sparkles,
} from 'lucide-react';
import { ProductionBlueprint } from '../types';

interface BlueprintProps {
  blueprint: ProductionBlueprint;
  onClose: () => void;
}

export const Blueprint: React.FC<BlueprintProps> = ({ blueprint, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyDossier = () => {
    const text = `GREENLIGHT PRODUCTION BLUEPRINT
LOGLINE: ${blueprint.logline}
TARGET AUDIENCE: ${blueprint.targetAudience}

TITLE OPTIONS:
${blueprint.titleOptions.map((t, i) => `${i + 1}. ${t}`).join('\n')}

OPENING HOOK (60s):
${blueprint.hook}

NARRATIVE ARC:
${blueprint.narrativeArc}

SCENE BREAKDOWN:
${blueprint.sceneStructure.map((s) => `${s.act} - ${s.scene}: ${s.description} [Visual: ${s.visualTone}]`).join('\n')}

B-ROLL SHOTS:
${blueprint.bRollShots.map((b, i) => `• ${b}`).join('\n')}

CLAIMS TO VERIFY:
${blueprint.claimsToVerify.map((c, i) => `• ${c}`).join('\n')}

SOURCES TO CONTACT:
${blueprint.sourcesToContact.map((s, i) => `• ${s}`).join('\n')}

CALL TO ACTION:
${blueprint.callToAction}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mt-12 bg-[#0A0A0A] border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden"
    >
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#C6F400] mb-2 uppercase tracking-widest">
            <Clapperboard className="w-4 h-4" />
            <span>CONFIDENTIAL PRODUCTION DOSSIER</span>
          </div>
          <h3 className="font-headline font-extrabold text-2xl sm:text-4xl text-white tracking-tight lowercase">
            production blueprint
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyDossier}
            className="px-4 py-2 rounded-full bg-[#111111] hover:bg-white/10 text-xs font-mono text-white/80 hover:text-white border border-white/10 transition-all flex items-center gap-2 lowercase"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#C6F400]" />
                <span>copied dossier</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>copy entire dossier</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition-all lowercase"
          >
            collapse blueprint
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Left Column: Logline, Audience & Title Options */}
        <div className="space-y-6">
          <div className="card-3d-wrap">
            <div className="card-3d bg-black/60 rounded-2xl p-5">
              <span className="text-xs font-mono text-white/40 block mb-2 lowercase">
                logline
              </span>
              <p className="font-body text-sm sm:text-base text-white/90 leading-relaxed italic lowercase">
                "{blueprint.logline}"
              </p>
            </div>
          </div>

          <div className="card-3d-wrap">
            <div className="card-3d bg-black/60 rounded-2xl p-5">
              <span className="text-xs font-mono text-white/40 block mb-2 lowercase">
                target audience
              </span>
              <p className="font-body text-xs sm:text-sm text-white/80 lowercase">
                {blueprint.targetAudience}
              </p>
            </div>
          </div>

          <div className="card-3d-wrap">
            <div className="card-3d bg-black/60 rounded-2xl p-5">
              <span className="text-xs font-mono text-white/40 block mb-3 lowercase">
                title options
              </span>
              <ul className="space-y-2 font-headline font-bold text-sm sm:text-base text-white lowercase">
                {blueprint.titleOptions.map((title, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-[#C6F400] font-mono text-xs">0{idx + 1}</span>
                    <span>{title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card-3d-wrap">
            <div className="card-3d bg-black/60 rounded-2xl p-5">
              <span className="text-xs font-mono text-white/40 block mb-2 lowercase">
                call to action / final resonance
              </span>
              <p className="text-xs text-white/70 font-body lowercase">
                {blueprint.callToAction}
              </p>
            </div>
          </div>
        </div>

        {/* Middle Column: Opening Hook & Scene Structure */}
        <div className="lg:col-span-2 space-y-6">
          {/* Opening 60-second Hook */}
          <div className="card-3d-wrap">
            <div className="card-3d bg-black/60 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2 text-xs font-mono text-[#C6F400] lowercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>first 60 seconds / the hook</span>
              </div>
              <p className="text-xs sm:text-sm text-white/90 font-body leading-relaxed lowercase">
                {blueprint.hook}
              </p>
              <div className="mt-4 pt-3 border-t border-white/5">
                <span className="text-xs font-mono text-white/40 block mb-1 lowercase">
                  narrative arc progression
                </span>
                <p className="text-xs text-white/70 font-body lowercase">
                  {blueprint.narrativeArc}
                </p>
              </div>
            </div>
          </div>

          {/* Scene Breakdown */}
          <div className="card-3d-wrap">
            <div className="card-3d bg-black/60 rounded-2xl p-5">
              <span className="text-xs font-mono text-white/40 block mb-4 lowercase">
                scene architecture & visual tone
              </span>
              <div className="space-y-4">
                {blueprint.sceneStructure.map((scene, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#0A0A0A] border border-white/5"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs text-[#C6F400] uppercase tracking-wider">
                        {scene.act}
                      </span>
                      <span className="font-headline font-semibold text-xs text-white/80 lowercase">
                        {scene.scene}
                      </span>
                    </div>
                    <p className="text-xs text-white/80 font-body mb-2 lowercase">
                      {scene.description}
                    </p>
                    <div className="text-[11px] font-mono text-white/40 lowercase">
                      <span className="text-[#C6F400]">cinematography: </span>
                      {scene.visualTone}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: B-Roll, Claims To Verify, Sources To Contact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-white/10">
        {/* B-Roll Setups */}
        <div className="card-3d-wrap">
          <div className="card-3d bg-black/40 rounded-2xl p-5 h-full">
            <div className="flex items-center gap-2 mb-3 text-xs font-mono text-white/50 lowercase">
              <Camera className="w-3.5 h-3.5 text-[#C6F400]" />
              <span>cinematic b-roll palette</span>
            </div>
            <ul className="space-y-2 text-xs text-white/70 font-body lowercase">
              {blueprint.bRollShots.map((shot, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#C6F400] font-mono text-xs">›</span>
                  <span>{shot}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Claims To Verify */}
        <div className="card-3d-wrap">
          <div className="card-3d bg-black/40 rounded-2xl p-5 h-full">
            <div className="flex items-center gap-2 mb-3 text-xs font-mono text-white/50 lowercase">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#FFB020]" />
              <span>claims requiring verification</span>
            </div>
            <ul className="space-y-2 text-xs text-white/70 font-body lowercase">
              {blueprint.claimsToVerify.map((claim, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#FFB020] font-mono text-xs">›</span>
                  <span>{claim}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sources To Contact */}
        <div className="card-3d-wrap">
          <div className="card-3d bg-black/40 rounded-2xl p-5 h-full">
            <div className="flex items-center gap-2 mb-3 text-xs font-mono text-white/50 lowercase">
              <Users className="w-3.5 h-3.5 text-[#C6F400]" />
              <span>key archetypes & insiders</span>
            </div>
            <ul className="space-y-2 text-xs text-white/70 font-body lowercase">
              {blueprint.sourcesToContact.map((source, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#C6F400] font-mono text-xs">›</span>
                  <span>{source}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
