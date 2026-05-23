import Link from 'next/link'

export default function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/55 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-novaraGold/60 bg-novaraGold/10 text-novaraGold font-bold">N</div>
          <div>
            <p className="text-sm tracking-[0.35em] text-white">NOVARA</p>
            <p className="text-xs tracking-[0.25em] text-novaraGold">HABITAT</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-white/80 md:flex">
          <a href="#services" className="hover:text-novaraGold">Services</a>
          <a href="#projets" className="hover:text-novaraGold">Réalisations</a>
          <a href="#process" className="hover:text-novaraGold">Méthode</a>
          <Link href="/connexion" className="hover:text-novaraGold">Espace client</Link>
          <a href="#contact" className="rounded-full border border-novaraGold/70 px-5 py-2 text-novaraGold hover:bg-novaraGold hover:text-black">Demander un devis</a>
        </nav>
      </div>
    </header>
  )
}
