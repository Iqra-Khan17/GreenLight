# GREENLIGHT

**Before you produce it, let AI challenge it.**

GREENLIGHT is an agentic pre-production system for filmmakers and creators. You submit a media idea. The agent researches the live web with Parallel, challenges the concept with Gemini, and returns **GREENLIGHT / REWORK / PASS** with sources and a production blueprint.

Live app: https://green-light1.vercel.app

## Why it exists

Creators don’t lack ideas. They lack a way to know which idea deserves time and money. Most AI tools say yes and generate a script. GREENLIGHT can say **no**.

## Hackathon

- Event: Agentic Cinema — The Blockbuster Hackathon
- Track: **Parallel**
- Workflow: media & entertainment development (greenlight a concept before production)

## Agent workflow (deterministic, multi-step)

1. **Producer** — normalize the idea + format
2. **Researcher** — Parallel Search API (live URLs + excerpts)
3. **Analyst** — Gemini scores demand, novelty, momentum, competition, evidence, feasibility, differentiation
4. **Contrarian** — tries to kill the idea
5. **Development executive** — GREENLIGHT (80–100) / REWORK (60–79) / PASS (0–59) + better angle + blueprint

Total score = sum of the seven dimension scores (computed in code).

Parallel is not decoration. It is the agent’s eyes. Evidence cards on the verdict screen are live Parallel citations.

## Stack

- UI: React + TypeScript + Vite + Tailwind
- Reasoning: Gemini
- Web intelligence: [Parallel Search API](https://www.parallel.ai) at runtime
- Hosting: Vercel

## Parallel (required)

`POST https://api.parallel.ai/v1beta/search` from the server (`api/greenlight/search.js` and `api/greenlight/analyze.js`).

The browser never sees `PARALLEL_API_KEY`.

## Run locally

```bash
npm install
cp .env.example .env
# set PARALLEL_API_KEY and GEMINI_API_KEY
npm run dev
