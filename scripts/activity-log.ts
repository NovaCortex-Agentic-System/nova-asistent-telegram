// Hook Stop: jurnal de activitate, o linie JSON pe tură, doar adăugare.
// Păstrează și calea transcrierii, ca dream să știe unde să caute.

import { appendFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { agentDir, citesteStdin, citesteTranscriere } from "./lib/cai";

const date = await citesteStdin();
const transcriere = String(date.transcript_path ?? "");
const mesaje = await citesteTranscriere(transcriere);

const ultimul = (rol: string) => [...mesaje].reverse().find((m) => m.rol === rol)?.text ?? "";

const intrare = {
  ts: new Date().toISOString(),
  sesiune: String(date.session_id ?? ""),
  transcriere,
  mesaj_om: ultimul("user").slice(0, 200),
  // Ultimul răspuns vine în intrarea hook-ului; în transcriere e scris uneori abia după hook.
  raspuns_agent: String(date.last_assistant_message || ultimul("assistant")).slice(0, 300),
};

const folder = join(agentDir(), "logs");
mkdirSync(folder, { recursive: true });
appendFileSync(join(folder, "activity.ndjson"), JSON.stringify(intrare) + "\n", "utf8");
