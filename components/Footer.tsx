import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black px-6 py-16 text-center">
      <div className="mx-auto flex max-w-7xl flex-col items-center">
        <div className="flex flex-wrap items-center justify-center gap-6">
          <img
            src="/logos/novara-logo-noir.jpg"
            className="h-14 object-contain opacity-90 transition hover:opacity-100"
            alt="NOVARA Habitat"
          />
          <img
            src="/logos/novara-studio.jpg"
            className="h-14 object-contain opacity-90 transition hover:opacity-100"
            alt="NOVARA Studio"
          />
          <img
            src="/logos/novara-voltis.jpg"
            className="h-14 object-contain opacity-90 transition hover:opacity-100"
            alt="NOVARA Voltis"
          />
        </div>

        <p className="mt-8 text-sm tracking-[0.45em] text-[#c9a45c]">NOVARA HABITAT</p>

        <div className="mt-8 flex gap-8 text-xs text-white/30">
          <Link href="/contact" className="transition hover:text-white/60">
            Contact
          </Link>
          <Link href="/connexion" className="transition hover:text-white/60">
            Espace pro
          </Link>
        </div>
      </div>
    </footer>
  );
}
