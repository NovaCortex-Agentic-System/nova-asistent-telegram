// Afișează chat_id-ul omului, ca agentul să-i poată scrie din proprie inițiativă
// (heartbeat, anunțuri), chiar și după o repornire.
// Într-o conversație privată pe Telegram, chat_id-ul e chiar ID-ul omului din allowlist.
// Nu afișează nimic dacă allowlist-ul e gol (pairing-ul nu s-a făcut încă).

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stateDir } from "./lib/cai";

try {
  const acces = JSON.parse(readFileSync(join(stateDir(), "access.json"), "utf8"));
  const primul = Array.isArray(acces.allowFrom) ? acces.allowFrom[0] : undefined;
  if (primul) console.log(String(primul));
} catch {
  // fișier lipsă sau invalid: nu avem încă destinatar
}
