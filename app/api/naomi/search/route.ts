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
      radius: "approximately 15 miles",
      search: "student jobs, part-time jobs, weekend jobs and flexible casual jobs",
      skills: Array.isArray(cv.skills) ? cv.skills.slice(0, 30) : [],
      experience: Array.isArray(cv.experience) ? cv.experience.slice(0, 10) : [],
      education: Array.isArray(cv.education) ? cv.education.slice(0, 10) : [],
      savedFacts: profile.answers || {},
    };

    const { output } = await generateText({
      model: "openai/gpt-5.6-luna",
      reasoning: "low",
      output: Output.object({ schema: jobSchema }),
      tools: { web_search: openai.tools.webSearch({}) },
      prompt: `Find current live job vacancies suitable for a student living in Portsmouth, England.

Search broadly across the live web. Use job boards such as Indeed UK, Reed, Totaljobs, CV-Library, LinkedIn Jobs, Adzuna and jobs.ac.uk for discovery, but whenever possible follow the vacancy to the employer's own careers page or its ATS and return that direct application URL instead of the job-board page.

Also search direct careers pages for employers around Portsmouth/Southsea/Port Solent/Cosham/Fareham/Havant: hospitality, pubs/restaurants/cafes, retail, supermarkets, cinemas, leisure, events, reception/admin, customer service, warehouses, university/student-union work and other flexible employers.

Priorities, in order:
1. Live vacancies with a direct employer/ATS application URL.
2. Applications that do not require an existing job-board account.
3. Portsmouth first, then places within roughly 15 miles and realistically commutable from Portsmouth.
4. Part-time, weekend, evening, flexible, casual, zero-hours or explicitly student-friendly work.
5. Relevant entry-level jobs matching the CV.
6. Recently posted vacancies.

Do not return generic search-result pages when a vacancy/application URL exists. Do not invent vacancies, employers or URLs. Only return jobs that appear live in current search results. Remove duplicates and expired roles. Avoid clearly full-time professional roles unsuitable alongside university. If the same vacancy appears on a board and on an employer site, keep the employer/ATS version only.

Score 0-100 based on student suitability + CV fit + ease of direct application, not on speculative likelihood of hiring.

Applicant facts:
${JSON.stringify(facts)}

Return up to 20 strongest current opportunities.`,
    });

    return Response.json(output);
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to search jobs." }, { status: 500 });
  }
}
