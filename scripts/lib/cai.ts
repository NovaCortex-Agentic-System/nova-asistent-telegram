// Căile și utilitarele comune tuturor scripturilor.
// Tot ce diferă între Mac și Windows se calculează aici, o singură dată.

import { homedir, tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";

// Folderul agentului. AGENT_DIR din mediu are prioritate (folosit de teste).
export function agentDir(): string {
  return process.env.AGENT_DIR ?? resolve(import.meta.dir, "..", "..");
}

// Numele agentului, derivat din numele folderului: litere mici, cifre și cratime.
export function numeAgent(dir: string = agentDir()): string {
  const nume = basename(dir)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return nume || "agent";
}

// Folderul de stare Telegram al agentului: token, allowlist, inbox.
// Stă în afara folderului agentului, ca să nu ajungă în iCloud sau în git.
export function stateDir(dir: string = agentDir()): string {
  return process.env.TELEGRAM_STATE_DIR ?? join(homedir(), ".claude", "channels", numeAgent(dir));
}

// Folderul temporar al sistemului. AGENT_TMP din mediu are prioritate (folosit de teste).
export function tempDir(): string {
  return process.env.AGENT_TMP ?? tmpdir();
}

function doua(n: number): string {
  return String(n).padStart(2, "0");
}

// Data locală în forma YYYY-MM-DD.
export function azi(d: Date = new Date()): string {
  return `${d.getFullYear()}-${doua(d.getMonth() + 1)}-${doua(d.getDate())}`;
}

// Ora locală în forma YYYYMMDD-HH, pentru fișierele de blocare pe oră.
export function cheieOra(d: Date = new Date()): string {
  return `${azi(d).replaceAll("-", "")}-${doua(d.getHours())}`;
}

// Ora locală în forma HH:MM.
export function oraMinut(d: Date = new Date()): string {
  return `${doua(d.getHours())}:${doua(d.getMinutes())}`;
}

// Citește JSON-ul primit de hook pe stdin. Întoarce {} dacă lipsește sau e invalid.
export async function citesteStdin(): Promise<Record<string, any>> {
  try {
    const text = await Bun.stdin.text();
    return text.trim() ? JSON.parse(text) : {};
  } catch {
    return {};
  }
}

// Extrage textul dintr-un mesaj de transcriere (string sau listă de blocuri).
export function textMesaj(content: unknown): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .filter((b) => b && typeof b === "object" && b.type === "text")
      .map((b) => String(b.text ?? ""))
      .join(" ");
  }
  return "";
}

// Citește o transcriere Claude Code (JSONL) și întoarce mesajele ca {rol, text}.
export async function citesteTranscriere(cale: string): Promise<{ rol: string; text: string }[]> {
  const fisier = Bun.file(cale);
  if (!cale || !(await fisier.exists())) return [];
  const mesaje: { rol: string; text: string }[] = [];
  for (const linie of (await fisier.text()).split("\n")) {
    if (!linie.trim()) continue;
    try {
      const obj = JSON.parse(linie);
      if (obj.type !== "user" && obj.type !== "assistant") continue;
      const text = textMesaj(obj.message?.content).trim();
      if (text) mesaje.push({ rol: obj.type, text });
    } catch {
      // linie coruptă, o sărim
    }
  }
  return mesaje;
}
