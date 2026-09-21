import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { EnTete, Vide } from "@/components/espace/ui";
import type { Client } from "@/lib/types";

export const metadata = { title: "Clients" };

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { supabase } = await requireAdmin();
  const { q } = await searchParams;

  let requete = supabase.from("clients").select("*").order("nom");
  if (q) {
    const motif = `%${q.replace(/[%_,()]/g, " ").trim()}%`;
    requete = requete.or(`nom.ilike.${motif},societe.ilike.${motif},ville.ilike.${motif},telephone.ilike.${motif}`);
  }
  const { data: clients } = await requete.returns<Client[]>();

  return (
    <>
      <EnTete
        titre="Clients"
        actions={
          <Link href="/espace/clients/nouveau" className="bouton">
            Nouveau client
          </Link>
        }
      />

      <form className="mb-5">
        <input name="q" defaultValue={q} placeholder="Rechercher un nom, une ville, un téléphone…" className="champ" />
      </form>

      {!clients?.length ? (
        <Vide>{q ? "Aucun client ne correspond." : "Aucun client pour l'instant."}</Vide>
      ) : (
        <ul className="divide-y divide-black/[0.06] overflow-hidden rounded-2xl border border-black/[0.06] bg-white">
          {clients.map((c) => (
            <li key={c.id}>
              <Link href={`/espace/clients/${c.id}`} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-creme/60">
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {c.nom}
                    {c.societe && <span className="font-normal text-gris"> · {c.societe}</span>}
                  </p>
                  <p className="truncate text-sm text-gris">{[c.ville, c.telephone].filter(Boolean).join(" · ")}</p>
                </div>
                <span aria-hidden className="text-black/25">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
