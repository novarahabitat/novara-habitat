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

      <section className="hero relative flex min-h-screen items-center overflow-hidden px-6 pt-32">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute left-[8%] top-[22%] h-72 w-72 rounded-full bg-[#c9a45c]/10 blur-[120px]" />
          <div className="absolute right-[10%] top-[18%] h-96 w-96 rounded-full bg-[#c9a45c]/15 blur-[150px]" />
          <div className="absolute bottom-[5%] left-[35%] h-80 w-80 rounded-full bg-white/5 blur-[130px]" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="mb-6 text-sm uppercase tracking-[0.48em] text-[#c9a45c]">
              NOVARA Habitat
            </p>

            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.045em] md:text-7xl">
              Le nouveau langage premium de l’habitat.
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-white/65">
              Rénovation, mémoire numérique du bien, smart habitat, suivi
              chantier et écosystème NOVARA Dynamics réunis dans une expérience
              simple, fluide et émotionnelle.
            </p>

            <div className="mt-11 flex flex-wrap gap-4">
              <a
                href="#contact"
                className="rounded-full bg-[#c9a45c] px-8 py-4 font-medium text-black shadow-[0_0_45px_rgba(201,164,92,0.28)] transition hover:bg-white"
              >
                Demander un devis
              </a>

              <Link
                href="/property"
                className="rounded-full border border-white/20 px-8 py-4 font-medium text-white/90 transition hover:border-[#c9a45c] hover:text-[#c9a45c]"
              >
                Voir Property Passport
              </Link>
            </div>

            <div className="mt-14 grid max-w-2xl gap-4 sm:grid-cols-3">
              <MiniStat title="Property" text="Mémoire du bien" />
              <MiniStat title="SMART" text="Maison connectée" />
              <MiniStat title="Core" text="Suivi chantier" />
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 rounded-[3rem] bg-[#c9a45c]/10 blur-[80px]" />

            <div className="relative rounded-[2.6rem] border border-[#c9a45c]/20 bg-white/[0.045] p-7 shadow-[0_30px_120px_rgba(0,0,0,.55)] backdrop-blur-2xl">
              <div className="rounded-[2rem] border border-white/10 bg-black/45 p-8">
                <div className="flex justify-center">
                  <img
                    src="/logos/novara-habitat.jpg"
                    className="h-44 w-full max-w-[340px] object-contain drop-shadow-[0_0_45px_rgba(201,164,92,0.32)]"
                    alt="NOVARA Habitat"
                  />
                </div>

                <div className="mt-10 rounded-[1.8rem] border border-white/10 bg-white/[0.06] p-6">
                  <p className="text-sm text-white/45">Property Passport</p>
                  <p className="mt-2 text-2xl font-semibold">
                    Maison Test NOVARA
                  </p>
                  <p className="mt-3 text-sm leading-6 text-white/50">
                    La première base visible de la mémoire numérique du bien :
                    pièces, équipements, documents, garanties et maintenance.
                  </p>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  <SmallCard number="2" label="Pièces" />
                  <SmallCard number="1" label="Équipement" />
                  <SmallCard number="0" label="Alertes" />
                </div>
              </div>
            </div>
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
              <p className="mt-5 text-sm text-black/60">{formStatus}</p>
            )}
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function MiniStat({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 backdrop-blur-xl">
      <p className="text-sm font-medium text-white">{title}</p>
      <p className="mt-1 text-xs text-white/45">{text}</p>
    </div>
  );
}

function SmallCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/35 p-4 text-center">
      <p className="text-2xl font-semibold">{number}</p>
      <p className="mt-1 text-xs text-white/45">{label}</p>
    </div>
  );
}
