"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f0e8] text-black overflow-hidden">

      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#f5f0e8] pt-28">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_16%,rgba(201,164,92,0.18),transparent_32%),linear-gradient(120deg,#f5f0e8_0%,#fffaf2_50%,#eadfce_100%)]" />

        <div className="relative mx-auto grid min-h-[760px] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[0.92fr_1.08fr]">

          <div className="z-10">

            <p className="mb-6 text-xs uppercase tracking-[0.45em] text-[#9b7b39]">
              NOVARA Habitat
            </p>

            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-0.05em] text-black md:text-7xl">
              L’habitat réinventé.{" "}
              <span className="italic text-[#9b7b39]">
                Pour vous.
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-black/62">
              NOVARA Habitat transforme chaque lieu en une expérience de vie
              intelligente, durable et sur-mesure : rénovation, aménagement,
              suivi chantier et valorisation du bien.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">

              <Link
                href="#portfolio"
                className="rounded-full bg-[#c9a45c] px-8 py-4 font-semibold text-black shadow-[0_20px_60px_rgba(201,164,92,0.25)] transition hover:bg-black hover:text-white"
              >
                Portfolio
              </Link>

              <Link
                href="#garanties"
                className="rounded-full border border-black/15 bg-white/45 px-8 py-4 font-semibold text-black transition hover:bg-black hover:text-white"
              >
                Les garanties NOVARA
              </Link>

            </div>

          </div>

          <div className="relative min-h-[560px] overflow-hidden rounded-[2.6rem] bg-white shadow-[0_35px_120px_rgba(0,0,0,.16)]">

            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center" />

            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(245,240,232,0.18),rgba(245,240,232,0.0)),radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.45),transparent_35%)]" />

          </div>

        </div>

      </section>

      {/* PORTFOLIO */}
      <section
        id="portfolio"
        className="overflow-hidden bg-[#f5f0e8] px-6 py-24 text-black"
      >

        <div className="mx-auto max-w-7xl">

          <p className="text-xs uppercase tracking-[0.35em] text-[#9b7b39]">
            Portfolio
          </p>

          <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.035em] md:text-5xl">
            Des espaces pensés pour durer, vivre et évoluer.
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">

            <PortfolioCard
              image="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop"
              title="Rénovation intérieure"
              text="Espaces lumineux, matériaux cohérents et finitions maîtrisées."
            />

            <PortfolioCard
              image="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200&auto=format&fit=crop"
              title="Aménagement premium"
              text="Confort, circulation et esthétique au service du quotidien."
              offset
            />

            <PortfolioCard
              image="https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop"
              title="Habitat valorisé"
              text="Chaque intervention prépare la valeur future du bien."
            />

          </div>

        </div>

      </section>

      {/* SIGNATURE NOVARA */}
      <section
        id="garanties"
        className="relative overflow-hidden bg-black px-6 py-32 text-white"
      >

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_48%,rgba(201,164,92,0.16),transparent_38%)]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-20 lg:grid-cols-[0.88fr_1.12fr]">

          {/* LEFT */}
          <div>

            <p className="mb-8 text-sm uppercase tracking-[0.55em] text-[#c9a45c]">
              LA SIGNATURE NOVARA
            </p>

            <h2 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-0.05em] md:text-6xl">
              Vous restez informé,
              accompagné et au
              centre de chaque
              décision.
            </h2>

            <div className="mt-8 h-[2px] w-16 bg-[#c9a45c]" />

            <p className="mt-10 max-w-xl text-lg leading-8 text-white/62">
              Un suivi humain, clair et structuré pour que chaque étape du
              chantier soit comprise, visible et maîtrisée.
            </p>

          </div>

          {/* RIGHT */}
          <div className="relative mx-auto h-[720px] w-full max-w-[720px]">

            {/* GOLD GLOW */}
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(201,164,92,0.22),transparent_55%)]" />

            {/* RINGS */}
            <div className="absolute inset-[80px] rounded-full border border-[#c9a45c]/22" />
            <div className="absolute inset-[135px] rounded-full border border-[#c9a45c]/10" />

            {/* CENTER */}
            <div className="absolute left-1/2 top-1/2 z-20 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-[2.4rem] border border-[#c9a45c]/40 bg-[#c9a45c]/10 p-10 text-center shadow-[0_0_90px_rgba(201,164,92,.18)] backdrop-blur-xl">

              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#c9a45c]/35 text-3xl text-[#c9a45c]">
                ⌂
              </div>

              <p className="text-4xl font-semibold tracking-[-0.03em]">
                Votre projet
              </p>

              <p className="mt-4 text-base leading-7 text-white/60">
                au centre du suivi{" "}
                <span className="text-[#c9a45c]">
                  NOVARA
                </span>
              </p>

            </div>

            {/* TOP */}
            <CircleNode
              className="left-1/2 top-[10px] -translate-x-1/2"
              icon="☎"
              title="Connexion client"
              text="Votre projet, notre priorité."
            />

            {/* RIGHT */}
            <CircleNode
              className="right-[30px] top-1/2 -translate-y-1/2"
              icon="◎"
              title="Interlocuteur dédié"
              text="Un contact unique à vos côtés."
            />

            {/* BOTTOM RIGHT */}
            <CircleNode
              className="bottom-[60px] right-[120px]"
              icon="▧"
              title="Photos chantier"
              text="Suivi visuel et régulier."
            />

            {/* BOTTOM LEFT */}
            <CircleNode
              className="bottom-[60px] left-[120px]"
              icon="▤"
              title="Rapport clair"
              text="Compte-rendu simple et utile."
            />

            {/* LEFT */}
            <CircleNode
              className="left-[30px] top-1/2 -translate-y-1/2"
              icon="◌"
              title="Communication"
              text="Réponses rapides et suivies."
            />

          </div>

        </div>

      </section>

      <Footer />

    </main>
  );
}

/* CARD */

function PortfolioCard({
  image,
  title,
  text,
  offset,
}: {
  image: string;
  title: string;
  text: string;
  offset?: boolean;
}) {
  return (
    <div className={offset ? "md:translate-y-12" : ""}>

      <div className="overflow-hidden rounded-[2.2rem] bg-white shadow-[0_25px_90px_rgba(0,0,0,.10)]">

        <div
          className="h-80 bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        />

        <div className="p-7">

          <p className="text-2xl font-semibold tracking-[-0.025em]">
            {title}
          </p>

          <p className="mt-3 leading-7 text-black/55">
            {text}
          </p>

        </div>

      </div>

    </div>
  );
}

/* WHEEL NODE */

function CircleNode({
  className,
  icon,
  title,
  text,
}: {
  className: string;
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div
      className={`absolute z-10 w-52 rounded-[2rem] border border-[#c9a45c]/24 bg-white/[0.04] p-6 text-center shadow-[0_0_40px_rgba(0,0,0,.28)] backdrop-blur-xl ${className}`}
    >

      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#c9a45c]/35 bg-black/30 text-2xl text-[#c9a45c]">
        {icon}
      </div>

      <p className="text-2xl font-semibold tracking-[-0.03em]">
        {title}
      </p>

      <p className="mt-3 text-base leading-7 text-white/58">
        {text}
      </p>

    </div>
  );
}
