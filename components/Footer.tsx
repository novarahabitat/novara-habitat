import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black px-6 py-12 text-sm text-white/50">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.2fr_1fr]">
        <div>
          <img src="/logo-novara-habitat.jpeg" alt="NOVARA Habitat" className="h-16 w-auto rounded-sm object-contain" />
          <p className="mt-5 max-w-xl text-white/55">
            Rénovation premium · Habitat intelligent · Suivi chantier digital · Expérience client haut de gamme.
          </p>
          <div className="mt-6 text-xs text-white/25">
            <Link href="/connexion" className="hover:text-[#c9a45c]">NOVARA Core</Link>
          </div>
        </div>

        <div>
          <p className="tracking-[0.25em] text-[#c9a45c]">ÉCOSYSTÈME NOVARA</p>
          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <img src="/logo-novara-habitat.jpeg" alt="NOVARA Habitat" className="h-12 w-full object-contain" />
              <p className="mt-3 text-center text-xs text-white/45">Habitat</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <img src="/logo-novara-studio.jpeg" alt="NOVARA Studio" className="h-12 w-full object-contain" />
              <p className="mt-3 text-center text-xs text-white/45">Studio</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <img src="/logo-novara-voltis.jpeg" alt="NOVARA Voltis" className="h-12 w-full object-contain" />
              <p className="mt-3 text-center text-xs text-white/45">Voltis</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
