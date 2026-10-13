// Evidența consolidării memoriei (dream). Dream nu pornește niciodată singur.
//
//   bun scripts/dream-due.ts            afișează ANUNTA dacă au trecut 5 zile și nu s-a anunțat încă
//   bun scripts/dream-due.ts --anuntat  notează că utilizatorul a fost anunțat
//   bun scripts/dream-due.ts --gata     notează un dream terminat și resetează numărătoarea

import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { agentDir } from "./lib/cai";

const ZILE = 5;

const dir = agentDir();
const ultimulDream = join(dir, ".last-dream");
const anuntat = join(dir, ".dream-anuntat");
const acum = Math.floor(Date.now() / 1000);

const comanda = process.argv[2] ?? "";

if (comanda === "--gata") {
  writeFileSync(ultimulDream, `${acum}\n`);
  rmSync(anuntat, { force: true });
  console.log("Dream notat. Următorul anunț peste " + ZILE + " zile.");
} else if (comanda === "--anuntat") {
  writeFileSync(anuntat, `${acum}\n`);
} else if (comanda === "") {
  if (!existsSync(ultimulDream)) {
    // Prima rulare: pornim numărătoarea de acum, nu anunțăm.
    writeFileSync(ultimulDream, `${acum}\n`);
  } else if (!existsSync(anuntat)) {
    const ultim = Number(readFileSync(ultimulDream, "utf8").trim()) || acum;
    if (acum - ultim >= ZILE * 24 * 3600) console.log("ANUNTA");
  }
} else {
  console.error(`Comandă necunoscută: ${comanda}. Folosește fără argument, --anuntat sau --gata.`);
  process.exit(1);
}
