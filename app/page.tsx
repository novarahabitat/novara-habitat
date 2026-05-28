"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

export default function Home(){
 const [fullName,setFullName]=useState("");
 const [email,setEmail]=useState("");
 const [phone,setPhone]=useState("");
 const [projectType,setProjectType]=useState("");
 const [budget,setBudget]=useState("");
 const [city,setCity]=useState("");
 const [message,setMessage]=useState("");
 const [formStatus,setFormStatus]=useState("");

 async function submitLead(e: React.FormEvent<HTMLFormElement>){
  e.preventDefault();
  setFormStatus("Envoi de votre demande...");
  const { error } = await supabase.from("leads").insert({
   full_name: fullName,
   email,
   phone,
   project_type: projectType,
   budget,
   city,
   message,
   status: "new"
  });
  if(error){ setFormStatus("Erreur : " + error.message); return; }
  setFullName(""); setEmail(""); setPhone(""); setProjectType(""); setBudget(""); setCity(""); setMessage("");
  setFormStatus("Demande envoyée. NOVARA vous recontactera rapidement.");
 }

 return <main className="min-h-screen bg-[#070707] text-white">
  <Header/>
  <section className="relative flex min-h-screen items-center overflow-hidden px-6 pt-24">
   <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(201,164,92,0.24),transparent_32%),linear-gradient(120deg,#050505,#15110a,#050505)]"/>
   <div className="relative z-10 mx-auto max-w-7xl">
    <p className="mb-5 text-sm uppercase tracking-[0.45em] text-[#c9a45c]">NOVARA Habitat</p>
    <h1 className="max-w-4xl text-5xl font-semibold leading-tight md:text-7xl">Rénovation premium et plateforme smart habitat.</h1>
    <p className="mt-8 max-w-2xl text-lg leading-8 text-white/70">Site public, espace client, admin, Core terrain et Sales commercial dans un même écosystème.</p>
    <div className="mt-10 flex flex-wrap gap-4">
     <a href="#contact" className="rounded-full bg-[#c9a45c] px-7 py-4 font-medium text-black hover:bg-white">Demander un devis</a>
     <Link href="/connexion" className="rounded-full border border-white/25 px-7 py-4 font-medium text-white hover:border-[#c9a45c] hover:text-[#c9a45c]">Accéder à mon espace</Link>
    </div>
   </div>
  </section>

  <section id="contact" className="bg-[#f5f0e8] px-6 py-24 text-black">
   <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_520px]">
    <div>
     <p className="text-sm uppercase tracking-[0.35em] text-[#9b7b39]">Contact</p>
     <h2 className="mt-4 text-4xl font-semibold md:text-6xl">Parlez-nous de votre projet.</h2>
     <p className="mt-6 max-w-2xl text-lg leading-8 text-black/60">Votre demande arrive directement dans NOVARA Sales.</p>
    </div>
    <form onSubmit={submitLead} className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
     <div className="grid gap-4 md:grid-cols-2">
      <div><label className="text-sm text-black/60">Nom complet</label><input className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3" value={fullName} onChange={e=>setFullName(e.target.value)} required/></div>
      <div><label className="text-sm text-black/60">Téléphone</label><input className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3" value={phone} onChange={e=>setPhone(e.target.value)}/></div>
     </div>
     <label className="mt-4 block text-sm text-black/60">Email</label>
     <input className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
     <div className="mt-4 grid gap-4 md:grid-cols-2">
      <div><label className="text-sm text-black/60">Type de projet</label><select className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3" value={projectType} onChange={e=>setProjectType(e.target.value)}><option value="">Choisir</option><option>Rénovation intérieure</option><option>Électricité</option><option>Smart home</option><option>Photovoltaïque / énergie</option><option>Aménagement extérieur</option><option>Autre</option></select></div>
      <div><label className="text-sm text-black/60">Budget estimé</label><select className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3" value={budget} onChange={e=>setBudget(e.target.value)}><option value="">Choisir</option><option>Moins de 5 000 €</option><option>5 000 - 15 000 €</option><option>15 000 - 40 000 €</option><option>40 000 € +</option><option>À définir</option></select></div>
     </div>
     <label className="mt-4 block text-sm text-black/60">Ville / secteur</label>
     <input className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3" value={city} onChange={e=>setCity(e.target.value)}/>
     <label className="mt-4 block text-sm text-black/60">Message</label>
     <textarea className="mt-2 min-h-32 w-full rounded-xl border border-black/10 px-4 py-3" value={message} onChange={e=>setMessage(e.target.value)} required/>
     <button className="mt-6 rounded-full bg-black px-8 py-4 font-medium text-white hover:bg-[#c9a45c] hover:text-black">Envoyer la demande</button>
     {formStatus&&<p className="mt-5 text-sm text-black/60">{formStatus}</p>}
    </form>
   </div>
  </section>
  <Footer/>
 </main>
}
