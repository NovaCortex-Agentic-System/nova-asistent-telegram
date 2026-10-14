# Pornește agentul pe Windows. Agentul trăiește cât e deschis terminalul ăsta.
# Rulare: powershell -ExecutionPolicy Bypass -File .\porneste.ps1
Set-Location $PSScriptRoot

if (-not (Get-Command bun -ErrorAction SilentlyContinue)) {
  Write-Host "Lipsește Bun. Instalează-l cu comanda de mai jos, apoi deschide un terminal nou și rulează din nou porneste.ps1"
  Write-Host 'powershell -c "irm bun.sh/install.ps1 | iex"'
  exit 1
}

if (-not (Get-Command claude -ErrorAction SilentlyContinue)) {
  Write-Host "Lipsește Claude Code din terminal. Vezi pasul de pregătire din GHID-INSTALARE.md."
  exit 1
}

# Fișierele personale care lipsesc se creează din sabloane/ (cele existente nu sunt atinse).
bun scripts/pregateste.ts

bun scripts/token.ts --exista
if ($LASTEXITCODE -ne 0) {
  Write-Host "Nu găsesc tokenul botului. Rulează întâi /onboarding în Claude Code, din folderul agentului."
  exit 1
}

$env:TELEGRAM_STATE_DIR = (bun scripts/token.ts --cale)

Write-Host "Pornesc agentul. Închiderea terminalului îl oprește."
Write-Host "Dacă botul nu răspunde și ai cont de firmă (Team sau Enterprise), Channels trebuie activat de Owner-ul organizației."
# Promptul stă ÎNAINTEA lui --channels: --channels primește mai multe valori
# și ar lua promptul drept al doilea canal (eroarea „--channels entries must be tagged”).
# --permission-mode manual: modul normal, cu aprobări prin butoane pe Telegram, oricum ar fi
# setat Claude Code pe calculatorul respectiv (auto mode sau alt mod implicit).
# --settings .claude/pornire.json: pluginul Telegram e oprit peste tot (în cont și în folderul agentului)
# și se activează doar aici. Altfel orice chat Claude Code îl încarcă fără token, pică, iar Claude Code
# nu mai încearcă să-l conecteze timp de ~15 minute, nici în sesiunea agentului.
claude "Pornire. Citește fișierele de bootstrap din CLAUDE.md, apoi programează heartbeat-ul din config.json." --permission-mode manual --settings .claude/pornire.json --channels plugin:telegram@claude-plugins-official
