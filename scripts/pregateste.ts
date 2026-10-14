// Copiază în rădăcina agentului fișierele personale care lipsesc, din sabloane/.
// Copiile sunt ale omului: git nu le urmărește, deci git pull nu se mai lovește de ele.
// Un fișier care există deja nu e atins niciodată.

import { copyFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { agentDir } from "./lib/cai";

export function pregateste(dir: string): string[] {
  const sabloane = join(dir, "sabloane");
  if (!existsSync(sabloane)) return [];
  const copiate: string[] = [];
  for (const nume of readdirSync(sabloane)) {
    const tinta = join(dir, nume);
    if (existsSync(tinta)) continue;
    copyFileSync(join(sabloane, nume), tinta);
    copiate.push(nume);
  }
  return copiate;
}

if (import.meta.main) {
  const copiate = pregateste(agentDir());
  if (copiate.length) console.log(`Am creat din sabloane/: ${copiate.join(", ")}`);
}
