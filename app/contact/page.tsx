"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f6f1e8] text-[#1f1f1f]">
      <Header />

      <section className="mx-auto max-w-5xl px-6 pb-24 pt-40 lg:px-8">
        <p className="mb-5 text-sm uppercase tracking-[0.4em] text-[#b99252]">
          Contact
        </p>

        <h1 className="text-5xl font-light leading-tight md:text-7xl">
          Parlons de votre projet.
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[#555]">
          Décrivez votre besoin, votre espace et vos priorités. NOVARA Habitat vous recontactera pour organiser la suite avec clarté et sérénité.
        </p>

        <form className="mt-14 rounded-[32px] bg-white p-8 shadow-xl md:p-10">
          <div className="grid gap-5 md:grid-cols-2">
            <input className="rounded-xl border border-black/10 px-4 py-4" placeholder="Nom complet" />
            <input className="rounded-xl border border-black/10 px-4 py-4" placeholder="Téléphone" />
          </div>

          <input className="mt-5 w-full rounded-xl border border-black/10 px-4 py-4" placeholder="Email" />

          <input className="mt-5 w-full rounded-xl border border-black/10 px-4 py-4" placeholder="Type de projet" />

          <textarea
            className="mt-5 min-h-40 w-full rounded-xl border border-black/10 px-4 py-4"
            placeholder="Votre message"
          />

          <button className="mt-8 rounded-full bg-[#153126] px-10 py-5 text-sm uppercase tracking-[0.22em] text-white">
            Envoyer la demande
          </button>
        </form>
      </section>

      <Footer />
    </main>
  );
}
