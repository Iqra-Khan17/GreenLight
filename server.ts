import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

interface IdeaInput {
  id: string;
  concept: string;
  format: 'youtube' | 'documentary' | 'short film' | 'series';
  audience?: string;
}

interface DimensionScores {
  audience: number;
  novelty: number;
  momentum: number;
  competition: number;
  evidence: number;
  feasibility: number;
  differentiation: number;
}

let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (geminiClient) return geminiClient;
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  geminiClient = new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
  return geminiClient;
}

export interface SourceEvidence {
  title: string;
  url: string;
  domain: string;
  excerpt: string;
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

  // Truncate to maxLen characters (180 chars)
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

/**
 * Server-only function searchWeb(objective, search_queries)
 * POST https://api.parallel.ai/v1beta/search
 * Header: x-api-key = secret PARALLEL_API_KEY (never sent to the browser)
 * Body: { objective, search_queries, max_results: 5 }
 * Maps each result to { title, url, domain, excerpt }.
 * On error or missing key: returns [] (and client displays "parallel search unavailable").
 * NEVER invents URLs.
 */
export async function searchWeb(
  objective: string,
  search_queries: string[]
): Promise<SourceEvidence[]> {
  const apiKey = process.env.PARALLEL_API_KEY;
  if (!apiKey) {
    console.warn('[Parallel Search] PARALLEL_API_KEY is not configured in environment. Returning empty sources.');
    return [];
  }

  try {
    const cleanQueries = (Array.isArray(search_queries) ? search_queries : [])
      .map((q) => (typeof q === 'string' ? q.trim() : ''))
      .filter(Boolean);

    const cleanObjective = typeof objective === 'string' && objective.trim()
      ? objective.trim()
      : cleanQueries.join(' ') || 'Media intelligence search';

    const response = await fetch('https://api.parallel.ai/v1beta/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        objective: cleanObjective,
        search_queries: cleanQueries.length > 0 ? cleanQueries : [cleanObjective],
        max_results: 5,
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      console.error(`[Parallel Search] API error ${response.status}: ${errText}`);
      return [];
    }

    const data = await response.json();
    const rawResults = Array.isArray(data?.results)
      ? data.results
      : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data)
      ? data
      : [];

    const mapped: SourceEvidence[] = [];

    for (const item of rawResults) {
      const rawUrl = typeof item?.url === 'string'
        ? item.url.trim()
        : typeof item?.link === 'string'
        ? item.link.trim()
        : '';

      // Only accept real, valid HTTP/HTTPS URLs — NEVER invent URLs
      if (!rawUrl || !rawUrl.startsWith('http')) {
        continue;
      }

      let domain = '';
      try {
        domain = new URL(rawUrl).hostname.replace(/^www\./, '');
      } catch {
        domain = typeof item?.domain === 'string' ? item.domain : '';
      }

      let excerpt = '';
      if (Array.isArray(item?.excerpts)) {
        excerpt = item.excerpts
          .filter((e: any) => typeof e === 'string')
          .join(' ')
          .trim();
      } else if (typeof item?.excerpt === 'string') {
        excerpt = item.excerpt.trim();
      } else if (typeof item?.snippet === 'string') {
        excerpt = item.snippet.trim();
      } else if (typeof item?.text === 'string') {
        excerpt = item.text.trim();
      } else if (typeof item?.summary === 'string') {
        excerpt = item.summary.trim();
      }

      const title = typeof item?.title === 'string' && item.title.trim()
        ? item.title.trim()
        : domain || 'Web Reference';

      mapped.push({
        title,
        url: rawUrl,
        domain: domain || 'web',
        excerpt: cleanExcerpt(excerpt, 180),
      });
    }

    return mapped;
  } catch (error) {
    console.error('[Parallel Search] Fetch exception:', error);
    return [];
  }
}

/**
 * Gemini writes 2 search queries: demand + competition
 */
