import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Reveal from '@/components/Reveal'
import { ArrowRight, ShieldCheck, Hammer, Zap, Home, FileText, MessageSquare } from 'lucide-react'

const services = [
  { icon: Hammer, title: 'Rénovation intérieure', text: 'Cuisine, salle de bain, sols, murs, placo, isolation intérieure, aménagements et finitions premium.' },
  { icon: Zap, title: 'Électricité & smart home', text: 'Électricité, basse tension, Wi‑Fi, relais connectés, sécurité, alarmes et maison intelligente.' },
  { icon: Home, title: 'Habitat & énergie', text: 'Préparation photovoltaïque, optimisation énergie, chauffage, poêles à granulés et confort global.' },
  { icon: ShieldCheck, title: 'Chantier propre & suivi', text: 'Méthode NOVARA Clean Renovation, traçabilité, photos, documents, SAV et expérience client premium.' }
]

const portal = [
  { icon: FileText, title: 'Documents', text: 'Devis, factures, attestations, photos chantier et comptes rendus centralisés.' },
  { icon: MessageSquare, title: 'Messages', text: 'Communication client, SAV, demandes complémentaires et historique projet.' },
  { icon: ShieldCheck, title: 'Accès sécurisé', text: 'Création de compte, mot de passe, espace individuel et accès projet personnalisé.' }
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-novaraBlack text-novaraCream">
      <Header />

      <section className="relative flex min-h-screen items-center overflow-hidden px-6 pt-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(200,162,74,0.22),transparent_32%),linear-gradient(120deg,#080806_0%,#14100b_55%,#000_100%)]" />
        <div className="absolute right-0 top-24 hidden h-[75vh] w-[48vw] rounded-l-[4rem] border border-novaraGold/25 bg-[linear-gradient(135deg,rgba(255,255,255,.14),rgba(200,162,74,.12)),url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-80 shadow-2xl md:block" />
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
          <Reveal>
            <p className="mb-5 text-sm uppercase tracking-[0.45em] text-novaraGold">Rénovation premium & habitat intelligent</p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-tight text-white md:text-7xl">L’habitat transformé avec méthode, élégance et suivi digital.</h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-white/72">NOVARA Habitat réunit rénovation, confort, énergie, smart home et espace client dans une expérience claire, premium et moderne.</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href="#contact" className="group flex items-center gap-3 rounded-full bg-novaraGold px-7 py-4 font-medium text-black transition hover:bg-white">Demander un devis <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></a>
              <a href="#services" className="rounded-full border border-white/20 px-7 py-4 text-white/85 hover:border-novaraGold hover:text-novaraGold">Découvrir les services</a>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="services" className="px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <Reveal><p className="text-sm uppercase tracking-[0.4em] text-novaraGold">Services NOVARA</p><h2 className="mt-4 max-w-3xl text-4xl font-semibold text-white md:text-5xl">Une plateforme d’habitat premium pensée pour évoluer.</h2></Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-4">
            {services.map((s, i) => <Reveal key={s.title} delay={i * 0.08}><div className="h-full rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 shadow-2xl transition hover:-translate-y-2 hover:border-novaraGold/60"><s.icon className="mb-8 h-9 w-9 text-novaraGold" /><h3 className="text-xl font-semibold text-white">{s.title}</h3><p className="mt-4 text-sm leading-7 text-white/65">{s.text}</p></div></Reveal>)}
          </div>
        </div>
      </section>

      <section id="projets" className="bg-novaraCream px-6 py-28 text-black">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2">
          <Reveal><div className="min-h-[520px] rounded-[3rem] bg-[url('https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center shadow-2xl" /></Reveal>
          <Reveal delay={0.12}><div className="flex h-full flex-col justify-center"><p className="text-sm uppercase tracking-[0.4em] text-[#8E6C22]">Expérience client</p><h2 className="mt-5 text-4xl font-semibold md:text-5xl">Un chantier suivi comme un projet premium.</h2><p className="mt-7 text-lg leading-8 text-black/65">Chaque client NOVARA pourra accéder à un espace individuel : étapes du chantier, photos, documents, devis, factures, messages, SAV et validations.</p><div className="mt-10 grid gap-4">{portal.map((p) => <div key={p.title} className="rounded-2xl border border-black/10 bg-white p-5"><p className="font-semibold">{p.title}</p><p className="mt-1 text-sm text-black/60">{p.text}</p></div>)}</div></div></Reveal>
        </div>
      </section>

      <section id="process" className="px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <Reveal><p className="text-sm uppercase tracking-[0.4em] text-novaraGold">Méthode</p><h2 className="mt-4 text-4xl font-semibold text-white md:text-5xl">De la demande au SAV, une seule expérience maîtrisée.</h2></Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-4">
            {['Diagnostic', 'Proposition', 'Réalisation', 'Suivi & SAV'].map((step, i) => <Reveal key={step} delay={i * 0.08}><div className="rounded-[2rem] border border-white/10 p-8"><p className="text-5xl font-semibold text-novaraGold/80">0{i+1}</p><h3 className="mt-8 text-xl text-white">{step}</h3><p className="mt-3 text-sm leading-7 text-white/60">Process clair, documents centralisés et expérience client haut de gamme.</p></div></Reveal>)}
          </div>
        </div>
      </section>

      <section id="contact" className="px-6 py-28">
        <Reveal><div className="mx-auto max-w-5xl rounded-[3rem] border border-novaraGold/30 bg-white/[0.05] p-10 text-center shadow-2xl md:p-16"><p className="text-sm uppercase tracking-[0.4em] text-novaraGold">Projet NOVARA</p><h2 className="mt-5 text-4xl font-semibold text-white md:text-5xl">Préparez votre futur chantier.</h2><p className="mx-auto mt-6 max-w-2xl text-white/70">La première version connectera bientôt le formulaire aux demandes de devis et à l’espace client Supabase.</p><a href="mailto:contact@novarahabitat.fr" className="mt-10 inline-flex rounded-full bg-novaraGold px-8 py-4 font-medium text-black hover:bg-white">contact@novarahabitat.fr</a></div></Reveal>
      </section>

      <Footer />
    </main>
  )
}
