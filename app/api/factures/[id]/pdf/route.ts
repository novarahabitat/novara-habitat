import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import { FacturePdf } from "@/lib/pdf/Facture";
import type { Client, Entreprise, Facture, LigneFacture } from "@/lib/types";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: estAdmin } = await supabase.rpc("est_admin");
  if (!user || !estAdmin) return new Response("Non autorisé", { status: 401 });

  const { data: facture } = await supabase
    .from("factures")
    .select("*, clients(*)")
    .eq("id", id)
    .maybeSingle<Facture & { clients: Client }>();
  if (!facture) return new Response("Facture introuvable", { status: 404 });

  const [{ data: lignes }, { data: entreprise }, { data: origine }, { data: aDeduire }] = await Promise.all([
    supabase.from("facture_lignes").select("*").eq("facture_id", id).order("position").returns<LigneFacture[]>(),
    supabase.from("entreprise").select("*").eq("owner_id", user.id).maybeSingle<Entreprise>(),
    facture.facture_origine_id
      ? supabase.from("factures").select("numero, date_emission").eq("id", facture.facture_origine_id).maybeSingle()
      : Promise.resolve({ data: null }),
    facture.statut === "brouillon" && facture.type === "facture" && facture.chantier_id
      ? supabase
          .from("factures")
          .select("numero, date_emission, total_ttc")
          .eq("type", "acompte")
          .neq("statut", "brouillon")
          .is("deduit_sur", null)
          .eq("chantier_id", facture.chantier_id)
          .eq("client_id", facture.client_id)
          .order("date_emission")
      : Promise.resolve({ data: null }),
  ]);
  const acomptes =
    facture.statut === "brouillon"
      ? (aDeduire ?? []).map((a) => ({ numero: a.numero as string, date: a.date_emission as string | null, ttc: a.total_ttc }))
      : (facture.acomptes ?? []);

  // Une facture émise s'imprime avec les coordonnées figées au moment de l'émission.
  const emise = facture.statut !== "brouillon";
  const buffer = await renderToBuffer(
    FacturePdf({
      facture,
      lignes: lignes ?? [],
      entreprise: emise && facture.emetteur ? facture.emetteur : (entreprise ?? {}),
      client: emise && facture.destinataire ? facture.destinataire : facture.clients,
      origine,
      acomptes,
    }),
  );

  const nom = facture.numero
    ? `${facture.type === "avoir" ? "Avoir" : facture.type === "acompte" ? "Facture-acompte" : "Facture"}-${facture.numero}.pdf`
    : "Facture-brouillon.pdf";
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${nom}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
