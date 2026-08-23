"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

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
  targetRoles: string;
  location: string;
  radius: number;
  minSalary: string;
  remote: boolean;
  rightToWork: string;
  sponsorship: string;
  drivingLicence: string;
  maxApplications: number;
  mode: "review" | "auto";
  notes: string;
  cvText: string;
  cvDetails: CvDetails;
};

type JobStatus = "new" | "applying" | "prepared" | "applied" | "skipped" | "blocked";

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

type AgentState = "checking" | "online" | "offline";

type StoredCv = { id: "cv"; name: string; type: string; blob: Blob };

const PROFILE_KEY = "naomi-job-hunt-profile-v2";
const JOBS_KEY = "naomi-job-hunt-jobs-v2";
const DB_NAME = "naomi-job-hunt";
const DB_STORE = "files";

const emptyCvDetails: CvDetails = {
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  postcode: "",
  country: "",
  linkedin: "",
  portfolio: "",
  skills: [],
  education: [],
  experience: [],
  summary: "",
  additionalFacts: [],
};

const defaultProfile: Profile = {
  name: "Naomi",
  email: "",
  phone: "",
  targetRoles: "",
  location: "",
  radius: 25,
  minSalary: "",
  remote: true,
  rightToWork: "",
  sponsorship: "",
  drivingLicence: "",
  maxApplications: 15,
  mode: "review",
  notes: "",
  cvText: "",
  cvDetails: emptyCvDetails,
};

const sourceLinks = [
  { name: "Indeed UK", build: (q: string, l: string) => `https://uk.indeed.com/jobs?q=${q}&l=${l}` },
  { name: "LinkedIn", build: (q: string, l: string) => `https://www.linkedin.com/jobs/search/?keywords=${q}&location=${l}` },
  { name: "Reed", build: (q: string, l: string) => `https://www.reed.co.uk/jobs?keywords=${q}&location=${l}` },
  { name: "Totaljobs", build: (q: string, l: string) => `https://www.totaljobs.com/jobs?keywords=${q}&location=${l}` },
  { name: "CV-Library", build: (q: string, l: string) => `https://www.cv-library.co.uk/search-jobs?keywords=${q}&location=${l}` },
  { name: "Adzuna", build: (q: string, l: string) => `https://www.adzuna.co.uk/jobs/search?q=${q}&loc=${l}` },
  { name: "NHS Jobs", build: (q: string, l: string) => `https://www.jobs.nhs.uk/candidate/search/results?keyword=${q}&location=${l}` },
  { name: "Civil Service", build: () => "https://www.civilservicejobs.service.gov.uk/csr/index.cgi" },
];

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
  const list = Array.isArray(payload)
    ? payload
    : payload && typeof payload === "object" && Array.isArray((payload as { jobs?: unknown }).jobs)
      ? (payload as { jobs: unknown[] }).jobs
      : [];

  return list.map((raw, index) => {
    const job = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
    const url = typeof job.url === "string" ? job.url : undefined;
    return {
      id: typeof job.id === "string" ? job.id : url || `job-${Date.now()}-${index}`,
      title: String(job.title || "Untitled role"),
      company: String(job.company || job.employer || "Employer not identified"),
      location: String(job.location || "Location not specified"),
      salary: job.salary ? String(job.salary) : undefined,
      source: job.source ? String(job.source) : undefined,
      url,
      score: typeof job.score === "number" ? job.score : undefined,
      status: "new",
    };
  });
}

function StatusPill({ state }: { state: AgentState }) {
  const style = state === "online"
    ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100"
    : state === "offline"
      ? "border-rose-300/20 bg-rose-300/10 text-rose-100"
      : "border-amber-300/20 bg-amber-300/10 text-amber-100";
  const label = state === "online" ? "Cloud agent online" : state === "offline" ? "Cloud agent unavailable" : "Checking cloud agent";
  return <span className={`rounded-full border px-3 py-1 text-xs font-medium ${style}`}>{label}</span>;
}

