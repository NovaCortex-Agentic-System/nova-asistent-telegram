# Design: nova-asistent-telegram

Data: 2026-10-12
Sursă: `PROIECTE AI/mister-o-template` (template Mister O, Telegram prin polling, Mac + launchd)
Destinație: `PROIECTE AI/mister-o-template-telegram`, publicat ca `NovaCortex-Agentic-System/nova-asistent-telegram`

## Scop

Un template de agent personal Claude Code pentru cursanți, care comunică prin Telegram și rulează pe Mac și pe Windows. Agentul trăiește cât e deschis terminalul în care a fost pornit. Nu e 24/7.

Template-ul păstrează identitatea, memoria și obiceiurile lui Mister O, dar înlocuiește polling-ul Telegram cu pluginul oficial Claude Code Channels și renunță la tot aparatul de supraviețuire macOS.

## Decizii luate

1. **Varianta A:** adaptăm template-ul existent, nu construim de la zero.
2. **Publicul:** cursanți.
3. **Fără 24/7.** Pornire manuală cu un script, viață cât ține terminalul.
4. **Mac și Windows**, cu aceleași fișiere, mai puțin scripturile de pornire.
5. **Scripturile în TypeScript, rulate cu Bun.** Bun e oricum cerut de pluginul Telegram, deci nu e o dependență nouă. Fără Python, fără Bash în hook-uri.
6. **Template nou, repo nou.** `mister-o-template` rămâne neatins, pentru că e public și clienții îl actualizează cu `git pull`.
7. **Dream rămâne manual.** Agentul doar notifică pe Telegram când au trecut 5 zile de la ultima consolidare, o singură dată până la următoarea.
8. **Tokenul botului se preia din clipboard** și se scrie într-un `.env` din afara folderului agentului.
9. **Ordinea de livrare:** build și teste, apoi repo în biblioteca Nova, apoi ghidul de instalare.

## Ce pleacă din template-ul sursă

| Element | Motiv |
|---|---|
| `scripts/agent-wrapper.sh`, `generate-launchd.sh`, `generate-supervisor-launchd.sh` | Fără 24/7, launchd există doar pe Mac |
| `scripts/supervisor.sh`, `supervisor-selftest.sh`, `lib/supervisor-lib.sh`, `mark-alive.sh`, `notify.sh` | Supervisorul are sens doar pentru un proces permanent |
| `.claude/skills/telegram-bot/` (check și send) | Înlocuit de pluginul Channels |
| Cronul de 1 minut din `config.json` | Mesajele intră direct în sesiune |
| `scripts/dream-hook.sh` | Pornea un al doilea Claude cu `nohup`; dream devine manual |
| `scripts/heartbeat-memory.sh` | Citea din basic-memory, proiectul personal `mem-dm` al lui Dan; la cursant nu face nimic |
| `.claude/skills/multimodal-rag/`, `scripts/mmrag.sh` | Decizia lui Dan; dependențe Python grele |
| `scripts/lib/test-helpers.sh` și testele de supervisor, launchd, wrapper, notify, mark-alive | Codul testat dispare |
| Secțiunea „Persistence” din `CLAUDE.md` | Nu mai există launchd și tmux |

## Ce rămâne

Fișierele de identitate și stare: `IDENTITY.md`, `SOUL.md`, `CONTRACT.md`, `USER.md`, `TOOLS.md`, `MEMORY.md`, `DECISIONS.md`, `GROUND-TRUTH.md`, `HEARTBEAT.md`, folderul `memory/`.

Skill-uri: `onboarding` (rescris), `dream` (fără hook automat), `skill-optimizer` (neschimbat).

Mecanisme: memoria zilnică, feedback loop, heartbeat la 30 de minute, hook-urile session-inject, loop-detector, memory-flush, activity-log.

## Structura

```
mister-o-template-telegram/
├── CLAUDE.md
├── IDENTITY.md  SOUL.md  CONTRACT.md  USER.md  TOOLS.md
├── MEMORY.md  DECISIONS.md  GROUND-TRUTH.md  HEARTBEAT.md
├── config.json
├── memory/
├── porneste.sh
├── porneste.ps1
├── scripts/
│   ├── session-inject.ts
│   ├── loop-detector.ts
│   ├── memory-flush.ts
│   ├── activity-log.ts
│   ├── dream-due.ts
│   ├── token.ts
│   └── lib/cai.ts
├── .claude/
│   ├── settings.json
│   └── skills/
│       ├── onboarding/
│       ├── dream/
│       └── skill-optimizer/
├── tests/
├── GHID-INSTALARE.md
├── README.md
└── .gitignore
```

