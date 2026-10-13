# nova-asistent-telegram

Un agent personal Claude Code cu care vorbești pe Telegram. Merge pe Mac și pe Windows.

Agentul are identitate, reguli, memorie zilnică și pe termen lung, învață din corecturile tale și face singur o rundă de verificări la fiecare 30 de minute. Îl pornești cu o comandă și trăiește cât e deschis terminalul. Nu rulează 24/7.

Instalarea pas cu pas, plus ce faci când ceva nu merge: **[GHID-INSTALARE.md](GHID-INSTALARE.md)**.

---

## Cum funcționează

- **Telegram prin Channels.** Pluginul oficial Telegram al Claude Code aduce mesajele tale direct în sesiunea agentului, imediat, fără verificări periodice.
- **Permisiuni de pe telefon.** Când agentul vrea să facă ceva care cere aprobare, primești pe Telegram un mesaj cu butoane.
- **Tokenul botului stă în afara folderului agentului**, în `~/.claude/channels/<nume-agent>/.env`. Nu ajunge în iCloud și nici pe GitHub.
- **Fiecare agent are botul lui.** Poți avea mai mulți agenți pe același calculator, fiecare în folderul lui.
- **Dream doar la cerere.** Agentul te anunță pe Telegram când au trecut 5 zile de la ultima consolidare a memoriei. Nu o pornește singur.

## Ce ai nevoie

- Claude Code (în VS Code sau în terminal), cu cont claude.ai sau cheie din Console
- Bun (onboarding-ul îl instalează cu acordul tău)
- Telegram pe telefon

Channels e în research preview. Pe planurile Team și Enterprise trebuie activat de Owner-ul organizației. Pe Pro și Max merge direct.

## Structura

| Fișier | Rol |
|---|---|
| `CLAUDE.md` | Contractul agentului: ce citește la pornire, cum răspunde pe Telegram, memoria, heartbeat-ul |
| `IDENTITY.md`, `SOUL.md`, `CONTRACT.md`, `USER.md`, `TOOLS.md` | Cine e agentul, cum se poartă, ce are voie, despre tine, ce unelte are |
| `MEMORY.md`, `memory/` | Memoria pe termen lung și jurnalele zilnice |
| `DECISIONS.md`, `GROUND-TRUTH.md` | Decizii permanente și starea verificată a sistemelor |
| `HEARTBEAT.md`, `config.json` | Ce face agentul la fiecare 30 de minute |
| `porneste.sh`, `porneste.ps1` | Pornirea pe Mac, respectiv pe Windows |
| `scripts/` | Hook-urile și uneltele agentului, în TypeScript, rulate cu Bun |
| `.claude/skills/` | `onboarding`, `dream`, `skill-optimizer` |
| `tests/` | Testele, rulate cu `bun test` |

## Testele

```
bun test
```

La fiecare push, GitHub Actions rulează testele pe o mașină Windows și pe una Mac (`.github/workflows/teste.yml`). Pe lângă suită, verifică pe sistemul real: preluarea tokenului din clipboard și golirea lui, pornirea fără token (inclusiv diacriticele din mesajele PowerShell) și hook-urile rulate prin bash și prin PowerShell.

Ce nu se poate testa automat: o sesiune completă cu un bot adevărat (pairing, mesaje, butoanele de permisiune). Asta s-a verificat doar parțial, pe Mac.

## Proveniență

Derivat din [mister-o-template](https://github.com/danutmitrut/mister-o-template), care rulează 24/7 pe Mac cu launchd. Varianta asta renunță la rularea permanentă în schimbul compatibilității cu Windows și al unei instalări mai simple.
