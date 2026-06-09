"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Employee = {
  id: string;
  employee_pin: string;
  first_name: string;
  last_name: string;
  role: string;
  job_title: string | null;
  phone: string | null;
  email: string | null;
  status: string;
  hire_date: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  terminated_at: string | null;
  termination_reason: string | null;
};

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const employeeId = params.id as string;

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    role: "employee",
    job_title: "",
    phone: "",
    email: "",
    status: "active",
    hire_date: "",
    termination_reason: "",
  });

  async function loadEmployee() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .eq("id", employeeId)
      .single();

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setEmployee(data);
    setForm({
      first_name: data.first_name || "",
      last_name: data.last_name || "",
      role: data.role || "employee",
      job_title: data.job_title || "",
      phone: data.phone || "",
      email: data.email || "",
      status: data.status || "active",
      hire_date: data.hire_date || "",
      termination_reason: data.termination_reason || "",
    });

    setLoading(false);
  }

  useEffect(() => {
    if (employeeId) loadEmployee();
  }, [employeeId]);

  async function saveEmployee(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      first_name: form.first_name,
      last_name: form.last_name,
      role: form.role,
      job_title: form.job_title || null,
      phone: form.phone || null,
      email: form.email || null,
      status: form.status,
      hire_date: form.hire_date || null,
      terminated_at:
        form.status === "terminated" || form.status === "retired"
          ? new Date().toISOString().slice(0, 10)
          : null,
      termination_reason: form.termination_reason || null,
    };

    const { error } = await supabase
      .from("employees")
      .update(payload)
      .eq("id", employeeId);

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    setSuccess("Fiche employé mise à jour.");
    await loadEmployee();
    setSaving(false);
  }

  if (loading) {
    return <main className="min-h-screen bg-[#f7f3ee] p-6">Chargement...</main>;
  }

  if (!employee) {
    return (
      <main className="min-h-screen bg-[#f7f3ee] p-6">
        Employé introuvable.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f3ee] p-6 text-[#171717]">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => router.push("/admin/employees")}
          className="mb-6 rounded-xl border bg-white px-4 py-2 text-sm"
        >
          ← Retour employés
        </button>

        <section className="mb-6 rounded-3xl bg-black p-8 text-white shadow-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-[#d6b46d]">
            Fiche employé NOVARA
          </p>

          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#d6b46d] text-3xl font-bold text-black">
              {employee.first_name?.[0]}
              {employee.last_name?.[0]}
            </div>

            <div>
              <h1 className="text-4xl font-semibold">
                {employee.first_name} {employee.last_name}
              </h1>
              <p className="mt-2 text-white/70">{employee.job_title || "Poste non renseigné"}</p>
              <p className="mt-3 font-mono text-2xl text-[#d6b46d]">
                PIN NOVARA : {employee.employee_pin}
              </p>
            </div>
          </div>
        </section>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-300 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-2xl border border-green-300 bg-green-50 p-4 text-green-800">
            {success}
          </div>
        )}

        <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <form onSubmit={saveEmployee} className="rounded-3xl bg-white p-6 shadow-lg">
            <h2 className="mb-5 text-2xl font-semibold">Informations employé</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                className="rounded-xl border p-3"
                placeholder="Prénom"
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              />

              <input
                className="rounded-xl border p-3"
                placeholder="Nom"
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              />

              <input
                className="rounded-xl border p-3"
                placeholder="Poste"
                value={form.job_title}
                onChange={(e) => setForm({ ...form, job_title: e.target.value })}
              />

              <select
                className="rounded-xl border p-3"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="employee">Employé</option>
                <option value="manager">Manager</option>
                <option value="hr">RH</option>
                <option value="sales">Commercial</option>
                <option value="admin">Admin</option>
              </select>

              <input
                className="rounded-xl border p-3"
                placeholder="Téléphone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />

              <input
                className="rounded-xl border p-3"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <input
                className="rounded-xl border p-3"
                type="date"
                value={form.hire_date}
                onChange={(e) => setForm({ ...form, hire_date: e.target.value })}
              />

              <select
                className="rounded-xl border p-3"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="terminated">Terminé</option>
                <option value="retired">Retraité</option>
              </select>
            </div>

            {(form.status === "terminated" || form.status === "retired") && (
              <textarea
                className="mt-4 w-full rounded-xl border p-3"
                placeholder="Raison de départ / note RH"
                value={form.termination_reason}
                onChange={(e) =>
                  setForm({ ...form, termination_reason: e.target.value })
                }
              />
            )}

            <div className="mt-6 rounded-2xl bg-[#f4efe7] p-4 text-sm text-neutral-600">
              Le PIN NOVARA est verrouillé. Il ne doit jamais être modifié.
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-6 rounded-2xl bg-black px-6 py-4 font-semibold text-white disabled:opacity-50"
            >
              {saving ? "Sauvegarde..." : "Sauvegarder"}
            </button>
          </form>

          <aside className="space-y-4">
            <div className="rounded-3xl bg-white p-6 shadow-lg">
              <h3 className="font-semibold">Statut</h3>
              <p className="mt-3 rounded-full bg-[#f4efe7] px-4 py-2 text-sm">
                {employee.status}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-lg">
              <h3 className="font-semibold">Modules à venir</h3>
              <div className="mt-4 space-y-3 text-sm text-neutral-600">
                <p>Documents RH</p>
                <p>Formations</p>
                <p>Absences</p>
                <p>Pointages</p>
                <p>Payroll</p>
                <p>Alertes expiration</p>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
