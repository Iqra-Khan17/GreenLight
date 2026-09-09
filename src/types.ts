export type FormatType = 'youtube' | 'documentary' | 'short film' | 'series';

export type DecisionType = 'greenlight' | 'rework' | 'pass';

export interface IdeaInput {
  id: string;
  concept: string;
  format: FormatType;
  audience?: string;
}

export interface DimensionScores {
  audience: number; // max 20
  novelty: number; // max 20
  momentum: number; // max 15
  competition: number; // max 15
  evidence: number; // max 10
  feasibility: number; // max 10
  differentiation: number; // max 10
}

export interface SourceEvidence {
  title: string;
  url: string;
  domain: string;
  excerpt: string;
}

export interface SceneStructureItem {
  act: string;
  scene: string;
  description: string;
  visualTone: string;
}

export interface ProductionBlueprint {
  titleOptions: string[];
  targetAudience: string;
  logline: string;
  hook: string;
  narrativeArc: string;
  sceneStructure: SceneStructureItem[];
  bRollShots: string[];
  claimsToVerify: string[];
  sourcesToContact: string[];
  callToAction: string;
}

export interface IdeaVerdict {
  id: string;
  rank: number;
  originalIdea: IdeaInput;
  decision: DecisionType;
  score: number; // calculated SUM of all 7 dimension scores
  executiveNote: string;
  dimensions: DimensionScores;
  whyNow: string;
  whatAlreadyExists: string;
  contentGap: string;
  strengths: string[];
  risks: string[];
  contrarianCase: string; // "your biggest weakness is..."
  recommendedAngle: {
    title: string;
    description: string;
    whyItScoresHigher: string;
  };
  sources: SourceEvidence[];
  blueprint: ProductionBlueprint;
}

export interface AnalysisResponse {
  verdicts: IdeaVerdict[];
  timestamp: string;
}

export type ScreenState = 'hero' | 'room' | 'running' | 'verdict';

export const DIMENSION_MAX = {
  audience: 20,
  novelty: 20,
  momentum: 15,
  competition: 15,
  evidence: 10,
  feasibility: 10,
  differentiation: 10,
} as const;

export const DIMENSION_LABELS: Record<keyof DimensionScores, { label: string; max: number; desc: string }> = {
  audience: { label: 'audience demand', max: 20, desc: 'addressable craving & scale' },
  novelty: { label: 'narrative novelty', max: 20, desc: 'uniqueness of thematic lens' },
  momentum: { label: 'cultural momentum', max: 15, desc: 'zeitgeist alignment & velocity' },
  competition: { label: 'market saturation', max: 15, desc: 'white-space vs existing saturation' },
  evidence: { label: 'verifiable evidence', max: 10, desc: 'hard proof, citations, and data' },
  feasibility: { label: 'execution feasibility', max: 10, desc: 'budget, access, and pipeline' },
  differentiation: { label: 'format differentiation', max: 10, desc: 'cinematic voice & structural hook' },
};
