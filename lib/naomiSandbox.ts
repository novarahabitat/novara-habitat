import { Sandbox } from "@vercel/sandbox";

const SYSTEM_DEPS = [
  "nss", "nspr", "libxkbcommon", "atk", "at-spi2-atk", "at-spi2-core",
  "libXcomposite", "libXdamage", "libXrandr", "libXfixes", "libXcursor",
  "libXi", "libXtst", "libXScrnSaver", "libXext", "mesa-libgbm", "libdrm",
  "mesa-libGL", "mesa-libEGL", "cups-libs", "alsa-lib", "pango", "cairo",
  "gtk3", "dbus-libs",
];

export async function getNaomiSandbox() {
  return Sandbox.getOrCreate({
    name: "naomi-job-agent",
    runtime: "node24",
    timeout: 20 * 60 * 1000,
    persistent: true,
    keepLastSnapshots: { count: 2 },
    onCreate: async (sandbox) => {
      const deps = await sandbox.runCommand({
        cmd: "dnf",
        args: ["install", "-y", "--skip-broken", ...SYSTEM_DEPS],
        sudo: true,
      });
      if (deps.exitCode !== 0) throw new Error(`Browser system dependencies failed: ${await deps.stderr()}`);

      const agent = await sandbox.runCommand("npm", ["install", "-g", "agent-browser"]);
      if (agent.exitCode !== 0) throw new Error(`agent-browser install failed: ${await agent.stderr()}`);

      const browser = await sandbox.runCommand("agent-browser", ["install"]);
      if (browser.exitCode !== 0) throw new Error(`Chromium install failed: ${await browser.stderr()}`);

      const directory = await sandbox.runCommand("mkdir", ["-p", "/vercel/sandbox/naomi"]);
      if (directory.exitCode !== 0) throw new Error(`Naomi workspace setup failed: ${await directory.stderr()}`);
    },
  });
}

export async function browserCommand(sandbox: Awaited<ReturnType<typeof getNaomiSandbox>>, args: string[]) {
  const result = await sandbox.runCommand("agent-browser", args);
  const stdout = await result.stdout();
  const stderr = await result.stderr();
  if (result.exitCode !== 0) {
    throw new Error(stderr.trim() || stdout.trim() || `agent-browser ${args[0]} failed`);
  }
  return stdout;
}

export async function safeBrowserCommand(sandbox: Awaited<ReturnType<typeof getNaomiSandbox>>, args: string[]) {
  try {
    return await browserCommand(sandbox, args);
  } catch {
    return "";
  }
}
