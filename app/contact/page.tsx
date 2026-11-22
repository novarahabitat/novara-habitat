import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FormulaireContact from "./FormulaireContact";
import "../site.css";

export const metadata: Metadata = {
  title: "Contact et devis gratuit — rénovation à Saint-Malo",
  description:
    "Demandez un devis gratuit pour vos travaux de rénovation à Saint-Malo et alentours : salle de bain, cuisine, rénovation complète, aménagements.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="site">
      <Header />

      <section className="page-haut">
        <div className="wrap etroit">
          <h1>Parlons de votre projet</h1>
          <p className="intro">
            Décrivez votre pièce et ce que vous aimeriez changer. Je vous recontacte pour fixer une
            visite chez vous. Le devis est gratuit.
          </p>
          <FormulaireContact />
          <p className="legende" style={{ marginTop: 24, marginBottom: 96 }}>
            Vous préférez écrire directement ?{" "}
            <a href="mailto:contact@novarahabitat.fr">contact@novarahabitat.fr</a>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
