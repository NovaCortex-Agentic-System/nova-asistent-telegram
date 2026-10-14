// Hook UserPromptSubmit: o dată pe oră injectează în context
// SOUL.md, USER.md, memoria de azi și MEMORY.md.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { agentDir, azi, cheieOra, numeAgent, tempDir } from "./lib/cai";

const dir = agentDir();

// Înainte de onboarding, fișierele conțin doar textul din șablon: nu are rost să-l injectăm.
const identitate = join(dir, "IDENTITY.md");
if (existsSync(identitate) && readFileSync(identitate, "utf8").includes("[Numele agentului]")) process.exit(0);

const blocare = join(tempDir(), `agent-inject-${numeAgent(dir)}-${cheieOra()}.lock`);

if (existsSync(blocare)) process.exit(0);
writeFileSync(blocare, "");

const sectiuni: [string, string][] = [
  ["Cine ești și cum te porți (SOUL.md)", join(dir, "SOUL.md")],
  ["Despre omul tău (USER.md)", join(dir, "USER.md")],
  [`Activitatea de azi (${azi()})`, join(dir, "memory", `${azi()}.md`)],
  ["Memoria pe termen lung (MEMORY.md)", join(dir, "MEMORY.md")],
];

let iesire = "\n[CONTEXT DE MEMORIE, injectat automat]\n";
for (const [titlu, cale] of sectiuni) {
  if (existsSync(cale)) iesire += `\n--- ${titlu} ---\n${readFileSync(cale, "utf8")}\n`;
}
iesire += "\n[SFÂRȘIT CONTEXT DE MEMORIE]\n";

process.stdout.write(iesire);
