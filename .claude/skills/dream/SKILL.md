---
name: dream
description: "Consolidarea memoriei agentului: citește memoria zilnică și conversațiile recente, extrage corecturile, deciziile și preferințele, le îmbină în MEMORY.md și curăță ce s-a învechit. Pornește DOAR când omul cere explicit (rulează dream, consolidează memoria). Nu se declanșează niciodată singur."
---

# Dream, consolidarea memoriei

Așa cum somnul consolidează memoria omului, dream adună ce s-a întâmplat în ultimele zile și îl așază curat în memoria pe termen lung.

**Pornește doar la cererea omului.** Dacă ai ajuns aici din altă cauză (heartbeat, propria inițiativă), te oprești.

Rulează ca subagent, în aceeași sesiune, ca să nu blochezi conversația. Înainte să pornească, trimite-i omului pe Telegram un mesaj scurt că începi consolidarea.

Toate căutările le faci cu uneltele Claude Code (Read, Grep, Glob), nu cu comenzi de terminal, ca să meargă la fel pe Mac și Windows.

```
ORIENTARE --> CULEGERE --> CONSOLIDARE --> CURĂȚARE
```

Faci fazele în ordine, fără să sari peste vreuna.

---

## Faza 1: orientare

Scop: să înțelegi ce e deja în memorie înainte să schimbi ceva.

1. Citește `MEMORY.md`. Notează secțiunile, numărul de linii și intrările care par învechite (date relative ca „ieri” sau „săptămâna trecută” fără o dată fixă).
2. Listează fișierele din `memory/` și citește-le pe cele din ultimele 7 zile, plus pe cele mai noi decât ultimul dream.
3. Citește `DECISIONS.md` și `GROUND-TRUTH.md`, ca să nu contrazici deciziile permanente.
4. Citește fișierele din `invatat/` (lecțiile pe sarcină).

**Prima rulare:** înainte de orice modificare, fă o copie a `MEMORY.md` în `memory/MEMORY-copie-{data de azi}.md`.

---

## Faza 2: culegere

Scop: semnalele importante din zilele recente, fără să citești tot.

Surse, în ordinea importanței:
1. **Memoria zilnică** din `memory/`, deja citită la faza 1.
2. **Jurnalul de activitate**, `logs/activity.ndjson`. Fiecare linie are mesajul omului, răspunsul tău și câmpul `transcriere` cu calea conversației complete.
3. **Conversațiile complete**, doar la nevoie: cauți cu Grep în fișierele indicate de câmpul `transcriere`, nu le citești integral.

Ce cauți:
- **Corecturi** (cea mai mare prioritate): „nu”, „greșit”, „nu mai face”, „ți-am spus”, „nu asta”, „oprește”
- **Confirmări**: „exact”, „perfect”, „așa da”, „continuă așa”
- **Decizii**: „am decis”, „mergem pe”, „de acum înainte”, „de fiecare dată”
- **Preferințe**: „prefer”, „îmi place”, „nu-mi place”, „vreau să”
- **Fapte noi**: oameni, proiecte, date, unelte menționate pentru prima dată

---

## Faza 3: consolidare

Reguli:
- **Nu ștergi fără înlocuire.** O intrare dispare doar dacă a fost contrazisă de una mai nouă sau mutată în altă secțiune.
- **Date absolute.** Transformi „ieri”, „joi”, „săptămâna trecută” în date de forma AAAA-LL-ZZ, pe baza datei fișierului din care vin.
- **Contradicțiile** se rezolvă în favoarea informației mai noi. Păstrezi o notă scurtă: „(înlocuiește ce era valabil până la AAAA-LL-ZZ)”.
- **Fără dubluri.** Dacă ceva există deja, îl completezi, nu-l repeți.
- **Deciziile permanente** nu le muți din `DECISIONS.md`. Dacă găsești o decizie nouă de nivelul ăla, o propui omului, nu o scrii singur.
- **Lecțiile pe sarcină.** O corectură găsită în culegere care privește o sarcină repetată și lipsește din `invatat/<nume>.md` o adaugi acolo ca regulă, nu în `MEMORY.md`. În fișierele din `invatat/` unești regulile duplicate și le ștergi pe cele marcate ca înlocuite. Nu inventezi reguli noi și nu ștergi reguli valabile.
- **Tiparul de 3 feedback-uri** pe același subiect: propui omului o completare în `SOUL.md`, nu o scrii singur.

---

## Faza 4: curățare

1. `MEMORY.md` rămâne sub 200 de linii. Dacă trece, muți detaliile în fișiere tematice în `memory/` (de exemplu `memory/preferinte.md`) și lași în `MEMORY.md` un rând cu trimitere.
2. Verifici că toate fișierele la care trimite `MEMORY.md` există.
3. Pui sus în `MEMORY.md` linia: `Ultima consolidare: {data de azi}`.

---

## Final

1. Rulează `bun scripts/dream-due.ts --gata`. Asta notează consolidarea și resetează numărătoarea de 5 zile.
2. Trimite-i omului pe Telegram un rezumat: câte intrări adăugate, câte actualizate, câte mutate, ce contradicții ai rezolvat și ce propuneri așteaptă acordul lui (SOUL.md, DECISIONS.md).

Nu raportezi consolidarea ca făcută dacă nu ai scris efectiv în fișiere. Dacă n-ai găsit nimic nou, spui asta și rulezi totuși pasul 1.
