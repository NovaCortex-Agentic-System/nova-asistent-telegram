// Tokenul botului Telegram. Tokenul nu se afișează niciodată.
//
//   bun scripts/token.ts           citește tokenul din clipboard, îl verifică, îl scrie în .env, golește clipboard-ul
//   bun scripts/token.ts --exista  cod 0 dacă tokenul e deja salvat, 1 dacă nu
//   bun scripts/token.ts --cale    afișează folderul de stare Telegram al agentului

import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { stateDir } from "./lib/cai";

// Forma unui token BotFather: cifre, două puncte, apoi minimum 30 de caractere din setul permis.
export function tokenValid(token: string): boolean {
  return /^\d{5,}:[A-Za-z0-9_-]{30,}$/.test(token);
}

// Înlocuiește sau adaugă linia TELEGRAM_BOT_TOKEN, păstrând restul fișierului.
export function continutEnv(existent: string, token: string): string {
  const linii = existent.split("\n").filter((l) => l.trim() && !l.startsWith("TELEGRAM_BOT_TOKEN="));
  return [...linii, `TELEGRAM_BOT_TOKEN=${token}`].join("\n") + "\n";
}

export function tokenSalvat(dir: string): boolean {
  const env = join(dir, ".env");
  return existsSync(env) && /^TELEGRAM_BOT_TOKEN=.+/m.test(readFileSync(env, "utf8"));
}

function ruleaza(comanda: string[], intrare?: string): string {
  const proces = Bun.spawnSync(comanda, { stdin: intrare === undefined ? "ignore" : Buffer.from(intrare) });
  if (proces.exitCode !== 0) throw new Error(`${comanda[0]} a eșuat`);
  return proces.stdout.toString();
}

function citesteClipboard(): string {
  if (process.platform === "darwin") return ruleaza(["pbpaste"]);
  if (process.platform === "win32") return ruleaza(["powershell", "-NoProfile", "-Command", "Get-Clipboard -Raw"]);
  throw new Error("Sistem nesuportat. Template-ul merge pe Mac și Windows.");
}

function golesteClipboard(): void {
  if (process.platform === "darwin") ruleaza(["pbcopy"], "");
  else if (process.platform === "win32") ruleaza(["powershell", "-NoProfile", "-Command", "Set-Clipboard -Value ' '"]);
}

if (import.meta.main) {
  const dir = stateDir();
  const comanda = process.argv[2] ?? "";

  if (comanda === "--cale") {
    console.log(dir);
  } else if (comanda === "--exista") {
    process.exit(tokenSalvat(dir) ? 0 : 1);
  } else if (comanda === "") {
    let token: string;
    try {
      token = citesteClipboard().trim();
    } catch (e) {
      console.error(`Nu am putut citi clipboard-ul: ${(e as Error).message}`);
      process.exit(1);
    }
    if (!tokenValid(token)) {
      console.error(
        "Ce e în clipboard nu arată ca un token de bot. Un token are forma 123456789:AAH... " +
          "Copiază din nou tokenul de la BotFather, întreg, și reîncearcă.",
      );
      process.exit(1);
    }
    mkdirSync(dir, { recursive: true, mode: 0o700 });
    const env = join(dir, ".env");
    writeFileSync(env, continutEnv(existsSync(env) ? readFileSync(env, "utf8") : "", token), { mode: 0o600 });
    try {
      chmodSync(env, 0o600);
    } catch {
      // pe Windows permisiunile Unix nu se aplică
    }
    try {
      golesteClipboard();
    } catch {
      console.log("Atenție: nu am putut goli clipboard-ul. Copiază altceva peste token.");
    }
    console.log(`Token salvat în ${env}. Clipboard-ul a fost golit.`);
  } else {
    console.error(`Comandă necunoscută: ${comanda}. Folosește fără argument, --exista sau --cale.`);
    process.exit(1);
  }
}
