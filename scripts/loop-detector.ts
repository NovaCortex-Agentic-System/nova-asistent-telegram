// Hook PreToolUse: blochează buclele infinite.
// Numără apelurile identice (aceeași unealtă, aceeași intrare) pe sesiune și pe oră.

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { cheieOra, citesteStdin, tempDir } from "./lib/cai";

const PRAG = 30;

// Serializare cu cheile sortate la orice adâncime, ca aceeași intrare să dea aceeași amprentă.
function stabil(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(stabil).join(",")}]`;
  if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    return `{${Object.keys(o).sort().map((k) => `${JSON.stringify(k)}:${stabil(o[k])}`).join(",")}}`;
  }
  return JSON.stringify(v) ?? "null";
}

const date = await citesteStdin();
if (!date.tool_name) process.exit(0);

const intrare = stabil(date.tool_input ?? {});
const amprenta = createHash("md5").update(`${date.tool_name}:${intrare}`).digest("hex").slice(0, 10);
const sesiune = String(date.session_id ?? "fara-sesiune").slice(0, 8);
const fisierStare = join(tempDir(), `agent-loop-${sesiune}-${cheieOra()}.json`);

let stare: Record<string, number> = {};
try {
  stare = JSON.parse(readFileSync(fisierStare, "utf8"));
} catch {
  // prima oară în ora asta
}

const numar = (stare[amprenta] ?? 0) + 1;
stare[amprenta] = numar;
try {
  writeFileSync(fisierStare, JSON.stringify(stare));
} catch {
  // nu blocăm agentul dacă nu putem scrie starea
}

if (numar >= PRAG) {
  // Codul 2 blochează apelul, iar textul de pe stderr ajunge la agent.
  process.stderr.write(
    `[BUCLĂ DETECTATĂ] Unealta '${date.tool_name}' a fost apelată de ${numar} ori cu aceeași intrare în ultima oră. ` +
      `Apelul e blocat. Vezi ce produce repetiția și încearcă altă abordare.\n`,
  );
  process.exit(2);
}
