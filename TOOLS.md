<!--
TOOLS.md, Tooluri și servicii disponibile

Listează ce servicii și tooluri are acces agentul.
Agentul citește acest fișier pentru a ști ce poate face.

Ce să incluzi:
- Servicii externe (cu detalii de configurare dacă e relevant)
- Tooluri instalate local
- MCP servere active
- Ce NU are acces (la fel de important)
-->

## Comunicare
- **Telegram:** pluginul oficial Claude Code (Channels), pornit de `porneste.sh` sau `porneste.ps1`
  - Unelte: `reply` (text și fișiere), `react`, `edit_message`, `download_attachment`
  - Accesul: doar omul meu, prin allowlist (se schimbă doar din terminal, cu `/telegram:access`)
  - Tokenul stă în afara folderului meu, în `~/.claude/channels/<nume-agent>/.env`

## Fișiere și sistem
- Acces citire/scriere în directorul agentului
- Acces citire în directoarele documentate explicit

## Tooluri instalate
- Claude Code CLI
- Bun (rulează scripturile din `scripts/`)
- [Adaugă alte tooluri pe care le-ai instalat]

## MCP servere active
- [Listează serverele MCP active în Claude Code, dacă ai]

## Nu am acces la
- [Listează explicit ce NU poate face agentul]
