import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

const services = ["Rénovation intérieure", "Électricité & basse tension", "Cuisine, salle de bain, sols et murs", "Isolation, placo et aménagement", "Smart home & énergie", "Suivi chantier client"];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <Header />
      <section className="relative flex min-h-screen items-center overflow-hidden px-6 pt-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(201,164,92,0.24),transparent_32%),linear-gradient(120deg,#050505,#15110a,#050505)]" />
        <div className="absolute right-0 top-24 hidden h-[520px] w-[45vw] rounded-l-[4rem] border border-[#c9a45c]/20 bg-white/5 shadow-2xl md:block reveal-delay" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <p className="reveal mb-5 text-sm uppercase tracking-[0.45em] text-[#c9a45c]">NOVARA Habitat</p>
          <h1 className="reveal max-w-4xl text-5xl font-semibold leading-tight md:text-7xl">Rénovation premium et habitat intelligent, avec suivi client digital.</h1>
          <p className="reveal-delay mt-8 max-w-2xl text-lg leading-8 text-white/70">Une expérience haut de gamme pour transformer, moderniser et piloter chaque projet avec clarté : devis, documents, photos, messages, suivi chantier et SAV.</p>
          <div className="reveal-delay-2 mt-10 flex flex-wrap gap-4">
            <a href="#contact" className="rounded-full bg-[#c9a45c] px-7 py-4 font-medium text-black hover:bg-white">Demander un devis</a>
            <Link href="/connexion" className="rounded-full border border-white/25 px-7 py-4 font-medium text-white hover:border-[#c9a45c] hover:text-[#c9a45c]">Accéder à mon espace</Link>
          </div>
        </div>
      </section>
      <section id="services" className="bg-[#f5f0e8] px-6 py-24 text-black">
        <div className="mx-auto max-w-7xl"><p className="reveal text-sm uppercase tracking-[0.35em] text-[#9b7b39]">Services</p><h2 className="reveal mt-4 max-w-3xl text-4xl font-semibold md:text-6xl">Une offre complète pour créer un habitat plus beau, plus intelligent et plus fluide.</h2><div className="mt-14 grid gap-6 md:grid-cols-3">{services.map((service, index) => (<div key={service} className="reveal rounded-3xl border border-black/10 bg-white p-8 shadow-sm"><p className="text-sm text-[#9b7b39]">0{index + 1}</p><h3 className="mt-8 text-2xl font-semibold">{service}</h3><p className="mt-4 text-black/60">Prestation structurée, finition soignée, communication claire et expérience client premium.</p></div>))}</div></div>
      </section>
      <section id="projets" className="px-6 py-24"><div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2"><div className="reveal min-h-[480px] rounded-[3rem] border border-[#c9a45c]/20 bg-[linear-gradient(145deg,rgba(201,164,92,0.22),rgba(255,255,255,0.04))]" /><div className="flex flex-col justify-center"><p className="reveal text-sm uppercase tracking-[0.35em] text-[#c9a45c]">Expérience client</p><h2 className="reveal mt-4 text-4xl font-semibold md:text-6xl">Un espace personnel pour chaque client.</h2><p className="reveal-delay mt-7 text-lg leading-8 text-white/70">Le client pourra suivre son chantier, retrouver ses documents, consulter ses devis et factures, envoyer un message, suivre le SAV et voir l’avancement.</p><div className="reveal-delay-2 mt-8 grid gap-4 text-white/75"><div className="glass rounded-2xl p-5">Suivi chantier & étapes clés</div><div className="glass rounded-2xl p-5">Documents, devis, factures et photos</div><div className="glass rounded-2xl p-5">Messagerie client et demandes SAV</div></div></div></div></section>
      <section id="contact" className="bg-[#f5f0e8] px-6 py-24 text-black"><div className="mx-auto max-w-4xl text-center"><p className="reveal text-sm uppercase tracking-[0.35em] text-[#9b7b39]">Contact</p><h2 className="reveal mt-4 text-4xl font-semibold md:text-6xl">Lancez votre projet NOVARA.</h2><div className="reveal-delay-2 mt-10"><a href="mailto:contact@novarahabitat.fr" className="rounded-full bg-black px-8 py-4 text-white hover:bg-[#c9a45c] hover:text-black">contact@novarahabitat.fr</a></div></div></section>
      <Footer />
    </main>
  );
}
