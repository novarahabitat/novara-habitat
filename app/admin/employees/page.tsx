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
  created_at: string;
};

type Skill = {
  id: string;
  name: string;
  category: string | null;
};

type JobPosition = {
  id: string;
  name: string;
  category: string | null;
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [positions, setPositions] = useState<JobPosition[]>([]);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [successPin, setSuccessPin] = useState("");

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    role: "employee",
    job_position_id: "",
    phone: "",
    email: "",
    status: "active",
    hire_date: "",
    certified_skill_id: "",
    knowledge_skill_id: "",
    knowledge_level: "practical",
  });

  async function loadData() {
    setLoading(true);
    setError("");

    const employeesRequest = supabase
      .from("employees")
      .select("*")
      .order("created_at", { ascending: false });

    const skillsRequest = supabase
      .from("skills")
      .select("id,name,category")
      .order("category", { ascending: true })
      .order("name", { ascending: true });

    const positionsRequest = supabase
      .from("job_positions")
      .select("id,name,category")
      .eq("is_active", true)
      .order("category", { ascending: true })
      .order("name", { ascending: true });

    const [employeesResult, skillsResult, positionsResult] = await Promise.all([
      employeesRequest,
      skillsRequest,
      positionsRequest,
    ]);

    if (employeesResult.error) setError(employeesResult.error.message);
    else setEmployees(employeesResult.data || []);

    if (skillsResult.error) setError(skillsResult.error.message);
    else setSkills(skillsResult.data || []);

    if (positionsResult.error) setError(positionsResult.error.message);
    else setPositions(positionsResult.data || []);

    setLoading(false);
  }

  useEffect(() => {
    loadData();
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

    if (!form.job_position_id) {
      setError("Merci de choisir un poste.");
      setCreating(false);
      return;
    }

    if (!form.certified_skill_id) {
      setError("Merci de choisir une discipline qualifiée.");
      setCreating(false);
      return;
    }

    if (!form.knowledge_skill_id) {
      setError("Merci de choisir une discipline en connaissance.");
      setCreating(false);
      return;
    }

    if (form.certified_skill_id === form.knowledge_skill_id) {
      setError("La discipline qualifiée et la discipline en connaissance doivent être différentes.");
      setCreating(false);
      return;
    }

    const selectedPosition = positions.find((p) => p.id === form.job_position_id);

    const { data, error } = await supabase
      .from("employees")
      .insert({
        first_name: form.first_name,
        last_name: form.last_name,
        role: form.role,
        job_position_id: form.job_position_id,
        job_title: selectedPosition?.name || null,
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

    const employeeId = data.id;

    const skillInsert = await supabase.from("employee_skills").insert([
      {
        employee_id: employeeId,
        skill_id: form.certified_skill_id,
        skill_level: "certified",
        verified: false,
        notes: "Ajout initial création employé",
      },
      {
        employee_id: employeeId,
        skill_id: form.knowledge_skill_id,
        skill_level: form.knowledge_level,
        verified: false,
        notes: "Ajout initial création employé",
      },
    ]);

    if (skillInsert.error) {
      setError(`Employé créé, mais erreur compétences : ${skillInsert.error.message}`);
      setCreating(false);
      return;
    }

    setSuccessPin(data.employee_pin);

    setForm({
      first_name: "",
      last_name: "",
      role: "employee",
      job_position_id: "",
      phone: "",
      email: "",
      status: "active",
      hire_date: "",
      certified_skill_id: "",
      knowledge_skill_id: "",
      knowledge_level: "practical",
    });

    await loadData();
    setCreating(false);
  }

  function copyPin(pin: string) {
    navigator.clipboard.writeText(pin);
  }

  return (
    <main className="min-h-screen bg-[#f7f3ee] p-4 text-[#171717] md:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl bg-black p-5 text-white shadow-xl md:p-8">
          <img
            src="/logos/novara-dynamics-logo.png"
            alt="NOVARA Dynamics"
            className="mb-4 h-10 w-auto md:h-16"
          />

          <p className="text-xs uppercase tracking-[0.22em] text-[#d6b46d] md:text-sm md:tracking-[0.3em]">
            NOVARA Dynamics · Gestion RH
          </p>

          <h1 className="mt-3 text-3xl font-semibold md:text-4xl">
            Employés & Employee Master ID
          </h1>

          <p className="mt-3 max-w-3xl text-white/70">
            Création des employés officiels NOVARA. Le PIN est généré automatiquement.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-300 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {successPin && (
          <div className="mb-6 rounded-2xl border border-green-300 bg-green-50 p-4 text-green-800">
            Employé créé avec succès. PIN NOVARA :
            <strong className="ml-2 text-xl">{successPin}</strong>
            <button
              onClick={() => copyPin(successPin)}
              className="ml-4 rounded-xl bg-green-700 px-4 py-2 text-sm text-white"
            >
              Copier PIN
            </button>
          </div>
        )}

        <section className="grid gap-6 lg:grid-cols-[430px_1fr]">
          <form onSubmit={createEmployee} className="rounded-3xl bg-white p-5 shadow-lg md:p-6">
            <h2 className="mb-5 text-2xl font-semibold">Nouvel employé</h2>

            <div className="space-y-4">
              <input
                className="w-full rounded-xl border p-3"
                placeholder="Prénom"
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              />

              <input
                className="w-full rounded-xl border p-3"
                placeholder="Nom"
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              />

              <select
                className="w-full rounded-xl border p-3"
                value={form.job_position_id}
                onChange={(e) => setForm({ ...form, job_position_id: e.target.value })}
              >
                <option value="">Choisir poste</option>
                {positions.map((position) => (
                  <option key={position.id} value={position.id}>
                    {position.name} {position.category ? `· ${position.category}` : ""}
                  </option>
                ))}
              </select>

              <select
                className="w-full rounded-xl border p-3"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="employee">Employé</option>
                <option value="manager">Manager</option>
                <option value="hr">RH</option>
                <option value="sales">Commercial</option>
                <option value="admin">Admin</option>
              </select>

              <select
                className="w-full rounded-xl border p-3"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="terminated">Terminé</option>
                <option value="retired">Retraité</option>
              </select>

              <input
                className="w-full rounded-xl border p-3"
                placeholder="Téléphone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />

              <input
                className="w-full rounded-xl border p-3"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <input
                className="w-full rounded-xl border p-3"
                type="date"
                value={form.hire_date}
                onChange={(e) => setForm({ ...form, hire_date: e.target.value })}
              />

              <div className="rounded-2xl bg-[#f4efe7] p-4 text-sm text-neutral-700">
                <p className="font-semibold">Compétences obligatoires à la création</p>
                <p className="mt-1">
                  Minimum 1 discipline qualifiée + 1 discipline en connaissance différente.
                </p>
              </div>

              <select
                className="w-full rounded-xl border p-3"
                value={form.certified_skill_id}
                onChange={(e) => setForm({ ...form, certified_skill_id: e.target.value })}
              >
                <option value="">Choisir discipline qualifiée</option>
                {skills.map((skill) => (
                  <option key={skill.id} value={skill.id}>
                    {skill.name} {skill.category ? `· ${skill.category}` : ""}
                  </option>
                ))}
              </select>

              <select
                className="w-full rounded-xl border p-3"
                value={form.knowledge_skill_id}
                onChange={(e) => setForm({ ...form, knowledge_skill_id: e.target.value })}
              >
                <option value="">Choisir discipline en connaissance</option>
                {skills.map((skill) => (
                  <option key={skill.id} value={skill.id}>
                    {skill.name} {skill.category ? `· ${skill.category}` : ""}
                  </option>
                ))}
              </select>

              <select
                className="w-full rounded-xl border p-3"
                value={form.knowledge_level}
                onChange={(e) => setForm({ ...form, knowledge_level: e.target.value })}
              >
                <option value="practical">Connaissance pratique</option>
                <option value="assistant">Assistant supervisé</option>
              </select>

              <div className="rounded-2xl bg-[#f4efe7] p-4 text-sm text-neutral-600">
                Le PIN NOVARA est généré automatiquement par Supabase.
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full rounded-2xl bg-black px-5 py-4 font-semibold text-white disabled:opacity-50"
              >
                {creating ? "Création..." : "Créer l'employé"}
              </button>
            </div>
          </form>

          <div className="rounded-3xl bg-white p-5 shadow-lg md:p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Employés</h2>
              <button onClick={loadData} className="rounded-xl border px-4 py-2 text-sm">
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
                        <td className="py-4 font-mono font-bold">
                          {employee.employee_pin}
                        </td>
                        <td>
                          <Link
                            href={`/admin/employees/${employee.id}`}
                            className="font-semibold underline"
                          >
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
