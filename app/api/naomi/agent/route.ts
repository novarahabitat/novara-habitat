import { Output, generateText } from "ai";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { z } from "zod";
import { browserCommand, getNaomiSandbox, safeBrowserCommand } from "@/lib/naomiSandbox";

export const runtime = "nodejs";
export const maxDuration = 120;

const actionSchema = z.object({
  state: z.enum(["act", "need_info", "ready_review", "done", "blocked"]),
  action: z.enum(["click", "fill", "select", "check", "upload_cv", "upload_cover_letter", "none"]),
  selector: z.string(),
  value: z.string(),
  questionKey: z.string(),
  question: z.string(),
  message: z.string(),
});

const verificationSchema = z.object({
  submitted: z.boolean(),
  message: z.string(),
});

function safeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-100) || "cv.pdf";
}

function cleanForPdf(value: string) {
  return value
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/[^\x20-\x7E\n]/g, " ");
}

function wrap(text: string, max = 88) {
  const out: string[] = [];
  for (const paragraph of cleanForPdf(text).split(/\n+/)) {
    const words = paragraph.trim().split(/\s+/).filter(Boolean);
    let line = "";
    for (const word of words) {
      if (!line) line = word;
      else if (`${line} ${word}`.length <= max) line += ` ${word}`;
      else { out.push(line); line = word; }
    }
    if (line) out.push(line);
    out.push("");
  }
  return out;
}

async function coverLetterPdf(letter: string) {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const pageSize: [number, number] = [595.28, 841.89];
  let page = pdf.addPage(pageSize);
  let y = 790;
  for (const line of wrap(letter)) {
    if (y < 55) { page = pdf.addPage(pageSize); y = 790; }
    if (line) page.drawText(line, { x: 55, y, size: 10.5, font });
    y -= line ? 15 : 8;
  }
  return Buffer.from(await pdf.save());
}

async function makeCoverLetter(profile: any, job: any, pageText: string) {
  const { output } = await generateText({
    model: "openai/gpt-5.6-luna",
    reasoning: "low",
    output: Output.object({
      schema: z.object({ subject: z.string(), letter: z.string() }),
    }),
    prompt: `Write a concise UK cover letter for this student's job application.
Use ONLY facts present in the applicant data below. Never invent experience, qualifications, availability, personal qualities demonstrated by events that are not in the CV, right-to-work facts or achievements.
Adapt the wording to the actual vacancy. Keep it natural, specific and around 180-280 words. Do not include fake addresses or a fake hiring-manager name.

JOB:
${JSON.stringify(job)}

JOB PAGE TEXT:
${pageText.slice(0, 18000)}

APPLICANT:
${JSON.stringify(profile).slice(0, 30000)}`,
  });
  return output;
}

async function verifySubmission(job: any, pageText: string) {
  const { output } = await generateText({
    model: "openai/gpt-5.6-luna",
    reasoning: "low",
    output: Output.object({ schema: verificationSchema }),
    prompt: `Decide whether this UK job application has definitely been submitted successfully.
Return submitted=true ONLY if the page contains a credible explicit confirmation such as application submitted, application received, thank you for applying, or an equivalent success message.
If the form is still present, there is a validation error, the state is ambiguous, or the page only says the application is ready, return submitted=false.

JOB:
${JSON.stringify(job)}

PAGE TEXT:
${pageText.slice(0, 18000)}`,
  });
  return output;
}

