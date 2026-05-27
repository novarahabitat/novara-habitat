"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Page(){
 const router=useRouter();
 const [allowed,setAllowed]=useState(false);
 const [status,setStatus]=useState("Vérification accès...");
 useEffect(()=>{async function check(){
  const {data:user}=await supabase.auth.getUser();
  if(!user.user){router.push("/connexion");return;}
  const {data:profile}=await supabase.from("profiles").select("role").eq("id",user.user.id).single();
  if(profile?.role==="sales"||profile?.role==="admin"){setAllowed(true);setStatus("Bienvenue dans NOVARA Sales.");} else setStatus("Accès refusé : rôle commercial requis.");
 } check();},[router]);
 async function logout(){await supabase.auth.signOut();router.push("/connexion");}
 return <main className="min-h-screen bg-[#070707] text-white"><Header/><section className="mx-auto min-h-screen max-w-7xl px-6 pt-32"><div className="flex flex-wrap items-center justify-between gap-6"><div><p className="text-sm uppercase tracking-[0.35em] text-[#c9a45c]">NOVARA Sales</p><h1 className="mt-5 text-5xl font-semibold">Vente & dossiers client</h1><p className="mt-4 text-white/70">{status}</p></div>{allowed&&<button onClick={logout} className="rounded-full border border-white/20 px-5 py-3 text-white/70 hover:border-[#c9a45c] hover:text-[#c9a45c]">Déconnexion</button>}</div>{allowed&&<div className="mt-12 grid gap-6 md:grid-cols-3"><div className="glass rounded-3xl p-8"><h2 className="text-2xl font-semibold">Prospects</h2><p className="mt-3 text-white/60">Qualification, besoins, photos et notes rendez-vous.</p></div><div className="glass rounded-3xl p-8"><h2 className="text-2xl font-semibold">Devis & signature</h2><p className="mt-3 text-white/60">Devis, contrat d’engagement et signature client.</p></div><div className="glass rounded-3xl p-8"><h2 className="text-2xl font-semibold">Dossier client</h2><p className="mt-3 text-white/60">PDF premium, impression bureau et présentation iPad.</p></div></div>}</section><Footer/></main>
}
