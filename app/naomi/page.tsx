"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

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
};

type JobStatus = "new" | "applying" | "applied" | "skipped" | "blocked";

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

type AgentState = "checking" | "connected" | "disconnected";

const PROFILE_KEY = "naomi-job-hunt-profile-v1";
const JOBS_KEY = "naomi-job-hunt-jobs-v1";
const AGENT_KEY = "naomi-job-hunt-agent-v1";

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

function makeId(value: unknown, index: number) {
  if (typeof value === "string" && value.trim()) return value;
  return `job-${Date.now()}-${index}`;
}

function normaliseJobs(payload: unknown): Job[] {
  const candidate = Array.isArray(payload)
    ? payload
    : payload && typeof payload === "object" && "jobs" in payload && Array.isArray((payload as { jobs?: unknown }).jobs)
      ? (payload as { jobs: unknown[] }).jobs
      : [];

  return candidate.map((raw, index) => {
    const job = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
    return {
      id: makeId(job.id ?? job.url, index),
      title: String(job.title ?? "Untitled role"),
      company: String(job.company ?? job.employer ?? "Unknown employer"),
      location: String(job.location ?? "Location not specified"),
      salary: job.salary ? String(job.salary) : undefined,
      source: job.source ? String(job.source) : undefined,
      url: job.url ? String(job.url) : undefined,
      score: typeof job.score === "number" ? job.score : undefined,
      status: "new" as const,
    };
  });
}

function StatusPill({ state }: { state: AgentState }) {
  const styles = {
    checking: "border-amber-300/20 bg-amber-300/10 text-amber-100",
    connected: "border-emerald-300/20 bg-emerald-300/10 text-emerald-100",
    disconnected: "border-rose-300/20 bg-rose-300/10 text-rose-100",
  }[state];

  const labels = {
    checking: "Checking agent",
    connected: "Agent connected",
    disconnected: "Agent offline",
  }[state];

  return <span className={`rounded-full border px-3 py-1 text-xs font-medium ${styles}`}>{labels}</span>;
}

