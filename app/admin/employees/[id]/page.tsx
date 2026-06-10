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
  created_at: string;
  updated_at: string;
  terminated_at: string | null;
  termination_reason: string | null;
};

type EmployeeDocument = {
  id: string;
  employee_id: string;
  document_type: string;
  document_name: string;
  file_url: string;
  document_status: string;
  expires_at: string | null;
  created_at: string;
};

type Skill = {
  id: string;
  code: string;
  name: string;
  category: string | null;
};

type EmployeeSkill = {
  id: string;
  employee_id: string;
  skill_id: string;
  skill_level: string;
  verified: boolean;
  notes: string | null;
  skills: Skill | null;
};

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const employeeId = params.id as string;

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [documents, setDocuments] = useState<EmployeeDocument[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [employeeSkills, setEmployeeSkills] = useState<EmployeeSkill[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [addingSkill, setAddingSkill] = useState(false);

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

  const [docForm, setDocForm] = useState({
    document_type: "identity_card",
    document_name: "",
    expires_at: "",
    file: null as File | null,
  });

  const [skillForm, setSkillForm] = useState({
    skill_id: "",
    skill_level: "certified",
    notes: "",
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

  async function loadDocuments() {
    const { data, error } = await supabase
      .from("employee_documents")
      .select("*")
      .eq("employee_id", employeeId)
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
      return;
    }

    setDocuments(data || []);
  }

  async function loadSkills() {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("category", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      setError(error.message);
      return;
    }

    setSkills(data || []);

    if (data && data.length > 0 && !skillForm.skill_id) {
      setSkillForm((prev) => ({ ...prev, skill_id: data[0].id }));
    }
  }

  async function loadEmployeeSkills() {
    const { data, error } = await supabase
      .from("employee_skills")
      .select("*, skills(*)")
      .eq("employee_id", employeeId)
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
      return;
    }

    setEmployeeSkills(data || []);
  }

  useEffect(() => {
    if (employeeId) {
      loadEmployee();
      loadDocuments();
      loadSkills();
      loadEmployeeSkills();
    }
  }, [employeeId]);

  async function saveEmployee(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const { error } = await supabase
      .from("employees")
      .update({
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
      })
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

  async function uploadDocument(e: React.FormEvent) {
    e.preventDefault();
    setUploading(true);
    setError("");
    setSuccess("");

    if (!docForm.file) {
      setError("Merci d'ajouter un fichier.");
      setUploading(false);
      return;
    }

    const safeName = docForm.file.name.replaceAll(" ", "-").toLowerCase();
    const filePath = `${employeeId}/${Date.now()}-${safeName}`;

    const upload = await supabase.storage
      .from("employee-documents")
      .upload(filePath, docForm.file, { upsert: false });

    if (upload.error) {
      setError(upload.error.message);
      setUploading(false);
      return;
    }

    const insert = await supabase.from("employee_documents").insert({
      employee_id: employeeId,
      document_type: docForm.document_type,
      document_name: docForm.document_name || docForm.file.name,
      file_url: filePath,
      expires_at: docForm.expires_at || null,
      document_status: "pending_review",
      is_sensitive: true,
    });

    if (insert.error) {
      setError(insert.error.message);
      setUploading(false);
      return;
    }

    setDocForm({
      document_type: "identity_card",
      document_name: "",
      expires_at: "",
      file: null,
    });

    setSuccess("Document ajouté. Statut : en attente de validation RH.");
    await loadDocuments();
    setUploading(false);
  }

  async function openDocument(path: string) {
    const { data, error } = await supabase.storage
      .from("employee-documents")
      .createSignedUrl(path, 60);

    if (error) {
      setError(error.message);
      return;
    }

    window.open(data.signedUrl, "_blank");
  }

  async function addEmployeeSkill(e: React.FormEvent) {
    e.preventDefault();
    setAddingSkill(true);
    setError("");
    setSuccess("");

    if (!skillForm.skill_id) {
      setError("Merci de choisir une compétence.");
      setAddingSkill(false);
      return;
    }

    const { error } = await supabase.from("employee_skills").insert({
      employee_id: employeeId,
      skill_id: skillForm.skill_id,
      skill_level: skillForm.skill_level,
      notes: skillForm.notes || null,
      verified: false,
    });

    if (error) {
      setError(error.message);
      setAddingSkill(false);
      return;
    }

    setSuccess("Compétence ajoutée à la fiche employé.");
    setSkillForm({
      skill_id: skills[0]?.id || "",
      skill_level: "certified",
      notes: "",
    });

    await loadEmployeeSkills();
    setAddingSkill(false);
  }

  async function removeEmployeeSkill(skillRecordId: string) {
    setError("");
    setSuccess("");

    const { error } = await supabase
      .from("employee_skills")
      .delete()
      .eq("id", skillRecordId);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess("Compétence retirée.");
    await loadEmployeeSkills();
  }

  const certifiedSkills = employeeSkills.filter(
    (item) => item.skill_level === "certified"
  );

  const knowledgeSkills = employeeSkills.filter(
    (item) => item.skill_level === "practical" || item.skill_level === "assistant"
  );

  const hasCertified = certifiedSkills.length > 0;
  const hasKnowledge = knowledgeSkills.some(
    (knowledge) =>
      !certifiedSkills.some(
        (certified) => certified.skill_id === knowledge.skill_id
      )
  );

  if (loading) {
    return <main className="min-h-screen bg-[#f7f3ee] p-6">Chargement...</main>;
  }

  if (!employee) {
    return <main className="min-h-screen bg-[#f7f3ee] p-6">Employé introuvable.</main>;
  }

  return (
    <main className="min-h-screen bg-[#f7f3ee] p-4 text-[#171717] md:p-6">
      <div className="mx-auto max-w-7xl">
        <button
          onClick={() => router.push("/admin/employees")}
          className="mb-4 rounded-xl border bg-white px-4 py-2 text-sm"
        >
          ← Retour employés
        </button>

        <section className="mb-6 rounded-3xl bg-black p-5 text-white shadow-xl md:p-8">
          <img
            src="/logos/novara-dynamics-logo.png"
            alt="NOVARA Dynamics"
            className="mb-4 h-10 w-auto md:h-16"
          />

          <p className="text-xs uppercase tracking-[0.22em] text-[#d6b46d] md:text-sm md:tracking-[0.3em]">
            NOVARA Dynamics · Gestion RH
          </p>

          <div className="mt-5 flex items-center gap-4 md:mt-6 md:gap-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#d6b46d] text-xl font-bold text-black md:h-24 md:w-24 md:text-3xl">
              {employee.first_name?.[0]}
              {employee.last_name?.[0]}
            </div>

            <div>
              <h1 className="text-2xl font-semibold md:text-4xl">
                {employee.first_name} {employee.last_name}
              </h1>
              <p className="mt-1 text-sm text-white/70 md:text-base">
                {employee.job_title || "Poste non renseigné"}
              </p>
              <p className="mt-2 font-mono text-lg text-[#d6b46d] md:text-2xl">
                PIN : {employee.employee_pin}
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

        <section className="grid gap-6 lg:grid-cols-[1fr_420px]">
          <div className="space-y-6">
            <form onSubmit={saveEmployee} className="rounded-3xl bg-white p-5 shadow-lg md:p-6">
              <h2 className="mb-5 text-2xl font-semibold">Informations employé</h2>

              <div className="grid gap-4 md:grid-cols-2">
                <input className="rounded-xl border p-3" placeholder="Prénom" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
                <input className="rounded-xl border p-3" placeholder="Nom" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
                <input className="rounded-xl border p-3" placeholder="Poste" value={form.job_title} onChange={(e) => setForm({ ...form, job_title: e.target.value })} />

                <select className="rounded-xl border p-3" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="employee">Employé</option>
                  <option value="manager">Manager</option>
                  <option value="hr">RH</option>
                  <option value="sales">Commercial</option>
                  <option value="admin">Admin</option>
                </select>

                <input className="rounded-xl border p-3" placeholder="Téléphone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <input className="rounded-xl border p-3" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <input className="rounded-xl border p-3" type="date" value={form.hire_date} onChange={(e) => setForm({ ...form, hire_date: e.target.value })} />

                <select className="rounded-xl border p-3" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="terminated">Terminé</option>
                  <option value="retired">Retraité</option>
                </select>
              </div>

              <div className="mt-6 rounded-2xl bg-[#f4efe7] p-4 text-sm text-neutral-600">
                Le PIN NOVARA est verrouillé et ne doit jamais être modifié.
              </div>

              <button type="submit" disabled={saving} className="mt-6 rounded-2xl bg-black px-6 py-4 font-semibold text-white disabled:opacity-50">
                {saving ? "Sauvegarde..." : "Sauvegarder"}
              </button>
            </form>

            <div className="rounded-3xl bg-white p-5 shadow-lg md:p-6">
              <h2 className="mb-3 text-2xl font-semibold">Compétences NOVARA</h2>

              <div className="mb-5 rounded-2xl bg-[#f4efe7] p-4 text-sm text-neutral-700">
                Règle cible : au minimum 1 discipline qualifiée + 1 discipline en connaissance différente.
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs ${hasCertified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"}`}>
                    Qualification : {hasCertified ? "OK" : "manquante"}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs ${hasKnowledge ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"}`}>
                    Connaissance différente : {hasKnowledge ? "OK" : "manquante"}
                  </span>
                </div>
              </div>

              <form onSubmit={addEmployeeSkill} className="mb-5 grid gap-3 md:grid-cols-[1fr_170px]">
                <select
                  className="rounded-xl border p-3"
                  value={skillForm.skill_id}
                  onChange={(e) => setSkillForm({ ...skillForm, skill_id: e.target.value })}
                >
                  {skills.map((skill) => (
                    <option key={skill.id} value={skill.id}>
                      {skill.name} {skill.category ? `· ${skill.category}` : ""}
                    </option>
                  ))}
                </select>

                <select
                  className="rounded-xl border p-3"
                  value={skillForm.skill_level}
                  onChange={(e) => setSkillForm({ ...skillForm, skill_level: e.target.value })}
                >
                  <option value="certified">Qualifié / diplômé</option>
                  <option value="practical">Connaissance pratique</option>
                  <option value="assistant">Assistant supervisé</option>
                </select>

                <input
                  className="rounded-xl border p-3 md:col-span-2"
                  placeholder="Note optionnelle — ex : à l'aise sous supervision"
                  value={skillForm.notes}
                  onChange={(e) => setSkillForm({ ...skillForm, notes: e.target.value })}
                />

                <button
                  type="submit"
                  disabled={addingSkill}
                  className="rounded-2xl bg-black px-5 py-3 font-semibold text-white disabled:opacity-50 md:col-span-2"
                >
                  {addingSkill ? "Ajout..." : "Ajouter compétence"}
                </button>
              </form>

              {employeeSkills.length === 0 ? (
                <p className="text-neutral-500">Aucune compétence ajoutée.</p>
              ) : (
                <div className="space-y-3">
                  {employeeSkills.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-2xl border p-4">
                      <div>
                        <p className="font-semibold">{item.skills?.name || "Compétence"}</p>
                        <p className="text-sm text-neutral-500">
                          {item.skill_level === "certified"
                            ? "Qualifié / diplômé"
                            : item.skill_level === "practical"
                            ? "Connaissance pratique"
                            : "Assistant supervisé"}
                          {item.notes ? ` · ${item.notes}` : ""}
                        </p>
                      </div>

                      <button
                        onClick={() => removeEmployeeSkill(item.id)}
                        className="rounded-xl border px-3 py-2 text-xs text-red-700"
                      >
                        Retirer
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-lg md:p-6">
              <h2 className="mb-5 text-2xl font-semibold">Documents RH</h2>

              {documents.length === 0 ? (
                <p className="text-neutral-500">Aucun document ajouté.</p>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between rounded-2xl border p-4">
                      <div>
                        <p className="font-semibold">{doc.document_name}</p>
                        <p className="text-sm text-neutral-500">
                          {doc.document_type} · {doc.document_status}
                          {doc.expires_at ? ` · expire le ${doc.expires_at}` : ""}
                        </p>
                      </div>
                      <button onClick={() => openDocument(doc.file_url)} className="rounded-xl bg-black px-4 py-2 text-sm text-white">
                        Voir
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className="rounded-3xl bg-white p-5 shadow-lg md:p-6">
            <h2 className="mb-5 text-2xl font-semibold">Ajouter document</h2>

            <form onSubmit={uploadDocument} className="space-y-4">
              <select className="w-full rounded-xl border p-3" value={docForm.document_type} onChange={(e) => setDocForm({ ...docForm, document_type: e.target.value })}>
                <option value="identity_card">Carte identité</option>
                <option value="passport">Passeport</option>
                <option value="residence_permit">Titre de séjour</option>
                <option value="visa">Visa</option>
                <option value="work_authorization">Autorisation de travail</option>
                <option value="rib">RIB</option>
                <option value="contract">Contrat</option>
                <option value="driving_license">Permis de conduire</option>
                <option value="training_certificate">Certificat formation</option>
                <option value="other">Autre</option>
              </select>

              <input className="w-full rounded-xl border p-3" placeholder="Nom du document" value={docForm.document_name} onChange={(e) => setDocForm({ ...docForm, document_name: e.target.value })} />

              <label className="block text-sm font-medium">Date d'expiration si applicable</label>
              <input className="w-full rounded-xl border p-3" type="date" value={docForm.expires_at} onChange={(e) => setDocForm({ ...docForm, expires_at: e.target.value })} />

              <input className="w-full rounded-xl border p-3" type="file" onChange={(e) => setDocForm({ ...docForm, file: e.target.files?.[0] || null })} />

              <div className="rounded-2xl bg-[#f4efe7] p-4 text-sm text-neutral-600">
                Le document sera stocké dans le bucket privé employee-documents.
                Statut initial : pending_review.
              </div>

              <button type="submit" disabled={uploading} className="w-full rounded-2xl bg-black px-5 py-4 font-semibold text-white disabled:opacity-50">
                {uploading ? "Upload..." : "Ajouter document"}
              </button>
            </form>
          </aside>
        </section>
      </div>
    </main>
  );
}
