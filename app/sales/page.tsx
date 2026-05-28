"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Lead = { id:string; created_at:string; full_name:string|null; email:string|null; phone:string|null; project_type:string|null; budget:string|null; city:string|null; message:string|null; status:string|null };

export default function SalesPage(){
 const router=useRouter();
 const [allowed,setAllowed]=useState(false);
 const [status,setStatus]=useState("Vérification accès...");
 const [leads,setLeads]=useState<Lead[]>([]);

 useEffect(()=>{async function start(){
  const {data:user}=await supabase.auth.getUser();
  if(!user.user){router.push("/connexion");return;}
  const {data:profile}=await supabase.from("profiles").select("role").eq("id",user.user.id).single();
  if(profile?.role==="sales"||profile?.role==="admin"){setAllowed(true);setStatus("Bienvenue dans NOVARA Sales."); await loadLeads();} else setStatus("Accès refusé : rôle commercial requis.");
 } start();},[router]);

 async function loadLeads(){
  const {data,error}=await supabase.from("leads").select("*").order("created_at",{ascending:false});
  if(!error&&data)setLeads(data as Lead[]);
 }
 async function logout(){await supabase.auth.signOut();router.push("/connexion");}

 return <main className="min-h-screen bg-[#070707] text-white"><Header/><section className="mx-auto min-h-screen max-w-7xl px-6 pt-32">
  <div className="flex flex-wrap items-center justify-between gap-6"><div><p className="text-sm uppercase tracking-[0.35em] text-[#c9a45c]">NOVARA Sales</p><h1 className="mt-5 text-5xl font-semibold">Vente & dossiers client</h1><p className="mt-4 text-white/70">{status}</p></div>{allowed&&<button onClick={logout} className="rounded-full border border-white/20 px-5 py-3 text-white/70 hover:border-[#c9a45c] hover:text-[#c9a45c]">Déconnexion</button>}</div>
  {allowed&&<>
   <div className="mt-12 grid gap-6 md:grid-cols-3">
    <div className="glass rounded-3xl p-8"><h2 className="text-2xl font-semibold">Prospects</h2><p className="mt-3 text-white/60">Demandes entrantes et qualification.</p></div>
    <div className="glass rounded-3xl p-8"><h2 className="text-2xl font-semibold">Devis & signature</h2><p className="mt-3 text-white/60">Prévu étape suivante.</p></div>
    <div className="glass rounded-3xl p-8"><h2 className="text-2xl font-semibold">Dossier client</h2><p className="mt-3 text-white/60">PDF premium et présentation iPad.</p></div>
   </div>
   <div className="mt-10 rounded-3xl border border-[#c9a45c]/25 bg-white/5 p-8">
    <h2 className="text-2xl font-semibold">Prospects entrants</h2>
    <p className="mt-2 text-sm text-white/55">Demandes reçues depuis le formulaire public.</p>
    <div className="mt-6 grid gap-4">
     {leads.map((lead)=><div key={lead.id} className="rounded-2xl border border-white/10 bg-black/40 p-5">
      <div className="flex flex-wrap justify-between gap-3"><div><h3 className="text-xl font-semibold">{lead.full_name||"Prospect sans nom"}</h3><p className="mt-2 text-sm text-white/55">{lead.project_type||"Projet non précisé"} · {lead.city||"Secteur non précisé"}</p></div><span className="rounded-full border border-[#c9a45c]/40 px-3 py-1 text-xs text-[#c9a45c]">{lead.status||"new"}</span></div>
      <p className="mt-3 text-sm text-white/60">{lead.email} · {lead.phone}</p>
      <p className="mt-3 text-sm text-white/60">Budget : {lead.budget||"Non précisé"}</p>
      {lead.message&&<p className="mt-4 text-sm leading-6 text-white/70">{lead.message}</p>}
     </div>)}
     {leads.length===0&&<p className="rounded-2xl border border-white/10 bg-black/40 p-5 text-white/55">Aucun prospect pour l’instant.</p>}
    </div>
   </div>
  </>}
 </section><Footer/></main>
}
