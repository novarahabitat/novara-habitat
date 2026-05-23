import Header from '@/components/Header'
import { FileText, Image, MessageSquare, Receipt, Wrench } from 'lucide-react'

const cards = [
  { icon: Wrench, title: 'Mes chantiers', text: 'Suivi des étapes, planning et avancement.' },
  { icon: FileText, title: 'Mes devis', text: 'Propositions commerciales et validations.' },
  { icon: Receipt, title: 'Mes factures', text: 'Factures, paiements et historique.' },
  { icon: Image, title: 'Photos chantier', text: 'Avant / pendant / après les travaux.' },
  { icon: MessageSquare, title: 'Messages & SAV', text: 'Demandes, support et communication.' }
]

export default function EspaceClientPage() {
  return (
    <main className="min-h-screen bg-novaraBlack px-6 py-32 text-novaraCream">
      <Header />
      <section className="mx-auto max-w-7xl">
        <p className="text-sm uppercase tracking-[0.35em] text-novaraGold">Dashboard client</p>
        <h1 className="mt-4 text-4xl font-semibold text-white md:text-5xl">Espace client NOVARA</h1>
        <p className="mt-5 max-w-2xl text-white/65">Structure prête pour projets individuels, documents, devis, factures, photos, messages et SAV. Connexion Supabase à venir.</p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {cards.map((c) => <div key={c.title} className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-7"><c.icon className="h-8 w-8 text-novaraGold" /><h2 className="mt-8 text-xl text-white">{c.title}</h2><p className="mt-3 text-sm text-white/60">{c.text}</p></div>)}
        </div>
      </section>
    </main>
  )
}
