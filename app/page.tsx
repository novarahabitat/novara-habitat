"use client";

export default function Home() {
  return (
    <main className="overflow-hidden bg-white text-[#1a1a1a]">

      {/* ================= HERO ================= */}

      <section className="relative min-h-screen overflow-hidden bg-[#f5f1e8]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.08),transparent_40%)]" />

        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 py-24 lg:px-8">
          <div className="grid items-center gap-20 lg:grid-cols-2">

            {/* LEFT */}
            <div>
              <p className="mb-6 text-sm uppercase tracking-[0.4em] text-[#b99252]">
                NOVARA Habitat
              </p>

              <h1 className="max-w-2xl text-6xl font-light leading-tight tracking-tight text-[#1a1a1a] md:text-7xl">
                L’habitat réinventé.
                <br />
                <span className="text-[#b99252]">
                  Pour vous.
                </span>
              </h1>

              <p className="mt-8 max-w-xl text-lg leading-relaxed text-[#4b4b4b]">
                Une expérience premium pensée autour du confort,
                de la sérénité et d’un accompagnement haut de gamme.
              </p>

              <div className="mt-12 flex flex-wrap gap-5">
                <button className="rounded-full bg-[#173328] px-8 py-4 text-sm uppercase tracking-[0.2em] text-white transition hover:bg-[#214737]">
                  Portfolio
                </button>

                <button className="rounded-full border border-[#c8a46b] px-8 py-4 text-sm uppercase tracking-[0.2em] text-[#1a1a1a] transition hover:bg-[#c8a46b]/10">
                  Les garanties NOVARA
                </button>
              </div>
            </div>

            {/* RIGHT */}
            <div className="relative">
              <div className="absolute inset-0 rounded-[40px] bg-[#d6b06a]/10 blur-3xl" />

              <div className="relative overflow-hidden rounded-[40px] shadow-2xl">
                <img
                  src="/images/hero-house.jpg"
                  alt="Maison premium NOVARA"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PORTFOLIO ================= */}

      <section className="bg-white py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="mb-20 text-center">
            <p className="mb-5 text-sm uppercase tracking-[0.4em] text-[#b99252]">
              Portfolio
            </p>

            <h2 className="text-5xl font-light text-[#1f1f1f]">
              Des espaces pensés
              <br />
              pour durer.
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">

            {[
              {
                title: "Rénovation intérieure",
                image: "/images/portfolio-1.jpg",
              },
              {
                title: "Aménagement premium",
                image: "/images/portfolio-2.jpg",
              },
              {
                title: "Habitat valorisé",
                image: "/images/portfolio-3.jpg",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group overflow-hidden rounded-[30px] bg-white shadow-xl transition duration-500 hover:-translate-y-2"
              >
                <div className="overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-[500px] w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-light text-[#1f1f1f]">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================= SIGNATURE NOVARA ========================= */}

      <section className="relative overflow-hidden bg-[#f6f1e8] py-24">

        <div className="absolute inset-0 opacity-40">
          <div className="absolute left-[-200px] top-[-200px] h-[500px] w-[500px] rounded-full bg-[#d6b06a]/20 blur-3xl" />
          <div className="absolute bottom-[-200px] right-[-200px] h-[500px] w-[500px] rounded-full bg-[#d6b06a]/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">

          {/* TOP */}
          <div className="grid items-center gap-16 lg:grid-cols-2">

            {/* LEFT */}
            <div>

              <img
                src="/images/novara-logo-transparent.png"
                alt="NOVARA Habitat"
                className="mb-10 h-20 w-auto"
              />

              <p className="mb-6 text-sm uppercase tracking-[0.35em] text-[#b99252]">
                Signature NOVARA
              </p>

              <h2 className="max-w-xl text-5xl font-light leading-tight tracking-tight text-[#1f1f1f] md:text-7xl">
                Votre habitat,
                <br />
                votre{" "}
                <span className="text-[#b99252]">
                  sérénité.
                </span>
              </h2>

              <div className="my-8 h-[2px] w-24 bg-[#c8a46b]" />

              <p className="max-w-xl text-lg leading-relaxed text-[#4d4d4d]">
                Un accompagnement humain et sur mesure pour simplifier votre
                quotidien, anticiper vos besoins et garder votre habitat sous
                contrôle.
              </p>

              {/* VALUES */}
              <div className="mt-12 flex flex-wrap gap-10">

                <div className="flex flex-col items-center">
                  <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full border border-[#c8a46b]/40 bg-white/70 backdrop-blur">
                    ✦
                  </div>

                  <span className="text-sm text-[#1f1f1f]">
                    Bien-être
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full border border-[#c8a46b]/40 bg-white/70 backdrop-blur">
                    ✦
                  </div>

                  <span className="text-sm text-[#1f1f1f]">
                    Sérénité
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full border border-[#c8a46b]/40 bg-white/70 backdrop-blur">
                    ✦
                  </div>

                  <span className="text-sm text-[#1f1f1f]">
                    Sous votre contrôle
                  </span>
                </div>
              </div>

              <button className="mt-12 rounded-full bg-[#153126] px-10 py-5 text-sm uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-[#1d4435]">
                Découvrir l’expérience
              </button>
            </div>

            {/* RIGHT */}
            <div className="relative">

              <div className="absolute inset-0 rounded-[40px] bg-[#d6b06a]/10 blur-3xl" />

              <div className="relative overflow-hidden rounded-[40px] border border-white/20 shadow-2xl">
                <img
                  src="/images/novara-signature.jpg"
                  alt="NOVARA Signature"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="absolute left-[-40px] top-12 hidden w-64 rounded-3xl border border-white/20 bg-black/40 p-6 text-white backdrop-blur-xl lg:block">
                <p className="text-xs uppercase tracking-[0.2em] text-[#d6b06a]">
                  Votre habitat
                </p>

                <p className="mt-2 text-sm text-white/80">
                  Entre de bonnes mains
                </p>
              </div>

              <div className="absolute bottom-10 right-[-30px] hidden w-64 rounded-3xl border border-white/20 bg-black/40 p-6 text-white backdrop-blur-xl lg:block">

                <p className="text-xs uppercase tracking-[0.2em] text-[#d6b06a]">
                  Accompagnement premium
                </p>

                <ul className="mt-4 space-y-3 text-sm text-white/80">
                  <li>• Écoute</li>
                  <li>• Réactivité</li>
                  <li>• Exigence</li>
                  <li>• Suivi personnalisé</li>
                </ul>
              </div>
            </div>
          </div>

          {/* STEPS */}

          <div className="mt-28 grid gap-8 lg:grid-cols-5">

            {[
              {
                number: "1",
                title: "Vous nous confiez votre habitat",
                text: "Vous gardez le contrôle, nous collectons uniquement les informations essentielles à votre confort et à votre sécurité.",
                image: "/images/signature-step-1.jpg",
              },
              {
                number: "2",
                title: "Nous comprenons et anticipons",
                text: "Nous comprenons vos besoins et les spécificités de votre habitat pour mieux anticiper.",
                image: "/images/signature-step-2.jpg",
              },
              {
                number: "3",
                title: "Votre habitat s’adapte",
                text: "Nous coordonnons les meilleures solutions et les meilleurs services pour votre confort quotidien.",
                image: "/images/signature-step-3.jpg",
              },
              {
                number: "4",
                title: "Vous êtes informé(e) en temps réel",
                text: "Vous recevez des informations claires et utiles. Nous vous tenons informé, vous décidez.",
                image: "/images/signature-step-4.jpg",
              },
              {
                number: "5",
                title: "Tout reste sous votre contrôle",
                text: "Vous gardez la main à tout moment depuis votre espace client. Nous sommes là pour vous.",
                image: "/images/signature-step-5.jpg",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="group overflow-hidden rounded-[30px] border border-[#d9c7aa] bg-white/70 shadow-lg backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="flex items-center justify-between px-6 pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#173328] text-lg font-semibold text-white">
                    {step.number}
                  </div>
                </div>

                <div className="px-6 pt-6">
                  <h3 className="min-h-[90px] text-2xl font-light leading-snug text-[#1f1f1f]">
                    {step.title}
                  </h3>

                  <p className="mt-4 text-sm leading-relaxed text-[#555]">
                    {step.text}
                  </p>
                </div>

                <div className="mt-8 overflow-hidden">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* BOTTOM */}

          <div className="mt-24 border-t border-[#d8c3a1] pt-14">

            <div className="flex flex-col items-center justify-between gap-10 lg:flex-row">

              <div>
                <h3 className="text-4xl font-light text-[#1f1f1f]">
                  Votre sérénité,
                  <br />
                  notre engagement.
                </h3>

                <div className="mt-6 h-[2px] w-24 bg-[#c8a46b]" />
              </div>

              <div className="grid grid-cols-2 gap-8 md:grid-cols-5">

                {[
                  "Sécurité & confidentialité",
                  "Respect de votre vie privée",
                  "Service humain et réactif",
                  "Fiabilité & exigence",
                  "Écoute & proximité",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#173328] text-white shadow-lg">
                      ✦
                    </div>

                    <p className="max-w-[120px] text-sm text-[#2a2a2a]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}

      <footer className="bg-black py-12 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 lg:flex-row lg:px-8">

          <img
            src="/images/novara-logo-transparent.png"
            alt="NOVARA Habitat"
            className="h-14 w-auto"
          />

          <p className="text-sm tracking-[0.2em] text-white/60">
            NOVARA Dynamics
          </p>
        </div>
      </footer>

    </main>
  );
}
