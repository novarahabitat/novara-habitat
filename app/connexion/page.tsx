"use client";
import Header from "@/components/Header"; import Footer from "@/components/Footer"; import { supabase } from "@/lib/supabaseClient"; import { useState } from "react"; import { useRouter } from "next/navigation";
export default function ConnexionPage(){
 const router=useRouter(); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [message,setMessage]=useState("");
 async function login(e:React.FormEvent<HTMLFormElement>){e.preventDefault(); setMessage("Connexion en cours...");
  const {error}=await supabase.auth.signInWithPassword({email,password}); if(error){setMessage("Erreur : "+error.message);return;}
  const {data:userData}=await supabase.auth.getUser(); const id=userData.user?.id; if(!id){setMessage("Utilisateur introuvable.");return;}
  const {data:profile}=await supabase.from("profiles").select("role").eq("id",id).single();
  if(profile?.role==="admin") router.push("/admin"); else if(profile?.role==="employee") router.push("/core"); else if(profile?.role==="sales") router.push("/sales"); else router.push("/espace-client");
 }
 return <main className="min-h-screen bg-[#070707] text-white"><Header/><section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 pt-24"><p className="text-sm uppercase tracking-[0.35em] text-[#c9a45c]">NOVARA Platform</p><h1 className="mt-5 text-5xl font-semibold">Connexion</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">Accès client, admin, Core ou Sales selon votre rôle.</p><form onSubmit={login} className="mt-10 max-w-xl rounded-3xl border border-[#c9a45c]/25 bg-white/5 p-8"><label className="block text-sm text-white/70">Email</label><input className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/><label className="mt-6 block text-sm text-white/70">Mot de passe</label><input className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/><button className="mt-8 rounded-full bg-[#c9a45c] px-7 py-4 font-medium text-black hover:bg-white">Se connecter</button>{message&&<p className="mt-5 text-sm text-white/70">{message}</p>}</form></section><Footer/></main>
}
