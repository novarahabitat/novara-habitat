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
  mode: "auto";
  notes: string;
  answers: Record<string, string>;
  cvText: string;
  cvDetails: CvDetails;
};

type JobStatus = "found" | "applying" | "applied" | "question" | "skipped" | "blocked";

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
  radius: 15,
  mode: "auto",
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
  return raw.map((item, index) => {
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
  const [message, setMessage] = useState("Add your CV. Everything else is automatic.");
  const [pending, setPending] = useState<PendingQuestion | null>(null);
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
          mode: "auto",
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
    patchJob(job.id, { status: "applying", note: "Completing application…" });
    const form = new FormData();
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
      setMessage("One answer is needed. The job hunt is paused here.");
      return "pause" as const;
    }

    if (payload.status === "applied") {
      patchJob(job.id, { status: "applied", note: payload.message || "Application sent" });
      return "continue" as const;
    }

    patchJob(job.id, { status: "blocked", note: payload.message || "Could not submit automatically" });
    return "continue" as const;
  }

  async function continueQueue(list: Job[], startIndex: number, effectiveProfile: Profile, file: File) {
    queueRef.current = { jobs: list, nextIndex: startIndex };
    for (let i = startIndex; i < list.length; i += 1) {
      queueRef.current = { jobs: list, nextIndex: i };
      const job = list[i];
      try {
        const result = await processJob(job, effectiveProfile, file);
        if (result === "pause") return;
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
    setMessage("Searching current student jobs around Portsmouth…");
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
      setMessage(`${found.length} jobs found. Applying automatically…`);
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

  async function clearEverything() {
    await deleteCvFile().catch(() => undefined);
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(JOBS_KEY);
    setProfile(defaultProfile);
    setCvFile(null);
    setJobs([]);
    setPending(null);
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
            <p className="mt-2 text-sm text-white/45">Portsmouth · student / part-time work · automatic applications</p>
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
            <button type="button" disabled={!answer.trim() || busy} onClick={() => void saveAnswerAndContinue()} className="mt-3 w-full rounded-2xl bg-amber-200 px-5 py-3 text-sm font-semibold text-[#1a1607] disabled:opacity-40">Save answer & continue automatically</button>
          </section>
        )}

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.035] p-5 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <div><p className="text-xs uppercase tracking-[0.18em] text-white/35">Step 2</p><h2 className="mt-1 text-xl font-semibold">Automatic job hunt</h2></div>
            <div className="text-right text-xs text-white/35"><p>Portsmouth + 15 miles</p><p>{Object.keys(profile.answers).length} extra answers saved</p></div>
          </div>
          <p className="mt-4 text-sm leading-6 text-white/50">The agent searches current student-friendly jobs, reads each vacancy, writes a tailored truthful cover letter, fills the application from the CV and saved answers, and submits it. If a required fact is missing, it asks one clear question above.</p>
          <button type="button" disabled={!cvFile || busy || !agentOnline || Boolean(pending)} onClick={() => void startJobHunt()} className="mt-5 w-full rounded-2xl bg-emerald-300 px-5 py-4 text-base font-semibold text-[#07100d] transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-35">
            {busy ? "Working…" : "Start job hunt"}
          </button>
        </section>

        <section className="mt-6 grid grid-cols-4 gap-2">
          {[["Found", stats.found], ["Applied", stats.applied], ["Question", stats.questions], ["Skipped", stats.skipped]].map(([label, value]) => (
            <div key={String(label)} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-center"><p className="text-2xl font-semibold">{value}</p><p className="mt-1 text-[11px] text-white/35">{label}</p></div>
          ))}
        </section>

        {jobs.length > 0 && (
          <section className="mt-6 space-y-2">
            {jobs.map((job) => (
              <div key={job.id} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.025] px-4 py-3">
                <div className={`h-2.5 w-2.5 shrink-0 rounded-full ${job.status === "applied" ? "bg-emerald-300" : job.status === "question" ? "bg-amber-200" : job.status === "blocked" || job.status === "skipped" ? "bg-white/20" : job.status === "applying" ? "bg-sky-300" : "bg-white/35"}`} />
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
