"use client";

import Header from "@/components/Header";

export default function ExperiencePage() {
  return (
    <main className="overflow-hidden bg-[#f6f1e8] text-[#1f1f1f]">
      <Header />

      <section className="relative py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(185,146,82,0.16),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-6 text-center lg:px-8">
          <p className="mb-6 text-sm uppercase tracking-[0.4em] text-[#b99252]">
            Signature NOVARA
          </p>

          <h1 className="mx-auto max-w-5xl text-6xl font-light leading-tight md:text-8xl">
            Une nouvelle façon
            <br />
            d’habiter.
          </h1>

          <div className="mx-auto mt-10 h-[2px] w-24 bg-[#c8a46b]" />

          <p className="mx-auto mt-10 max-w-3xl text-xl leading-relaxed text-[#555]">
            NOVARA transforme la relation entre votre habitat, vos projets et
            votre quotidien. Plus simple. Plus serein. Plus humain.
          </p>
        </div>
      </section>

      <section className="pb-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="overflow-hidden rounded-[40px] shadow-[0_40px_120px_rgba(0,0,0,0.15)]">
            <img
              src="/images/novara-signature.jpg"
              alt="Expérience NOVARA Signature"
              className="w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="mb-5 text-sm uppercase tracking-[0.35em] text-[#b99252]">
            Notre philosophie
          </p>

          <h2 className="text-5xl font-light">Le client au centre.</h2>

          <p className="mt-10 text-xl leading-relaxed text-[#555]">
            Trop souvent, les travaux, l’entretien, les garanties, les documents
            et les rendez-vous deviennent une source de stress.
            <br />
            <br />
            NOVARA a été imaginé pour inverser cette logique.
            <br />
            <br />
            Vous profitez de votre habitat. Nous nous occupons du reste.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-20 text-center">
            <p className="mb-5 text-sm uppercase tracking-[0.35em] text-[#b99252]">
              L’expérience NOVARA
            </p>

            <h2 className="text-5xl font-light">Chaque détail compte.</h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {[
              {
                title: "Clarté",
                text: "Une communication simple, lisible et transparente.",
              },
              {
                title: "Paix d’esprit",
                text: "Un accompagnement rassurant, humain et structuré.",
              },
              {
                title: "Exigence premium",
                text: "Une attention portée aux détails, aux finitions et à l’expérience.",
              },
              {
                title: "Réactivité",
                text: "Un suivi clair, des réponses rapides et une présence fiable.",
              },
              {
                title: "Confiance",
                text: "Une relation durable fondée sur l’écoute et la transparence.",
              },
              {
                title: "Première classe",
                text: "Une expérience inspirée des meilleurs standards de service.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[30px] bg-white p-10 shadow-xl"
              >
                <h3 className="text-3xl font-light">{item.title}</h3>

                <p className="mt-6 leading-relaxed text-[#555]">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-20 text-center">
            <p className="mb-5 text-sm uppercase tracking-[0.35em] text-[#b99252]">
              Votre parcours
            </p>

            <h2 className="text-5xl font-light">
              Une expérience pensée de bout en bout.
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-5">
            {[
              "Découverte",
              "Étude",
              "Conception",
              "Réalisation",
              "Suivi",
            ].map((step, index) => (
              <div
                key={step}
                className="rounded-[30px] bg-white p-8 text-center shadow-lg"
              >
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#173328] text-white">
                  {index + 1}
                </div>

                <h3 className="text-xl font-light">{step}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-5xl font-light">
            Votre habitat mérite mieux.
          </h2>

          <p className="mt-8 text-xl leading-relaxed text-[#555]">
            Découvrez une expérience habitat pensée autour de vous, de votre
            confort et de votre tranquillité.
          </p>

          <a
            href="/"
            className="mt-12 inline-flex rounded-full bg-[#173328] px-10 py-5 text-sm uppercase tracking-[0.25em] text-white transition hover:bg-[#214737]"
          >
            Retour à l’accueil
          </a>
        </div>
      </section>
    </main>
  );
}
