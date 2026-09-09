function fallbackVerdict(idea, idx, sources) {
  const dimensions = {
    audience: 16,
    novelty: 14,
    momentum: 11,
    competition: 8,
    evidence: sources.length ? 8 : 5,
    feasibility: 8,
    differentiation: 8,
  };
  const score = Object.values(dimensions).reduce((a, b) => a + b, 0);
  const decision = score >= 80 ? "greenlight" : score >= 60 ? "rework" : "pass";
  return {
    id: idea.id,
    rank: idx + 1,
    originalIdea: idea,
    decision,
    score,
    executiveNote:
      "Premise has cultural heat, but needs a sharper human conflict before a full greenlight.",
    dimensions,
    whyNow: "Audience demand for this format is active, but the current framing is still too essay-like.",
    whatAlreadyExists: "Existing coverage is mostly talking-head explainers and trend roundups.",
    contentGap: "Missing a single protagonist and a concrete, filmable conflict.",
    strengths: [
      "Built-in cultural conversation trigger",
      "Clear documentary / YouTube fit",
      "Room for a sharper alternative angle",
    ],
    risks: [
      "Saturation if executed as a generic explainer",
      "Weak hook if it stays abstract",
      "Evidence quality depends on live research",
    ],
    contrarianCase:
      "Your biggest weakness is assuming the audience already cares. Put a human cost in the first 30 seconds.",
    recommendedAngle: {
      title: "One insider. One bad incentive. One night everything changed.",
      description: "Tell the story through a single person who switched from making the work to supervising machines.",
      whyItScoresHigher: "Turns a topic into a character engine with clearer demand and differentiation.",
    },
    sources: sources || [],
    blueprint: {
      titleOptions: [
        "The Supervisor Shift",
        "Who Writes the Code Now",
        idea.concept ? String(idea.concept).slice(0, 40) : "Working Title",
      ],
      targetAudience: idea.audience || "Creators, developers, and documentary viewers",
      logline: "A creator idea is tested against live evidence before anyone spends a production budget.",
      hook: "Open on a junior developer watching an AI finish the job they were hired to learn.",
      narrativeArc: "Premise -> live evidence -> challenge -> decision -> blueprint",
      sceneStructure: [
        { act: "Act I", scene: "The Pitch", description: "The original idea, unfiltered.", visualTone: "Quiet, observational." },
        { act: "Act II", scene: "The Evidence", description: "What the live web actually shows.", visualTone: "Investigative, kinetic." },
        { act: "Act III", scene: "The Challenge", description: "Why this version may fail.", visualTone: "Close, unsparing." },
        { act: "Act IV", scene: "The Call", description: "GREENLIGHT, REWORK, or PASS.", visualTone: "Studio decision room." },
      ],
      bRollShots: ["Cursor on a code editor", "YouTube analytics", "Studio clapper", "Search results scrolling"],
      claimsToVerify: ["Demand claims", "Saturation claims", "Any statistic cited on camera"],
      sourcesToContact: ["Working practitioner", "Industry reporter", "Creator who already covered the topic"],
      callToAction: "Produce the sharper angle, not the generic explainer.",
    },
  };
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ verdicts: [] });

  const ideas = (req.body && req.body.ideas) || [];
  if (!ideas.length) return res.status(400).json({ error: "no_ideas" });

  const geminiKey = process.env.GEMINI_API_KEY;
  const parallelKey = process.env.PARALLEL_API_KEY;

  async function searchOne(query) {
    if (!parallelKey || !query) return [];
    try {
      const r = await fetch("https://api.parallel.ai/v1beta/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": parallelKey,
        },
        body: JSON.stringify({
          objective: query,
          search_queries: [query],
          max_results: 5,
        }),
      });
      const data = await r.json();
      const raw = data.results || data.hits || [];
      return raw.map((item) => {
        const url = item.url || item.link || "";
        let domain = item.domain || "";
        try {
          if (url) domain = new URL(url).hostname.replace(/^www\./, "");
        } catch {}
        const excerpt =
          (item.excerpts && item.excerpts[0]) ||
          item.excerpt ||
          item.snippet ||
          item.content ||
          "";
        return {
          title: item.title || item.name || domain || "source",
          url,
          domain,
          excerpt: String(excerpt).slice(0, 180),
        };
      }).filter((s) => s.url);
    } catch {
      return [];
    }
  }

  const sourcesByIdea = [];
  for (const idea of ideas.slice(0, 3)) {
    const q = idea.concept || idea.text || idea.raw || JSON.stringify(idea);
    sourcesByIdea.push(await searchOne(q));
  }

  let verdicts = [];
  if (geminiKey) {
    try {
      const r = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
          encodeURIComponent(geminiKey),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text:
                      "You are GREENLIGHT, a media development executive. Return ONLY valid JSON of shape {\"verdicts\":[...]}. " +
                      "Each verdict needs: id, rank, originalIdea, decision (greenlight|rework|pass), score, executiveNote, " +
                      "dimensions {audience,novelty,momentum,competition,evidence,feasibility,differentiation} (integers that SUM to score), " +
                      "whyNow, whatAlreadyExists, contentGap, strengths (3), risks (3), contrarianCase, " +
                      "recommendedAngle {title,description,whyItScoresHigher}, sources (use the provided live sources only, never invent URLs), blueprint. " +
                      "GREENLIGHT 80-100, REWORK 60-79, PASS 0-59. Ideas: " +
                      JSON.stringify(ideas) +
                      " Live sources per idea: " +
                      JSON.stringify(sourcesByIdea),
                  },
                ],
              },
            ],
            generationConfig: { temperature: 0.4 },
          }),
        }
      );
      const data = await r.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const cleaned = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed.verdicts) && parsed.verdicts.length) {
        verdicts = parsed.verdicts.map((v, i) => ({
          ...v,
          sources: (v.sources && v.sources.length ? v.sources : sourcesByIdea[i]) || [],
          score:
            v.dimensions
              ? Object.values(v.dimensions).reduce((a, b) => a + Number(b || 0), 0)
              : v.score,
        }));
      }
    } catch {
      verdicts = [];
    }
  }

  if (!verdicts.length) {
    verdicts = ideas.map((idea, i) => fallbackVerdict(idea, i, sourcesByIdea[i] || []));
  }

  return res.status(200).json({ verdicts });
}
