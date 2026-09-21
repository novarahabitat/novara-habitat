"use client";

import { useState } from "react";
import type { Client } from "@/lib/types";

export default function ChampsClient({ client }: { client?: Client }) {
  const [type, setType] = useState(client?.type ?? "particulier");

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <span className="etiquette">Type</span>
        <div className="flex gap-2">
          {(["particulier", "professionnel"] as const).map((t) => (
            <label
              key={t}
              className={`cursor-pointer rounded-full border px-4 py-2 text-sm ${
                type === t ? "border-foret bg-foret text-white" : "border-black/15 bg-white"
              }`}
            >
              <input
                type="radio"
                name="type"
                value={t}
                checked={type === t}
                onChange={() => setType(t)}
                className="sr-only"
              />
              {t === "particulier" ? "Particulier" : "Professionnel"}
            </label>
          ))}
        </div>
      </div>

      <div className="sm:col-span-2">
        <label className="etiquette" htmlFor="nom">
          {type === "professionnel" ? "Nom du contact" : "Nom et prénom"} *
        </label>
        <input id="nom" name="nom" required defaultValue={client?.nom} className="champ" />
      </div>

      {type === "professionnel" && (
        <>
          <div className="sm:col-span-2">
            <label className="etiquette" htmlFor="societe">
              Société
            </label>
            <input id="societe" name="societe" defaultValue={client?.societe ?? ""} className="champ" />
          </div>
          <div>
            <label className="etiquette" htmlFor="siret">
              SIRET
            </label>
            <input id="siret" name="siret" inputMode="numeric" defaultValue={client?.siret ?? ""} className="champ" />
          </div>
          <div>
            <label className="etiquette" htmlFor="tva_intracom">
              N° TVA intracommunautaire
            </label>
            <input id="tva_intracom" name="tva_intracom" defaultValue={client?.tva_intracom ?? ""} className="champ" />
          </div>
        </>
      )}

      <div>
        <label className="etiquette" htmlFor="telephone">
          Téléphone
        </label>
        <input id="telephone" name="telephone" type="tel" defaultValue={client?.telephone ?? ""} className="champ" />
      </div>
      <div>
        <label className="etiquette" htmlFor="email">
          Email
        </label>
        <input id="email" name="email" type="email" defaultValue={client?.email ?? ""} className="champ" />
      </div>

      <div className="sm:col-span-2">
        <label className="etiquette" htmlFor="adresse">
          Adresse
        </label>
        <input id="adresse" name="adresse" defaultValue={client?.adresse ?? ""} className="champ" />
      </div>
      <div>
        <label className="etiquette" htmlFor="code_postal">
          Code postal
        </label>
        <input
          id="code_postal"
          name="code_postal"
          inputMode="numeric"
          defaultValue={client?.code_postal ?? ""}
          className="champ"
        />
      </div>
      <div>
        <label className="etiquette" htmlFor="ville">
          Ville
        </label>
        <input id="ville" name="ville" defaultValue={client?.ville ?? ""} className="champ" />
      </div>

      <div className="sm:col-span-2">
        <label className="etiquette" htmlFor="notes">
          Notes (privées)
        </label>
        <textarea id="notes" name="notes" rows={3} defaultValue={client?.notes ?? ""} className="champ" />
      </div>
    </div>
  );
}
