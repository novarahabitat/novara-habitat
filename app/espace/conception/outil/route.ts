import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@/lib/supabase/server";

// L'outil de conception est un fichier HTML autonome (three.js, dessin du plan,
// vue 3D) servi tel quel. Il est volontairement hors de `public/` : il ne doit
// sortir que pour le compte de l'espace pro, jamais en accès libre.
const fichier = path.join(process.cwd(), "app/espace/conception/novara-plan.html");

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: estAdmin } = await supabase.rpc("est_admin");
  if (!user || !estAdmin) return new Response("Non autorisé", { status: 401 });

  const html = await readFile(fichier, "utf8");
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-store",
    },
  });
}
