"use client";

import React from "react";

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

      {/* ================= SIGNATURE NOVARA V12 ================= */}

      <section className="relative overflow-hidden bg-[#f6f1e8] py-24 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(185,146,82,0.14),transparent_36%),radial-gradient(circle_at_15%_10%,rgba(255,255,255,0.85),transparent_32%)]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">

          {/* LEFT */}
          <div className="max-w-xl">
            <img
              src="/images/novara-logo-transparent.png"
              alt="NOVARA Habitat"
              className="mb-12 h-20 w-auto object-contain"
            />

            <p className="mb-6 text-sm uppercase tracking-[0.35em] text-[#b99252]">
              La Signature NOVARA
            </p>

            <h2 className="text-5xl font-light leading-tight tracking-tight text-[#1f1f1f] md:text-7xl">
              Votre habitat,
              <br />
              votre{" "}
              <span className="text-[#b99252]">
                sérénité.
              </span>
            </h2>

            <div className="my-8 h-[2px] w-24 bg-[#c8a46b]" />

            <p className="text-lg leading-relaxed text-[#4d4d4d]">
              Un accompagnement humain et sur mesure pour simplifier votre
              quotidien, anticiper vos besoins et garder votre habitat sous
              contrôle.
            </p>

           <a
  href="/experience"
  className="mt-12 inline-flex rounded-full bg-[#153126] px-10 py-5 text-sm uppercase tracking-[0.22em] text-white shadow-[0_18px_45px_rgba(21,49,38,0.18)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#1d4435]"
>
  Découvrir l’expérience
</a>
          {/* RIGHT IMAGE */}
          <div className="relative">
            <div className="absolute -inset-8 rounded-[48px] bg-[#d6b06a]/20 blur-3xl" />

            <div className="relative overflow-hidden rounded-[34px] border border-white/60 bg-white/35 p-3 shadow-[0_35px_100px_rgba(30,24,12,0.22)] backdrop-blur">
              <img
                src="/images/novara-signature.jpg"
                alt="Signature NOVARA — accompagnement premium humain"
                className="aspect-[16/10] w-full rounded-[26px] object-cover"
              />
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
