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

      <section className="relative min-h-screen overflow-hidden bg-[#050505] pt-28">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(201,164,92,0.18),transparent_36%),linear-gradient(120deg,#050505_0%,#090909_42%,#15110a_100%)]" />
          <div className="absolute right-0 top-0 h-full w-[58%] bg-[linear-gradient(90deg,rgba(5,5,5,0.96),rgba(5,5,5,0.35),rgba(5,5,5,0.08))]" />
        </div>

        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl items-center gap-14 px-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="mb-6 text-sm uppercase tracking-[0.45em] text-[#c9a45c]">
              NOVARA Dynamics
            </p>

            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.045em] md:text-7xl">
              Bâtir aujourd’hui l’habitat de demain.
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-white/65">
              NOVARA réunit rénovation premium, mémoire numérique du bien,
              smart habitat, énergie et intelligence opérationnelle dans un
              écosystème pensé pour durer.
            </p>

            <div className="mt-11 flex flex-wrap gap-4">
              <a
                href="#contact"
                className="rounded-full bg-[#c9a45c] px-8 py-4 font-medium text-black shadow-[0_0_45px_rgba(201,164,92,0.22)] transition hover:bg-white"
              >
                Demander un devis
              </a>

              <Link
                href="/property"
                className="rounded-full border border-white/20 px-8 py-4 font-medium text-white/90 transition hover:border-[#c9a45c] hover:text-[#c9a45c]"
              >
                Explorer Property
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-10 rounded-[3rem] bg-[#c9a45c]/10 blur-[90px]" />

            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_35px_120px_rgba(0,0,0,.65)] backdrop-blur-2xl">
              <div className="relative aspect-[1.16] overflow-hidden rounded-[2rem] border border-white/10 bg-[#111]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(201,164,92,0.25),transparent_35%),linear-gradient(135deg,#0a0a0a,#1b160d)]" />

                <div className="absolute inset-0 flex items-center justify-center p-10">
                  <img
                    src="/logos/novara-habitat.jpg"
                    alt="NOVARA Habitat"
                    className="max-h-40 w-full object-contain drop-shadow-[0_0_40px_rgba(201,164,92,0.35)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f0e8] px-6 py-20 text-black">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_1.25fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#9b7b39]">
              Property Passport
            </p>

            <h2 className="mt-4 max-w-xl text-4xl font-semibold leading-tight tracking-[-0.035em] md:text-5xl">
              La première base visible de la mémoire du bien.
            </h2>

            <p className="mt-6 max-w-xl text-base leading-7 text-black/60">
              Pièces, équipements, documents, garanties, maintenance et données
              SMART sont réunis autour d’une seule source de vérité : le bien
              immobilier.
            </p>

            <Link
              href="/property"
              className="mt-8 inline-flex rounded-full border border-black/15 px-7 py-4 font-medium text-black transition hover:bg-black hover:text-white"
            >
              Voir le passeport
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <InfoCard title="2" text="Pièces" />
            <InfoCard title="1" text="Équipement" />
            <InfoCard title="0" text="Alertes" />
            <InfoCard title="Actif" text="Synchronisé" />
          </div>
        </div>
      </section>

      <section className="bg-[#050505] px-6 py-24 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-[0.35em] text-[#c9a45c]">
            Écosystème
          </p>

          <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.035em] md:text-5xl">
            Un système complet, plusieurs expériences spécialisées.
          </h2>

          <div className="mt-12 grid gap-5 md:grid-cols-4">
            <EcoCard title="Habitat" text="Rénovation et valorisation du bien." />
            <EcoCard title="Property" text="Mémoire numérique et cycle de vie." />
            <EcoCard title="SMART" text="Maison connectée et assistance." />
            <EcoCard title="Core" text="Terrain, opérations et qualité." />
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
              <p className="mt-5 text-sm text-black/60">{formStatus}</p>
            )}
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
      <p className="text-3xl font-semibold">{title}</p>
      <p className="mt-2 text-sm text-black/50">{text}</p>
    </div>
  );
}

function EcoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
      <p className="text-xl font-semibold">{title}</p>
      <p className="mt-3 text-sm leading-6 text-white/55">{text}</p>
    </div>
  );
}
