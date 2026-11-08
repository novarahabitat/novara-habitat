import { createClient } from "@/lib/supabase/server";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ID = /^[A-Za-z0-9_-]{1,64}$/;
const TYPES = ["image/jpeg", "image/png", "image/webp"];
const TAILLE_MAX = 10 * 1024 * 1024;

async function contexte(params: Promise<{ chantier: string; media: string }>) {
  const { chantier, media } = await params;
  if (!UUID.test(chantier) || !ID.test(media)) return { erreur: new Response("Adresse invalide", { status: 400 }) };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: estAdmin } = await supabase.rpc("est_admin");
  if (!user || !estAdmin) return { erreur: new Response("Non autorisé", { status: 401 }) };

  return { supabase, chemin: `${chantier}/${media}` };
}

/** Photo du pack client, rangée dans le bucket privé `plans`. */
export async function GET(_: Request, { params }: { params: Promise<{ chantier: string; media: string }> }) {
  const { erreur, supabase, chemin } = await contexte(params);
  if (erreur) return erreur;

  const { data, error } = await supabase!.storage.from("plans").download(chemin!);
  if (error || !data) return new Response("Photo introuvable", { status: 404 });

  return new Response(data, {
    headers: {
      "Content-Type": data.type || "image/jpeg",
      "Cache-Control": "private, max-age=86400",
    },
  });
}

export async function PUT(request: Request, { params }: { params: Promise<{ chantier: string; media: string }> }) {
  const { erreur, supabase, chemin } = await contexte(params);
  if (erreur) return erreur;

  const type = (request.headers.get("content-type") ?? "").split(";")[0].trim();
  if (!TYPES.includes(type)) return new Response("Image attendue", { status: 415 });

  const octets = await request.arrayBuffer();
  if (!octets.byteLength) return new Response("Image vide", { status: 400 });
  if (octets.byteLength > TAILLE_MAX) return new Response("Image trop lourde", { status: 413 });

  const { error } = await supabase!.storage
    .from("plans")
    .upload(chemin!, octets, { contentType: type, upsert: true });
  if (error) return new Response("Dépôt refusé", { status: 400 });

  return Response.json({ chemin });
}
