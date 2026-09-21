import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import { PackPdf, type PhotoPack } from "@/lib/pdf/Pack";
import type { Chantier, Client, Entreprise, Photo } from "@/lib/types";

export const maxDuration = 60;

const ordrePhases = { avant: 0, pendant: 1, apres: 2 } as const;

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: estAdmin } = await supabase.rpc("est_admin");
  if (!user || !estAdmin) return new Response("Non autorisé", { status: 401 });

  const { data: chantier } = await supabase
    .from("chantiers")
    .select("*, clients(*)")
    .eq("id", id)
    .maybeSingle<Chantier & { clients: Client | null }>();
  if (!chantier) return new Response("Chantier introuvable", { status: 404 });

  const [{ data: photos }, { data: entreprise }] = await Promise.all([
    supabase
      .from("chantier_photos")
      .select("*")
      .eq("chantier_id", id)
      .eq("dans_pack", true)
      .order("created_at")
      .returns<Photo[]>(),
    supabase.from("entreprise").select("*").eq("owner_id", user.id).maybeSingle<Entreprise>(),
  ]);

  const tries = (photos ?? []).sort((a, b) => ordrePhases[a.phase] - ordrePhases[b.phase]);
  const images: PhotoPack[] = [];
  for (const p of tries) {
    const { data } = await supabase.storage.from("chantiers").download(p.storage_path);
    if (data) images.push({ phase: p.phase, legende: p.legende, data: Buffer.from(await data.arrayBuffer()) });
  }

  const buffer = await renderToBuffer(
    PackPdf({ chantier, client: chantier.clients, entreprise: entreprise ?? {}, photos: images }),
  );

  const nom = `Fin-de-chantier-${chantier.titre.replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "")}.pdf`;
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(nom)}`,
      "Cache-Control": "private, no-store",
    },
  });
}
