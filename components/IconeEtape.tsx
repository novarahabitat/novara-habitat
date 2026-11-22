// Petites icônes au trait pour les 4 étapes du chantier.
const TRACES = {
  visite: (
    <>
      <path d="M6 22 24 8l18 14" />
      <path d="M10 19v21h28V19" />
      <path d="M14 44h22v-8H14z" />
      <path d="M18 36v3M22 36v4M26 36v3M30 36v4" />
      <circle cx="24" cy="26" r="4" />
    </>
  ),
  image: (
    <>
      <rect x="6" y="8" width="24" height="18" rx="1" />
      <path d="M6 22l7-6 6 5 4-3 7 6" />
      <circle cx="22" cy="13" r="2" />
      <path d="M22 30h20v14H22z" />
      <path d="M26 35h12M26 39h8" />
    </>
  ),
  travaux: (
    <g transform="rotate(-40 24 24)">
      <rect x="21.5" y="18" width="5" height="27" rx="1.5" />
      <path d="M13 9h20l3 3v6H13z" />
      <path d="M13 9v9" />
    </g>
  ),
  propre: (
    <>
      <path d="M30 6 22 24" />
      <path d="M14 24h16l4 18H10z" />
      <path d="M16 32l-2 10M22 32v10M28 32l2 10" />
      <path d="M38 10v6M35 13h6" />
      <path d="M42 22v4M40 24h4" />
    </>
  ),
};

export type NomIcone = keyof typeof TRACES;

export default function IconeEtape({ nom }: { nom: NomIcone }) {
  return (
    <svg className="ico" viewBox="0 0 48 48" aria-hidden="true">
      {TRACES[nom]}
    </svg>
  );
}
