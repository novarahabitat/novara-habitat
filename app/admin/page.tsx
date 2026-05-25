"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Project = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  location: string | null;
  status: string | null;
  published: boolean | null;
  created_at: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Vérification de l’accès admin...");
  const [isAdmin, setIsAdmin] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [formMessage, setFormMessage] = useState("");

  useEffect(() => {
    async function start() {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        router.push("/connexion");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userData.user.id)
        .single();

      if (error || profile?.role !== "admin") {
        setStatus("Accès refusé : compte admin requis.");
        return;
      }

      setIsAdmin(true);
      setStatus("Bienvenue dans l’admin NOVARA.");
      await loadProjects();
    }

    start();
  }, [router]);

  async function loadProjects() {
    const { data, error } = await supabase
      .from("projects")
      .select("id,title,description,category,location,status,published,created_at")
      .order("created_at", { ascending: false });

    if (!error && data) setProjects(data as Project[]);
  }

  async function createProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormMessage("Création du projet...");

    const slug = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const { error } = await supabase.from("projects").insert({
      title,
      slug: slug + "-" + Date.now(),
      category,
      location,
      description,
      status: "draft",
      published: false,
    });

    if (error) {
      setFormMessage("Erreur : " + error.message);
      return;
    }

    setTitle("");
    setCategory("");
    setLocation("");
    setDescription("");
    setFormMessage("Projet créé avec succès.");
    await loadProjects();
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/connexion");
  }

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <Header />
      <section className="mx-auto min-h-screen max-w-7xl px-6 pt-32">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#c9a45c]">NOVARA Admin</p>
            <h1 className="mt-5 text-5xl font-semibold">Dashboard</h1>
            <p className="mt-4 text-white/70">{status}</p>
          </div>
          {isAdmin && (
            <button onClick={logout} className="rounded-full border border-white/20 px-5 py-3 text-white/70 hover:border-[#c9a45c] hover:text-[#c9a45c]">
              Déconnexion
            </button>
          )}
        </div>

        {isAdmin && (
          <div className="mt-12 grid gap-8 lg:grid-cols-[420px_1fr]">
            <form onSubmit={createProject} className="rounded-3xl border border-[#c9a45c]/25 bg-white/5 p-8">
              <h2 className="text-2xl font-semibold">Nouveau projet</h2>
              <p className="mt-2 text-sm text-white/55">Créer une réalisation ou un chantier à publier plus tard.</p>

              <label className="mt-6 block text-sm text-white/70">Titre</label>
              <input className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white" value={title} onChange={(e) => setTitle(e.target.value)} required />

              <label className="mt-5 block text-sm text-white/70">Catégorie</label>
              <input className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Rénovation, électricité, extérieur..." />

              <label className="mt-5 block text-sm text-white/70">Localisation</label>
              <input className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ville / secteur" />

              <label className="mt-5 block text-sm text-white/70">Description</label>
              <textarea className="mt-2 min-h-32 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white" value={description} onChange={(e) => setDescription(e.target.value)} />

              <button className="mt-7 rounded-full bg-[#c9a45c] px-7 py-4 font-medium text-black hover:bg-white">
                Créer le projet
              </button>
              {formMessage && <p className="mt-5 text-sm text-white/65">{formMessage}</p>}
            </form>

            <div className="rounded-3xl border border-[#c9a45c]/25 bg-white/5 p-8">
              <h2 className="text-2xl font-semibold">Projets NOVARA</h2>
              <p className="mt-2 text-sm text-white/55">{projects.length} projet(s) enregistré(s).</p>

              <div className="mt-6 grid gap-4">
                {projects.map((project) => (
                  <div key={project.id} className="rounded-2xl border border-white/10 bg-black/40 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-semibold">{project.title}</h3>
                        <p className="mt-2 text-sm text-white/55">{project.category || "Sans catégorie"} · {project.location || "Sans lieu"}</p>
                      </div>
                      <span className="rounded-full border border-[#c9a45c]/40 px-3 py-1 text-xs text-[#c9a45c]">
                        {project.published ? "Publié" : "Brouillon"}
                      </span>
                    </div>
                    {project.description && <p className="mt-4 text-sm leading-6 text-white/65">{project.description}</p>}
                  </div>
                ))}

                {projects.length === 0 && (
                  <p className="rounded-2xl border border-white/10 bg-black/40 p-5 text-white/55">
                    Aucun projet pour l’instant. Crée ton premier chantier NOVARA.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
