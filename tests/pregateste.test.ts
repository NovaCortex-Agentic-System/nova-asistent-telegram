import { describe, expect, test } from "bun:test";
import { cpSync, existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pregateste } from "../scripts/pregateste";
import { RADACINA, agentTemporar, ruleaza } from "./ajutor";

describe("pregateste", () => {
  test("pe o clonă proaspătă creează toate fișierele personale din sabloane/", () => {
    const a = agentTemporar();
    cpSync(join(RADACINA, "sabloane"), join(a.dir, "sabloane"), { recursive: true });
    const copiate = pregateste(a.dir);
    expect(copiate.sort()).toEqual(readdirSync(join(RADACINA, "sabloane")).sort());
    expect(readFileSync(join(a.dir, "IDENTITY.md"), "utf8")).toContain("[Numele agentului]");
  });

  test("nu atinge fișierele care există deja", () => {
    const a = agentTemporar();
    cpSync(join(RADACINA, "sabloane"), join(a.dir, "sabloane"), { recursive: true });
    writeFileSync(join(a.dir, "IDENTITY.md"), "# Ana");
    const copiate = pregateste(a.dir);
    expect(copiate).not.toContain("IDENTITY.md");
    expect(readFileSync(join(a.dir, "IDENTITY.md"), "utf8")).toBe("# Ana");
  });

  test("a doua rulare nu mai copiază nimic și nu afișează nimic", () => {
    const a = agentTemporar();
    cpSync(join(RADACINA, "sabloane"), join(a.dir, "sabloane"), { recursive: true });
    expect(ruleaza("pregateste.ts", a).iesire).toContain("IDENTITY.md");
    const r = ruleaza("pregateste.ts", a);
    expect(r.cod).toBe(0);
    expect(r.iesire).toBe("");
  });

  test("fără sabloane/ nu cade", () => {
    const a = agentTemporar();
    expect(pregateste(a.dir)).toEqual([]);
    expect(existsSync(join(a.dir, "IDENTITY.md"))).toBe(false);
  });
});
