import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { BadgeChantier, BadgeFacture, EnTete, Section, Vide } from "@/components/espace/ui";
import { BoutonEnvoi, Formulaire } from "@/components/espace/Formulaire";
import { formatDate, formatEuros } from "@/lib/format";
import type { Chantier, Client, Facture } from "@/lib/types";
import ChampsClient from "../ChampsClient";
import { modifierClient, supprimerClient } from "../actions";

export default async function ClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const [{ data: client }, { data: chantiers }, { data: factures }] = await Promise.all([
    supabase.from("clients").select("*").eq("id", id).maybeSingle<Client>(),
    supabase.from("chantiers").select("*").eq("client_id", id).order("created_at", { ascending: false }).returns<Chantier[]>(),
    supabase.from("factures").select("*").eq("client_id", id).order("created_at", { ascending: false }).returns<Facture[]>(),
  ]);
  if (!client) notFound();

  return (
    <>
      <EnTete
        titre={client.nom}
        sousTitre={client.societe}
        retour={{ href: "/espace/clients", label: "Clients" }}
        actions={
          <Link href={`/espace/chantiers/nouveau?client=${client.id}`} className="bouton">
            Nouveau chantier
          </Link>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_22rem]">
        <Formulaire action={modifierClient.bind(null, client.id)} className="carte">
          <ChampsClient client={client} />
          <div className="mt-6">
            <BoutonEnvoi>Enregistrer</BoutonEnvoi>
          </div>
        </Formulaire>

        <div className="space-y-5">
          <Section titre="Chantiers">
            {!chantiers?.length ? (
              <Vide>Aucun chantier.</Vide>
            ) : (
              <ul className="space-y-2">
                {chantiers.map((c) => (
                  <li key={c.id}>
                    <Link href={`/espace/chantiers/${c.id}`} className="flex items-center justify-between gap-3 rounded-xl px-2 py-2 hover:bg-creme">
                      <span className="truncate">{c.titre}</span>
                      <BadgeChantier statut={c.statut} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section titre="Factures">
            {!factures?.length ? (
              <Vide>Aucune facture.</Vide>
            ) : (
              <ul className="space-y-2">
                {factures.map((f) => (
                  <li key={f.id}>
                    <Link href={`/espace/factures/${f.id}`} className="flex items-center justify-between gap-3 rounded-xl px-2 py-2 hover:bg-creme">
                      <span className="min-w-0">
                        <span className="block truncate">{f.numero ?? "Brouillon"}</span>
                        <span className="block text-xs text-gris">
                          {formatEuros(f.total_ttc)} {f.date_emission && `· ${formatDate(f.date_emission)}`}
                        </span>
                      </span>
                      <BadgeFacture statut={f.statut} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          {!chantiers?.length && !factures?.length && (
            <Formulaire
              action={supprimerClient.bind(null, client.id)}
              confirmation={`Supprimer définitivement le client ${client.nom} ?`}
            >
              <BoutonEnvoi variante="danger" enCours="Suppression…">
                Supprimer ce client
              </BoutonEnvoi>
            </Formulaire>
          )}
        </div>
      </div>
    </>
  );
}
