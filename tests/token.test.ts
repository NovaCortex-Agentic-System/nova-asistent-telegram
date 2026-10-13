import { describe, expect, test } from "bun:test";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { continutEnv, tokenSalvat, tokenValid } from "../scripts/token";
import { agentTemporar, ruleaza } from "./ajutor";

const BUN = "123456789:AAHfiqksKZ8abcdefghijklmnopqrstuvwxyz";

describe("tokenValid", () => {
  test("acceptă forma BotFather", () => expect(tokenValid(BUN)).toBe(true));
  test("respinge text oarecare", () => expect(tokenValid("salut ce faci")).toBe(false));
  test("respinge tokenul fără partea de cifre", () => expect(tokenValid(BUN.split(":")[1])).toBe(false));
  test("respinge tokenul trunchiat", () => expect(tokenValid("123456789:AAHfiq")).toBe(false));
  test("respinge tokenul cu spațiu în interior", () => expect(tokenValid("123456789:AAHfiqksKZ8abcde fghijklmnopqrstuvwxyz")).toBe(false));
});

describe("continutEnv", () => {
  test("pe fișier gol scrie doar tokenul", () => {
    expect(continutEnv("", BUN)).toBe(`TELEGRAM_BOT_TOKEN=${BUN}\n`);
  });
  test("înlocuiește tokenul vechi și păstrează celelalte linii", () => {
    const rezultat = continutEnv("ALTCEVA=1\nTELEGRAM_BOT_TOKEN=vechi\n", BUN);
    expect(rezultat).toBe(`ALTCEVA=1\nTELEGRAM_BOT_TOKEN=${BUN}\n`);
  });
});

describe("linia de comandă", () => {
  test("--cale afișează folderul de stare", () => {
    const a = agentTemporar();
    expect(ruleaza("token.ts", { ...a, argumente: ["--cale"] }).iesire.trim()).toBe(a.stare);
  });

  test("--exista: 1 fără token, 0 cu token", () => {
    const a = agentTemporar();
    expect(ruleaza("token.ts", { ...a, argumente: ["--exista"] }).cod).toBe(1);
    expect(tokenSalvat(a.stare)).toBe(false);

    mkdirSync(a.stare, { recursive: true });
    writeFileSync(join(a.stare, ".env"), `TELEGRAM_BOT_TOKEN=${BUN}\n`);
    expect(ruleaza("token.ts", { ...a, argumente: ["--exista"] }).cod).toBe(0);
    expect(tokenSalvat(a.stare)).toBe(true);
  });

  test("argument necunoscut iese cu eroare", () => {
    const a = agentTemporar();
    expect(ruleaza("token.ts", { ...a, argumente: ["--altceva"] }).cod).toBe(1);
  });
});
