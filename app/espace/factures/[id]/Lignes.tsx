"use client";

import { useState, useTransition } from "react";
import type { LigneFacture } from "@/lib/types";
import { formatEuros, formatNombre, formatTaux } from "@/lib/format";
import { BoutonEnvoi, Formulaire } from "@/components/espace/Formulaire";
import { ajouterLigne, modifierLigne, supprimerLigne } from "../actions";

function ChampsLigne({
  ligne,
  tauxParDefaut,
  franchise,
}: {
  ligne?: LigneFacture;
  tauxParDefaut: string;
  franchise: boolean;
}) {
  return (
    <div className="grid grid-cols-6 gap-2">
      <textarea
        name="designation"
        required
        rows={2}
        defaultValue={ligne?.designation}
        placeholder="Désignation (ex. Fourniture et pose de faïence)"
        className="champ col-span-6 text-sm"
      />
      <label className="col-span-2 sm:col-span-1">
        <span className="mb-1 block text-xs text-gris">Quantité</span>
        <input
          name="quantite"
          inputMode="decimal"
          required
          defaultValue={ligne ? formatNombre(ligne.quantite).replace(/\s/g, "") : "1"}
          className="champ px-3 text-sm"
        />
      </label>
      <label className="col-span-2 sm:col-span-1">
        <span className="mb-1 block text-xs text-gris">Unité</span>
        <input name="unite" defaultValue={ligne?.unite ?? ""} placeholder="m², h, u…" className="champ px-3 text-sm" />
      </label>
      <label className="col-span-2 sm:col-span-2">
        <span className="mb-1 block text-xs text-gris">{franchise ? "Prix unitaire (€)" : "Prix unitaire HT (€)"}</span>
        <input
          name="prix_unitaire_ht"
          inputMode="decimal"
          required
          defaultValue={ligne ? String(Number(ligne.prix_unitaire_ht)).replace(".", ",") : ""}
          className="champ px-3 text-sm"
        />
      </label>
      {franchise ? (
        <input type="hidden" name="taux_tva" value="0" />
      ) : (
        <label className="col-span-6 sm:col-span-2">
          <span className="mb-1 block text-xs text-gris">TVA</span>
          <select name="taux_tva" defaultValue={ligne ? String(Number(ligne.taux_tva)) : tauxParDefaut} className="champ px-3 text-sm">
            <option value="20">20 %</option>
            <option value="10">10 % (rénovation logement + 2 ans)</option>
            <option value="5.5">5,5 % (rénovation énergétique)</option>
            <option value="0">0 % (autoliquidation, franchise…)</option>
          </select>
        </label>
      )}
    </div>
  );
}

export default function Lignes({
  factureId,
  lignes,
  modifiable,
  franchiseTva,
}: {
  factureId: string;
  lignes: LigneFacture[];
  modifiable: boolean;
  franchiseTva: boolean;
}) {
  const [edition, setEdition] = useState<string>();
  const [enCours, demarrer] = useTransition();
  const tauxParDefaut = franchiseTva
    ? "0"
    : lignes.length
      ? String(Number(lignes[lignes.length - 1].taux_tva))
      : "10";

  return (
    <div>
      {lignes.length > 0 && (
        <ul className="divide-y divide-black/[0.06]">
          {lignes.map((l) =>
            edition === l.id ? (
              <li key={l.id} className="py-4">
                <Formulaire
                  action={async (etat, fd) => {
                    const r = await modifierLigne(factureId, l.id, etat, fd);
                    if (r?.ok) setEdition(undefined);
                    return r;
                  }}
                >
                  <ChampsLigne ligne={l} tauxParDefaut={tauxParDefaut} franchise={franchiseTva} />
                  <div className="mt-3 flex gap-2">
                    <BoutonEnvoi>Enregistrer</BoutonEnvoi>
                    <button type="button" onClick={() => setEdition(undefined)} className="bouton-secondaire">
                      Annuler
                    </button>
                  </div>
                </Formulaire>
              </li>
            ) : (
              <li key={l.id} className="flex items-start gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="whitespace-pre-line text-sm">{l.designation}</p>
                  <p className="mt-0.5 text-xs text-gris">
                    {formatNombre(l.quantite)} {l.unite ?? ""} × {formatEuros(l.prix_unitaire_ht)}
                    {franchiseTva ? "" : ` HT · TVA ${formatTaux(l.taux_tva)}`}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-medium tabular-nums">
                  {formatEuros(Math.round(Number(l.quantite) * Number(l.prix_unitaire_ht) * 100) / 100)}
                </p>
                {modifiable && (
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <button type="button" onClick={() => setEdition(l.id)} className="text-xs text-or hover:underline">
                      Modifier
                    </button>
                    <button
                      type="button"
                      disabled={enCours}
                      onClick={() => demarrer(async () => void (await supprimerLigne(factureId, l.id)))}
                      className="text-xs text-black/35 hover:text-alerte"
                    >
                      Retirer
                    </button>
                  </div>
                )}
              </li>
            ),
          )}
        </ul>
      )}

      {modifiable && !edition && (
        <Formulaire
          action={ajouterLigne.bind(null, factureId)}
          viderApresSucces
          className={`rounded-xl bg-creme p-3 sm:p-4 ${lignes.length ? "mt-4" : ""}`}
        >
          <p className="mb-2 text-sm font-medium">Ajouter une ligne</p>
          <ChampsLigne tauxParDefaut={tauxParDefaut} franchise={franchiseTva} />
          <div className="mt-3">
            <BoutonEnvoi enCours="Ajout…">Ajouter la ligne</BoutonEnvoi>
          </div>
        </Formulaire>
      )}
    </div>
  );
}
