import { Sandbox } from "@vercel/sandbox";

export const runtime = "nodejs";
export const maxDuration = 120;

const CHROMIUM_SYSTEM_DEPS = [
  "nss", "nspr", "libxkbcommon", "atk", "at-spi2-atk", "at-spi2-core",
  "libXcomposite", "libXdamage", "libXrandr", "libXfixes", "libXcursor",
  "libXi", "libXtst", "libXScrnSaver", "libXext", "mesa-libgbm", "libdrm",
  "mesa-libGL", "mesa-libEGL", "cups-libs", "alsa-lib", "pango", "cairo",
  "gtk3", "dbus-libs",
];

export async function GET() {
  const sandbox = await Sandbox.create({ runtime: "node24", timeout: 300_000 });
  try {
    const installDeps = await sandbox.runCommand("sh", [
      "-c",
      `sudo dnf clean all >/dev/null 2>&1; sudo dnf install -y --skip-broken ${CHROMIUM_SYSTEM_DEPS.join(" ")} >/dev/null 2>&1; sudo ldconfig`,
    ]);
    if (installDeps.exitCode !== 0) {
      return Response.json({ error: "System dependency install failed" }, { status: 500 });
    }

    const installAgent = await sandbox.runCommand("npm", ["install", "-g", "agent-browser"]);
    if (installAgent.exitCode !== 0) {
      return Response.json({ error: "agent-browser install failed", log: await installAgent.stderr() }, { status: 500 });
    }

    const installBrowser = await sandbox.runCommand("agent-browser", ["install"]);
    if (installBrowser.exitCode !== 0) {
      return Response.json({ error: "Chromium install failed", log: await installBrowser.stderr() }, { status: 500 });
    }

    const snapshot = await sandbox.snapshot();
    return Response.json({ ok: true, snapshotId: snapshot.snapshotId });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "bootstrap failed" }, { status: 500 });
  }
}