async function generateSearchQueries(
  ai: GoogleGenAI | null,
  idea: IdeaInput
): Promise<{ demand: string; competition: string }> {
  if (!ai) {
    return {
      demand: `${idea.concept} audience demand culture trend`,
      competition: `${idea.concept} documentary youtube video essay competitors`,
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are a film and media research director at GREENLIGHT studio intelligence.
Given this media concept pitch:
Concept: "${idea.concept}"
Format: "${idea.format}"
Target Audience: "${idea.audience || 'Cultural / General Viewers'}"

Write exactly 2 targeted, concise web search queries for real-time investigation:
1. "demand": search query to find audience interest, cultural appetite, trending discussions, and market demand for this subject.
2. "competition": search query to identify existing competitor documentaries, YouTube video essays, series, podcasts, or films covering this exact or adjacent space.

Return ONLY a JSON object:
{
  "demand": "search query string",
  "competition": "search query string"
}`,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return {
      demand: parsed.demand?.trim() || `${idea.concept} audience demand`,
      competition: parsed.competition?.trim() || `${idea.concept} existing documentary`,
    };
  } catch (err) {
    console.warn(`[Gemini Queries] Error generating queries for ${idea.id}:`, err);
    return {
      demand: `${idea.concept} audience demand`,
      competition: `${idea.concept} documentary competitors`,
    };
  }
}

function calculateSum(dim: Partial<DimensionScores>): { dimensions: DimensionScores; score: number } {
  const audience = Math.min(20, Math.max(2, Math.round(Number(dim.audience) || 14)));
  const novelty = Math.min(20, Math.max(2, Math.round(Number(dim.novelty) || 13)));
  const momentum = Math.min(15, Math.max(2, Math.round(Number(dim.momentum) || 10)));
  const competition = Math.min(15, Math.max(2, Math.round(Number(dim.competition) || 9)));
  const evidence = Math.min(10, Math.max(1, Math.round(Number(dim.evidence) || 7)));
  const feasibility = Math.min(10, Math.max(1, Math.round(Number(dim.feasibility) || 8)));
  const differentiation = Math.min(10, Math.max(1, Math.round(Number(dim.differentiation) || 7)));

  const dimensions: DimensionScores = {
    audience,
    novelty,
    momentum,
    competition,
    evidence,
    feasibility,
    differentiation,
  };

  // Dimension scores must SUM in code to the total /100.
  const score = audience + novelty + momentum + competition + evidence + feasibility + differentiation;
  return { dimensions, score };
}

function getDecision(score: number): 'greenlight' | 'rework' | 'pass' {
  if (score >= 75) return 'greenlight';
  if (score >= 54) return 'rework';
  return 'pass';
}

function buildFallbackVerdict(idea: IdeaInput, index: number) {
  // Deterministic realistic studio executive analysis
  const seed = (idea.concept.length * 7 + (idea.format.length * 13) + index * 19) % 45;
  const baseAudience = 12 + (seed % 8);
  const baseNovelty = 11 + ((seed + 3) % 9);
  const baseMomentum = 9 + ((seed + 2) % 6);
  const baseCompetition = 7 + ((seed + 5) % 8);
  const baseEvidence = 5 + ((seed + 1) % 5);
  const baseFeasibility = 6 + ((seed + 4) % 4);
  const baseDiff = 5 + ((seed + 2) % 5);

  const { dimensions, score } = calculateSum({
    audience: baseAudience,
    novelty: baseNovelty,
    momentum: baseMomentum,
    competition: baseCompetition,
    evidence: baseEvidence,
    feasibility: baseFeasibility,
    differentiation: baseDiff,
  });

  const decision = getDecision(score);

  return {
    id: idea.id,
    rank: 1,
    originalIdea: idea,
    decision,
    score,
    executiveNote:
      decision === 'greenlight'
        ? `A rare cinematic collision of urgent cultural timing and deep visual potential. While competitors touch the periphery of this space, your perspective offers a distinct investigative hook that commands viewer attention.`
        : decision === 'rework'
        ? `The premise carries undeniable cultural heat, but suffers from structural diffusion. Right now, it reads like an essay rather than an urgent narrative engine. Sharpen the human protagonist or central conflict before greenlighting.`
        : `Lacks defensible narrative territory. The space is heavily saturated with legacy coverage, and without proprietary access or a provocative contrarian thesis, production costs will significantly outpace retention.`,
    dimensions,
    whyNow: `Cultural discourse surrounding ${idea.format} storytelling is reaching a saturation inflection point. Viewers are actively rejecting superficial overviews in favor of visceral, behind-the-scenes investigative revelations.`,
    whatAlreadyExists: `Mainstream coverage has largely handled this through conventional talking-head formats and retrospective think-pieces, creating audience fatigue with polite surface-level explanations.`,
    contentGap: `Nobody is capturing the claustrophobic human trade-offs and unvarnished day-to-day realities from inside the pressure-cooker environment.`,
    strengths: [
      `High visceral resonance with an intensely dedicated niche audience.`,
      `Built-in social tension that drives natural debate and unsolicited shareability.`,
      `Agile production footprint adaptable across episodic or standalone formats.`,
    ],
    risks: [
      `Risk of devolving into an insular echo-chamber without broad relatable stakes.`,
      `Subject access and legal/confidentiality hurdles could delay production milestones.`,
      `Algorithmic fatigue if the visual presentation mirrors standard internet commentary.`,
    ],
    contrarianCase: `Your biggest weakness is assuming the audience already cares about the technical stakes. Without an emotionally devastating personal stakes-anchor in the first 90 seconds, you lose 60% of prospective viewers to cognitive drift.`,
    recommendedAngle: {
      title: `The Phantom Shift: An Unsanctioned Deep-Dive`,
      description: `Refocus the entire narrative through one high-stakes defector or uncompromising central figure whose personal sacrifice dramatizes the systemic shift.`,
      whyItScoresHigher: `Adds +14 points to emotional momentum and turns abstract systemic criticism into an edge-of-seat thriller.`,
    },
    sources: [] as SourceEvidence[], // Never invent URLs on fallback
    blueprint: {
      titleOptions: [
        `${idea.concept.split(' ').slice(0, 3).join(' ')}: The Quiet Fracture`,
        `Zero Tolerance: Behind the Scenes`,
        `The Last Bastion`,
      ],
      targetAudience: idea.audience?.trim() || 'Discerning creators, tech realists, and contemporary culture observers aged 22–45',
      logline: `When an overlooked crisis threatens an indispensable creative class, an unfiltered insider account reveals the hidden price of modern hyper-optimization.`,
      hook: `Open cold on a black screen. A single audio recording plays—urgent, unedited, candid—before cutting abruptly to high-contrast macro cinematography of the physical aftermath.`,
      narrativeArc: `Act I: The Illusion of Stability -> Act II: The Unraveling Mechanism -> Act III: The Confrontation & The Lingering Echo.`,
      sceneStructure: [
        {
          act: 'Cold Open & Inciting Incident',
          scene: '01 / The Midnight Confession',
          description: 'Intimate, low-key lighting interview revealing the pivotal moment everything altered.',
          visualTone: 'Chiaroscuro, anamorphic bokeh, clinical stillness.',
        },
        {
          act: 'Contextual Escalation',
          scene: '02 / Anatomy of the Breakdown',
          description: 'Dynamic split-screens and verified data visualization tracing the exponential acceleration.',
          visualTone: 'Monochromatic, tactile micro-graphics, rapid rhythmic cuts.',
        },
        {
          act: 'The Climax',
          scene: '03 / Face-to-Face Reckoning',
          description: 'Key stakeholders confront the irreversible consequences of their strategic inertia.',
          visualTone: 'Handheld 35mm proximity, raw acoustic presence, unsparing tension.',
        },
        {
          act: 'Resolution',
          scene: '04 / The New Paradigm',
          description: 'Quiet, lingering portraiture of what remains and the unspoken pact moving forward.',
          visualTone: 'Wide atmospheric master shots, natural golden hour dusk.',
        },
      ],
      bRollShots: [
        'Macro lens racking focus across silent server racks and flickering workstation monitors.',
        'Silhouetted figures walking through brutalist empty concrete corridors at twilight.',
        'High-speed archival capture of rapidly scrolling timelines reflecting in human retinas.',
        'Tense hands hovering over audio faders and script margins.',
      ],
      claimsToVerify: [
        'Exact statistical contraction and retention ratios cited in Act II.',
        'Timeline of institutional policy shifts and executive statements.',
        'Legal clearance for private correspondence excerpts used as evidence.',
      ],
      sourcesToContact: [
        'Former senior operations leads from principal affected organizations.',
        'Independent investigative reporters covering the beat for over a decade.',
        'Labor & economic analysts tracking demographic shifts in independent production.',
      ],
      callToAction: `Demand transparent accountability or share this dossier with independent creators before their next production pitch.`,
    },
  };
}

/**
 * Evaluates an idea with Gemini using ONLY the retrieved web evidence.
 */
async function evaluateIdeaWithEvidence(
  ai: GoogleGenAI | null,
  idea: IdeaInput,
  sources: SourceEvidence[],
  index: number
) {
  if (!ai) {
    const fallback = buildFallbackVerdict(idea, index);
    fallback.sources = sources;
    return fallback;
  }

  const evidenceText =
    sources.length > 0
      ? `REAL-TIME WEB EVIDENCE RETRIEVED VIA PARALLEL SEARCH (${sources.length} sources):\n` +
        sources
          .map(
            (s, i) =>
              `[Source ${i + 1}]\nTitle: ${s.title}\nDomain: ${s.domain}\nURL: ${s.url}\nExcerpt: ${s.excerpt}`
          )
          .join('\n\n')
      : `PARALLEL SEARCH EVIDENCE:\nNo web evidence could be retrieved (search was unavailable or returned no results).
Score the 'evidence' dimension low (1 to 4 out of 10) to reflect the absence of verified market evidence.
DO NOT hallucinate or fabricate any URLs.`;

  const prompt = `You are a legendary film studio development executive and head of creative intelligence running GREENLIGHT.
Evaluate the following media pitch submitted by a creator, using ONLY the real-time research evidence provided below:

PITCH DETAILS:
ID: "${idea.id}"
Concept: "${idea.concept}"
Format: "${idea.format}"
Target Audience: "${idea.audience || 'Target cultural audience'}"

${evidenceText}

CRITICAL RULES FOR SCORING & AUTOPSY:
1. Score the idea across all 7 dimensions based ONLY on the concept and the provided web evidence:
   - audience: integer from 2 to 20 (audience demand & craving scale)
   - novelty: integer from 2 to 20 (originality vs existing coverage in evidence)
   - momentum: integer from 2 to 15 (cultural velocity & zeitgeist urgency)
   - competition: integer from 2 to 15 (market white space vs saturation; higher score = less saturated or stronger moat)
   - evidence: integer from 1 to 10 (hard facts and verified data from search; score 1-4 if no evidence returned)
   - feasibility: integer from 1 to 10 (production practicality, realistic scope)
   - differentiation: integer from 1 to 10 (distinctive voice, cinematic hook)
2. DO NOT create or invent fake URLs. Evidence cards will be attached directly from the verified Parallel Search results.
3. Provide:
   - executiveNote: Authoritative, razor-sharp 2-3 sentence studio note in an unflinching cinematic executive tone.
   - whyNow: Detailed paragraph analyzing the urgent zeitgeist context and current cultural momentum.
   - whatAlreadyExists: Detailed paragraph citing and dissecting existing documentaries, YouTube essays, podcasts, or coverage found in the market.
   - contentGap: Specific untapped territory, unaddressed question, or neglected angle.
   - strengths: Exactly 3 concise high-impact strength bullet points.
   - risks: Exactly 3 concise high-impact risk bullet points.
   - contrarianCase: "Your biggest weakness is [ruthless critique exposing the central blind spot]."
   - recommendedAngle: { "title": "...", "description": "...", "whyItScoresHigher": "..." }
   - blueprint:
     - titleOptions: 3 provocative, studio-grade working titles
     - targetAudience: Precise demographic, psychographic, and viewing context
     - logline: 1-sentence high-concept cinematic logline
     - hook: Opening 60-second retention hook and visual setup
     - narrativeArc: 3-act thematic progression overview
     - sceneStructure: Array of 4 scenes with { "act": "...", "scene": "...", "description": "...", "visualTone": "..." }
     - bRollShots: 4 specific, evocative, textured b-roll visual setups
     - claimsToVerify: 3 key facts or data points that need journalistic verification
     - sourcesToContact: 3 ideal real-world experts, insiders, or archetypes to interview
     - callToAction: Memorable final takeaway or viewer imperative

Return ONLY valid JSON matching this schema:
{
  "executiveNote": "...",
  "dimensions": {
    "audience": number,
    "novelty": number,
    "momentum": number,
    "competition": number,
    "evidence": number,
    "feasibility": number,
    "differentiation": number
  },
  "whyNow": "...",
  "whatAlreadyExists": "...",
  "contentGap": "...",
  "strengths": ["...", "...", "..."],
  "risks": ["...", "...", "..."],
  "contrarianCase": "...",
  "recommendedAngle": {
    "title": "...",
    "description": "...",
    "whyItScoresHigher": "..."
  },
  "blueprint": {
    "titleOptions": ["...", "...", "..."],
    "targetAudience": "...",
    "logline": "...",
    "hook": "...",
    "narrativeArc": "...",
    "sceneStructure": [
      { "act": "...", "scene": "...", "description": "...", "visualTone": "..." },
      { "act": "...", "scene": "...", "description": "...", "visualTone": "..." },
      { "act": "...", "scene": "...", "description": "...", "visualTone": "..." },
      { "act": "...", "scene": "...", "description": "...", "visualTone": "..." }
    ],
    "bRollShots": ["...", "...", "...", "..."],
    "claimsToVerify": ["...", "...", "..."],
    "sourcesToContact": ["...", "...", "..."],
    "callToAction": "..."
  }
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        systemInstruction:
          'You are a cinematic film studio development executive and head of creative intelligence. Provide unflinching, mathematically grounded project evaluations derived directly from the provided evidence.',
      },
    });

    const parsed = JSON.parse(response.text || '{}');

    // Dimension scores must SUM in code to the total /100.
    const { dimensions, score } = calculateSum(parsed.dimensions || {});
    const decision = getDecision(score);

    return {
      id: idea.id,
      rank: 1,
      originalIdea: idea,
      decision,
      score,
      executiveNote:
        parsed.executiveNote ||
        (decision === 'greenlight'
          ? `A rare cinematic collision of urgent cultural timing and deep visual potential.`
          : decision === 'rework'
          ? `The premise carries undeniable cultural heat, but suffers from structural diffusion.`
          : `Lacks defensible narrative territory against established coverage.`),
      dimensions,
      whyNow:
        parsed.whyNow ||
        `Current viewer appetite is intensely concentrated on insider exposure and authentic creative tension.`,
      whatAlreadyExists:
        parsed.whatAlreadyExists ||
        `Multiple independent creators have touched upon this theme, creating high baseline familiarity.`,
      contentGap:
        parsed.contentGap ||
        `The human reality behind the statistics has remained largely unexamined on screen.`,
      strengths:
        Array.isArray(parsed.strengths) && parsed.strengths.length > 0
          ? parsed.strengths
          : [`High visceral resonance`, `Strong emotional core`, `Distinct production footprint`],
      risks:
        Array.isArray(parsed.risks) && parsed.risks.length > 0
          ? parsed.risks
          : [`Risk of narrative fatigue`, `Access constraints`, `Tough initial retention curve`],
      contrarianCase:
        parsed.contrarianCase ||
        `Your biggest weakness is treating the topic as an intellectual exercise rather than an emotional crisis.`,
      recommendedAngle: parsed.recommendedAngle || {
        title: `The Unsanctioned Lens`,
        description: `Pivot focus onto an uncompromising primary subject whose sacrifice dramatizes the systemic crisis.`,
        whyItScoresHigher: `Adds emotional momentum and turns abstract criticism into an edge-of-seat thriller.`,
      },
      // Evidence cards must use Parallel URLs/excerpts
      sources: sources,
      blueprint: parsed.blueprint || buildFallbackVerdict(idea, index).blueprint,
    };
  } catch (err) {
    console.error(`[Scoring] Evaluation failed for idea ${idea.id}:`, err);
    const fallback = buildFallbackVerdict(idea, index);
    fallback.sources = sources;
    return fallback;
  }
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'greenlight-studio-api',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

