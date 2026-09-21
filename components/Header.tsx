import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#0a0a0a]/90 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:h-24 sm:px-6">
        <Link href="/" className="flex items-center gap-3 sm:gap-4">
          <img
            src="/images/novara-logo-noir.jpg"
            alt="NOVARA Habitat"
            className="h-10 w-auto object-contain sm:h-12"
          />

          <div className="leading-tight">
            <p className="text-sm tracking-[0.42em] text-[#c9a45c]">NOVARA</p>
            <p className="text-[11px] uppercase tracking-[0.35em] text-white/55">HABITAT</p>
          </div>
        </Link>

        <Link
          href="/contact"
          className="rounded-full border border-[#c9a45c]/50 px-5 py-2.5 text-sm font-medium text-[#c9a45c] transition-all duration-300 hover:bg-[#c9a45c] hover:text-black hover:shadow-[0_0_25px_rgba(201,164,92,0.35)] sm:px-7 sm:py-3"
        >
          Contact
        </Link>
      </div>
    </header>
  );
}
