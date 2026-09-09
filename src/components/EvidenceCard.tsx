import React from 'react';
import { ExternalLink, Globe, CheckCircle2 } from 'lucide-react';
import { SourceEvidence } from '../types';

interface EvidenceCardProps {
  source: SourceEvidence;
}

/**
 * Strips raw markdown syntax and truncates cleanly to maxLen characters (180 chars).
 */
export function cleanExcerpt(raw: string, maxLen = 180): string {
  if (!raw || typeof raw !== 'string') return '';

  let text = raw;
  // Strip markdown images: ![alt](url)
  text = text.replace(/!\[([^\]]*)\]\([^)]*\)/g, '');
  // Strip markdown links: [text](url) -> text
  text = text.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
  // Strip bare URLs
  text = text.replace(/https?:\/\/\S+/gi, '');
  // Strip markdown headers: # ...
  text = text.replace(/#{1,6}\s+/g, '');
  // Strip bold / italic markdown: **text** or *text* or __text__ or _text_
  text = text.replace(/(\*\*|__)(.*?)\1/g, '$2');
  text = text.replace(/(\*|_)(.*?)\1/g, '$2');
  // Strip strikethrough: ~~text~~
  text = text.replace(/~~(.*?)~~/g, '$1');
  // Strip blockquotes: > ...
  text = text.replace(/^>\s+/gm, '');
  // Strip markdown tables & dividers: | a | b |
  text = text.replace(/\|/g, ' ');
  text = text.replace(/[-=_]{3,}/g, ' ');
  // Strip bullet points / list numbers
  text = text.replace(/^\s*[-*+]\s+/gm, '');
  text = text.replace(/^\s*\d+\.\s+/gm, '');
  // Strip code blocks & inline backticks
  text = text.replace(/```[\s\S]*?```/g, '');
  text = text.replace(/`([^`]+)`/g, '$1');
  // Normalize whitespace, tabs, and newlines
  text = text.replace(/\s+/g, ' ').trim();

  // Truncate to maxLen characters
  if (text.length <= maxLen) {
    return text;
  }

  const sliced = text.slice(0, maxLen);
  const lastSpace = sliced.lastIndexOf(' ');
  if (lastSpace > maxLen - 25) {
    return sliced.slice(0, lastSpace).trim() + '…';
  }
  return sliced.trim() + '…';
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ source }) => {
  const isParallelPending =
    !source.url ||
    source.domain.toLowerCase().includes('pending') ||
    source.domain.toLowerCase().includes('parallel');

  // Guaranteed valid URL for source reference
  const url =
    source.url && source.url.startsWith('http')
      ? source.url
      : source.domain &&
        !source.domain.toLowerCase().includes('pending') &&
        !source.domain.toLowerCase().includes('parallel')
      ? `https://${source.domain}`
      : `https://www.google.com/search?q=${encodeURIComponent(source.title || 'cultural intelligence')}`;

  const displayExcerpt = cleanExcerpt(source.excerpt, 180);

  return (
    <div className="relative z-0 h-full w-full">
      <div className="evidence-card bg-[#0A0A0A] rounded-2xl p-5 sm:p-6 flex flex-col justify-between h-full relative z-0">
        <div>
          {/* Top Domain & Verification Badge */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-mono">
              <Globe className="w-3.5 h-3.5 text-[#C6F400]" />
              <span
                className={`lowercase truncate max-w-[170px] ${
                  isParallelPending ? 'text-[#FFB020]' : 'text-white/70'
                }`}
              >
                {source.domain || 'parallel verified'}
              </span>
            </div>

            {isParallelPending ? (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FFB020]/10 text-[#FFB020] border border-[#FFB020]/20 lowercase">
                index pending
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#C6F400]/10 text-[#C6F400] border border-[#C6F400]/20 lowercase">
                <CheckCircle2 className="w-2.5 h-2.5" />
                verified
              </span>
            )}
          </div>

          {/* Source Title */}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 pointer-events-auto block hover:text-[#C6F400] transition-colors mb-2"
          >
            <h4 className="font-headline font-bold text-base sm:text-lg text-white leading-snug lowercase">
              {source.title}
            </h4>
          </a>

          {/* Cleaned & Truncated Excerpt (no raw markdown, max 180 chars) */}
          <p className="text-xs sm:text-[13px] text-white/70 font-body leading-relaxed mb-4 lowercase">
            "{displayExcerpt || 'verified index finding retrieved via live parallel research.'}"
          </p>
        </div>

        {/* Bottom Interactive Link */}
        <div className="pt-3.5 border-t border-white/10 flex items-center justify-between text-xs mt-auto relative z-10">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 pointer-events-auto inline-flex items-center gap-1.5 text-[#C6F400] hover:text-white font-mono text-[11px] sm:text-xs font-semibold lowercase transition-colors group"
          >
            <span className="underline-offset-2 group-hover:underline">view source reference</span>
            <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          <span className="font-mono text-[10px] text-white/30 lowercase truncate max-w-[120px]">
            {source.domain || 'parallel index'}
          </span>
        </div>
      </div>
    </div>
  );
};
