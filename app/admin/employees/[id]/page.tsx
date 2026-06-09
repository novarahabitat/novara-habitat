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

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const employeeId = params.id as string;

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [documents, setDocuments] = useState<EmployeeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
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

  useEffect(() => {
    if (employeeId) {
      loadEmployee();
      loadDocuments();
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

  if (loading) {
    return <main className="min-h-screen bg-[#f7f3ee] p-6">Chargement...</main>;
  }

  if (!employee) {
    return <main className="min-h-screen bg-[#f7f3ee] p-6">Employé introuvable.</main>;
  }

  return (
    <main className="min-h-screen bg-[#f7f3ee] p-6 text-[#171717]">
      <div className="mx-auto max-w-7xl">
        <button
          onClick={() => router.push("/admin/employees")}
          className="mb-6 rounded-xl border bg-white px-4 py-2 text-sm"
        >
          ← Retour employés
        </button>

        <section className="mb-6 rounded-3xl bg-black p-8 text-white shadow-xl">
          <img
            src="/logos/novara-dynamics-logo.png"
            alt="NOVARA Dynamics"
            className="mb-6 h-16 w-auto"
          />

          <p className="text-sm uppercase tracking-[0.3em] text-[#d6b46d]">
            NOVARA Dynamics · Gestion RH
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
              <p className="mt-2 text-white/70">
                {employee.job_title || "Poste non renseigné"}
              </p>
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

        <section className="grid gap-6 lg:grid-cols-[1fr_420px]">
          <div className="space-y-6">
            <form onSubmit={saveEmployee} className="rounded-3xl bg-white p-6 shadow-lg">
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

            <div className="rounded-3xl bg-white p-6 shadow-lg">
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
                      <button
                        onClick={() => openDocument(doc.file_url)}
                        className="rounded-xl bg-black px-4 py-2 text-sm text-white"
                      >
                        Voir
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className="rounded-3xl bg-white p-6 shadow-lg">
            <h2 className="mb-5 text-2xl font-semibold">Ajouter document</h2>

            <form onSubmit={uploadDocument} className="space-y-4">
              <select
                className="w-full rounded-xl border p-3"
                value={docForm.document_type}
                onChange={(e) => setDocForm({ ...docForm, document_type: e.target.value })}
              >
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

              <input
                className="w-full rounded-xl border p-3"
                placeholder="Nom du document"
                value={docForm.document_name}
                onChange={(e) => setDocForm({ ...docForm, document_name: e.target.value })}
              />

              <label className="block text-sm font-medium">
                Date d'expiration si applicable
              </label>
              <input
                className="w-full rounded-xl border p-3"
                type="date"
                value={docForm.expires_at}
                onChange={(e) => setDocForm({ ...docForm, expires_at: e.target.value })}
              />

              <input
                className="w-full rounded-xl border p-3"
                type="file"
                onChange={(e) =>
                  setDocForm({ ...docForm, file: e.target.files?.[0] || null })
                }
              />

              <div className="rounded-2xl bg-[#f4efe7] p-4 text-sm text-neutral-600">
                Le document sera stocké dans le bucket privé employee-documents.
                Statut initial : pending_review.
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full rounded-2xl bg-black px-5 py-4 font-semibold text-white disabled:opacity-50"
              >
                {uploading ? "Upload..." : "Ajouter document"}
              </button>
            </form>
          </aside>
        </section>
      </div>
    </main>
  );
}
