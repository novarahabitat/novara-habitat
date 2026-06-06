import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black px-6 py-16 text-center">

      <div className="mx-auto flex max-w-7xl flex-col items-center">

        <div className="flex items-center justify-center gap-6">

          <img
            src="/logos/novara-logo-noir.jpg"
            className="h-14 object-contain opacity-90 transition hover:opacity-100"
            alt="Habitat"
          />

          <img
            src="/logos/novara-studio.jpg"
            className="h-14 object-contain opacity-90 transition hover:opacity-100"
            alt="Studio"
          />

          <img
            src="/logos/novara-voltis.jpg"
            className="h-14 object-contain opacity-90 transition hover:opacity-100"
            alt="Voltis"
          />

        </div>

        <p className="mt-8 text-sm tracking-[0.45em] text-[#c9a45c]">
          NOVARA DYNAMICS
        </p>

        <p className="mt-5 max-w-3xl text-sm leading-7 text-white/45">
          Habitat · Property · SMART · Studio · Voltis · Estate · Core · Sales
        </p>

        <div className="mt-8 flex gap-8 text-xs text-white/25">
          <Link href="/core">NOVARA Core</Link>
          <Link href="/sales">NOVARA Sales</Link>
        </div>

      </div>

    </footer>
  );
}
