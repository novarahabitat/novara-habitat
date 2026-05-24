"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Vérification de l’accès admin...");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) { router.push("/connexion"); return; }
      const { data: profile, error } = await supabase.from("profiles").select("role, full_name").eq("id", userData.user.id).single();
      if (error || profile?.role !== "admin") { setStatus("Accès refusé : compte admin requis."); return; }
      setIsAdmin(true); setStatus("Bienvenue dans l’admin NOVARA.");
    }
    checkAdmin();
  }, [router]);

  async function logout() { await supabase.auth.signOut(); router.push("/connexion"); }

  return (
    <main className="min-h-screen bg-[#070707] text-white"><Header /><section className="mx-auto min-h-screen max-w-7xl px-6 pt-32"><div className="flex flex-wrap items-center justify-between gap-6"><div><p className="text-sm uppercase tracking-[0.35em] text-[#c9a45c]">NOVARA Admin</p><h1 className="mt-5 text-5xl font-semibold">Dashboard</h1><p className="mt-4 text-white/70">{status}</p></div>{isAdmin && <button onClick={logout} className="rounded-full border border-white/20 px-5 py-3 text-white/70 hover:border-[#c9a45c] hover:text-[#c9a45c]">Déconnexion</button>}</div>{isAdmin && <div className="mt-12 grid gap-6 md:grid-cols-3"><div className="rounded-3xl border border-[#c9a45c]/25 bg-white/5 p-8"><h2 className="text-2xl font-semibold">Projets</h2><p className="mt-3 text-white/60">Créer et gérer les réalisations NOVARA.</p></div><div className="rounded-3xl border border-[#c9a45c]/25 bg-white/5 p-8"><h2 className="text-2xl font-semibold">Photos</h2><p className="mt-3 text-white/60">Upload chantier, avant/après, galerie premium.</p></div><div className="rounded-3xl border border-[#c9a45c]/25 bg-white/5 p-8"><h2 className="text-2xl font-semibold">Demandes</h2><p className="mt-3 text-white/60">Devis, messages clients, SAV et documents.</p></div></div>}</section><Footer /></main>
  );
}
