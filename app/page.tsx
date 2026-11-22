import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import Realisations from "@/components/Realisations";
import FicheEntreprise from "@/components/FicheEntreprise";
import { comparaisons, DOSSIER_REALISATIONS } from "@/lib/realisations";
import { SERVICES, ZONE_PRINCIPALE } from "@/lib/site";
import "./site.css";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const ETAPES = [
  {
    titre: "Visite chez vous",
    texte: "On regarde ensemble la pièce, vos envies et votre budget. Je prends toutes les mesures.",
  },
  {
    titre: "Image et devis",
    texte:
      "Vous recevez une image de votre future pièce et un devis détaillé. On ajuste jusqu'à ce que ce soit exactement ce que vous voulez.",
  },
  {
    titre: "Les travaux",
    texte:
      "Points fréquents, horaires tenus, meubles et sols protégés, chantier nettoyé. Vous changez d'avis ? Je vous propose des solutions.",
  },
  {
    titre: "Visite de fin",
    texte: "Je repasse après les travaux pour vérifier avec vous que tout est conforme à votre demande.",
  },
];

export default function Home() {
  // La cheminée (image du projet → réalisé) est en haut de page ; les autres plus bas.
  const cheminee = comparaisons.find((c) => c.avant.startsWith("cheminee"));
  const autres = comparaisons.filter((c) => c !== cheminee);

  return (
    <main className="site">
      <FicheEntreprise />
      <Header />

      <section className="hero">
        <div className="wrap">
          <div>
            <h1>Une nouvelle façon de rénover</h1>
            <p className="chapo">
              Votre maison, c&apos;est votre foyer. On prépare votre projet ensemble, sans
              précipitation, et vous voyez votre future pièce en image avant le début des travaux.
              Vous savez à quoi vous attendre, et rien ne se décide sans vous.
            </p>
            <div className="actions">
              <Link className="btn" href="/contact">
                Demander un devis gratuit
              </Link>
              <a className="btn clair" href="#chantiers">
                Voir les chantiers
              </a>
            </div>
            <p className="preuve">
              Rénovation intérieure à Saint-Malo et alentours : salles de bain, cuisines,
              aménagements sur mesure. Un seul interlocuteur, des nouvelles fréquentes, un travail
              soigné et fait comme vous l&apos;avez voulu.
            </p>
          </div>
          {cheminee && (
            <div>
              <BeforeAfterSlider
                title="Cheminée"
                beforeImage={DOSSIER_REALISATIONS + cheminee.avant}
                afterImage={DOSSIER_REALISATIONS + cheminee.apres}
                beforeLabel="Image du projet"
                afterLabel="Réalisé"
              />
              <p className="legende">
                Faites glisser : l&apos;image validée par le client, puis la cheminée terminée.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="bloc methode" id="methode">
        <div className="wrap">
          <h2>Comment se passe votre chantier</h2>
          <p className="intro">
            Je travaille seul sur mes chantiers. Vous savez toujours qui est chez vous et où en sont
            les travaux.
          </p>
          <ol className="etapes">
            {ETAPES.map((e, i) => (
              <li key={e.titre}>
                <div className="n">{i + 1}</div>
                <h3>{e.titre}</h3>
                <p>{e.texte}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bloc" id="avant-apres">
        <div className="wrap">
          <h2>Avant, après</h2>
          <div className="duo">
            {autres.map((c) => (
              <div key={c.titre}>
                <BeforeAfterSlider
                  title={c.titre}
                  beforeImage={DOSSIER_REALISATIONS + c.avant}
                  afterImage={DOSSIER_REALISATIONS + c.apres}
                  beforeLabel={c.etiquetteAvant}
                  afterLabel={c.etiquetteApres}
                />
                <h3>{c.titre}</h3>
                <p>{c.texte}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bloc" id="chantiers" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <h2>Chantiers réalisés</h2>
          <p className="intro">Cliquez sur une photo pour l&apos;agrandir.</p>
          <Realisations />
        </div>
      </section>

      {/* Études de cas : section prête, affichée quand les textes seront fournis. */}

      <section className="bloc services" id="services">
        <div className="wrap">
          <h2>Ce que je fais pour vous</h2>
          <div className="liste-services">
            {SERVICES.map((s) => (
              <div key={s.titre}>
                <h3>{s.titre}</h3>
                <p>{s.texte}</p>
              </div>
            ))}
          </div>
          <p className="zone">
            <strong>Où j&apos;interviens :</strong> {ZONE_PRINCIPALE.join(", ")} et toutes les
            communes à moins de 35 km de Saint-Malo.
          </p>
        </div>
      </section>

      <section className="bloc contact" id="contact">
        <div className="wrap">
          <div>
            <h2>Parlons de votre projet</h2>
            <p className="intro">
              Décrivez votre pièce et ce que vous aimeriez changer. Je vous recontacte pour fixer
              une visite. Le devis est gratuit.
            </p>
          </div>
          <div>
            <Link className="btn" href="/contact">
              Prenez contact
            </Link>
            <a className="mail" href="mailto:contact@novarahabitat.fr">
              contact@novarahabitat.fr
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
