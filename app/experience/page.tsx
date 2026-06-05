"use client";

export default function ExperiencePage() {
  return (
    <main className="min-h-screen bg-[#f6f1e8] text-[#1f1f1f]">

      <section className="relative py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="text-center">

            <p className="mb-6 text-sm uppercase tracking-[0.4em] text-[#b99252]">
              Signature NOVARA
            </p>

            <h1 className="mx-auto max-w-5xl text-6xl font-light leading-tight md:text-8xl">
              Une nouvelle façon
              <br />
              d'habiter.
            </h1>

            <div className="mx-auto mt-10 h-[2px] w-24 bg-[#c8a46b]" />

            <p className="mx-auto mt-10 max-w-3xl text-xl leading-relaxed text-[#555]">
              NOVARA transforme la relation entre votre habitat,
              vos projets et votre quotidien.
              Plus simple.
              Plus serein.
              Plus humain.
            </p>

          </div>

        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="overflow-hidden rounded-[40px] shadow-2xl">
            <img
              src="/images/novara-signature.jpg"
              alt="NOVARA Signature"
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

          <h2 className="text-5xl font-light">
            Le client au centre.
          </h2>

          <p className="mt-10 text-xl leading-relaxed text-[#555]">
            Trop souvent, les travaux, l'entretien,
            les garanties et les démarches deviennent
            une source de stress.

            <br />
            <br />

            NOVARA a été imaginé pour simplifier votre quotidien
            et vous offrir une expérience plus sereine.

            <br />
            <br />

            Vous profitez de votre habitat.
            Nous nous occupons du reste.
          </p>

        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="mb-20 text-center">

            <p className="mb-5 text-sm uppercase tracking-[0.35em] text-[#b99252]">
              L'expérience NOVARA
            </p>

            <h2 className="text-5xl font-light">
              Chaque détail compte.
            </h2>

          </div>

          <div className="grid gap-8 lg:grid-cols-3">

            {[
              {
                title: "Clarté",
                text: "Une communication simple et transparente."
              },
              {
                title: "Sérénité",
                text: "Un accompagnement rassurant à chaque étape."
              },
              {
                title: "Excellence",
                text: "Une exigence permanente dans chaque détail."
              },
              {
                title: "Réactivité",
                text: "Des réponses rapides et un suivi constant."
              },
              {
                title: "Confiance",
                text: "Une relation durable fondée sur l'écoute."
              },
              {
                title: "Premium",
                text: "Une expérience inspirée des meilleurs standards de service."
              }
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[30px] bg-white p-10 shadow-xl"
              >
                <h3 className="text-3xl font-light">
                  {item.title}
                </h3>

                <p className="mt-6 leading-relaxed text-[#555]">
                  {item.text}
                </p>
              </div>
            ))}

          </div>

        </div>
      </section>

    </main>
  );
}
