export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black px-6 py-12 text-white/65">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
        <div>
          <p className="text-lg tracking-[0.35em] text-white">NOVARA</p>
          <p className="mt-1 text-sm tracking-[0.25em] text-novaraGold">HABITAT</p>
          <p className="mt-4 max-w-sm text-sm">Rénovation premium, habitat intelligent, énergie, confort et suivi digital client.</p>
        </div>
        <div className="text-sm">
          <p className="mb-3 text-white">Services</p>
          <p>Rénovation intérieure</p>
          <p>Électricité & basse tension</p>
          <p>Smart home & énergie</p>
          <p>Suivi chantier & SAV</p>
        </div>
        <div className="text-sm">
          <p className="mb-3 text-white">Contact</p>
          <p>contact@novarahabitat.fr</p>
          <p>novarahabitat.fr</p>
        </div>
      </div>
    </footer>
  )
}
