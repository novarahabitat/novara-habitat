import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Retour des liens envoyés par email (mot de passe oublié) : on ouvre la session
// puis on renvoie vers la page demandée, uniquement à l'intérieur du site.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const suite = searchParams.get("suite") ?? "/espace";
  const destination = suite.startsWith("/") && !suite.startsWith("//") ? suite : "/espace";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(destination, origin));
  }
  return NextResponse.redirect(new URL("/connexion/oubli?expire=1", origin));
}
