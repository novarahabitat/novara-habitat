"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type CvDetails = {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postcode: string;
  country: string;
  linkedin: string;
  portfolio: string;
  skills: string[];
  education: Array<{ institution: string; qualification: string; field: string; start: string; end: string }>;
  experience: Array<{ employer: string; title: string; location: string; start: string; end: string; details: string[] }>;
  summary: string;
  additionalFacts: string[];
};

type Profile = {
  name: string;
  email: string;
  phone: string;
  location: string;
  targetRoles: string;
  radius: number;
  mode: "review";
  notes: string;
  answers: Record<string, string>;
  cvText: string;
  cvDetails: CvDetails;
};

type JobStatus = "found" | "applying" | "review" | "applied" | "question" | "skipped" | "blocked";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  source?: string;
  url?: string;
  score?: number;
  status: JobStatus;
  note?: string;
};

type PendingQuestion = { job: Job; key: string; question: string; message: string };
type PendingReview = { job: Job; submitSelector: string; message: string; coverLetter: string };
type StoredCv = { id: "cv"; name: string; type: string; blob: Blob };
type QueueState = { jobs: Job[]; nextIndex: number };

const PROFILE_KEY = "naomi-job-hunt-profile-v3";
const JOBS_KEY = "naomi-job-hunt-jobs-v3";
const DB_NAME = "naomi-job-hunt";
const DB_STORE = "files";

const emptyCvDetails: CvDetails = {
  firstName: "", lastName: "", address: "", city: "", postcode: "", country: "",
  linkedin: "", portfolio: "", skills: [], education: [], experience: [], summary: "", additionalFacts: [],
};

