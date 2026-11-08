import { createClient } from "@/lib/supabase/server";
import type { DocumentPlan, MediaPlan, ReponsePlan } from "@/lib/types";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function session() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: estAdmin } = await supabase.rpc("est_admin");
  return user && estAdmin ? supabase : null;
}

function cheminsMedias(document: DocumentPlan | null) {
  const medias = Array.isArray(document?.medias) ? (document.medias as MediaPlan[]) : [];
  return new Set(medias.map((m) => m?.chemin).filter((c): c is string => typeof c === "string"));
}

/** L'horloge d'une tablette peut avancer : on ne laisse pas une date partir dans le futur. */
function dateAppareil(valeur: unknown) {
  const t = typeof valeur === "string" ? Date.parse(valeur) : NaN;
  const maintenant = Date.now();
  if (!Number.isFinite(t)) return new Date(maintenant).toISOString();
  return new Date(Math.min(t, maintenant + 60_000)).toISOString();
}

export async function GET(_: Request, { params }: { params: Promise<{ chantier: string }> }) {
  const { chantier } = await params;
  if (!UUID.test(chantier)) return new Response("Chantier inconnu", { status: 400 });

  const supabase = await session();
  if (!supabase) return new Response("Non autorisé", { status: 401 });

  const { data } = await supabase
    .from("plans")
    .select("document, resume, version, modifie_le, appareil")
    .eq("chantier_id", chantier)
    .maybeSingle();

  const reponse: ReponsePlan = data
    ? { etat: "lu", existe: true, ...data }
    : { etat: "lu", existe: false };
  return Response.json(reponse, { headers: { "Cache-Control": "private, no-store" } });
}

/**
 * Enregistre le plan venu d'un appareil.
 *
 * `base_version` est la version que cet appareil avait sous les yeux. Si la
 * ligne a bougé entre-temps, c'est qu'un autre appareil est passé : on garde
 * alors la version la plus récente des deux et on le dit à l'appareil, qui
 * prévient son utilisateur.
 */
export async function PUT(request: Request, { params }: { params: Promise<{ chantier: string }> }) {
  const { chantier } = await params;
  if (!UUID.test(chantier)) return new Response("Chantier inconnu", { status: 400 });

  const supabase = await session();
  if (!supabase) return new Response("Non autorisé", { status: 401 });

  let corps: {
    document?: unknown;
    resume?: unknown;
    base_version?: unknown;
    modifie_le?: unknown;
    appareil?: unknown;
  };
  try {
    corps = await request.json();
  } catch {
    return new Response("Corps illisible", { status: 400 });
  }

  const document = corps.document;
  if (!document || typeof document !== "object" || Array.isArray(document)) {
    return new Response("Document attendu", { status: 400 });
  }
  const resume = corps.resume && typeof corps.resume === "object" && !Array.isArray(corps.resume) ? corps.resume : {};
  const baseVersion = Number(corps.base_version) || 0;
  const modifieLe = dateAppareil(corps.modifie_le);
  const appareil = typeof corps.appareil === "string" ? corps.appareil.slice(0, 80) : null;

  const { data: actuel } = await supabase
    .from("plans")
    .select("id, document, version, modifie_le, appareil")
    .eq("chantier_id", chantier)
    .maybeSingle<{ id: string; document: DocumentPlan; version: number; modifie_le: string; appareil: string | null }>();

  // Premier enregistrement pour ce chantier.
  if (!actuel) {
    const { data, error } = await supabase
      .from("plans")
      .insert({ chantier_id: chantier, document, resume, modifie_le: modifieLe, appareil })
      .select("version, modifie_le")
      .single();
    if (error) {
      const inconnu = error.code === "23503";
      return new Response(inconnu ? "Chantier inconnu" : "Enregistrement refusé", { status: inconnu ? 404 : 400 });
    }
    return Response.json({ etat: "enregistre", existe: true, ...data } satisfies ReponsePlan);
  }

  // Un autre appareil a écrit depuis la lecture : la version la plus récente gagne.
  const aBouge = actuel.version !== baseVersion;
  if (aBouge && Date.parse(actuel.modifie_le) >= Date.parse(modifieLe)) {
    const { data } = await supabase
      .from("plans")
      .select("document, resume, version, modifie_le, appareil")
      .eq("id", actuel.id)
      .single();
    return Response.json({ etat: "depasse", existe: true, ...data } satisfies ReponsePlan, { status: 409 });
  }

  const { data, error } = await supabase
    .from("plans")
    .update({ document, resume, version: actuel.version + 1, modifie_le: modifieLe, appareil })
    .eq("id", actuel.id)
    .eq("version", actuel.version)
    .select("version, modifie_le")
    .maybeSingle();

  // La ligne a changé entre la lecture et l'écriture : l'appareil rejouera.
  if (error || !data) return new Response("Enregistrement à refaire", { status: 409 });

  // Photos retirées du pack : on les sort aussi du stockage.
  const avant = cheminsMedias(actuel.document);
  const apres = cheminsMedias(document as DocumentPlan);
  const retirees = [...avant].filter((c) => !apres.has(c));
  if (retirees.length) await supabase.storage.from("plans").remove(retirees);

  return Response.json({
    etat: aBouge ? "remplace" : "enregistre",
    existe: true,
    remplace_appareil: aBouge ? actuel.appareil : null,
    remplace_le: aBouge ? actuel.modifie_le : null,
    ...data,
  } satisfies ReponsePlan);
}