export default function NaomiJobHuntPage() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [agentUrl, setAgentUrl] = useState("http://127.0.0.1:9378");
  const [agentState, setAgentState] = useState<AgentState>("checking");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("Profile and application data stay on this device.");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(PROFILE_KEY);
      const savedJobs = localStorage.getItem(JOBS_KEY);
      const savedAgent = localStorage.getItem(AGENT_KEY);
      if (savedProfile) setProfile({ ...defaultProfile, ...JSON.parse(savedProfile) });
      if (savedJobs) setJobs(JSON.parse(savedJobs));
      if (savedAgent) setAgentUrl(savedAgent);
    } catch {
      // Ignore malformed local data and keep safe defaults.
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }, [profile, ready]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
  }, [jobs, ready]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(AGENT_KEY, agentUrl);
  }, [agentUrl, ready]);

  async function checkAgent() {
    setAgentState("checking");
    try {
      const response = await fetch(`${agentUrl.replace(/\/$/, "")}/health`, {
        method: "GET",
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Agent unavailable");
      setAgentState("connected");
      setMessage("Local automation agent connected.");
    } catch {
      setAgentState("disconnected");
      setMessage("Local automation agent is not connected yet. The UK search links below still work.");
    }
  }

  useEffect(() => {
    if (!ready) return;
    void checkAgent();
    // Intentionally only re-check when the saved agent URL changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, agentUrl]);

  const searchLinks = useMemo(() => {
    const q = encodeURIComponent(profile.targetRoles || "jobs");
    const l = encodeURIComponent(profile.location || "England");
    return sourceLinks.map((source) => ({ name: source.name, url: source.build(q, l) }));
  }, [profile.targetRoles, profile.location]);

  const stats = useMemo(() => {
    return {
      found: jobs.length,
      ready: jobs.filter((job) => job.status === "new").length,
      applied: jobs.filter((job) => job.status === "applied").length,
      blocked: jobs.filter((job) => job.status === "blocked").length,
    };
  }, [jobs]);

  function updateProfile<K extends keyof Profile>(key: K, value: Profile[K]) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  async function searchJobs(event?: FormEvent) {
    event?.preventDefault();
    if (!profile.targetRoles.trim()) {
      setMessage("Add at least one target role before searching.");
      return;
    }
    if (agentState !== "connected") {
      setMessage("Connect the local automation agent to search and collect jobs automatically.");
      return;
    }

    setBusy(true);
    setMessage("Searching UK job sources and screening matches…");
    try {
      const response = await fetch(`${agentUrl.replace(/\/$/, "")}/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });
      if (!response.ok) throw new Error(`Search failed (${response.status})`);
      const payload = await response.json();
      const nextJobs = normaliseJobs(payload);
      setJobs(nextJobs);
      setMessage(nextJobs.length ? `${nextJobs.length} matching jobs found.` : "Search completed. No matching jobs returned.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Search failed.");
    } finally {
      setBusy(false);
    }
  }

  async function uploadCv() {
    if (!cvFile) {
      setMessage("Choose a CV file first.");
      return;
    }
    if (agentState !== "connected") {
      setMessage("Connect the local agent before sending the CV. The file is not uploaded to novarahabitat.fr.");
      return;
    }

    setBusy(true);
    try {
      const form = new FormData();
      form.append("cv", cvFile);
      const response = await fetch(`${agentUrl.replace(/\/$/, "")}/profile/cv`, {
        method: "POST",
        body: form,
      });
      if (!response.ok) throw new Error(`CV upload failed (${response.status})`);
      setMessage(`CV sent to the local agent: ${cvFile.name}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "CV upload failed.");
    } finally {
      setBusy(false);
    }
  }

  function updateJob(id: string, patch: Partial<Job>) {
    setJobs((current) => current.map((job) => (job.id === id ? { ...job, ...patch } : job)));
  }

  async function applyToJob(job: Job) {
    if (agentState !== "connected") {
      setMessage("Connect the local automation agent before applying.");
      return;
    }

    updateJob(job.id, { status: "applying", note: "Application in progress" });
    setMessage(`Preparing application for ${job.title}…`);

    try {
      const response = await fetch(`${agentUrl.replace(/\/$/, "")}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job, profile }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof payload?.error === "string" ? payload.error : `Application blocked (${response.status})`);

      const status: JobStatus = payload?.status === "blocked" ? "blocked" : "applied";
      updateJob(job.id, {
        status,
        note: typeof payload?.message === "string" ? payload.message : status === "applied" ? "Submission confirmed" : "Application blocked",
      });
      setMessage(status === "applied" ? `Applied to ${job.title}.` : `Application to ${job.title} needs attention.`);
    } catch (error) {
      updateJob(job.id, {
        status: "blocked",
        note: error instanceof Error ? error.message : "Application failed",
      });
      setMessage(error instanceof Error ? error.message : "Application failed.");
    }
  }

  function resetLocalData() {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(JOBS_KEY);
    setProfile(defaultProfile);
    setJobs([]);
    setCvFile(null);
    setMessage("Local profile and application history cleared.");
  }

  return (
    <main className="min-h-screen bg-[#07100d] text-[#f3f7f5]">
      <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <header className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-emerald-200/60">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              Private workspace
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Naomi · Job Hunt</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
              Find relevant UK jobs, prepare truthful applications, review them if wanted, submit and track the result from one place.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatusPill state={agentState} />
            <button
              type="button"
              onClick={() => void checkAgent()}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/70 transition hover:bg-white/[0.08]"
            >
              Recheck
            </button>
          </div>
        </header>

        <div className="mb-6 rounded-2xl border border-emerald-200/10 bg-emerald-300/[0.05] px-4 py-3 text-sm text-emerald-50/80">
          {message}
        </div>

        <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Jobs found", stats.found],
            ["Ready to review", stats.ready],
            ["Applied", stats.applied],
            ["Needs attention", stats.blocked],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-white/35">{label}</p>
              <p className="mt-2 text-3xl font-semibold">{value}</p>
            </div>
          ))}
        </section>

        <div className="grid gap-6 xl:grid-cols-[390px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/10">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">Search profile</h2>
                  <p className="mt-1 text-xs text-white/40">Saved only in this browser.</p>
                </div>
                <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] text-white/45">UK</span>
              </div>

              <form onSubmit={searchJobs} className="space-y-4">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-white/55">Target roles</span>
                  <input
                    value={profile.targetRoles}
                    onChange={(event) => updateProfile("targetRoles", event.target.value)}
                    placeholder="e.g. retail assistant, receptionist"
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white placeholder:text-white/25"
                  />
                </label>

                <div className="grid grid-cols-[1fr_92px] gap-3">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-white/55">Location</span>
                    <input
                      value={profile.location}
                      onChange={(event) => updateProfile("location", event.target.value)}
                      placeholder="City or postcode"
                      className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white placeholder:text-white/25"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-white/55">Radius</span>
                    <select
                      value={profile.radius}
                      onChange={(event) => updateProfile("radius", Number(event.target.value))}
                      className="w-full rounded-xl border border-white/10 bg-[#0b1512] px-3 py-2.5 text-sm text-white"
                    >
                      {[5, 10, 15, 25, 40, 60].map((radius) => (
                        <option key={radius} value={radius}>{radius} mi</option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-white/55">Minimum salary</span>
                  <input
                    value={profile.minSalary}
                    onChange={(event) => updateProfile("minSalary", event.target.value)}
                    placeholder="Optional, e.g. £24,000"
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white placeholder:text-white/25"
                  />
                </label>

                <label className="flex items-center justify-between rounded-xl border border-white/10 bg-black/15 px-3 py-2.5">
                  <span className="text-sm text-white/65">Include remote jobs</span>
                  <input
                    type="checkbox"
                    checked={profile.remote}
                    onChange={(event) => updateProfile("remote", event.target.checked)}
                    className="h-4 w-4 accent-emerald-300"
                  />
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-white/55">Daily cap</span>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={profile.maxApplications}
                      onChange={(event) => updateProfile("maxApplications", Number(event.target.value))}
                      className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-white/55">Submit mode</span>
                    <select
                      value={profile.mode}
                      onChange={(event) => updateProfile("mode", event.target.value as Profile["mode"])}
                      className="w-full rounded-xl border border-white/10 bg-[#0b1512] px-3 py-2.5 text-sm text-white"
                    >
                      <option value="review">Review first</option>
                      <option value="auto">Automatic</option>
                    </select>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full rounded-xl bg-emerald-300 px-4 py-3 text-sm font-semibold text-[#07100d] transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {busy ? "Working…" : "Search & screen jobs"}
                </button>
              </form>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
              <h2 className="font-semibold">Application facts</h2>
              <p className="mt-1 text-xs leading-5 text-white/40">The agent should answer from these facts only and never invent experience or qualifications.</p>
              <div className="mt-4 space-y-3">
                <input
                  value={profile.email}
                  onChange={(event) => updateProfile("email", event.target.value)}
                  placeholder="Email"
                  type="email"
                  autoComplete="email"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white placeholder:text-white/25"
                />
                <input
                  value={profile.phone}
                  onChange={(event) => updateProfile("phone", event.target.value)}
                  placeholder="Phone"
                  type="tel"
                  autoComplete="tel"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white placeholder:text-white/25"
                />
                <input
                  value={profile.rightToWork}
                  onChange={(event) => updateProfile("rightToWork", event.target.value)}
                  placeholder="Right to work answer"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white placeholder:text-white/25"
                />
                <input
                  value={profile.sponsorship}
                  onChange={(event) => updateProfile("sponsorship", event.target.value)}
                  placeholder="Sponsorship requirement"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white placeholder:text-white/25"
                />
                <input
                  value={profile.drivingLicence}
                  onChange={(event) => updateProfile("drivingLicence", event.target.value)}
                  placeholder="Driving licence / transport"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white placeholder:text-white/25"
                />
                <textarea
                  value={profile.notes}
                  onChange={(event) => updateProfile("notes", event.target.value)}
                  placeholder="Education, availability, skills, preferred hours, exclusions…"
                  rows={5}
                  className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm leading-6 text-white placeholder:text-white/25"
                />
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
              <h2 className="font-semibold">CV</h2>
              <p className="mt-1 text-xs leading-5 text-white/40">The CV is sent directly from this browser to the local agent, not stored on this website.</p>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt,.md"
                onChange={(event) => setCvFile(event.target.files?.[0] ?? null)}
                className="mt-4 block w-full text-xs text-white/55 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-xs file:text-white"
              />
              <button
                type="button"
                onClick={() => void uploadCv()}
                disabled={busy || !cvFile}
                className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2.5 text-sm text-white/70 hover:bg-white/[0.08] disabled:opacity-35"
              >
                Send CV to local agent
              </button>
            </section>
          </aside>

          <div className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 sm:p-6">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Application queue</h2>
                  <p className="mt-1 text-sm text-white/40">Only jobs returned by the local search agent appear here.</p>
                </div>
                {jobs.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setJobs((current) => current.filter((job) => job.status !== "skipped"))}
                    className="rounded-xl border border-white/10 px-3 py-2 text-xs text-white/55 hover:bg-white/[0.05]"
                  >
                    Clear skipped
                  </button>
                )}
              </div>

              {jobs.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 px-5 py-14 text-center">
                  <p className="text-base font-medium text-white/70">No jobs in the queue yet.</p>
                  <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-white/35">
                    When the local automation engine is connected, “Search & screen jobs” can collect matching vacancies and place them here for review or automatic application.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {jobs.map((job) => (
                    <article key={job.id} className="rounded-2xl border border-white/10 bg-black/15 p-4 sm:p-5">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold">{job.title}</h3>
                            {typeof job.score === "number" && (
                              <span className="rounded-full bg-emerald-300/10 px-2 py-1 text-[11px] font-medium text-emerald-100">{job.score}% match</span>
                            )}
                            <span className="rounded-full bg-white/[0.06] px-2 py-1 text-[11px] text-white/45">{job.status}</span>
                          </div>
                          <p className="mt-1 text-sm text-white/55">{job.company} · {job.location}</p>
                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/35">
                            {job.salary && <span>{job.salary}</span>}
                            {job.source && <span>{job.source}</span>}
                            {job.note && <span>{job.note}</span>}
                          </div>
                        </div>
                        <div className="flex shrink-0 flex-wrap gap-2">
                          {job.url && (
                            <a
                              href={job.url}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/65 hover:bg-white/[0.08]"
                            >
                              View job
                            </a>
                          )}
                          {job.status === "new" && (
                            <>
                              <button
                                type="button"
                                onClick={() => updateJob(job.id, { status: "skipped", note: "Skipped by Naomi" })}
                                className="rounded-xl border border-white/10 px-3 py-2 text-xs text-white/55 hover:bg-white/[0.05]"
                              >
                                Skip
                              </button>
                              <button
                                type="button"
                                onClick={() => void applyToJob(job)}
                                className="rounded-xl bg-emerald-300 px-3 py-2 text-xs font-semibold text-[#07100d] hover:bg-emerald-200"
                              >
                                Fill & apply
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 sm:p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold">UK search pack</h2>
                <p className="mt-1 text-sm text-white/40">Immediate fallback links using the role and location above, even while the automation agent is offline.</p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {searchLinks.map((source) => (
                  <a
                    key={source.name}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-white/10 bg-black/15 px-3 py-3 text-sm text-white/65 transition hover:border-emerald-200/20 hover:bg-emerald-300/[0.06] hover:text-white"
                  >
                    {source.name}
                  </a>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 sm:p-6">
              <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <h2 className="text-lg font-semibold">Local automation engine</h2>
                  <p className="mt-1 max-w-3xl text-sm leading-6 text-white/40">
                    Browser automation must run on Naomi’s computer so her job-board sessions, credentials, CV and application answers are not exposed through the public website. This page is the control panel; the local helper performs the actual browser work.
                  </p>
                  <label className="mt-4 block max-w-xl">
                    <span className="mb-1.5 block text-xs font-medium text-white/55">Local agent address</span>
                    <input
                      value={agentUrl}
                      onChange={(event) => setAgentUrl(event.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 font-mono text-xs text-white"
                    />
                  </label>
                </div>
                <button
                  type="button"
                  onClick={resetLocalData}
                  className="rounded-xl border border-rose-300/15 bg-rose-300/[0.05] px-4 py-2.5 text-xs text-rose-100/70 hover:bg-rose-300/[0.08]"
                >
                  Clear local data
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
