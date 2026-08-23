export const runtime = "nodejs";

export async function GET() {
  return Response.json({
    ok: true,
    agent: "cloud",
    runtime: "Vercel Sandbox",
    localAgentRequired: false,
  });
}