async function nextAction(input: {
  profile: any;
  job: any;
  snapshot: string;
  pageText: string;
  fileInputs: string;
  coverLetter: string;
  step: number;
}) {
  const { output } = await generateText({
    model: "openai/gpt-5.6-luna",
    reasoning: "low",
    output: Output.object({ schema: actionSchema }),
    prompt: `You control a browser completing a UK job application for the applicant herself. Choose exactly ONE next action.

Goal: navigate from the vacancy to its application form, fill it truthfully, attach the CV, use the tailored cover letter when requested, and prepare everything for submission. NEVER submit the application without explicit manual confirmation from the applicant.

STRICT RULES:
- Use only facts in APPLICANT and SAVED ANSWERS. Never invent anything.
- Portsmouth is the applicant's search city, not necessarily her home address. Do not invent an address.
- If a mandatory factual question cannot be answered from the data, return state=need_info with one short, precise question and a stable questionKey. Do not guess.
- Examples of valid missing questions: availability, desired hours, postcode/address, notice period, date of birth if genuinely mandatory, specific licence/certification, work-authorisation answer.
- Optional equality/diversity questions: choose 'Prefer not to say' when available; otherwise leave optional fields blank. Never infer protected characteristics.
- Do not request or store account passwords. If a site requires a login, CAPTCHA, MFA or email verification that cannot be handled legitimately, return state=blocked and explain it.
- For ordinary terms/privacy declarations required to prepare a truthful application, you may check them.
- Do not click adverts or unrelated navigation.
- If there is an Apply/Apply now/Continue/Next button and it only navigates to another application step, click it.
- If any button would actually send, submit or finalize the application, DO NOT CLICK IT.
- If a required field is visible, fill/select/check it before moving on.
- For the CV upload use action=upload_cv and selector MUST be one of the CSS selectors in FILE INPUTS.
- For a cover-letter file upload use action=upload_cover_letter and a CSS selector from FILE INPUTS.
- For a cover-letter textarea use action=fill and value exactly COVER LETTER.
- For input/select/button refs from ACCESSIBILITY SNAPSHOT use selectors like @e12 exactly as shown.
- When the final Submit application / Send application / Apply control is available and every mandatory field is complete, return state=ready_review, action=none, and put the exact final submit control ref in selector. Do not click it.
- Return state=done only if the page already shows a credible prior submission confirmation.
- If the vacancy is closed, unavailable, clearly unsuitable, or the application cannot be automated, return state=blocked.

STEP: ${input.step}
JOB: ${JSON.stringify(input.job)}
APPLICANT: ${JSON.stringify(input.profile).slice(0, 35000)}
COVER LETTER: ${input.coverLetter}
FILE INPUTS: ${input.fileInputs}
ACCESSIBILITY SNAPSHOT:
${input.snapshot.slice(0, 26000)}
PAGE TEXT:
${input.pageText.slice(0, 18000)}`,
  });
  return output;
}

