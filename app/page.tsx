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
    <main className="min-h-screen bg-[#050505] text-white">
      <Header />

      <section className="relative overflow-hidden bg-[#050505] pt-28">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(201,164,92,0.14),transparent_32%),linear-gradient(120deg,#050505_0%,#070707_48%,#14100a_100%)]" />

        <div className="relative mx-auto grid min-h-[760px] max-w-7xl items-center gap-0 px-6 lg:grid-cols-[0.78fr_1.22fr]">

          <div className="relative z-10 py-20">

            <p className="mb-6 text-xs uppercase tracking-[0.48em] text-[#c9a45c]">
              NOVARA Dynamics
            </p>

            <h1 className="max-w-2xl text-5xl font-semibold leading-[1.02] tracking-[-0.05em] md:text-7xl">
              Bâtir aujourd’hui{" "}
              <span className="text-[#c9a45c]">
                l’habitat de demain.
              </span>
            </h1>

            <p className="mt-8 max-w-lg text-lg leading-8 text-white/62">
              Innovation, durabilité et excellence réunies dans l’écosystème
              NOVARA : rénovation premium, mémoire numérique du bien et smart
              habitat nouvelle génération.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">

              <a
                href="#contact"
                className="rounded-full bg-[#c9a45c] px-8 py-4 font-semibold text-black shadow-[0_0_40px_rgba(201,164,92,0.22)] transition hover:bg-white"
              >
                Demander un devis
              </a>

              <Link
                href="/property"
                className="rounded-full border border-white/15 px-8 py-4 font-semibold text-white/90 transition hover:border-[#c9a45c] hover:text-[#c9a45c]"
              >
                Explorer
              </Link>

            </div>

          </div>

          <div className="relative h-full min-h-[760px] overflow-hidden">

            <div className="absolute inset-0 rounded-tl-[3rem] bg-[linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.35)),url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center" />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(201,164,92,0.18),transparent_35%)]" />

          </div>

        </div>

        <div className="relative bg-[#f5f0e8] px-6 py-14 text-black">

          <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_1.25fr]">

            <div>

              <p className="text-xs uppercase tracking-[0.35em] text-[#9b7b39]">
                Property Passport
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] md:text-4xl">
                Maison Test NOVARA
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-black/58">
                La première base visible de la mémoire numérique du bien :
                pièces, équipements, garanties, documents, maintenance et
                données SMART réunis autour d’une seule source de vérité.
              </p>

              <Link
                href="/property"
                className="mt-6 inline-flex text-sm font-semibold text-[#9b7b39]"
              >
                Voir le passeport →
              </Link>

            </div>

            <div className="grid gap-4 sm:grid-cols-4">

              <InfoCard title="2" text="Pièces" />

              <InfoCard title="1" text="Équipement" />

              <InfoCard title="0" text="Alertes" />

              <InfoCard title="●" text="Synchronisé" />

            </div>

          </div>

        </div>

      </section>

      <section className="bg-[#050505] px-6 py-24 text-white">

        <div className="mx-auto max-w-7xl">

          <p className="text-xs uppercase tracking-[0.35em] text-[#c9a45c]">
            Écosystème
          </p>

          <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.035em] md:text-5xl">
            Une architecture unique, plusieurs expériences spécialisées.
          </h2>

          <div className="mt-12 grid gap-5 md:grid-cols-4">

            <EcoCard
              title="Habitat"
              text="Rénovation et valorisation du bien."
            />

            <EcoCard
              title="Property"
              text="Mémoire numérique du bien."
            />

            <EcoCard
              title="SMART"
              text="Maison connectée et assistance."
            />

            <EcoCard
              title="Core"
              text="Terrain, qualité et opérations."
            />

          </div>

        </div>

      </section>

      <section
        id="contact"
        className="relative overflow-hidden bg-[#f5f0e8] px-6 py-28 text-black"
      >

        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-[#c9a45c]/18 blur-[120px]" />

        <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1fr_520px]">

          <div>

            <p className="text-sm uppercase tracking-[0.35em] text-[#9b7b39]">
              Contact
            </p>

            <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.035em] md:text-6xl">
              Donnez à votre projet une trajectoire plus intelligente.
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
              <p className="mt-5 text-sm text-black/60">
                {formStatus}
              </p>
            )}

          </form>

        </div>

      </section>

      <Footer />

    </main>
  );
}

function InfoCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl bg-white/70 p-6 text-center shadow-sm backdrop-blur-xl">

      <p className="text-3xl font-semibold">
        {title}
      </p>

      <p className="mt-2 text-sm text-black/50">
        {text}
      </p>

    </div>
  );
}

function EcoCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 transition hover:border-[#c9a45c]/35 hover:bg-white/[0.07]">

      <p className="text-xl font-semibold">
        {title}
      </p>

      <p className="mt-3 text-sm leading-6 text-white/55">
        {text}
      </p>

    </div>
  );
}
