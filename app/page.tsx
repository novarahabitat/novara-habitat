"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">

      <Header />

      {/* SIGNATURE NOVARA */}
      <section className="relative overflow-hidden bg-black px-6 pb-32 pt-28 text-white">

        {/* GOLD GLOW */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(201,164,92,0.16),transparent_32%)]" />

        <div className="relative mx-auto max-w-7xl">

          {/* HERO */}
          <div className="grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr]">

            {/* LEFT */}
            <div>

              <p className="mb-6 text-xs uppercase tracking-[0.45em] text-[#c9a45c]">
                SIGNATURE NOVARA
              </p>

              <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-0.05em] md:text-7xl">
                L’IA qui prend soin
                <br />
                de votre{" "}
                <span className="text-[#c9a45c]">
                  sérénité
                </span>
              </h1>

              <p className="mt-8 max-w-xl text-lg leading-8 text-white/70">
                NOVARA Concierge utilise l’intelligence artificielle
                pour simplifier votre quotidien, anticiper vos besoins
                et garder votre habitat sous contrôle.
              </p>

              <p className="mt-4 max-w-xl text-lg leading-8 text-white/70">
                Votre bien-être, votre tranquillité et votre sécurité
                restent la priorité absolue.
              </p>

              {/* VALUES */}
              <div className="mt-12 flex flex-wrap gap-10">

                <div className="flex flex-col items-center gap-3">
                  <div className="text-3xl text-[#c9a45c]">♡</div>
                  <p className="text-sm uppercase tracking-[0.18em] text-white/75">
                    Bien-être
                  </p>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="text-3xl text-[#c9a45c]">☼</div>
                  <p className="text-sm uppercase tracking-[0.18em] text-white/75">
                    Sérénité
                  </p>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="text-3xl text-[#c9a45c]">⌂</div>
                  <p className="text-sm uppercase tracking-[0.18em] text-white/75">
                    Sous votre contrôle
                  </p>
                </div>

              </div>

              {/* BUTTON */}
              <button className="mt-12 rounded-full border border-[#c9a45c]/40 px-8 py-4 text-sm uppercase tracking-[0.18em] text-white transition hover:bg-[#c9a45c] hover:text-black">
                Découvrir l’expérience
              </button>

            </div>

            {/* RIGHT */}
            <div className="relative min-h-[880px]">

              {/* WOMAN IMAGE */}
              <div
                className="absolute inset-0 rounded-[2.8rem] bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('/signature-novara.jpg')",
                }}
              />

              {/* DARK OVERLAY */}
              <div className="absolute inset-0 rounded-[2.8rem] bg-[linear-gradient(90deg,rgba(0,0,0,0.48),rgba(0,0,0,0.12))]" />

              {/* HOLOGRAPHIC PANEL */}
              <div className="absolute right-[-20px] top-1/2 w-[280px] -translate-y-1/2 rounded-[2rem] border border-cyan-400/25 bg-cyan-400/10 p-6 backdrop-blur-xl">

                <p className="text-lg font-medium uppercase tracking-[0.12em] text-white">
                  Votre habitat
                  <br />
                  sous contrôle
                </p>

                <div className="mt-6 space-y-4 text-sm text-white/80">

                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span>Sécurité</span>
                    <span className="text-cyan-300">
                      Tout est en ordre
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span>Énergie</span>
                    <span className="text-cyan-300">
                      Optimisée
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span>Confort</span>
                    <span className="text-cyan-300">
                      Ambiance idéale
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span>Équipements</span>
                    <span className="text-cyan-300">
                      Fonctionnels
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Accès</span>
                    <span className="text-cyan-300">
                      Contrôlés
                    </span>
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* EXPERIENCE */}
          <div className="mt-36 text-center">

            <p className="text-sm uppercase tracking-[0.35em] text-[#c9a45c]">
              Une expérience simple, intelligente et humaine
            </p>

            <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-semibold tracking-[-0.03em] md:text-6xl">
              Signature NOVARA,
              votre quotidien allégé
              en 5 étapes
            </h2>

          </div>

          {/* STEPS */}
          <div className="mt-20 grid gap-6 lg:grid-cols-5">

            {[
              {
                number: "1",
                title: "Vous nous confiez votre habitat",
                text: "Vous gardez le contrôle, nous collectons uniquement les informations essentielles à votre confort et à votre sécurité.",
                value: "TRANSPARENCE TOTALE",
              },
              {
                number: "2",
                title: "Notre IA analyse et anticipe",
                text: "Notre IA analyse vos préférences et le fonctionnement de votre habitat pour anticiper vos besoins.",
                value: "INTELLIGENCE PRÉDICTIVE",
              },
              {
                number: "3",
                title: "Votre habitat s’adapte",
                text: "Nous ajustons automatiquement les équipements et services pour votre bien-être au quotidien.",
                value: "CONFORT SUR-MESURE",
              },
              {
                number: "4",
                title: "Vous êtes informé(e) en temps réel",
                text: "Vous recevez des alertes et recommandations claires. Vous décidez, nous exécutons.",
                value: "INFORMATION CLAIRE ET UTILE",
              },
              {
                number: "5",
                title: "Tout reste sous votre contrôle",
                text: "Vous gardez la main à tout moment depuis votre espace client.",
                value: "VOUS DÉCIDEZ, NOUS AGISSONS",
              },
            ].map((card) => (

              <div
                key={card.number}
                className="group relative overflow-hidden rounded-[2rem] border border-[#c9a45c]/18 bg-white/[0.03] p-7 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-[#c9a45c]/40 hover:bg-white/[0.05]"
              >

                {/* NUMBER */}
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[#c9a45c]/35 text-xl font-semibold text-[#c9a45c]">
                  {card.number}
                </div>

                {/* TITLE */}
                <h3 className="text-2xl font-semibold leading-tight tracking-[-0.03em]">
                  {card.title}
                </h3>

                {/* TEXT */}
                <p className="mt-5 text-base leading-7 text-white/65">
                  {card.text}
                </p>

                {/* VALUE */}
                <div className="mt-8 border-t border-white/10 pt-5">

                  <p className="text-sm uppercase tracking-[0.18em] text-[#c9a45c]">
                    {card.value}
                  </p>

                </div>

              </div>

            ))}

          </div>

          {/* TRUST */}
          <div className="mt-28 rounded-[2.4rem] border border-[#c9a45c]/18 bg-white/[0.03] p-10 backdrop-blur-xl">

            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">

              <div>

                <p className="text-3xl font-semibold tracking-[-0.03em]">
                  Votre sérénité,
                  notre engagement
                </p>

                <p className="mt-6 text-lg leading-8 text-white/65">
                  Sécurité des données, confidentialité,
                  fiabilité et discrétion.
                </p>

                <p className="mt-4 text-lg leading-8 text-white/65">
                  NOVARA Concierge place votre tranquillité
                  au cœur de chaque action.
                </p>

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                {[
                  "Données sécurisées et chiffrées",
                  "Respect total de votre vie privée",
                  "IA éthique et responsable",
                  "Support humain dédié 24/7",
                ].map((item) => (

                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white/80"
                  >
                    ✓ {item}
                  </div>

                ))}

              </div>

            </div>

          </div>

          {/* FOOTER */}
          <div className="mt-24 border-t border-white/10 pt-10 text-center">

            <p className="text-lg uppercase tracking-[0.4em] text-[#c9a45c]">
              NOVARA CONCIERGE
            </p>

            <p className="mt-4 text-white/55">
              L’IA au service de votre bien-être,
              sous votre contrôle.
            </p>

          </div>

        </div>

      </section>

      <Footer />

    </main>
  );
}
