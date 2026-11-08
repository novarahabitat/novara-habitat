import { EnTete } from "@/components/espace/ui";

export const metadata = { title: "Conception" };

// L'outil vit dans son propre document (il occupe tout l'écran et charge ses
// propres scripts) : on l'affiche dans un cadre, et « Plein écran » l'ouvre seul.
export default function ConceptionPage() {
  return (
    <>
      <EnTete
        titre="Conception"
        sousTitre="Plan au sol, murs, pièces et vue 3D. Le travail en cours est gardé par le navigateur."
        actions={
          <a href="/espace/conception/outil" target="_blank" rel="noopener noreferrer" className="bouton-secondaire">
            Plein écran
          </a>
        }
      />

      <div className="h-[calc(100svh-18rem)] min-h-[28rem] overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] lg:h-[calc(100svh-15rem)]">
        <iframe src="/espace/conception/outil" title="Outil de conception NOVARA" className="h-full w-full border-0" />
      </div>
    </>
  );
}
