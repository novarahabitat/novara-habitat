import { createClient } from "@supabase/supabase-js";

// Appelée chaque jour par Vercel Cron (vercel.json) : une petite requête suffit
// pour que Supabase ne mette plus le projet gratuit en pause.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Non autorisé", { status: 401 });
  }

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false },
  });
  const { error } = await supabase.rpc("est_admin");
  if (error) return Response.json({ ok: false }, { status: 502 });
  return Response.json({ ok: true });
}
