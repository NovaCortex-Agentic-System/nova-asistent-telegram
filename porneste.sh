#!/usr/bin/env bash
# Pornește agentul pe Mac. Agentul trăiește cât e deschis terminalul ăsta.
set -e
cd "$(dirname "$0")"

if ! command -v bun >/dev/null 2>&1; then
  echo "Lipsește Bun. Instalează-l cu comanda de mai jos, apoi deschide un terminal nou și rulează din nou ./porneste.sh"
  echo "curl -fsSL https://bun.sh/install | bash"
  exit 1
fi

if ! command -v claude >/dev/null 2>&1; then
  echo "Lipsește Claude Code din terminal. Vezi pasul de pregătire din GHID-INSTALARE.md."
  exit 1
fi

if ! bun scripts/token.ts --exista; then
  echo "Nu găsesc tokenul botului. Rulează întâi /onboarding în Claude Code, din folderul agentului."
  exit 1
fi

export TELEGRAM_STATE_DIR="$(bun scripts/token.ts --cale)"

echo "Pornesc agentul. Închiderea terminalului îl oprește."
echo "Dacă botul nu răspunde și ai cont de firmă (Team sau Enterprise), Channels trebuie activat de Owner-ul organizației."
# Promptul stă ÎNAINTEA lui --channels: --channels primește mai multe valori
# și ar lua promptul drept al doilea canal (eroarea „--channels entries must be tagged”).
exec claude "Pornire. Citește fișierele de bootstrap din CLAUDE.md, apoi programează heartbeat-ul din config.json." --channels plugin:telegram@claude-plugins-official
