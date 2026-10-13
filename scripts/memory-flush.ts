// Hook PreCompact: înainte de compactarea contextului, salvează în memoria zilnică
// ultimele mesaje consistente ale agentului. Rulează cel mult o dată la 10 minute.

import { appendFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { agentDir, azi, citesteStdin, citesteTranscriere, numeAgent, oraMinut, tempDir } from "./lib/cai";

const LUNGIME_MINIMA = 80;
const MAXIM_MESAJE = 5;

const date = await citesteStdin();
const dir = agentDir();

// Fereastră de 10 minute: 09:00-09:09 e o fereastră, 09:10-09:19 alta.
const acum = new Date();
const fereastra = `${azi(acum).replaceAll("-", "")}-${oraMinut(acum).replace(":", "").slice(0, 3)}`;
const blocare = join(tempDir(), `agent-flush-${numeAgent(dir)}-${fereastra}.lock`);
if (existsSync(blocare)) process.exit(0);

const mesaje = (await citesteTranscriere(String(date.transcript_path ?? "")))
  .filter((m) => m.rol === "assistant" && m.text.length >= LUNGIME_MINIMA)
  .map((m) => m.text.slice(0, 400).replace(/\s*\n\s*/g, " "))
  .slice(-MAXIM_MESAJE);

if (mesaje.length === 0) process.exit(0);

writeFileSync(blocare, "");
mkdirSync(join(dir, "memory"), { recursive: true });
const linii = [`\n## Salvare înainte de compactare, ${oraMinut(acum)}\n`, ...mesaje.map((m) => `- ${m}`)];
appendFileSync(join(dir, "memory", `${azi(acum)}.md`), linii.join("\n") + "\n", "utf8");
