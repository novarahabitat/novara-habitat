import Link from "next/link";
import "@/app/site.css";

// Les trois métiers NOVARA, puis le pied de page.
export default function Footer() {
  return (
    <div className="site">
      <section className="bloc marques" id="marques">
        <div className="wrap">
          <h2>Les métiers NOVARA</h2>
          <div className="trio">
            <div>
              <img src="/images/marques/habitat.png" alt="NOVARA Habitat" />
              <p>Rénovation intérieure : salles de bain, cuisines, aménagements et rénovation complète.</p>
            </div>
            <div>
              <img src="/images/marques/studio.png" alt="NOVARA Studio" />
              <p>Conception et image de votre projet avant les travaux, pour valider le résultat ensemble.</p>
            </div>
            <div>
              <img src="/images/marques/voltis.png" alt="NOVARA Voltis" />
              <p>Énergie verte.</p>
              <span className="bientot">Bientôt disponible</span>
            </div>
          </div>
        </div>
      </section>
      <footer>
        <div className="wrap">
          <span>NOVARA Habitat · Rénovation intérieure · Saint-Malo (35400)</span>
          <span>SIRET 917 689 499 00023</span>
          <span>
            <Link href="/contact">Contact</Link> &nbsp; <Link href="/connexion">Espace pro</Link>
          </span>
        </div>
      </footer>
    </div>
  );
}
