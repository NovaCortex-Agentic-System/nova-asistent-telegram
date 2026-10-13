import { afterEach, describe, expect, test } from "bun:test";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { azi, cheieOra, citesteTranscriere, numeAgent, oraMinut, stateDir, textMesaj } from "../scripts/lib/cai";
import { agentTemporar, transcriere } from "./ajutor";

const stareInitiala = process.env.TELEGRAM_STATE_DIR;
afterEach(() => {
  if (stareInitiala === undefined) delete process.env.TELEGRAM_STATE_DIR;
  else process.env.TELEGRAM_STATE_DIR = stareInitiala;
});

describe("numeAgent", () => {
  test("transformă numele folderului în litere mici și cratime", () => {
    expect(numeAgent("/x/Agentul Meu")).toBe("agentul-meu");
  });
  test("scoate diacriticele", () => {
    expect(numeAgent("/x/Asistentul Ănei Ștefănescu")).toBe("asistentul-anei-stefanescu");
  });
  test("nume fără caractere valide devine agent", () => {
    expect(numeAgent("/x/___")).toBe("agent");
  });
});

describe("stateDir", () => {
  test("implicit stă în ~/.claude/channels/<nume-agent>, în afara folderului agentului", () => {
    delete process.env.TELEGRAM_STATE_DIR;
    const cale = stateDir("/oriunde/Asistent Ana");
    expect(cale).toEndWith(join(".claude", "channels", "asistent-ana"));
    expect(cale.startsWith("/oriunde")).toBe(false);
  });
  test("TELEGRAM_STATE_DIR are prioritate", () => {
    process.env.TELEGRAM_STATE_DIR = "/alt/loc";
    expect(stateDir("/oriunde/agent")).toBe("/alt/loc");
  });
});

describe("date și ore", () => {
  const d = new Date(2026, 0, 5, 7, 3);
  test("azi", () => expect(azi(d)).toBe("2026-01-05"));
  test("cheieOra", () => expect(cheieOra(d)).toBe("20260105-07"));
  test("oraMinut", () => expect(oraMinut(d)).toBe("07:03"));
});

describe("transcrieri", () => {
  test("textMesaj acceptă string și liste de blocuri, ignoră blocurile non-text", () => {
    expect(textMesaj("salut")).toBe("salut");
    expect(textMesaj([{ type: "text", text: "a" }, { type: "tool_use" }, { type: "text", text: "b" }])).toBe("a b");
    expect(textMesaj(undefined)).toBe("");
  });

  test("citesteTranscriere ține doar mesajele cu text, în ordine", async () => {
    const { dir } = agentTemporar();
    const cale = join(dir, "t.jsonl");
    writeFileSync(
      cale,
      transcriere([
        { rol: "user", continut: "întrebare" },
        { rol: "user", continut: [{ type: "tool_result", content: "x" }] },
        { rol: "assistant", continut: [{ type: "text", text: "răspuns" }] },
      ]) + "linie stricată\n" + JSON.stringify({ type: "summary", summary: "s" }) + "\n",
    );
    expect(await citesteTranscriere(cale)).toEqual([
      { rol: "user", text: "întrebare" },
      { rol: "assistant", text: "răspuns" },
    ]);
  });

  test("citesteTranscriere întoarce listă goală dacă fișierul lipsește", async () => {
    expect(await citesteTranscriere("/nu/exista.jsonl")).toEqual([]);
    expect(await citesteTranscriere("")).toEqual([]);
  });
});
