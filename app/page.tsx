import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import Realisations from "@/components/Realisations";
import { comparaisons, DOSSIER_REALISATIONS } from "@/lib/realisations";
import FicheEntreprise from "@/components/FicheEntreprise";
import { SERVICES, ZONE_PRINCIPALE } from "@/lib/site";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return (
    <main className="overflow-hidden bg-white text-[#1a1a1a]">
      <FicheEntreprise />
      <Header />

      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden bg-[#f5f1e8]">
        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 py-24 lg:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="mb-6 text-sm uppercase tracking-[0.4em] text-[#b99252]">
                NOVARA Habitat · Rénovation à Saint-Malo
              </p>

              <h1 className="max-w-2xl text-5xl font-light leading-tight tracking-tight md:text-7xl">
                La rénovation réinventée.
                <br />
                <span className="text-[#b99252]">Pour vous.</span>
              </h1>

              <p className="mt-8 max-w-xl text-lg leading-relaxed text-[#4b4b4b]">
                Rénovation intérieure à Saint-Malo et alentours : salles de
                bain, cuisines, rénovation complète et aménagements sur mesure.
                Une expérience pensée autour de votre confort et de votre
                sérénité.
              </p>

              <div className="mt-12 flex flex-wrap gap-5">
                <a
                  href="#portfolio"
                  className="rounded-full bg-[#173328] px-8 py-4 text-sm uppercase tracking-[0.2em] text-white transition hover:bg-[#214737]"
                >
                  Portfolio
                </a>

                <a
                  href="/contact"
                  className="rounded-full border border-[#c8a46b] px-8 py-4 text-sm uppercase tracking-[0.2em] text-[#1a1a1a] transition hover:bg-[#c8a46b]/10"
                >
                  Prendre contact
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 rounded-[40px] bg-[#d6b06a]/10 blur-3xl" />

              <div className="relative overflow-hidden rounded-[36px] shadow-2xl">
                <img
                  src="/images/hero-house.jpg"
                  alt="Maison premium NOVARA"
                  className="max-h-[420px] w-full object-cover md:max-h-[650px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="bg-white py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="mb-5 text-sm uppercase tracking-[0.4em] text-[#b99252]">
              Nos services
            </p>
            <h2 className="text-5xl font-light text-[#1f1f1f]">
              Rénovation intérieure
              <br />
              à Saint-Malo et alentours
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <div key={s.titre} className="rounded-[24px] border border-black/[0.06] bg-[#f6f1e8] p-8">
                <h3 className="text-xl font-light text-[#1f1f1f]">{s.titre}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#5c5a55]">{s.texte}</p>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-14 max-w-3xl text-center text-[15px] leading-relaxed text-[#5c5a55]">
            Nous intervenons à {ZONE_PRINCIPALE.join(", ")} et dans toutes les communes
            à moins de 35 km de Saint-Malo.
            Devis gratuit, un seul interlocuteur du premier rendez-vous à la fin du chantier.
          </p>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section id="portfolio" className="bg-white py-28">
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
            {comparaisons.map((c) => (
              <BeforeAfterSlider
                key={c.titre}
                title={c.titre}
                description={c.texte}
                beforeImage={DOSSIER_REALISATIONS + c.avant}
                afterImage={DOSSIER_REALISATIONS + c.apres}
                beforeLabel={c.etiquetteAvant}
                afterLabel={c.etiquetteApres}
              />
            ))}
          </div>
        </div>
      </section>

      {/* RÉALISATIONS */}
      <section id="realisations" className="bg-[#f6f1e8] py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="mb-5 text-sm uppercase tracking-[0.4em] text-[#b99252]">
              Nos réalisations
            </p>
            <h2 className="text-5xl font-light text-[#1f1f1f]">Chantiers réalisés</h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#5c5a55]">
              Cuisines, salles de bain, aménagements : quelques chantiers menés de A à Z.
              Cliquez sur une photo pour l&apos;agrandir.
            </p>
          </div>

          <Realisations />

          <div className="mt-16 text-center">
            <a
              href="/contact"
              className="inline-flex rounded-full bg-[#153126] px-10 py-5 text-sm uppercase tracking-[0.22em] text-white transition hover:bg-[#1d4435]"
            >
              Parlez-nous de votre projet
            </a>
          </div>
        </div>
      </section>

      {/* SIGNATURE NOVARA */}
      <section
        id="signature"
        className="relative overflow-hidden bg-[#f6f1e8] py-24 lg:py-32"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(185,146,82,0.14),transparent_36%),radial-gradient(circle_at_15%_10%,rgba(255,255,255,0.85),transparent_32%)]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
          <div className="max-w-xl">
            <img
              src="/images/novara-logo-blanc.png"
              alt="NOVARA Habitat"
              className="mb-12 h-20 w-auto object-contain"
            />

            <p className="mb-6 text-sm uppercase tracking-[0.35em] text-[#b99252]">
              Signature NOVARA
            </p>

            <h2 className="text-5xl font-light leading-tight tracking-tight text-[#1f1f1f] md:text-7xl">
              Votre habitat,
              <br />
              votre <span className="text-[#b99252]">sérénité.</span>
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
          </div>

          <div className="relative">
            <div className="absolute -inset-10 rounded-[60px] bg-[#d6b06a]/25 blur-3xl" />

            <img
              src="/images/novara-signature.jpg"
              alt="Signature NOVARA"
              className="relative w-full rounded-[30px] shadow-[0_35px_100px_rgba(30,24,12,0.28)]"
            />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
