import { Output, generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

export const runtime = "nodejs";
export const maxDuration = 60;

const jobSchema = z.object({
  jobs: z.array(z.object({
    id: z.string(),
    title: z.string(),
    company: z.string(),
    location: z.string(),
    salary: z.string(),
    source: z.string(),
    url: z.string(),
    score: z.number().min(0).max(100),
    reason: z.string(),
  })).max(20),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const profile = body?.profile || {};
    const cv = profile.cvDetails || {};

    const facts = {
      name: profile.name || "Naomi",
      location: "Portsmouth, UK",
      search: "student jobs, part-time jobs, weekend jobs and flexible casual jobs",
      skills: Array.isArray(cv.skills) ? cv.skills.slice(0, 30) : [],
      experience: Array.isArray(cv.experience) ? cv.experience.slice(0, 10) : [],
      education: Array.isArray(cv.education) ? cv.education.slice(0, 10) : [],
      notes: profile.notes || "",
      savedAnswers: profile.answers || {},
    };

    const { output } = await generateText({
      model: "openai/gpt-5.6-luna",
      reasoning: "low",
      output: Output.object({ schema: jobSchema }),
      tools: {
        web_search: openai.tools.webSearch({}),
      },
      prompt: `Find current live job vacancies suitable for a student living in Portsmouth, England.

Search broadly across the live web, including direct employer career pages and current listings from Indeed UK, Reed, Totaljobs, CV-Library, LinkedIn Jobs, Adzuna, jobs.ac.uk, university/student-union vacancies, hospitality, retail, supermarkets, cinemas, leisure, reception/admin, customer service, warehouses and flexible casual work.

Priorities:
- Portsmouth first, then Southsea, Port Solent, Cosham, Fareham, Havant and locations reasonably commutable from Portsmouth.
- Part-time, weekend, evening, flexible, casual, zero-hours or student-friendly work.
- Also include relevant entry-level work that matches the CV.
- Prefer listings posted recently and direct application URLs.
- Do not return generic search-result pages if an actual vacancy URL is available.
- Do not invent vacancies or URLs. Only return jobs you can verify are live from search results.
- Avoid clearly full-time professional roles that are unsuitable alongside university.
- Remove duplicates.
- Score each role from 0-100 for student suitability + CV fit, not employer likelihood of hiring.

Applicant facts:
${JSON.stringify(facts)}

Return up to 20 strongest current opportunities.`,
    });

    return Response.json(output);
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to search jobs." }, { status: 500 });
  }
}
