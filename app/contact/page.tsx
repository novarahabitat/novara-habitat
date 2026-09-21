import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FormulaireContact from "./FormulaireContact";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f6f1e8] text-[#1f1f1f]">
      <Header />

      <section className="mx-auto max-w-5xl px-6 pb-24 pt-36 sm:pt-40 lg:px-8">
        <p className="mb-5 text-sm uppercase tracking-[0.4em] text-[#b99252]">Contact</p>

        <h1 className="text-5xl font-light leading-tight md:text-7xl">Parlons de votre projet.</h1>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[#555]">
          Décrivez votre besoin, votre espace et vos priorités. NOVARA Habitat vous recontactera
          pour organiser la suite avec clarté et sérénité.
        </p>

        <FormulaireContact />
      </section>

      <Footer />
    </main>
  );
}
