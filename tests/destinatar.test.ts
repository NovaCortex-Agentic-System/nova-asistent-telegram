import { describe, expect, test } from "bun:test";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { agentTemporar, ruleaza } from "./ajutor";

describe("destinatar", () => {
  test("afișează primul ID din allowlist", () => {
    const a = agentTemporar();
    mkdirSync(a.stare, { recursive: true });
    writeFileSync(join(a.stare, "access.json"), JSON.stringify({ dmPolicy: "allowlist", allowFrom: ["123456"] }));
    const r = ruleaza("destinatar.ts", a);
    expect(r.cod).toBe(0);
    expect(r.iesire.trim()).toBe("123456");
  });

  test("nu afișează nimic dacă allowlist-ul e gol", () => {
    const a = agentTemporar();
    mkdirSync(a.stare, { recursive: true });
    writeFileSync(join(a.stare, "access.json"), JSON.stringify({ dmPolicy: "pairing", allowFrom: [] }));
    expect(ruleaza("destinatar.ts", a).iesire).toBe("");
  });

  test("nu cade dacă fișierul lipsește", () => {
    const a = agentTemporar();
    const r = ruleaza("destinatar.ts", a);
    expect(r.cod).toBe(0);
    expect(r.iesire).toBe("");
  });
});
