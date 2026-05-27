import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

const ecosystem = [
 ["NOVARA Habitat","Rénovation, transformation, chantiers premium."],
 ["NOVARA Studio","Design, conception, visualisation et dossiers client."],
 ["NOVARA Voltis","Énergie, photovoltaïque, smart home et optimisation."],
 ["NOVARA Core","Employés, terrain, photos, SAV, tâches et planning."],
 ["NOVARA Sales","Vente, devis, signature, dossier client et relances."]
];

export default function Home(){
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
  <section id="ecosysteme" className="px-6 py-24">
   <div className="mx-auto max-w-7xl">
    <p className="text-sm uppercase tracking-[0.35em] text-[#c9a45c]">Écosystème NOVARA</p>
    <h2 className="mt-4 max-w-4xl text-4xl font-semibold md:text-6xl">Une plateforme unique, plusieurs expériences métier.</h2>
    <div className="mt-12 grid gap-6 md:grid-cols-5">{ecosystem.map(([t,d])=><div key={t} className="glass rounded-3xl p-6"><h3 className="text-xl font-semibold">{t}</h3><p className="mt-4 text-sm leading-6 text-white/60">{d}</p></div>)}</div>
   </div>
  </section>
  <section id="contact" className="bg-[#f5f0e8] px-6 py-24 text-black">
   <div className="mx-auto max-w-4xl text-center">
    <p className="text-sm uppercase tracking-[0.35em] text-[#9b7b39]">Contact</p>
    <h2 className="mt-4 text-4xl font-semibold md:text-6xl">Lancez votre projet NOVARA.</h2>
    <p className="mt-6 text-black/60">Formulaire contact/CRM prévu dans la prochaine étape.</p>
    <div className="mt-10"><a href="mailto:contact@novarahabitat.fr" className="rounded-full bg-black px-8 py-4 text-white hover:bg-[#c9a45c] hover:text-black">contact@novarahabitat.fr</a></div>
   </div>
  </section>
  <Footer/>
 </main>
}
