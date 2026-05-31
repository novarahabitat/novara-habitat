import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-black/60 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <Link href="/" className="flex items-center gap-4">
          <img
            src="/logos/novara-habitat.jpg"
            alt="NOVARA"
            className="h-16 w-16 object-contain drop-shadow-[0_0_18px_rgba(201,164,92,0.25)]"
          />

          <div className="flex flex-col">
            <span className="text-sm tracking-[0.45em] text-[#c9a45c]">
              NOVARA
            </span>

            <span className="text-[10px] uppercase tracking-[0.35em] text-white/40">
              Dynamics Ecosystem
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-white/70 md:flex">
          <Link
            href="/property"
            className="transition hover:text-[#c9a45c]"
          >
            Property
          </Link>

          <Link
            href="/sales"
            className="transition hover:text-[#c9a45c]"
          >
            Sales
          </Link>

          <Link
            href="/core"
            className="transition hover:text-[#c9a45c]"
          >
            Core
          </Link>

          <Link
            href="/connexion"
            className="rounded-full border border-[#c9a45c]/60 px-5 py-3 text-[#c9a45c] transition hover:bg-[#c9a45c] hover:text-black"
          >
            Accès
          </Link>
        </nav>

      </div>
    </header>
  );
}