`scripts/lib/cai.ts` adună într-un singur loc calculul căilor comune (folderul agentului, folderul temporar al sistemului, folderul de stare Telegram, folderul de sesiuni Claude Code), ca restul scripturilor să nu repete logica diferită între Mac și Windows.

## Componentele

### Scripturile de pornire

`porneste.sh` (Mac) și `porneste.ps1` (Windows) fac același lucru, în ordinea asta:

1. Intră în folderul agentului.
2. Verifică că `bun` există. Dacă nu, afișează comanda de instalare pentru sistemul respectiv și se opresc.
3. Verifică că există `.env`-ul cu token în folderul de stare. Dacă nu, spun că trebuie rulat întâi `/onboarding` și se opresc.
4. Setează `TELEGRAM_STATE_DIR` la `~/.claude/channels/<nume-agent>/`, unde `<nume-agent>` e numele folderului agentului.
5. Pornesc `claude --channels plugin:telegram@claude-plugins-official`.

Dacă sesiunea pornește dar Channels nu se activează, utilizatorul vede mesajul Claude Code. Ghidul acoperă cazul Team și Enterprise.

### Telegram prin Channels

- Mesajele intră direct în sesiune. Pe Telegram apare indicatorul de scriere cât lucrează agentul.
- Regula din `CLAUDE.md` rămâne: înainte de orice sarcină primită pe Telegram, agentul trimite o confirmare scurtă. Folosește `reply`; la sarcini lungi poate folosi `edit_message` pe confirmare pentru progres, dar rezultatul final pleacă într-un mesaj nou, fiindcă editările nu dau notificare pe telefon (corectat la implementare, după instrucțiunile pluginului).
- Pozele primite ajung în inbox-ul din folderul de stare și agentul le citește cu `Read`. Fișierele produse pleacă prin `reply` cu `files`.
- Botul nu are istoric. Dacă agentul are nevoie de context vechi, îl caută în `memory/`, nu pe Telegram.

### Permisiuni

- Agentul pornește în modul normal de permisiuni, nu cu skip.
- Cererile de permisiune ajung pe Telegram cu butoane, prin releul de permisiuni al pluginului.
- `.claude/settings.json` aprobă din start doar `bun scripts/*.ts` și comenzile de citire a clipboard-ului folosite la onboarding.
- `CONTRACT.md` rămâne granița de delegare scrisă.

### Accesul la bot

Onboarding-ul face pairing-ul, apoi setează imediat politica `allowlist`. Fără pasul al doilea, oricine găsește botul primește coduri de pairing.

### Tokenul

1. Onboarding-ul îl ghidează pe cursant prin BotFather și îi cere să copieze tokenul și să scrie că l-a copiat.
2. Agentul citește clipboard-ul cu `pbpaste` (Mac) sau `Get-Clipboard` (Windows), direct într-o variabilă, fără să-l afișeze.
3. Verifică forma: cifre, două puncte, apoi caractere din setul `A-Za-z0-9_-`. Dacă nu se potrivește, nu scrie nimic și cere recopierea.
4. Scrie `TELEGRAM_BOT_TOKEN=...` în `~/.claude/channels/<nume-agent>/.env`, în afara folderului agentului (nu ajunge în iCloud și nici în git).
5. Golește clipboard-ul.

Tokenul nu apare niciodată în chat, în memorie sau în fișierele agentului.

### Hook-urile

Toate rulate cu `bun scripts/<nume>.ts`, aceeași comandă pe ambele sisteme.

| Script | Hook | Comportament |
|---|---|---|
| `session-inject.ts` | UserPromptSubmit | O dată pe oră injectează SOUL, USER, MEMORY și memoria de azi. Blocarea pe oră folosește un fișier în folderul temporar al sistemului. |
| `loop-detector.ts` | PreToolUse | Blochează un apel identic repetat de prea multe ori într-o oră. Pragul coboară de la 150 la 30, fiindcă nu mai există cronul de 1 minut care repeta legitim apeluri. |
| `memory-flush.ts` | PreCompact | Scrie un rezumat al ultimelor mesaje în memoria zilnică, cel mult o dată la 10 minute. Folderul de sesiuni se calculează după regula de nume a Claude Code pe sistemul curent. Fără basic-memory. |
| `activity-log.ts` | Stop | Jurnal de activitate în `logs/activity.ndjson`, în folderul agentului (ignorat de git). |
| `dream-due.ts` | apelat din heartbeat | Citește `.last-dream` și `.dream-anuntat`. Dacă au trecut 5 zile de la ultimul dream și nu s-a anunțat încă, afișează `ANUNTA`; altfel nu afișează nimic. |

