// Verifică faptul că piesele template-ului se potrivesc între ele.

import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { RADACINA } from "./ajutor";

const citeste = (cale: string) => readFileSync(join(RADACINA, cale), "utf8");

function fisiere(dir: string): string[] {
  return readdirSync(dir).flatMap((nume) => {
    if ([".git", "node_modules", "docs"].includes(nume)) return [];
    const cale = join(dir, nume);
    return statSync(cale).isDirectory() ? fisiere(cale) : [cale];
  });
}

describe("settings.json", () => {
  const setari = JSON.parse(citeste(".claude/settings.json"));
  const comenzi: string[] = Object.values(setari.hooks).flatMap((grupuri: any) =>
    grupuri.flatMap((g: any) => g.hooks.map((h: any) => h.command)),
  );

  test("are cele patru hook-uri", () => {
    expect(Object.keys(setari.hooks).sort()).toEqual(["PreCompact", "PreToolUse", "Stop", "UserPromptSubmit"]);
  });

  test("fiecare hook rulează cu bun un script care există", () => {
    for (const comanda of comenzi) {
      expect(comanda).toMatch(/^bun scripts\/[a-z-]+\.ts$/);
      expect(existsSync(join(RADACINA, comanda.replace("bun ", "")))).toBe(true);
    }
  });
});

describe("config.json și HEARTBEAT.md", () => {
  test("config.json are doar heartbeat-ul de 30 de minute, fără supervisor", () => {
    const config = JSON.parse(citeste("config.json"));
    expect(config.crons).toHaveLength(1);
    expect(config.crons[0].interval).toBe("30m");
    expect(config.supervisor).toBeUndefined();
  });

  test("HEARTBEAT.md verifică dream fără să-l pornească", () => {
    const heartbeat = citeste("HEARTBEAT.md");
    expect(heartbeat).toContain("bun scripts/dream-due.ts");
    expect(heartbeat).toContain("--anuntat");
    expect(heartbeat).toContain("Nu porni dream singur");
  });
});

describe("curățenia față de template-ul vechi", () => {
  const eliminate = [
    "check-telegram",
    "send-telegram",
    "agent-wrapper",
    "generate-launchd",
    "supervisor.sh",
    "mark-alive",
    "multimodal-rag",
    "mmrag",
    "heartbeat-memory",
    "TELEGRAM_ALLOWED_USER",
    "should-dream",
    "python3",
  ];

  test("niciun fișier nu mai trimite la piesele eliminate", () => {
    for (const cale of fisiere(RADACINA)) {
      if (cale.endsWith("structura.test.ts")) continue;
      const continut = readFileSync(cale, "utf8");
      for (const termen of eliminate) {
        if (continut.includes(termen)) throw new Error(`${relative(RADACINA, cale)} conține încă „${termen}”`);
      }
    }
  });

  test("nu există em dash în fișierele în română ale agentului", () => {
    for (const cale of fisiere(RADACINA)) {
      if (cale.includes("skill-optimizer")) continue;
      if (readFileSync(cale, "utf8").includes(String.fromCharCode(0x2014))) throw new Error(`${relative(RADACINA, cale)} conține em dash`);
    }
  });
});

describe("scripturile de pornire", () => {
  test("porneste.ps1 are BOM UTF-8, ca diacriticele să apară corect în PowerShell 5.1", () => {
    const octeti = readFileSync(join(RADACINA, "porneste.ps1"));
    expect([...octeti.subarray(0, 3)]).toEqual([0xef, 0xbb, 0xbf]);
  });

  test("ambele pornesc pluginul Telegram cu folderul de stare al agentului", () => {
    for (const script of ["porneste.sh", "porneste.ps1"]) {
      const continut = citeste(script);
      expect(continut).toContain("claude --channels plugin:telegram@claude-plugins-official");
      expect(continut).toContain("TELEGRAM_STATE_DIR");
      expect(continut).toContain("bun scripts/token.ts --exista");
    }
  });

  test.skipIf(process.platform === "win32")("porneste.sh e executabil", () => {
    expect(statSync(join(RADACINA, "porneste.sh")).mode & 0o111).not.toBe(0);
  });
});
