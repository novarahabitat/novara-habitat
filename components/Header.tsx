import Link from "next/link";
import "@/app/site.css";

// En-tête du site public. Enveloppé dans .site pour garder son style
// même sur une page qui n'utilise pas encore le nouveau design.
export default function Header() {
  return (
    <div className="site">
      <header>
        <div className="wrap">
          <Link className="marque" href="/">
            <img src="/images/marques/novara-mark.png" alt="" />
            <span>NOVARA</span>
            <small>Habitat</small>
          </Link>
          <nav aria-label="Navigation principale">
            <Link className="lien" href="/#methode">Ma méthode</Link>
            <Link className="lien" href="/#chantiers">Chantiers</Link>
            <Link className="lien" href="/#services">Services</Link>
            <Link className="btn" href="/contact">Devis gratuit</Link>
          </nav>
        </div>
      </header>
    </div>
  );
}
