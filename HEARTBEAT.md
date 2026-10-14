# Heartbeat

Fișierul ăsta e citit la fiecare heartbeat (implicit la 30 de minute, cât timp sesiunea e deschisă).
Adaugă aici sarcinile pe care vrei ca agentul să le facă periodic.

## Sarcini de bază (active mereu)

- [ ] Actualizează memoria de azi (`memory/{data de azi}.md`) cu ce s-a întâmplat de la ultimul heartbeat
- [ ] Rulează `bun scripts/dream-due.ts`, singur pe linie (fără alte comenzi înlănțuite, ca să nu ceară aprobare). Dacă afișează `ANUNTA`, trimite-i omului tău pe Telegram: „Au trecut 5 zile de la ultima consolidare a memoriei. Rulează dream când ai un moment.”, apoi rulează `bun scripts/dream-due.ts --anuntat`. Nu porni dream singur.

## Sarcini opționale (decomentează sau adaugă)

<!-- - [ ] Verifică starea serviciilor din GROUND-TRUTH.md -->
<!-- - [ ] Trimite un rezumat scurt pe Telegram dacă e după ora 18:00 și nu l-ai trimis azi -->

---

*Heartbeat-ul rulează doar cât e deschisă sesiunea. Dacă închizi terminalul, se oprește și el.*
