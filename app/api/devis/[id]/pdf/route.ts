import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import { DevisPdf } from "@/lib/pdf/Devis";
import type { Client, Devis, Entreprise, LigneDevis } from "@/lib/types";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: estAdmin } = await supabase.rpc("est_admin");
  if (!user || !estAdmin) return new Response("Non autorisé", { status: 401 });

  const { data: devis } = await supabase
    .from("devis")
    .select("*, clients(*)")
    .eq("id", id)
    .maybeSingle<Devis & { clients: Client }>();
  if (!devis) return new Response("Devis introuvable", { status: 404 });

  const [{ data: lignes }, { data: entreprise }] = await Promise.all([
    supabase.from("devis_lignes").select("*").eq("devis_id", id).order("position").returns<LigneDevis[]>(),
    supabase.from("entreprise").select("*").eq("owner_id", user.id).maybeSingle<Entreprise>(),
  ]);

  // Un devis envoyé s'imprime avec les coordonnées figées au moment de l'envoi.
  const envoye = devis.statut !== "brouillon";
  const buffer = await renderToBuffer(
    DevisPdf({
      devis,
      lignes: lignes ?? [],
      entreprise: envoye && devis.emetteur ? devis.emetteur : (entreprise ?? {}),
      client: envoye && devis.destinataire ? devis.destinataire : devis.clients,
    }),
  );

  const nom = devis.numero ? `Devis-${devis.numero}.pdf` : "Devis-brouillon.pdf";
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${nom}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
