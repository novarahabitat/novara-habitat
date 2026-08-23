import { generateText, Output } from "ai";
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
import { z } from "zod";

export const runtime = "nodejs";
export const maxDuration = 60;

const cvProfileSchema = z.object({
  name: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  address: z.string(),
  city: z.string(),
  postcode: z.string(),
  country: z.string(),
  linkedin: z.string(),
  portfolio: z.string(),
  targetRoles: z.array(z.string()),
  skills: z.array(z.string()),
  education: z.array(
    z.object({
      institution: z.string(),
      qualification: z.string(),
      field: z.string(),
      start: z.string(),
      end: z.string(),
    }),
  ),
  experience: z.array(
    z.object({
      employer: z.string(),
      title: z.string(),
      location: z.string(),
      start: z.string(),
      end: z.string(),
      details: z.array(z.string()),
    }),
  ),
  rightToWork: z.string(),
  sponsorship: z.string(),
  drivingLicence: z.string(),
  summary: z.string(),
  additionalFacts: z.array(z.string()),
});

type CvProfile = z.infer<typeof cvProfileSchema>;

function emptyProfile(): CvProfile {
  return {
    name: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postcode: "",
    country: "",
    linkedin: "",
    portfolio: "",
    targetRoles: [],
    skills: [],
    education: [],
    experience: [],
    rightToWork: "",
    sponsorship: "",
    drivingLicence: "",
    summary: "",
    additionalFacts: [],
  };
}

async function extractText(file: File, buffer: Buffer): Promise<string> {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();

  if (type === "application/pdf" || name.endsWith(".pdf")) {
    const parser = new PDFParse({ data: buffer });
    try {
      const result = await parser.getText();
      return result.text || "";
    } finally {
      await parser.destroy();
    }
  }

  if (
    type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    name.endsWith(".docx")
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "";
  }

  if (type.startsWith("text/") || name.endsWith(".txt")) {
    return buffer.toString("utf8");
  }

  return "";
}

function fallbackProfile(text: string): CvProfile {
  const profile = emptyProfile();
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const email = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "";
  const phone =
    text.match(/(?:\+44\s?\d{4}|0\d{4})[\s.-]?\d{3}[\s.-]?\d{3}/)?.[0] ||
    text.match(/(?:\+44\s?7\d{3}|07\d{3})[\s.-]?\d{3}[\s.-]?\d{3}/)?.[0] ||
    "";
  const postcode =
    text.match(/\b(?:GIR 0AA|[A-PR-UWYZ][A-HK-Y]?\d[A-Z\d]?\s?\d[ABD-HJLNP-UW-Z]{2})\b/i)?.[0] || "";
  const linkedin = text.match(/https?:\/\/(?:www\.)?linkedin\.com\/[^\s)]+/i)?.[0] || "";
  const urls = [...text.matchAll(/https?:\/\/[^\s)]+/gi)].map((match) => match[0]);
  const portfolio = urls.find((url) => !/linkedin\.com/i.test(url)) || "";

  const likelyName = lines.find((line) => {
    if (line.length < 3 || line.length > 60) return false;
    if (line.includes("@") || /https?:\/\//i.test(line) || /\d{3}/.test(line)) return false;
    return /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/.test(line);
  });

  profile.name = likelyName || "";
  if (likelyName) {
    const parts = likelyName.split(/\s+/);
    profile.firstName = parts[0] || "";
    profile.lastName = parts.slice(1).join(" ");
  }
  profile.email = email;
  profile.phone = phone;
  profile.postcode = postcode;
  profile.linkedin = linkedin;
  profile.portfolio = portfolio;
  profile.summary = lines.slice(0, 12).join(" · ").slice(0, 1800);

  const lower = text.toLowerCase();
  if (lower.includes("right to work in the uk") || lower.includes("right to work in uk")) {
    profile.rightToWork = "Right to work in the UK stated on CV";
  }
  if (lower.includes("full uk driving licence") || lower.includes("full uk driving license")) {
    profile.drivingLicence = "Full UK driving licence";
  }

  return profile;
}

async function extractWithAi(file: File, buffer: Buffer, text: string): Promise<CvProfile> {
  const instruction = `Extract a truthful applicant profile from this CV for UK job applications.
Return only facts explicitly present in the CV. Never invent or infer dates, qualifications, nationality, visa status, right-to-work status, driving licence, employers, skills or achievements.
For missing fields return an empty string or empty array.
Target roles may be suggested only from job titles/summary already present in the CV; keep them short.
Preserve education and employment dates exactly as written where possible.`;

  const fileIsPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  const content: Array<
    | { type: "text"; text: string }
    | { type: "file"; data: Buffer; mediaType: string; filename: string }
  > = [{ type: "text", text: instruction }];

  if (fileIsPdf) {
    content.push({
      type: "file",
      data: buffer,
      mediaType: "application/pdf",
      filename: file.name,
    });
  } else {
    content.push({ type: "text", text: `\nCV text:\n${text.slice(0, 50000)}` });
  }

  const { output } = await generateText({
    model: "openai/gpt-5.6-luna",
    output: Output.object({ schema: cvProfileSchema }),
    messages: [{ role: "user", content }],
  });

  return output;
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("cv");

    if (!(file instanceof File)) {
      return Response.json({ error: "CV file is required." }, { status: 400 });
    }
    if (file.size === 0) {
      return Response.json({ error: "The CV file is empty." }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return Response.json({ error: "CV must be 10 MB or smaller." }, { status: 413 });
    }

    const lower = file.name.toLowerCase();
    if (!lower.endsWith(".pdf") && !lower.endsWith(".docx") && !lower.endsWith(".txt")) {
      return Response.json({ error: "Use a PDF, DOCX or TXT CV." }, { status: 415 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let text = "";
    try {
      text = await extractText(file, buffer);
    } catch {
      // PDF extraction is a fallback only; multimodal AI can still read the PDF directly.
    }

    let profile: CvProfile;
    let extraction: "ai" | "fallback" = "ai";
    try {
      profile = await extractWithAi(file, buffer, text);
    } catch {
      profile = fallbackProfile(text);
      extraction = "fallback";
    }

    return Response.json({
      ok: true,
      extraction,
      filename: file.name,
      profile,
      cvText: text.slice(0, 50000),
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unable to analyse CV." },
      { status: 500 },
    );
  }
}