export default function NaomiJobHuntPage() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [agentState, setAgentState] = useState<AgentState>("checking");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("Upload your CV once. The system will extract the details and use them for applications.");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [manualUrl, setManualUrl] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(PROFILE_KEY);
      const savedJobs = localStorage.getItem(JOBS_KEY);
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile) as Partial<Profile>;
        setProfile({ ...defaultProfile, ...parsed, cvDetails: { ...emptyCvDetails, ...(parsed.cvDetails || {}) } });
      }
      if (savedJobs) setJobs(JSON.parse(savedJobs));
    } catch {
      // Keep safe defaults if local data is malformed.
    }

    void loadCvFile().then(setCvFile).catch(() => undefined);
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }, [profile, ready]);

  useEffect(() => {
    if (ready) localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
  }, [jobs, ready]);

  async function checkAgent() {
    setAgentState("checking");
    try {
      const response = await fetch("/api/naomi/health", { cache: "no-store" });
      if (!response.ok) throw new Error();
      const payload = await response.json();
      if (!payload?.ok || payload?.agent !== "cloud") throw new Error();
      setAgentState("online");
    } catch {
      setAgentState("offline");
    }
  }

  useEffect(() => {
    if (ready) void checkAgent();
  }, [ready]);

  function updateProfile<K extends keyof Profile>(key: K, value: Profile[K]) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  const searchLinks = useMemo(() => {
    const q = encodeURIComponent(profile.targetRoles || "jobs");
    const l = encodeURIComponent(profile.location || "England");
    return sourceLinks.map((source) => ({ name: source.name, url: source.build(q, l) }));
  }, [profile.targetRoles, profile.location]);

  const stats = useMemo(() => ({
    found: jobs.length,
    ready: jobs.filter((job) => job.status === "new" || job.status === "prepared").length,
    applied: jobs.filter((job) => job.status === "applied").length,
    blocked: jobs.filter((job) => job.status === "blocked").length,
  }), [jobs]);

  async function analyseCv(file?: File | null) {
    const selected = file || cvFile;
    if (!selected) {
      setMessage("Choose a PDF or DOCX CV first.");
      return;
    }

    setBusy(true);
    setMessage("Reading CV and extracting application details…");
    try {
      const form = new FormData();
      form.append("cv", selected);
      const response = await fetch("/api/naomi/cv", { method: "POST", body: form });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || `CV analysis failed (${response.status})`);

      const extracted = payload.profile || {};
      const nextDetails: CvDetails = {
        firstName: extracted.firstName || "",
        lastName: extracted.lastName || "",
        address: extracted.address || "",
        city: extracted.city || "",
        postcode: extracted.postcode || "",
        country: extracted.country || "",
        linkedin: extracted.linkedin || "",
        portfolio: extracted.portfolio || "",
        skills: Array.isArray(extracted.skills) ? extracted.skills : [],
        education: Array.isArray(extracted.education) ? extracted.education : [],
        experience: Array.isArray(extracted.experience) ? extracted.experience : [],
        summary: extracted.summary || "",
        additionalFacts: Array.isArray(extracted.additionalFacts) ? extracted.additionalFacts : [],
      };

      setProfile((current) => ({
        ...current,
        name: extracted.name || current.name,
        email: extracted.email || current.email,
        phone: extracted.phone || current.phone,
        targetRoles: current.targetRoles || (Array.isArray(extracted.targetRoles) ? extracted.targetRoles.join(", ") : ""),
        location: current.location || [extracted.city, extracted.postcode].filter(Boolean).join(" "),
        rightToWork: extracted.rightToWork || current.rightToWork,
        sponsorship: extracted.sponsorship || current.sponsorship,
        drivingLicence: extracted.drivingLicence || current.drivingLicence,
        cvText: payload.cvText || "",
        cvDetails: nextDetails,
      }));

      await saveCvFile(selected);
      setCvFile(selected);
      setMessage(`CV analysed and saved on this device: ${selected.name}${payload.extraction === "fallback" ? " (basic extraction)" : ""}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "CV analysis failed.");
    } finally {
      setBusy(false);
    }
  }

  async function searchJobs(event?: FormEvent) {
    event?.preventDefault();
    if (!profile.targetRoles.trim()) {
      setMessage("Add at least one target role before searching.");
      return;
    }
    if (agentState !== "online") {
      setMessage("Cloud agent is not available.");
      return;
    }

    setBusy(true);
    setMessage("Cloud agent is searching UK job sources…");
    try {
      const response = await fetch("/api/naomi/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || `Search failed (${response.status})`);
      const found = normaliseJobs(payload);
      setJobs(found);
      setMessage(found.length ? `${found.length} matching jobs found.` : "Search completed. No suitable jobs were collected automatically; the direct sources remain available below.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Search failed.");
    } finally {
      setBusy(false);
    }
  }

  function addManualJob() {
    try {
      const url = new URL(manualUrl);
      setJobs((current) => [{
        id: url.toString(),
        title: "Job from link",
        company: url.hostname.replace(/^www\./, ""),
        location: "To be read by cloud agent",
        source: "Manual link",
        url: url.toString(),
        status: "new",
      }, ...current.filter((job) => job.url !== url.toString())]);
      setManualUrl("");
      setMessage("Job added. The cloud agent can read and process it.");
    } catch {
      setMessage("Enter a valid job URL.");
    }
  }

  function updateJob(id: string, patch: Partial<Job>) {
    setJobs((current) => current.map((job) => job.id === id ? { ...job, ...patch } : job));
  }

  async function applyToJob(job: Job) {
    if (!job.url) return;
    const storedCv = cvFile || await loadCvFile();
    if (!storedCv) {
      setMessage("Upload and analyse the CV before applying.");
      return;
    }

    updateJob(job.id, { status: "applying", note: "Cloud agent working" });
    setMessage(`Cloud agent is processing ${job.title}…`);
    try {
      const form = new FormData();
      form.append("job", JSON.stringify(job));
      form.append("profile", JSON.stringify(profile));
      form.append("cv", storedCv);
      const response = await fetch("/api/naomi/agent", { method: "POST", body: form });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || `Application failed (${response.status})`);

      const status: JobStatus = payload.status === "applied" ? "applied" : payload.status === "prepared" ? "prepared" : "blocked";
      updateJob(job.id, { status, note: payload.message || status });
      setMessage(payload.message || (status === "applied" ? "Application submitted." : "Application needs attention."));
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Application failed.";
      updateJob(job.id, { status: "blocked", note: msg });
      setMessage(msg);
    }
  }

  async function resetLocalData() {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(JOBS_KEY);
    await deleteCvFile().catch(() => undefined);
    setProfile(defaultProfile);
    setJobs([]);
    setCvFile(null);
    setMessage("Local profile, CV and application history cleared.");
  }

  return (
    <main className="min-h-screen bg-[#07100d] text-[#f3f7f5]">
      <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <header className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-emerald-200/60">
              <span className="h-2 w-2 rounded-full bg-emerald-300" /> Private workspace
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Naomi · Job Hunt</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">CV → profile → UK job search → application preparation → form filling → submission tracking.</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusPill state={agentState} />
            <button type="button" onClick={() => void checkAgent()} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/70 hover:bg-white/[0.08]">Recheck</button>
          </div>
        </header>

        <div className="mb-6 rounded-2xl border border-emerald-200/10 bg-emerald-300/[0.05] px-4 py-3 text-sm text-emerald-50/80">{message}</div>

        <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[["Jobs found", stats.found], ["Ready", stats.ready], ["Applied", stats.applied], ["Needs attention", stats.blocked]].map(([label, value]) => (
            <div key={String(label)} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-white/35">{label}</p><p className="mt-2 text-3xl font-semibold">{value}</p>
            </div>
          ))}
        </section>

        <div className="grid gap-6 xl:grid-cols-[410px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
              <h2 className="font-semibold">1 · CV</h2>
              <p className="mt-1 text-xs leading-5 text-white/45">PDF or DOCX. The file is analysed by the server, then retained in this browser for future applications.</p>
              <label className="mt-4 block rounded-2xl border border-dashed border-white/15 bg-black/20 p-4">
                <input type="file" accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="block w-full text-xs text-white/60 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-300 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#07100d]" onChange={(event) => {
                  const file = event.target.files?.[0] || null;
                  setCvFile(file);
                  if (file) void analyseCv(file);
                }} />
                <p className="mt-3 text-xs text-white/45">{cvFile ? `Loaded: ${cvFile.name}` : "No CV loaded yet"}</p>
              </label>
              {cvFile && <button type="button" disabled={busy} onClick={() => void analyseCv()} className="mt-3 w-full rounded-xl bg-emerald-300 px-4 py-2.5 text-sm font-semibold text-[#07100d] disabled:opacity-50">Re-analyse CV</button>}

              {(profile.cvDetails.skills.length > 0 || profile.cvDetails.experience.length > 0) && (
                <div className="mt-4 rounded-2xl border border-white/8 bg-black/20 p-3 text-xs text-white/55">
                  <p>{profile.cvDetails.experience.length} experience entries · {profile.cvDetails.education.length} education entries</p>
                  {profile.cvDetails.skills.length > 0 && <p className="mt-2 leading-5">Skills: {profile.cvDetails.skills.slice(0, 12).join(", ")}</p>}
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
              <h2 className="font-semibold">2 · Search profile</h2>
              <form onSubmit={searchJobs} className="mt-4 space-y-3">
                {[
                  ["Name", "name", profile.name],
                  ["Email", "email", profile.email],
                  ["Phone", "phone", profile.phone],
                  ["Target roles", "targetRoles", profile.targetRoles],
                  ["Location", "location", profile.location],
                  ["Minimum salary", "minSalary", profile.minSalary],
                  ["Right to work", "rightToWork", profile.rightToWork],
                  ["Sponsorship", "sponsorship", profile.sponsorship],
                  ["Driving licence", "drivingLicence", profile.drivingLicence],
                ].map(([label, key, value]) => (
                  <label key={key} className="block"><span className="mb-1 block text-xs text-white/50">{label}</span><input value={String(value)} onChange={(e) => updateProfile(key as keyof Profile, e.target.value as never)} className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm" /></label>
                ))}

                <div className="grid grid-cols-2 gap-3">
                  <label><span className="mb-1 block text-xs text-white/50">Radius (miles)</span><input type="number" min={1} max={100} value={profile.radius} onChange={(e) => updateProfile("radius", Number(e.target.value))} className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm" /></label>
                  <label><span className="mb-1 block text-xs text-white/50">Daily limit</span><input type="number" min={1} max={50} value={profile.maxApplications} onChange={(e) => updateProfile("maxApplications", Number(e.target.value))} className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm" /></label>
                </div>

                <label className="flex items-center gap-2 text-xs text-white/60"><input type="checkbox" checked={profile.remote} onChange={(e) => updateProfile("remote", e.target.checked)} /> Include remote/hybrid</label>
                <label className="block"><span className="mb-1 block text-xs text-white/50">Submission mode</span><select value={profile.mode} onChange={(e) => updateProfile("mode", e.target.value as Profile["mode"])} className="w-full rounded-xl border border-white/10 bg-[#0b1512] px-3 py-2.5 text-sm"><option value="review">Review before final submission</option><option value="auto">Submit automatically when all answers are factual and complete</option></select></label>
                <label className="block"><span className="mb-1 block text-xs text-white/50">Additional factual notes</span><textarea rows={3} value={profile.notes} onChange={(e) => updateProfile("notes", e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm" /></label>
                <button type="submit" disabled={busy || agentState !== "online"} className="w-full rounded-xl bg-emerald-300 px-4 py-3 text-sm font-semibold text-[#07100d] disabled:opacity-40">Search UK jobs with cloud agent</button>
              </form>
            </section>
          </aside>

          <section className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div><h2 className="font-semibold">Direct UK sources</h2><p className="mt-1 text-xs text-white/40">Useful even when a board blocks automation.</p></div>
                <div className="flex flex-wrap gap-2">{searchLinks.map((source) => <a key={source.name} href={source.url} target="_blank" rel="noreferrer" className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/65 hover:bg-white/[0.08]">{source.name}</a>)}</div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-semibold">Application queue</h2><p className="mt-1 text-xs text-white/40">The cloud browser fills forms using the CV and saved facts. Unknown mandatory answers are blocked rather than invented.</p></div><button type="button" onClick={() => void resetLocalData()} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-white/45 hover:text-white/70">Clear local data</button></div>

              <div className="mt-4 flex gap-2"><input value={manualUrl} onChange={(e) => setManualUrl(e.target.value)} placeholder="Paste any job advert URL" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm" /><button type="button" onClick={addManualJob} className="rounded-xl border border-white/10 bg-white/[0.06] px-4 text-sm">Add</button></div>

              <div className="mt-5 space-y-3">
                {jobs.length === 0 && <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-white/35">No jobs collected yet.</div>}
                {jobs.map((job) => (
                  <article key={job.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2"><h3 className="font-medium">{job.title}</h3>{typeof job.score === "number" && <span className="rounded-full bg-emerald-300/10 px-2 py-0.5 text-[11px] text-emerald-100">{job.score}% match</span>}<span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-white/45">{job.status}</span></div>
                        <p className="mt-1 text-sm text-white/50">{job.company} · {job.location}{job.salary ? ` · ${job.salary}` : ""}</p>
                        {job.note && <p className="mt-2 text-xs text-white/40">{job.note}</p>}
                      </div>
                      <div className="flex shrink-0 gap-2">
                        {job.url && <a href={job.url} target="_blank" rel="noreferrer" className="rounded-lg border border-white/10 px-3 py-2 text-xs text-white/60">Open</a>}
                        <button type="button" onClick={() => updateJob(job.id, { status: "skipped", note: "Skipped" })} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-white/50">Skip</button>
                        <button type="button" disabled={!job.url || busy || job.status === "applied"} onClick={() => void applyToJob(job)} className="rounded-lg bg-emerald-300 px-3 py-2 text-xs font-semibold text-[#07100d] disabled:opacity-40">{profile.mode === "review" ? "Prepare / apply" : "Fill & submit"}</button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