const defaultProfile: Profile = {
  name: "Naomi",
  email: "",
  phone: "",
  location: "Portsmouth, UK",
  targetRoles: "Student jobs, part-time jobs, weekend jobs, flexible casual work",
  radius: 3,
  mode: "review",
  notes: "",
  answers: {},
  cvText: "",
  cvDetails: emptyCvDetails,
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(DB_STORE)) request.result.createObjectStore(DB_STORE, { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveCvFile(file: File) {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(DB_STORE, "readwrite");
    tx.objectStore(DB_STORE).put({ id: "cv", name: file.name, type: file.type, blob: file } satisfies StoredCv);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

async function loadCvFile(): Promise<File | null> {
  const db = await openDb();
  const stored = await new Promise<StoredCv | undefined>((resolve, reject) => {
    const tx = db.transaction(DB_STORE, "readonly");
    const request = tx.objectStore(DB_STORE).get("cv");
    request.onsuccess = () => resolve(request.result as StoredCv | undefined);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return stored ? new File([stored.blob], stored.name, { type: stored.type }) : null;
}

async function deleteCvFile() {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(DB_STORE, "readwrite");
    tx.objectStore(DB_STORE).delete("cv");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

function normaliseJobs(payload: unknown): Job[] {
  const raw = payload && typeof payload === "object" && Array.isArray((payload as { jobs?: unknown }).jobs)
    ? (payload as { jobs: unknown[] }).jobs
    : [];
  return raw.map<Job>((item, index) => {
    const job = item && typeof item === "object" ? item as Record<string, unknown> : {};
    const url = typeof job.url === "string" ? job.url : undefined;
    return {
      id: String(job.id || url || `job-${Date.now()}-${index}`),
      title: String(job.title || "Student job"),
      company: String(job.company || "Employer"),
      location: String(job.location || "Portsmouth area"),
      salary: job.salary ? String(job.salary) : undefined,
      source: job.source ? String(job.source) : undefined,
      url,
      score: typeof job.score === "number" ? job.score : undefined,
      status: "found",
      note: job.reason ? String(job.reason) : undefined,
    };
  }).filter((job) => Boolean(job.url));
}

export default function NaomiJobHuntPage() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [agentOnline, setAgentOnline] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("Add your CV. Applications are prepared automatically, but nothing is submitted without your confirmation.");
  const [pending, setPending] = useState<PendingQuestion | null>(null);
  const [pendingReview, setPendingReview] = useState<PendingReview | null>(null);
  const [answer, setAnswer] = useState("");
  const [ready, setReady] = useState(false);
  const queueRef = useRef<QueueState | null>(null);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(PROFILE_KEY);
      const savedJobs = localStorage.getItem(JOBS_KEY);
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile) as Partial<Profile>;
        setProfile({
          ...defaultProfile,
          ...parsed,
          location: "Portsmouth, UK",
          targetRoles: defaultProfile.targetRoles,
          radius: 3,
          mode: "review",
          answers: parsed.answers || {},
          cvDetails: { ...emptyCvDetails, ...(parsed.cvDetails || {}) },
        });
      }
      if (savedJobs) setJobs(JSON.parse(savedJobs));
    } catch {}
    void loadCvFile().then(setCvFile).catch(() => undefined);
    setReady(true);
  }, []);

  useEffect(() => { if (ready) localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); }, [profile, ready]);
  useEffect(() => { if (ready) localStorage.setItem(JOBS_KEY, JSON.stringify(jobs)); }, [jobs, ready]);

  useEffect(() => {
    if (!ready) return;
    void fetch("/api/naomi/health", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setAgentOnline(Boolean(data?.ok)))
      .catch(() => setAgentOnline(false));
  }, [ready]);

  const stats = useMemo(() => ({
    found: jobs.length,
    ready: jobs.filter((job) => job.status === "review").length,
    applied: jobs.filter((job) => job.status === "applied").length,
    questions: jobs.filter((job) => job.status === "question").length,
    skipped: jobs.filter((job) => job.status === "blocked" || job.status === "skipped").length,
  }), [jobs]);

  function patchJob(id: string, patch: Partial<Job>) {
    setJobs((current) => current.map((job) => job.id === id ? { ...job, ...patch } : job));
  }

  async function analyseCv(file: File) {
    setBusy(true);
    setMessage("Reading your CV…");
    setPending(null);
    setPendingReview(null);
    try {
      const form = new FormData();
      form.append("cv", file);
      const response = await fetch("/api/naomi/cv", { method: "POST", body: form });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || "CV analysis failed.");
      const x = payload.profile || {};
      const details: CvDetails = {
        firstName: x.firstName || "", lastName: x.lastName || "", address: x.address || "",
        city: x.city || "", postcode: x.postcode || "", country: x.country || "",
        linkedin: x.linkedin || "", portfolio: x.portfolio || "",
        skills: Array.isArray(x.skills) ? x.skills : [],
        education: Array.isArray(x.education) ? x.education : [],
        experience: Array.isArray(x.experience) ? x.experience : [],
        summary: x.summary || "", additionalFacts: Array.isArray(x.additionalFacts) ? x.additionalFacts : [],
      };
      setProfile((current) => ({
        ...current,
        name: x.name || current.name,
        email: x.email || current.email,
        phone: x.phone || current.phone,
        notes: [x.rightToWork, x.sponsorship, x.drivingLicence].filter(Boolean).join(" · ") || current.notes,
        cvText: payload.cvText || "",
        cvDetails: details,
      }));
      await saveCvFile(file);
      setCvFile(file);
      setMessage("CV ready. Press Start job hunt.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "CV analysis failed.");
    } finally {
      setBusy(false);
    }
  }

  async function processJob(job: Job, effectiveProfile: Profile, file: File) {
    patchJob(job.id, { status: "applying", note: "Preparing application…" });
    const form = new FormData();
    form.append("phase", "prepare");
    form.append("job", JSON.stringify(job));
    form.append("profile", JSON.stringify(effectiveProfile));
    form.append("cv", file);
    const response = await fetch("/api/naomi/agent", { method: "POST", body: form });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload?.error || "Application failed.");

    if (payload.status === "need_info") {
      const question: PendingQuestion = {
        job,
        key: String(payload.questionKey || payload.question || "answer"),
        question: String(payload.question || "A piece of information is missing."),
        message: String(payload.message || "The application needs one answer."),
      };
      patchJob(job.id, { status: "question", note: question.question });
      setPending(question);
      setPendingReview(null);
      setMessage("One answer is needed. The job hunt is paused here.");
      return "pause" as const;
    }

    if (payload.status === "ready_for_review") {
      const review: PendingReview = {
        job,
        submitSelector: String(payload.submitSelector || ""),
        message: String(payload.message || "Application ready for your confirmation."),
        coverLetter: String(payload.coverLetter || ""),
      };
      patchJob(job.id, { status: "review", note: "Ready for manual confirmation" });
      setPending(null);
      setPendingReview(review);
      setMessage("Application complete. Nothing has been sent yet — confirm it below.");
      return "pause" as const;
    }

    if (payload.status === "applied") {
      patchJob(job.id, { status: "applied", note: payload.message || "Application sent" });
      return "continue" as const;
    }

    patchJob(job.id, { status: "blocked", note: payload.message || "Could not prepare automatically" });
    return "continue" as const;
  }

  async function continueQueue(list: Job[], startIndex: number, effectiveProfile: Profile, file: File) {
    queueRef.current = { jobs: list, nextIndex: startIndex };
    for (let i = startIndex; i < list.length; i += 1) {
      queueRef.current = { jobs: list, nextIndex: i };
      const job = list[i];
      try {
        const result = await processJob(job, effectiveProfile, file);
        if (result === "pause") {
          setBusy(false);
          return;
        }
      } catch (error) {
        patchJob(job.id, { status: "blocked", note: error instanceof Error ? error.message : "Could not complete" });
      }
      queueRef.current = { jobs: list, nextIndex: i + 1 };
    }
    queueRef.current = null;
    setBusy(false);
    setMessage("Job hunt complete for this run.");
  }

  async function startJobHunt() {
    const file = cvFile || await loadCvFile();
    if (!file) {
      setMessage("Add your CV first.");
      return;
    }
    if (!agentOnline) {
      setMessage("Cloud agent is currently unavailable.");
      return;
    }

    setBusy(true);
    setPending(null);
    setPendingReview(null);
    setMessage("Searching current student jobs within 3 miles of Portsmouth…");
    try {
      const response = await fetch("/api/naomi/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || "Job search failed.");
      const found = normaliseJobs(payload);
      setJobs(found);
      if (!found.length) {
        setBusy(false);
        setMessage("No suitable live vacancies found in this run.");
        return;
      }
      setMessage(`${found.length} jobs found. Preparing the first application…`);
      await continueQueue(found, 0, profile, file);
    } catch (error) {
      setBusy(false);
      setMessage(error instanceof Error ? error.message : "Job hunt failed.");
    }
  }

  async function saveAnswerAndContinue() {
    if (!pending || !answer.trim()) return;
    const file = cvFile || await loadCvFile();
    if (!file) return;

    const nextProfile: Profile = {
      ...profile,
      answers: { ...profile.answers, [pending.key]: answer.trim() },
    };
    setProfile(nextProfile);
    setAnswer("");
    setBusy(true);
    setMessage("Answer saved. Continuing the application…");

    const currentJob = pending.job;
    setPending(null);
    try {
      const result = await processJob(currentJob, nextProfile, file);
      if (result === "pause") { setBusy(false); return; }
    } catch (error) {
      patchJob(currentJob.id, { status: "blocked", note: error instanceof Error ? error.message : "Could not complete" });
    }

    const queue = queueRef.current;
    if (queue) await continueQueue(queue.jobs, queue.nextIndex + 1, nextProfile, file);
    else setBusy(false);
  }

  async function confirmSubmission() {
    if (!pendingReview) return;
    const file = cvFile || await loadCvFile();
    if (!file) return;

    const review = pendingReview;
    setBusy(true);
    setMessage(`Submitting ${review.job.title}…`);

    try {
      const form = new FormData();
      form.append("phase", "submit");
      form.append("job", JSON.stringify(review.job));
      form.append("submitSelector", review.submitSelector);
      const response = await fetch("/api/naomi/agent", { method: "POST", body: form });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || "Submission failed.");

      if (payload.status === "applied") {
        patchJob(review.job.id, { status: "applied", note: payload.message || "Application submitted" });
        setPendingReview(null);
        setMessage("Application submitted. Preparing the next job…");
      } else {
        patchJob(review.job.id, { status: "blocked", note: payload.message || "Submission could not be confirmed" });
        setPendingReview(null);
        setMessage(payload.message || "Submission could not be confirmed. Moving to the next job.");
      }
    } catch (error) {
      patchJob(review.job.id, { status: "blocked", note: error instanceof Error ? error.message : "Submission failed" });
      setPendingReview(null);
      setMessage(error instanceof Error ? error.message : "Submission failed.");
    }

    const queue = queueRef.current;
    if (queue) await continueQueue(queue.jobs, queue.nextIndex + 1, profile, file);
    else setBusy(false);
  }

  async function skipSubmission() {
    if (!pendingReview) return;
    const file = cvFile || await loadCvFile();
    if (!file) return;

    const review = pendingReview;
    setBusy(true);
    try {
      const form = new FormData();
      form.append("phase", "cancel");
      form.append("job", JSON.stringify(review.job));
      await fetch("/api/naomi/agent", { method: "POST", body: form });
    } catch {}

    patchJob(review.job.id, { status: "skipped", note: "Skipped before submission" });
    setPendingReview(null);
    setMessage("Application skipped. Preparing the next job…");

    const queue = queueRef.current;
    if (queue) await continueQueue(queue.jobs, queue.nextIndex + 1, profile, file);
    else setBusy(false);
  }

  async function clearEverything() {
    await deleteCvFile().catch(() => undefined);
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(JOBS_KEY);
    setProfile(defaultProfile);
    setCvFile(null);
    setJobs([]);
    setPending(null);
    setPendingReview(null);
    setAnswer("");
    setMessage("Cleared. Add a CV to start again.");
  }

  return (
    <main className="min-h-screen bg-[#07100d] text-[#f4f8f6]">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
        <header className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-emerald-200/55">Private · Naomi</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Find me a student job</h1>
            <p className="mt-2 text-sm text-white/45">Portsmouth · within 3 miles · manual confirmation before submit</p>
          </div>
          <span className={`mt-1 rounded-full border px-3 py-1.5 text-xs ${agentOnline ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100" : "border-white/10 bg-white/5 text-white/40"}`}>
            {agentOnline ? "Cloud agent online" : "Agent unavailable"}
          </span>
        </header>

        <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/70">{message}</div>

        <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <div><p className="text-xs uppercase tracking-[0.18em] text-white/35">Step 1</p><h2 className="mt-1 text-xl font-semibold">Your CV</h2></div>
            {cvFile && <span className="rounded-full bg-emerald-300/10 px-3 py-1 text-xs text-emerald-100">Ready</span>}
          </div>

          <label className="mt-5 block cursor-pointer rounded-2xl border border-dashed border-white/15 bg-black/20 p-6 text-center transition hover:border-emerald-200/30 hover:bg-emerald-300/[0.03]">
            <input type="file" className="sr-only" accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void analyseCv(file);
            }} />
            <p className="font-medium">{cvFile ? cvFile.name : "Tap to add CV"}</p>
            <p className="mt-1 text-xs text-white/35">PDF or DOCX · information is extracted automatically</p>
          </label>

          {cvFile && (
            <div className="mt-4 rounded-2xl bg-black/20 p-4 text-sm text-white/55">
              <div className="grid gap-2 sm:grid-cols-3">
                <div><span className="text-white/30">Name</span><br />{profile.name || "—"}</div>
                <div><span className="text-white/30">Email</span><br />{profile.email || "Not in CV"}</div>
                <div><span className="text-white/30">Phone</span><br />{profile.phone || "Not in CV"}</div>
              </div>
              {profile.cvDetails.skills.length > 0 && <p className="mt-3 text-xs leading-5 text-white/40">Detected: {profile.cvDetails.skills.slice(0, 10).join(" · ")}</p>}
            </div>
          )}
        </section>

        {pending && (
          <section className="mt-6 rounded-3xl border border-amber-200/20 bg-amber-200/[0.06] p-5 sm:p-7">
            <p className="text-xs uppercase tracking-[0.18em] text-amber-100/55">One thing missing</p>
            <h2 className="mt-2 text-xl font-semibold">{pending.question}</h2>
            <p className="mt-2 text-sm text-white/45">For {pending.job.title} · {pending.job.company}</p>
            <textarea autoFocus rows={3} value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Type the answer here…" className="mt-5 w-full resize-none rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm placeholder:text-white/25" />
            <button type="button" disabled={!answer.trim() || busy} onClick={() => void saveAnswerAndContinue()} className="mt-3 w-full rounded-2xl bg-amber-200 px-5 py-3 text-sm font-semibold text-[#1a1607] disabled:opacity-40">Save answer & continue</button>
          </section>
        )}

        {pendingReview && (
          <section className="mt-6 rounded-3xl border border-violet-200/20 bg-violet-200/[0.06] p-5 sm:p-7">
            <p className="text-xs uppercase tracking-[0.18em] text-violet-100/55">Ready to submit</p>
            <h2 className="mt-2 text-xl font-semibold">{pendingReview.job.title}</h2>
            <p className="mt-1 text-sm text-white/45">{pendingReview.job.company} · {pendingReview.job.location}</p>
            <p className="mt-4 text-sm leading-6 text-white/60">The form is filled and the cover letter is prepared. Nothing has been sent yet.</p>

            {pendingReview.coverLetter && (
              <details className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                <summary className="cursor-pointer text-sm font-medium text-white/70">View tailored cover letter</summary>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-white/50">{pendingReview.coverLetter}</p>
              </details>
            )}

            <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
              <button type="button" disabled={busy} onClick={() => void confirmSubmission()} className="rounded-2xl bg-violet-200 px-5 py-3 text-sm font-semibold text-[#130d1e] disabled:opacity-40">Submit application</button>
              <button type="button" disabled={busy} onClick={() => void skipSubmission()} className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm text-white/60 disabled:opacity-40">Skip</button>
            </div>

            {pendingReview.job.url && <a href={pendingReview.job.url} target="_blank" rel="noreferrer" className="mt-4 inline-block text-xs text-white/35 underline underline-offset-4 hover:text-white/60">View job listing</a>}
          </section>
        )}

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.035] p-5 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <div><p className="text-xs uppercase tracking-[0.18em] text-white/35">Step 2</p><h2 className="mt-1 text-xl font-semibold">Automatic job preparation</h2></div>
            <div className="text-right text-xs text-white/35"><p>Portsmouth + 3 miles</p><p>{Object.keys(profile.answers).length} extra answers saved</p></div>
          </div>
          <p className="mt-4 text-sm leading-6 text-white/50">The agent searches current student-friendly jobs, reads each vacancy, writes a tailored truthful cover letter and fills the application from the CV and saved answers. It always stops before the final submission and waits for your confirmation.</p>
          <button type="button" disabled={!cvFile || busy || !agentOnline || Boolean(pending) || Boolean(pendingReview)} onClick={() => void startJobHunt()} className="mt-5 w-full rounded-2xl bg-emerald-300 px-5 py-4 text-base font-semibold text-[#07100d] transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-35">
            {busy ? "Working…" : "Start job hunt"}
          </button>
        </section>

        <section className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {[["Found", stats.found], ["Ready", stats.ready], ["Applied", stats.applied], ["Question", stats.questions], ["Skipped", stats.skipped]].map(([label, value]) => (
            <div key={String(label)} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-center"><p className="text-2xl font-semibold">{value}</p><p className="mt-1 text-[11px] text-white/35">{label}</p></div>
          ))}
        </section>

        {jobs.length > 0 && (
          <section className="mt-6 space-y-2">
            {jobs.map((job) => (
              <div key={job.id} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.025] px-4 py-3">
                <div className={`h-2.5 w-2.5 shrink-0 rounded-full ${job.status === "applied" ? "bg-emerald-300" : job.status === "review" ? "bg-violet-300" : job.status === "question" ? "bg-amber-200" : job.status === "blocked" || job.status === "skipped" ? "bg-white/20" : job.status === "applying" ? "bg-sky-300" : "bg-white/35"}`} />
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{job.title}</p><p className="truncate text-xs text-white/35">{job.company} · {job.location}{job.salary ? ` · ${job.salary}` : ""}</p></div>
                <span className="text-xs text-white/35">{job.status}</span>
              </div>
            ))}
          </section>
        )}

        <div className="mt-8 flex justify-center"><button type="button" onClick={() => void clearEverything()} className="text-xs text-white/25 hover:text-white/50">Clear CV and saved answers</button></div>
      </div>
    </main>
  );
}