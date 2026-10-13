import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { azi } from "../scripts/lib/cai";
import { agentTemporar, ruleaza, transcriere } from "./ajutor";

const LUNG = "Am terminat analiza cerută și am pregătit un rezumat cu cele trei variante, fiecare cu avantaje și riscuri.";

describe("session-inject", () => {
  test("injectează fișierele prima dată, apoi tace în aceeași oră", () => {
    const a = agentTemporar();
    writeFileSync(join(a.dir, "SOUL.md"), "suflet-test");
    writeFileSync(join(a.dir, "USER.md"), "om-test");
    writeFileSync(join(a.dir, "MEMORY.md"), "memorie-test");
    writeFileSync(join(a.dir, "memory", `${azi()}.md`), "azi-test");

    const prima = ruleaza("session-inject.ts", { ...a, intrare: {} });
    expect(prima.cod).toBe(0);
    for (const text of ["suflet-test", "om-test", "memorie-test", "azi-test"]) expect(prima.iesire).toContain(text);

    const a_doua = ruleaza("session-inject.ts", { ...a, intrare: {} });
    expect(a_doua.cod).toBe(0);
    expect(a_doua.iesire).toBe("");
  });

  test("nu cade dacă lipsesc fișierele", () => {
    const a = agentTemporar();
    const r = ruleaza("session-inject.ts", { ...a, intrare: {} });
    expect(r.cod).toBe(0);
    expect(r.iesire).toContain("CONTEXT DE MEMORIE");
  });
});

describe("loop-detector", () => {
  const apel = (a: ReturnType<typeof agentTemporar>, intrare: unknown) =>
    ruleaza("loop-detector.ts", { ...a, intrare: { session_id: "sesiune1", tool_name: "Bash", tool_input: intrare } });

  test("lasă 29 de apeluri identice și îl blochează pe al 30-lea", () => {
    const a = agentTemporar();
    for (let i = 1; i < 30; i++) expect(apel(a, { command: "ls" }).cod).toBe(0);
    const blocat = apel(a, { command: "ls" });
    expect(blocat.cod).toBe(2);
    expect(blocat.erori).toContain("BUCLĂ DETECTATĂ");
  });

  test("ordinea cheilor, inclusiv în obiecte imbricate, nu schimbă amprenta", () => {
    const a = agentTemporar();
    for (let i = 1; i < 30; i++) {
      const intrare = i % 2 ? { a: 1, b: { x: 1, y: 2 } } : { b: { y: 2, x: 1 }, a: 1 };
      expect(apel(a, intrare).cod).toBe(0);
    }
    expect(apel(a, { a: 1, b: { x: 1, y: 2 } }).cod).toBe(2);
  });

  test("valori imbricate diferite nu se adună", () => {
    const a = agentTemporar();
    for (let i = 1; i < 35; i++) expect(apel(a, { a: 1, b: { x: i } }).cod).toBe(0);
  });

  test("intrare lipsă sau invalidă nu blochează", () => {
    const a = agentTemporar();
    expect(ruleaza("loop-detector.ts", { ...a }).cod).toBe(0);
  });
});

describe("memory-flush", () => {
  test("salvează mesajele lungi ale agentului în memoria de azi, o dată pe fereastră", () => {
    const a = agentTemporar();
    const t = join(a.dir, "t.jsonl");
    writeFileSync(
      t,
      transcriere([
        { rol: "user", continut: "fă analiza" },
        { rol: "assistant", continut: [{ type: "text", text: "scurt" }] },
        { rol: "assistant", continut: [{ type: "text", text: LUNG }] },
      ]),
    );
    const fisier = join(a.dir, "memory", `${azi()}.md`);

    expect(ruleaza("memory-flush.ts", { ...a, intrare: { transcript_path: t } }).cod).toBe(0);
    const continut = readFileSync(fisier, "utf8");
    expect(continut).toContain(LUNG);
    expect(continut).not.toContain("- scurt");

    ruleaza("memory-flush.ts", { ...a, intrare: { transcript_path: t } });
    expect(readFileSync(fisier, "utf8")).toBe(continut);
  });

  test("fără transcriere nu scrie nimic", () => {
    const a = agentTemporar();
    expect(ruleaza("memory-flush.ts", { ...a, intrare: {} }).cod).toBe(0);
    expect(existsSync(join(a.dir, "memory", `${azi()}.md`))).toBe(false);
  });
});

describe("activity-log", () => {
  test("adaugă o linie cu ultimul mesaj al omului, al agentului și calea transcrierii", () => {
    const a = agentTemporar();
    const t = join(a.dir, "t.jsonl");
    writeFileSync(
      t,
      transcriere([
        { rol: "user", continut: "salut" },
        { rol: "assistant", continut: [{ type: "text", text: "bună" }] },
        { rol: "user", continut: "ce faci?" },
        { rol: "assistant", continut: [{ type: "text", text: "lucrez" }] },
      ]),
    );
    expect(ruleaza("activity-log.ts", { ...a, intrare: { session_id: "s1", transcript_path: t } }).cod).toBe(0);
    ruleaza("activity-log.ts", { ...a, intrare: { session_id: "s1", transcript_path: t } });

    const linii = readFileSync(join(a.dir, "logs", "activity.ndjson"), "utf8").trim().split("\n");
    expect(linii).toHaveLength(2);
    const intrare = JSON.parse(linii[0]);
    expect(intrare).toMatchObject({ sesiune: "s1", transcriere: t, mesaj_om: "ce faci?", raspuns_agent: "lucrez" });
  });

  test("preferă last_assistant_message, care e mai proaspăt decât transcrierea", () => {
    const a = agentTemporar();
    const t = join(a.dir, "t.jsonl");
    writeFileSync(t, transcriere([{ rol: "user", continut: "salut" }]));
    ruleaza("activity-log.ts", { ...a, intrare: { session_id: "s1", transcript_path: t, last_assistant_message: "gata" } });
    const intrare = JSON.parse(readFileSync(join(a.dir, "logs", "activity.ndjson"), "utf8").trim());
    expect(intrare.raspuns_agent).toBe("gata");
  });
});
