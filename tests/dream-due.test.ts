import { describe, expect, test } from "bun:test";
import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { agentTemporar, ruleaza } from "./ajutor";

const ZI = 24 * 3600;
const acum = () => Math.floor(Date.now() / 1000);

describe("dream-due", () => {
  test("prima rulare pornește numărătoarea și nu anunță", () => {
    const a = agentTemporar();
    const r = ruleaza("dream-due.ts", a);
    expect(r.cod).toBe(0);
    expect(r.iesire).toBe("");
    expect(existsSync(join(a.dir, ".last-dream"))).toBe(true);
  });

  test("sub 5 zile nu anunță", () => {
    const a = agentTemporar();
    writeFileSync(join(a.dir, ".last-dream"), String(acum() - 4 * ZI));
    expect(ruleaza("dream-due.ts", a).iesire).toBe("");
  });

  test("la 5 zile anunță, iar după --anuntat tace", () => {
    const a = agentTemporar();
    writeFileSync(join(a.dir, ".last-dream"), String(acum() - 5 * ZI));
    expect(ruleaza("dream-due.ts", a).iesire.trim()).toBe("ANUNTA");

    ruleaza("dream-due.ts", { ...a, argumente: ["--anuntat"] });
    expect(ruleaza("dream-due.ts", a).iesire).toBe("");
  });

  test("--gata resetează numărătoarea și șterge marcajul de anunț", () => {
    const a = agentTemporar();
    writeFileSync(join(a.dir, ".last-dream"), String(acum() - 9 * ZI));
    writeFileSync(join(a.dir, ".dream-anuntat"), "1");

    expect(ruleaza("dream-due.ts", { ...a, argumente: ["--gata"] }).cod).toBe(0);
    expect(existsSync(join(a.dir, ".dream-anuntat"))).toBe(false);
    expect(ruleaza("dream-due.ts", a).iesire).toBe("");
  });

  test("argument necunoscut iese cu eroare", () => {
    const a = agentTemporar();
    expect(ruleaza("dream-due.ts", { ...a, argumente: ["--altceva"] }).cod).toBe(1);
  });
});
