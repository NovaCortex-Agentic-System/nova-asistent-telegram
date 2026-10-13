// Utilitare pentru teste: un folder de agent temporar și rularea scripturilor ca procese separate.

import { mkdtempSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

export const RADACINA = resolve(import.meta.dir, "..");

export function agentTemporar(): { dir: string; tmp: string; stare: string } {
  const baza = mkdtempSync(join(tmpdir(), "agent-test-"));
  const dir = join(baza, "agent");
  const tmp = join(baza, "tmp");
  const stare = join(baza, "stare");
  mkdirSync(join(dir, "memory"), { recursive: true });
  mkdirSync(tmp);
  return { dir, tmp, stare };
}

export function ruleaza(
  script: string,
  opt: { dir: string; tmp: string; stare?: string; intrare?: unknown; argumente?: string[] },
) {
  const proces = Bun.spawnSync(["bun", join(RADACINA, "scripts", script), ...(opt.argumente ?? [])], {
    stdin: opt.intrare === undefined ? "ignore" : Buffer.from(JSON.stringify(opt.intrare)),
    env: {
      ...process.env,
      AGENT_DIR: opt.dir,
      AGENT_TMP: opt.tmp,
      ...(opt.stare ? { TELEGRAM_STATE_DIR: opt.stare } : {}),
    },
  });
  return { cod: proces.exitCode, iesire: proces.stdout.toString(), erori: proces.stderr.toString() };
}

// Construiește o transcriere JSONL în formatul Claude Code.
export function transcriere(mesaje: { rol: "user" | "assistant"; continut: unknown }[]): string {
  return mesaje.map((m) => JSON.stringify({ type: m.rol, message: { role: m.rol, content: m.continut } })).join("\n") + "\n";
}
