"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [successPin, setSuccessPin] = useState("");

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    role: "employee",
    job_title: "",
    phone: "",
    email: "",
    status: "active",
    hire_date: "",
  });

  async function loadEmployees() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) setError(error.message);
    else setEmployees(data || []);

    setLoading(false);
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  async function createEmployee(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError("");
    setSuccessPin("");

    if (!form.first_name || !form.last_name) {
      setError("Prénom et nom obligatoires.");
      setCreating(false);
      return;
    }

    const { data, error } = await supabase
      .from("employees")
      .insert({
        first_name: form.first_name,
        last_name: form.last_name,
        role: form.role,
        job_title: form.job_title || null,
        phone: form.phone || null,
        email: form.email || null,
        status: form.status,
        hire_date: form.hire_date || null,
      })
      .select("*")
      .single();

    if (error) {
      setError(error.message);
      setCreating(false);
      return;
    }

    setSuccessPin(data.employee_pin);

    setForm({
      first_name: "",
      last_name: "",
      role: "employee",
      job_title: "",
      phone: "",
      email: "",
      status: "active",
      hire_date: "",
    });

    await loadEmployees();
    setCreating(false);
  }

  function copyPin(pin: string) {
    navigator.clipboard.writeText(pin);
  }

  return (
    <main className="min-h-screen bg-[#f7f3ee] p-6 text-[#171717]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl bg-black p-8 text-white shadow-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-[#d6b46d]">
            NOVARA RH
          </p>
          <h1 className="mt-3 text-4xl font-semibold">
            Employés & Employee Master ID
          </h1>
          <p className="mt-3 max-w-3xl text-white/70">
            Création des employés officiels NOVARA. Le PIN 6 chiffres est généré automatiquement.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-300 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {successPin && (
          <div className="mb-6 rounded-2xl border border-green-300 bg-green-50 p-4 text-green-800">
            Employé créé avec succès. PIN NOVARA généré :
            <strong className="ml-2 text-xl">{successPin}</strong>
            <button
              onClick={() => copyPin(successPin)}
              className="ml-4 rounded-xl bg-green-700 px-4 py-2 text-sm text-white"
            >
              Copier PIN
            </button>
          </div>
        )}

        <section className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <form onSubmit={createEmployee} className="rounded-3xl bg-white p-6 shadow-lg">
            <h2 className="mb-5 text-2xl font-semibold">Nouvel employé</h2>

            <div className="space-y-4">
              <input className="w-full rounded-xl border p-3" placeholder="Prénom" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
              <input className="w-full rounded-xl border p-3" placeholder="Nom" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
              <input className="w-full rounded-xl border p-3" placeholder="Poste — ex: Électricien" value={form.job_title} onChange={(e) => setForm({ ...form, job_title: e.target.value })} />

              <select className="w-full rounded-xl border p-3" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="employee">Employé</option>
                <option value="manager">Manager</option>
                <option value="hr">RH</option>
                <option value="sales">Commercial</option>
                <option value="admin">Admin</option>
              </select>

              <select className="w-full rounded-xl border p-3" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="terminated">Terminé</option>
                <option value="retired">Retraité</option>
              </select>

              <input className="w-full rounded-xl border p-3" placeholder="Téléphone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <input className="w-full rounded-xl border p-3" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <input className="w-full rounded-xl border p-3" type="date" value={form.hire_date} onChange={(e) => setForm({ ...form, hire_date: e.target.value })} />

              <div className="rounded-2xl bg-[#f4efe7] p-4 text-sm text-neutral-600">
                Le PIN NOVARA est généré automatiquement par Supabase.
              </div>

              <button type="submit" disabled={creating} className="w-full rounded-2xl bg-black px-5 py-4 font-semibold text-white disabled:opacity-50">
                {creating ? "Création..." : "Créer l'employé"}
              </button>
            </div>
          </form>

          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Employés</h2>
              <button onClick={loadEmployees} className="rounded-xl border px-4 py-2 text-sm">
                Actualiser
              </button>
            </div>

            {loading ? (
              <p>Chargement...</p>
            ) : employees.length === 0 ? (
              <p className="text-neutral-500">Aucun employé pour le moment.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b text-neutral-500">
                      <th className="py-3">PIN</th>
                      <th>Nom</th>
                      <th>Poste</th>
                      <th>Rôle</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((employee) => (
                      <tr key={employee.id} className="border-b">
                        <td className="py-4 font-mono font-bold">{employee.employee_pin}</td>
                        <td>
                          <Link href={`/admin/employees/${employee.id}`} className="font-semibold underline">
                            {employee.first_name} {employee.last_name}
                          </Link>
                        </td>
                        <td>{employee.job_title || "—"}</td>
                        <td>{employee.role}</td>
                        <td>
                          <span className="rounded-full bg-[#f4efe7] px-3 py-1 text-xs">
                            {employee.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
