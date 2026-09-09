export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ verdicts: [] });
  }

  const ideas = (req.body && req.body.ideas) || [];
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!geminiKey || !ideas.length) {
    return res.status(200).json({ verdicts: [] });
  }

  try {
    const r = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
        geminiKey,
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
                    "Return ONLY JSON { verdicts: IdeaVerdict[] } for these media ideas. Each verdict must include id, rank, originalIdea, decision (greenlight|rework|pass), score, executiveNote, dimensions {audience,novelty,momentum,competition,evidence,feasibility,differentiation}, whyNow, whatAlreadyExists, contentGap, strengths[], risks[], contrarianCase, recommendedAngle {title,description,whyItScoresHigher}, sources[], blueprint. Score = sum of dimensions. Ideas: " +
                    JSON.stringify(ideas),
                },
              ],
            },
          ],
        }),
      }
    );
    const data = await r.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || '{"verdicts":[]}';
    const cleaned = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return res.status(200).json({ verdicts: parsed.verdicts || [] });
  } catch {
    return res.status(200).json({ verdicts: [] });
  }
}