export async function POST(request: Request) {
  const form = await request.formData();
  const phase = String(form.get("phase") || "prepare");
  const jobRaw = form.get("job");

  if (typeof jobRaw !== "string") {
    return Response.json({ error: "Job data is required." }, { status: 400 });
  }

  const job = JSON.parse(jobRaw);

  if (phase === "cancel") {
    const sandbox = await getNaomiSandbox();
    try {
      await safeBrowserCommand(sandbox, ["close"]);
      return Response.json({ status: "cancelled" });
    } finally {
      await sandbox.stop().catch(() => undefined);
    }
  }

  if (phase === "submit") {
    const submitSelector = form.get("submitSelector");
    if (typeof submitSelector !== "string" || !submitSelector) {
      return Response.json({ error: "Submit control is missing." }, { status: 400 });
    }

    const sandbox = await getNaomiSandbox();
    try {
      await browserCommand(sandbox, ["click", submitSelector]);
      await safeBrowserCommand(sandbox, ["wait", "900"]);
      await safeBrowserCommand(sandbox, ["wait", "--load", "networkidle"]);
      const pageText = await safeBrowserCommand(sandbox, ["get", "text", "body"]);
      const verification = await verifySubmission(job, pageText);

      if (verification.submitted) {
        await safeBrowserCommand(sandbox, ["state", "save", "/vercel/sandbox/naomi/browser-state.json"]);
        return Response.json({ status: "applied", message: verification.message || "Application submitted." });
      }

      return Response.json({
        status: "blocked",
        message: verification.message || "The submit control was clicked but a successful submission could not be confirmed.",
      });
    } catch (error) {
      return Response.json({ error: error instanceof Error ? error.message : "Submission failed." }, { status: 500 });
    } finally {
      await safeBrowserCommand(sandbox, ["close"]);
      await sandbox.stop().catch(() => undefined);
    }
  }

  const cv = form.get("cv");
  const profileRaw = form.get("profile");

  if (!(cv instanceof File) || typeof profileRaw !== "string") {
    return Response.json({ error: "CV and profile are required." }, { status: 400 });
  }

  const profile = JSON.parse(profileRaw);
  if (!job?.url) return Response.json({ error: "Job URL is missing." }, { status: 400 });

  const sandbox = await getNaomiSandbox();
  const cvPath = `/vercel/sandbox/naomi/${safeFileName(cv.name)}`;
  const coverPath = "/vercel/sandbox/naomi/cover-letter.pdf";
  let preserveForReview = false;

  try {
    await sandbox.writeFiles([{ path: cvPath, content: Buffer.from(await cv.arrayBuffer()) }]);

    await safeBrowserCommand(sandbox, ["close"]);
    await browserCommand(sandbox, ["open", String(job.url)]);
    await safeBrowserCommand(sandbox, ["wait", "--load", "networkidle"]);
    await safeBrowserCommand(sandbox, ["wait", "1200"]);

    let pageText = await safeBrowserCommand(sandbox, ["get", "text", "body"]);
    const cover = await makeCoverLetter(profile, job, pageText);
    await sandbox.writeFiles([{ path: coverPath, content: await coverLetterPdf(cover.letter) }]);

    for (let step = 1; step <= 18; step += 1) {
      const snapshot = await safeBrowserCommand(sandbox, ["snapshot", "-i", "-C"]);
      pageText = await safeBrowserCommand(sandbox, ["get", "text", "body"]);
      const fileInputs = await safeBrowserCommand(sandbox, [
        "eval",
        `JSON.stringify(Array.from(document.querySelectorAll('input[type=file]')).map((el,i)=>{el.setAttribute('data-naomi-upload',String(i));return {selector:'input[data-naomi-upload="'+i+'"]',name:el.getAttribute('name')||'',accept:el.getAttribute('accept')||'',aria:el.getAttribute('aria-label')||'',required:el.required}}))`,
      ]);

      const action = await nextAction({
        profile,
        job,
        snapshot,
        pageText,
        fileInputs,
        coverLetter: cover.letter,
        step,
      });

      if (action.state === "need_info") {
        return Response.json({
          status: "need_info",
          questionKey: action.questionKey || action.question,
          question: action.question,
          message: action.message || "One answer is needed before the application can continue.",
        });
      }

      if (action.state === "ready_review") {
        if (!action.selector) {
          return Response.json({ status: "blocked", message: "The final submit control could not be identified safely." });
        }
        preserveForReview = true;
        return Response.json({
          status: "ready_for_review",
          submitSelector: action.selector,
          message: action.message || "Application completed and ready for your confirmation.",
          coverLetter: cover.letter,
        });
      }

      if (action.state === "done") {
        await safeBrowserCommand(sandbox, ["state", "save", "/vercel/sandbox/naomi/browser-state.json"]);
        return Response.json({ status: "applied", message: action.message || "Application was already submitted.", coverLetter: cover.letter });
      }

      if (action.state === "blocked") {
        return Response.json({ status: "blocked", message: action.message || "This application could not be completed automatically." });
      }

      if (!action.selector && action.action !== "none") {
        return Response.json({ status: "blocked", message: "Application agent could not identify the next form control." });
      }

      if (action.action === "click") {
        await browserCommand(sandbox, ["click", action.selector]);
      } else if (action.action === "fill") {
        await browserCommand(sandbox, ["fill", action.selector, action.value]);
      } else if (action.action === "select") {
        await browserCommand(sandbox, ["select", action.selector, action.value]);
      } else if (action.action === "check") {
        await browserCommand(sandbox, ["check", action.selector]);
      } else if (action.action === "upload_cv") {
        await browserCommand(sandbox, ["upload", action.selector, cvPath]);
      } else if (action.action === "upload_cover_letter") {
        await browserCommand(sandbox, ["upload", action.selector, coverPath]);
      }

      await safeBrowserCommand(sandbox, ["wait", "700"]);
      await safeBrowserCommand(sandbox, ["wait", "--load", "networkidle"]);
    }

    return Response.json({ status: "blocked", message: "Application reached the automation step limit and was stopped without submitting uncertain data." });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Application agent failed." }, { status: 500 });
  } finally {
    if (!preserveForReview) {
      await safeBrowserCommand(sandbox, ["close"]);
      await sandbox.stop().catch(() => undefined);
    }
  }
}