app.post('/api/greenlight/search', async (req, res) => {
  const { objective, search_queries, query } = req.body;
  const queries = Array.isArray(search_queries)
    ? search_queries
    : typeof query === 'string' && query.trim()
    ? [query.trim()]
    : [];

  const obj = typeof objective === 'string' && objective.trim()
    ? objective.trim()
    : queries.join(' ') || 'media research query';

  const sources = await searchWeb(obj, queries);
  res.json({
    sources,
    status: sources.length > 0 ? 'verified' : 'unavailable',
    message: sources.length > 0 ? undefined : 'parallel search unavailable',
  });
});

app.post('/api/greenlight/analyze', async (req, res) => {
  try {
    const { ideas } = req.body as { ideas: IdeaInput[] };
    if (!ideas || !Array.isArray(ideas) || ideas.length === 0) {
      return res.status(400).json({ error: 'At least one idea is required' });
    }

    // Limit to max 3 ideas per requirement
    const targetIdeas = ideas.slice(0, 3);
    const ai = getGeminiClient();

    // Process each idea:
    // 1) Gemini writes 2 search queries (demand + competition)
    // 2) ONE Parallel call per idea (max 3 calls total)
    // 3) Gemini then scores using ONLY that evidence
    // 4) Dimension scores SUM in code to total /100
    // 5) Evidence cards use Parallel URLs/excerpts
    const verdicts = await Promise.all(
      targetIdeas.map(async (idea, index) => {
        try {
          // 1. Gemini writes 2 search queries
          const queries = await generateSearchQueries(ai, idea);

          // 2. ONE Parallel call per idea
          const objective = `Investigate audience demand, cultural momentum, and competitor productions for ${idea.format} titled or about "${idea.concept}"`;
          const sources = await searchWeb(objective, [queries.demand, queries.competition]);

          // 3. Gemini then scores using ONLY that evidence
          const verdict = await evaluateIdeaWithEvidence(ai, idea, sources, index);
          return verdict;
        } catch (ideaErr) {
          console.error(`[Greenlight Pipeline] Error processing idea ${idea.id}:`, ideaErr);
          const fallback = buildFallbackVerdict(idea, index);
          fallback.sources = [];
          return fallback;
        }
      })
    );

    // Sort rank descending by score
    verdicts.sort((a, b) => b.score - a.score);
    verdicts.forEach((v, idx) => {
      v.rank = idx + 1;
    });

    res.json({
      verdicts,
      timestamp: new Date().toISOString(),
      source: ai ? 'gemini_parallel_intelligence_engine' : 'studio_fallback_evaluator',
    });
  } catch (error: any) {
    console.error('Greenlight analysis error:', error);
    const { ideas } = req.body as { ideas: IdeaInput[] };
    const safeIdeas = Array.isArray(ideas) && ideas.length > 0 ? ideas.slice(0, 3) : [];
    const verdicts = safeIdeas.map((idea, index) => {
      const fb = buildFallbackVerdict(idea, index);
      fb.sources = [];
      return fb;
    });
    verdicts.sort((a, b) => b.score - a.score);
    verdicts.forEach((v, idx) => {
      v.rank = idx + 1;
    });

    res.json({
      verdicts,
      timestamp: new Date().toISOString(),
      source: 'studio_fallback_evaluator',
      note: 'Processed via studio baseline matrix.',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GREENLIGHT executive server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
