import Link from "next/link";
import type { Chantier, Client } from "@/lib/types";
import { libelleStatutChantier } from "@/lib/format";

export default function ChampsChantier({
  chantier,
  clients,
  clientParDefaut,
}: {
  chantier?: Chantier;
  clients: Pick<Client, "id" | "nom" | "societe">[];
  clientParDefaut?: string;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className="etiquette" htmlFor="titre">
          Nom du chantier *
        </label>
        <input
          id="titre"
          name="titre"
          required
          placeholder="Ex. Rénovation salle de bain"
          defaultValue={chantier?.titre}
          className="champ"
        />
      </div>

      <div className="sm:col-span-2">
        <div className="flex items-baseline justify-between">
          <label className="etiquette" htmlFor="client_id">
            Client
          </label>
          {!chantier && (
            <Link href="/espace/clients/nouveau?retour=chantier" className="text-sm text-or hover:underline">
              + Nouveau client
            </Link>
          )}
        </div>
        <select
          id="client_id"
          name="client_id"
          defaultValue={chantier?.client_id ?? clientParDefaut ?? ""}
          className="champ"
        >
          <option value="">— Aucun —</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nom}
              {c.societe ? ` (${c.societe})` : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="sm:col-span-2">
        <label className="etiquette" htmlFor="adresse">
          Adresse du chantier
        </label>
        <input
          id="adresse"
          name="adresse"
          placeholder={chantier ? "" : "Laisser vide pour reprendre l'adresse du client"}
          defaultValue={chantier?.adresse ?? ""}
          className="champ"
        />
      </div>
      <div>
        <label className="etiquette" htmlFor="code_postal">
          Code postal
        </label>
        <input id="code_postal" name="code_postal" inputMode="numeric" defaultValue={chantier?.code_postal ?? ""} className="champ" />
      </div>
      <div>
        <label className="etiquette" htmlFor="ville">
          Ville
        </label>
        <input id="ville" name="ville" defaultValue={chantier?.ville ?? ""} className="champ" />
      </div>

      <div>
        <label className="etiquette" htmlFor="date_debut">
          Début
        </label>
        <input id="date_debut" name="date_debut" type="date" defaultValue={chantier?.date_debut ?? ""} className="champ" />
      </div>
      <div>
        <label className="etiquette" htmlFor="date_fin">
          Fin
        </label>
        <input id="date_fin" name="date_fin" type="date" defaultValue={chantier?.date_fin ?? ""} className="champ" />
      </div>

      <div className="sm:col-span-2">
        <label className="etiquette" htmlFor="statut">
          Statut
        </label>
        <select id="statut" name="statut" defaultValue={chantier?.statut ?? "prevu"} className="champ">
          {Object.entries(libelleStatutChantier).map(([valeur, libelle]) => (
            <option key={valeur} value={valeur}>
              {libelle}
            </option>
          ))}
        </select>
      </div>

      <div className="sm:col-span-2">
        <label className="etiquette" htmlFor="description">
          Description / demande du client
        </label>
        <textarea id="description" name="description" rows={4} defaultValue={chantier?.description ?? ""} className="champ" />
      </div>
    </div>
  );
}
