"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

export default function Home() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [projectType, setProjectType] = useState("");
  const [budget, setBudget] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");
  const [formStatus, setFormStatus] = useState("");

  async function submitLead(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormStatus("Envoi...");

    const { error } = await supabase.from("leads").insert({
      full_name: fullName,
      email,
      phone,
      project_type: projectType,
      budget,
      city,
      message,
      status: "new",
    });

    if (error) {
      setFormStatus("Erreur : " + error.message);
      return;
    }

    setFullName("");
    setEmail("");
    setPhone("");
    setProjectType("");
    setBudget("");
    setCity("");
    setMessage("");
    setFormStatus("Demande envoyée.");
  }

  return (
    <main className="min-h-screen bg-[#f5f0e8] text-black">
      <Header />

      <section className="relative overflow-hidden bg-[#f5f0e8] pt-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_16%,rgba(201,164,92,0.18),transparent_32%),linear-gradient(120deg,#f5f0e8_0%,#fffaf2_50%,#eadfce_100%)]" />

        <div className="relative mx-auto grid min-h-[760px] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="z-10">
            <p className="mb-6 text-xs uppercase tracking-[0.45em] text-[#9b7b39]">
              NOVARA Habitat
            </p>

            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-0.05em] text-black md:text-7xl">
              L’habitat réinventé.{" "}
              <span className="italic text-[#9b7b39]">Pour vous.</span>
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

      <section id="portfolio" className="overflow-hidden bg-[#f5f0e8] px-6 py-24 text-black">
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
              text="Espaces lumineux, matériaux cohérents, finitions maîtrisées."
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

      <section id="garanties" className="bg-[#050505] px-6 py-24 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-[0.35em] text-[#c9a45c]">
            Signature NOVARA
          </p>

          <h2 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight tracking-[-0.035em] md:text-5xl">
            Rénovation premium, technologie utile et expérience client claire.
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/55">
            Une approche pensée pour rassurer, organiser et valoriser votre
            projet avec un niveau d’exigence constant.
          </p>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <DarkCard
              title="Rénover"
              text="Concevoir et exécuter des travaux propres, suivis et valorisants."
            />
            <DarkCard
              title="Aménager"
              text="Créer des espaces cohérents, fonctionnels et élégants."
            />
            <DarkCard
              title="Valoriser"
              text="Préserver la qualité du bien et préparer son évolution."
            />
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="relative overflow-hidden bg-[#f5f0e8] px-6 py-28 text-black"
      >
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-[#c9a45c]/20 blur-[120px]" />

        <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1fr_520px]">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#9b7b39]">
              Contact
            </p>

            <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.035em] md:text-6xl">
              Parlez-nous de votre projet.
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-black/60">
              Votre demande est transmise à NOVARA Sales pour être suivie comme
              un vrai projet : qualification, rendez-vous, devis, dossier client
              et accompagnement.
            </p>
          </div>

          <form
            onSubmit={submitLead}
            className="rounded-[2rem] border border-black/10 bg-white p-8 shadow-[0_25px_80px_rgba(0,0,0,.08)]"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <input
                className="rounded-2xl border border-black/10 px-4 py-4"
                placeholder="Nom complet"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />

              <input
                className="rounded-2xl border border-black/10 px-4 py-4"
                placeholder="Téléphone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <input
              className="mt-4 w-full rounded-2xl border border-black/10 px-4 py-4"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <input
                className="rounded-2xl border border-black/10 px-4 py-4"
                placeholder="Type de projet"
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
              />

              <input
                className="rounded-2xl border border-black/10 px-4 py-4"
                placeholder="Budget estimé"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>

            <input
              className="mt-4 w-full rounded-2xl border border-black/10 px-4 py-4"
              placeholder="Ville"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />

            <textarea
              className="mt-4 min-h-36 w-full rounded-2xl border border-black/10 px-4 py-4"
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />

            <button className="mt-6 rounded-full bg-black px-8 py-4 font-medium text-white transition hover:bg-[#c9a45c] hover:text-black">
              Envoyer la demande
            </button>

            {formStatus && (
              <p className="mt-5 text-sm text-black/60">{formStatus}</p>
            )}
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}

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
          <p className="text-2xl font-semibold tracking-[-0.025em]">{title}</p>
          <p className="mt-3 leading-7 text-black/55">{text}</p>
        </div>
      </div>
    </div>
  );
}

function DarkCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-8 shadow-[0_20px_80px_rgba(0,0,0,.25)]">
      <div className="mb-8 h-10 w-10 rounded-2xl border border-[#c9a45c]/35 bg-[#c9a45c]/10" />
      <p className="text-2xl font-semibold">{title}</p>
      <p className="mt-4 leading-7 text-white/55">{text}</p>
    </div>
  );
}