### Heartbeat

- `config.json` păstrează doar intrarea de 30 de minute și blocul de pornire; blocul `supervisor` dispare.
- La pornire, agentul își programează heartbeat-ul cu `/loop 30m`.
- `HEARTBEAT.md` are ca sarcini de bază: actualizarea memoriei zilnice și rularea `bun scripts/dream-due.ts`. Dacă scriptul afișează `ANUNTA`, agentul trimite pe Telegram: „Au trecut 5 zile de la ultima consolidare a memoriei. Rulează dream când ai un moment.” și creează `.dream-anuntat`.

### Dream

- Se pornește doar când cere utilizatorul.
- La final, dream scrie `.last-dream` și șterge `.dream-anuntat`, ca numărătoarea să o ia de la capăt.
- Verificarea de 24 de ore din `CLAUDE.md` dispare.

### Onboarding

Skill-ul `onboarding` e rescris pentru fluxul nou:

1. Completează IDENTITY, SOUL, USER, CONTRACT și TOOLS prin întrebări.
2. Ghidează cursantul prin BotFather.
3. Preia tokenul din clipboard, ca mai sus.
4. Îi spune cursantului să închidă sesiunea și să ruleze scriptul de pornire în terminalul integrat din VS Code.
5. După pornire, ghidează pairing-ul și trecerea pe allowlist.
6. Test final: un mesaj dus-întors și o cerere de permisiune aprobată de pe telefon.

## Testele

- Rescrise în `bun test`, aceeași comandă pe Mac și Windows.
- Acoperă: fiecare hook (intrare JSON, ieșire, fișiere create), calculul căilor pe stil Mac și stil Windows, `dream-due.ts` (prima rulare, sub 5 zile, peste 5 zile, deja anunțat), validarea formei tokenului, structura `config.json` și a `HEARTBEAT.md`.
- Pe Windows: dacă există o mașină disponibilă, suita rulează acolo înainte de publicare. Dacă nu, README-ul și ghidul marchează explicit „netestat pe Windows”.

## Publicarea în biblioteca Nova

- Repo: `NovaCortex-Agentic-System/nova-asistent-telegram`, public, ca restul bibliotecii.
- Descriere: „Agent personal Claude Code pe Telegram, pentru Mac și Windows, fără 24/7”.
- Crearea repo-ului și push-ul se fac separat, fiecare după confirmarea explicită a lui Dan.

## Ghidul de instalare

`GHID-INSTALARE.md`, scris după ce repo-ul există, ca adresa de clonare să fie reală.

1. **Cerințe:** Claude Code în VS Code, cont claude.ai sau cheie Console, Telegram pe telefon. Notă: Channels e în research preview; pe planurile Team și Enterprise trebuie activat de Owner-ul organizației (Organization settings, Claude Code, Channels). Pro și Max nu au barieră.
2. **Instalarea:** clonare, pregătirea uneltelor (Bun și pluginul), `/onboarding`, pornire și pairing, verificare. Fiecare pas cu promptul de lipit în Claude Code; unde e nevoie de terminal, comenzile date pe rând, separat pentru Mac și Windows, fără blocuri pe mai multe linii.
3. **Ce merge prost:** organizat după simptom. Pentru fiecare: cauza probabilă, cum verifici, ce faci. Lista de pornire:
   - Botul nu răspunde deloc (sesiune închisă, laptop în sleep, pornit fără scriptul de pornire)
   - Scriptul de pornire spune că lipsește Bun
   - Scriptul de pornire spune că lipsește tokenul
   - Onboarding-ul spune că tokenul e greșit
   - Botul trimite un cod în loc să răspundă (pairing neterminat)
   - Străinii primesc coduri de la bot (politica nu e pe allowlist)
   - Apare un mesaj cu butoane (cerere de permisiune)
   - Channels nu pornește pe cont de firmă (Team sau Enterprise neactivat)

   Lista se completează doar cu probleme întâlnite efectiv la testare, nu cu probleme presupuse.

## În afara scopului

- Rulare 24/7 și repornire automată.
- Grupuri Telegram și mai mulți utilizatori pe același bot.
- Transcrierea mesajelor vocale. Pluginul le livrează ca atașament descărcabil (`download_attachment`), dar nu le transcrie, iar o unealtă de transcriere ar fi o dependență în plus.
- Migrarea instalărilor existente de `mister-o-template`.
