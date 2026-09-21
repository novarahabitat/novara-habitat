import { requireAdmin } from "@/lib/auth";
import { EnTete, Section } from "@/components/espace/ui";
import { BoutonEnvoi, Formulaire } from "@/components/espace/Formulaire";
import type { Entreprise } from "@/lib/types";
import { enregistrerEntreprise, fixerNumerotation } from "./actions";

export const metadata = { title: "Réglages" };

function Champ({
  nom,
  libelle,
  valeur,
  aide,
  large,
  ...autres
}: {
  nom: string;
  libelle: string;
  valeur?: string | number | null;
  aide?: string;
  large?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={large ? "sm:col-span-2" : ""}>
      <label className="etiquette" htmlFor={nom}>
        {libelle}
      </label>
      <input id={nom} name={nom} defaultValue={valeur ?? ""} className="champ" {...autres} />
      {aide && <p className="mt-1 text-xs text-gris">{aide}</p>}
    </div>
  );
}

export default async function ParametresPage() {
  const { supabase, user } = await requireAdmin();
  const annee = Number(new Intl.DateTimeFormat("fr-CA", { timeZone: "Europe/Paris", year: "numeric" }).format(new Date()));

  const [{ data: e }, { data: compteur }] = await Promise.all([
    supabase.from("entreprise").select("*").eq("owner_id", user.id).maybeSingle<Entreprise>(),
    supabase.from("compteurs_factures").select("dernier").eq("owner_id", user.id).eq("annee", annee).maybeSingle(),
  ]);
  const prefixe = e?.prefixe_facture ?? "F";
  const prochain = (compteur?.dernier ?? 0) + 1;

  return (
    <div className="max-w-3xl space-y-5">
      <EnTete
        titre="Réglages"
        sousTitre="Ces informations apparaissent sur vos factures. Elles sont figées sur chaque facture au moment de son émission."
      />

      <Formulaire action={enregistrerEntreprise} className="space-y-5">
        <Section titre="Entreprise">
          <div className="grid gap-4 sm:grid-cols-2">
            <Champ nom="raison_sociale" libelle="Raison sociale *" valeur={e?.raison_sociale} large required />
            <Champ
              nom="forme_juridique"
              libelle="Forme juridique"
              valeur={e?.forme_juridique}
              placeholder="SAS, SARL, EI…"
              aide="Micro-entrepreneur / entrepreneur individuel : écrivez « EI ». Il sera ajouté après votre nom sur les factures."
            />
            <Champ nom="capital" libelle="Capital social" valeur={e?.capital} placeholder="Ex. 5 000 €" />
            <Champ nom="adresse" libelle="Adresse *" valeur={e?.adresse} large />
            <Champ nom="code_postal" libelle="Code postal *" valeur={e?.code_postal} inputMode="numeric" />
            <Champ nom="ville" libelle="Ville *" valeur={e?.ville} />
            <Champ nom="telephone" libelle="Téléphone" valeur={e?.telephone} type="tel" />
            <Champ nom="email" libelle="Email" valeur={e?.email} type="email" />
            <Champ nom="site_web" libelle="Site web" valeur={e?.site_web ?? "novarahabitat.fr"} large />
          </div>
        </Section>

        <Section titre="Identification">
          <div className="grid gap-4 sm:grid-cols-2">
            <Champ nom="siret" libelle="SIRET *" valeur={e?.siret} inputMode="numeric" aide="14 chiffres." />
            <Champ nom="rcs" libelle="RCS / RM" valeur={e?.rcs} placeholder="Ex. RCS Nice 123 456 789" />
            <Champ nom="tva_intracom" libelle="N° de TVA intracommunautaire" valeur={e?.tva_intracom} placeholder="FR…" />
            <label className="flex items-center gap-3 self-end rounded-xl border border-black/10 bg-white px-4 py-3 text-sm">
              <input type="checkbox" name="franchise_tva" defaultChecked={e?.franchise_tva} className="h-4 w-4 accent-foret" />
              Franchise en base de TVA (micro-entrepreneur : pas de TVA facturée)
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm sm:col-span-2">
              <input type="checkbox" name="tva_sur_debits" defaultChecked={e?.tva_sur_debits} className="h-4 w-4 accent-foret" />
              J&apos;ai opté pour le paiement de la TVA d&apos;après les débits (rare : à cocher seulement si vous l&apos;avez demandé aux impôts)
            </label>
          </div>
        </Section>

        <Section titre="Assurance décennale">
          <p className="mb-4 text-sm text-gris">Mention obligatoire sur les factures de travaux.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Champ nom="assureur_decennale" libelle="Assureur *" valeur={e?.assureur_decennale} />
            <Champ nom="police_decennale" libelle="N° de contrat *" valeur={e?.police_decennale} />
            <Champ nom="zone_couverture" libelle="Couverture géographique" valeur={e?.zone_couverture} placeholder="Ex. France métropolitaine" large />
          </div>
        </Section>

        <Section titre="Paiement">
          <div className="grid gap-4 sm:grid-cols-2">
            <Champ nom="iban" libelle="IBAN" valeur={e?.iban} large />
            <Champ nom="bic" libelle="BIC" valeur={e?.bic} />
            <Champ
              nom="delai_paiement_jours"
              libelle="Délai de paiement (jours)"
              valeur={e?.delai_paiement_jours ?? 30}
              inputMode="numeric"
              aide="Entre professionnels, 60 jours maximum. Ajoutez-le aussi dans les conditions ci-dessous."
            />
            <div className="sm:col-span-2">
              <label className="etiquette" htmlFor="conditions_paiement">
                Conditions de paiement
              </label>
              <textarea id="conditions_paiement" name="conditions_paiement" rows={2} defaultValue={e?.conditions_paiement} className="champ text-sm" />
            </div>
            <div className="sm:col-span-2">
              <label className="etiquette" htmlFor="penalites_retard">
                Pénalités de retard
              </label>
              <textarea id="penalites_retard" name="penalites_retard" rows={3} defaultValue={e?.penalites_retard} className="champ text-sm" />
            </div>
          </div>
        </Section>

        <Section titre="Factures">
          <div className="grid gap-4 sm:grid-cols-2">
            <Champ
              nom="prefixe_facture"
              libelle="Préfixe des numéros"
              valeur={prefixe}
              aide={`Exemple : ${prefixe}-${annee}-0001`}
              maxLength={6}
            />
            <div className="sm:col-span-2">
              <label className="etiquette" htmlFor="mentions_libres">
                Mentions complémentaires (bas de facture)
              </label>
              <textarea id="mentions_libres" name="mentions_libres" rows={2} defaultValue={e?.mentions_libres ?? ""} className="champ text-sm" />
            </div>
          </div>
        </Section>

        <div className="sticky bottom-20 z-10 lg:bottom-4">
          <BoutonEnvoi className="w-full shadow-lg sm:w-auto">Enregistrer les réglages</BoutonEnvoi>
        </div>
      </Formulaire>

      <Section titre="Reprendre votre numérotation">
        <p className="mb-4 text-sm text-gris">
          Si vous avez déjà émis des factures ailleurs cette année, indiquez le dernier numéro pour continuer la même
          série sans trou. Possible uniquement tant qu&apos;aucune facture de l&apos;année n&apos;a été émise ici.
          Prochain numéro actuel :{" "}
          <strong className="text-encre">
            {prefixe}-{annee}-{String(prochain).padStart(4, "0")}
          </strong>
        </p>
        <Formulaire action={fixerNumerotation} className="flex flex-wrap items-end gap-3">
          <input type="hidden" name="annee" value={annee} />
          <div>
            <label className="etiquette" htmlFor="dernier">
              Dernier numéro émis en {annee}
            </label>
            <input id="dernier" name="dernier" inputMode="numeric" defaultValue={prochain - 1} className="champ w-32" />
          </div>
          <BoutonEnvoi variante="secondaire">Appliquer</BoutonEnvoi>
        </Formulaire>
      </Section>
    </div>
  );
}
