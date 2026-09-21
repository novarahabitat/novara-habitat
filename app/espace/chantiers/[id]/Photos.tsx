"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { libellePhase } from "@/lib/format";
import type { PhasePhoto, Photo } from "@/lib/types";
import { enregistrerPhoto, modifierPhoto, supprimerPhoto } from "../actions";

export type PhotoAffichee = Photo & { url: string | null };

const PHASES: PhasePhoto[] = ["avant", "pendant", "apres"];
const COTE_MAX = 2000;

/** Réduit la photo à 2000 px de côté en JPEG : ~300-600 Ko au lieu de 3-8 Mo. */
async function compresser(fichier: File): Promise<Blob> {
  const image = await createImageBitmap(fichier, { imageOrientation: "from-image" });
  const ratio = Math.min(1, COTE_MAX / Math.max(image.width, image.height));
  const largeur = Math.round(image.width * ratio);
  const hauteur = Math.round(image.height * ratio);

  const canvas = document.createElement("canvas");
  canvas.width = largeur;
  canvas.height = hauteur;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas indisponible");
  ctx.drawImage(image, 0, 0, largeur, hauteur);
  image.close();

  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Compression impossible"))), "image/jpeg", 0.82),
  );
}

export default function Photos({ chantierId, photos }: { chantierId: string; photos: PhotoAffichee[] }) {
  const router = useRouter();
  const entree = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<PhasePhoto>("pendant");
  const [filtre, setFiltre] = useState<PhasePhoto | "toutes">("toutes");
  const [progression, setProgression] = useState<string>();
  const [erreur, setErreur] = useState<string>();
  const [agrandie, setAgrandie] = useState<PhotoAffichee>();
  const [enCours, demarrer] = useTransition();

  async function deposer(fichiers: FileList) {
    setErreur(undefined);
    const supabase = createClient();
    const liste = Array.from(fichiers);
    let echecs = 0;

    for (const [i, fichier] of liste.entries()) {
      setProgression(`Envoi ${i + 1} / ${liste.length}…`);
      try {
        const blob = await compresser(fichier);
        const chemin = `${chantierId}/${crypto.randomUUID()}.jpg`;
        const { error } = await supabase.storage
          .from("chantiers")
          .upload(chemin, blob, { contentType: "image/jpeg", upsert: false });
        if (error) throw error;
        const r = await enregistrerPhoto(chantierId, chemin, phase);
        if (r?.erreur) throw new Error(r.erreur);
      } catch {
        echecs++;
      }
    }

    setProgression(undefined);
    if (echecs) setErreur(`${echecs} photo(s) n'ont pas pu être envoyées. Vérifiez la connexion et réessayez.`);
    if (entree.current) entree.current.value = "";
    router.refresh();
  }

  function modifier(id: string, maj: Parameters<typeof modifierPhoto>[2]) {
    demarrer(async () => {
      const r = await modifierPhoto(chantierId, id, maj);
      if (r?.erreur) setErreur(r.erreur);
    });
  }

  const visibles = filtre === "toutes" ? photos : photos.filter((p) => p.phase === filtre);
  const compte = (p: PhasePhoto) => photos.filter((x) => x.phase === p).length;

  return (
    <div>
      <div className="rounded-xl bg-creme p-3 sm:p-4">
        <p className="mb-2 text-sm text-gris">Ajouter des photos</p>
        <div className="flex flex-wrap items-center gap-2">
          {PHASES.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPhase(p)}
              className={`rounded-full border px-3.5 py-1.5 text-sm ${
                phase === p ? "border-foret bg-foret text-white" : "border-black/10 bg-white"
              }`}
            >
              {libellePhase[p]}
            </button>
          ))}
          <label className={`bouton ml-auto cursor-pointer ${progression ? "pointer-events-none opacity-60" : ""}`}>
            {progression ?? "Prendre / choisir"}
            <input
              ref={entree}
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(e) => e.target.files?.length && deposer(e.target.files)}
            />
          </label>
        </div>
      </div>

      {erreur && <p className="mt-3 text-sm text-alerte">{erreur}</p>}

      {photos.length > 0 && (
        <div className="mt-4 flex gap-2 overflow-x-auto">
          {(["toutes", ...PHASES] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFiltre(f)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs ${
                filtre === f ? "bg-encre text-white" : "bg-black/5 text-gris"
              }`}
            >
              {f === "toutes" ? `Toutes (${photos.length})` : `${libellePhase[f]} (${compte(f)})`}
            </button>
          ))}
        </div>
      )}

      {visibles.length > 0 && (
        <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {visibles.map((p) => (
            <li key={p.id} className="overflow-hidden rounded-xl border border-black/[0.06] bg-white">
              <button type="button" onClick={() => setAgrandie(p)} className="block aspect-[4/3] w-full bg-black/5">
                {p.url ? (
                  <img src={p.url} alt={p.legende ?? ""} loading="lazy" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xs text-gris">Image indisponible</span>
                )}
              </button>
              <div className="space-y-2 p-2">
                <select
                  value={p.phase}
                  disabled={enCours}
                  onChange={(e) => modifier(p.id, { phase: e.target.value as PhasePhoto })}
                  className="w-full rounded-lg border border-black/10 bg-white px-2 py-1 text-xs"
                >
                  {PHASES.map((ph) => (
                    <option key={ph} value={ph}>
                      {libellePhase[ph]}
                    </option>
                  ))}
                </select>
                <label className="flex items-center gap-2 text-xs text-gris">
                  <input
                    type="checkbox"
                    checked={p.dans_pack}
                    disabled={enCours}
                    onChange={(e) => modifier(p.id, { dans_pack: e.target.checked })}
                    className="accent-foret"
                  />
                  Dans le pack client
                </label>
              </div>
            </li>
          ))}
        </ul>
      )}

      {agrandie && (
        <div
          role="dialog"
          aria-modal
          className="fixed inset-0 z-50 flex flex-col bg-black/90 p-4"
          onClick={() => setAgrandie(undefined)}
        >
          <div className="flex justify-end">
            <button type="button" className="px-3 py-2 text-white/80">
              Fermer ✕
            </button>
          </div>
          <div className="flex min-h-0 flex-1 items-center justify-center">
            {agrandie.url && <img src={agrandie.url} alt="" className="max-h-full max-w-full object-contain" />}
          </div>
          <div className="mx-auto mt-3 flex w-full max-w-md flex-col gap-2" onClick={(e) => e.stopPropagation()}>
            <input
              defaultValue={agrandie.legende ?? ""}
              placeholder="Légende (apparaît dans le pack)"
              onBlur={(e) => {
                if (e.target.value !== (agrandie.legende ?? "")) modifier(agrandie.id, { legende: e.target.value });
              }}
              className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40"
            />
            <button
              type="button"
              disabled={enCours}
              onClick={() => {
                if (!window.confirm("Supprimer définitivement cette photo ?")) return;
                const id = agrandie.id;
                setAgrandie(undefined);
                demarrer(async () => {
                  const r = await supprimerPhoto(chantierId, id);
                  if (r?.erreur) setErreur(r.erreur);
                });
              }}
              className="rounded-full border border-white/20 px-4 py-2.5 text-sm text-red-300"
            >
              Supprimer la photo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
