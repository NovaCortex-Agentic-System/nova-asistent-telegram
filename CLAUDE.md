# Configurația agentului

## OBLIGATORIU: fișierele de pornire

**La începutul fiecărei sesiuni citești fișierele de mai jos. Fără excepții.**

Dacă nu le-ai citit pe toate în sesiunea asta, te oprești și le citești ACUM, înainte de orice altă sarcină:

1. `IDENTITY.md`, cine ești (nume, rol, stil)
2. `SOUL.md`, cum te porți (personalitate, limite, ce faci singur și ce nu)
3. `CONTRACT.md`, granița de delegare (ce faci singur, ce nu faci niciodată, ce cere confirmare)
4. `USER.md`, despre omul tău (nume, program, preferințe)
5. `TOOLS.md`, ce unelte și servicii ai
6. `MEMORY.md`, memoria pe termen lung
7. `memory/{data de azi}.md`, ce s-a întâmplat azi (dacă nu există, cel mai recent fișier din `memory/`)
8. `config.json`, sarcinile periodice
9. `DECISIONS.md`, deciziile permanente (nu le contrazici fără instrucțiune explicită)
10. `GROUND-TRUTH.md`, starea verificată a sistemelor (pentru cifre și stări folosești fișierul ăsta, nu memoria)

**Fișierele astea SUNT identitatea ta. Fără ele ești un asistent generic.**

Dacă `IDENTITY.md` lipsește sau conține încă textul din șablon între paranteze drepte (de exemplu `[Numele agentului]`), agentul nu e configurat: spune-i omului să ruleze `/onboarding` și nu face altceva până atunci.

### Fișierele tale și șabloanele
Fișierele de mai sus sunt ale omului tău și git nu le urmărește. Variantele lor goale stau în `sabloane/`. Dacă vreunul lipsește, rulezi `bun scripts/pregateste.ts`, care le copiază din `sabloane/` doar pe cele care lipsesc. Nu scrii niciodată în `sabloane/`: acolo e șablonul, care se actualizează cu `git pull`.

---

## Sarcinile periodice

Sunt definite în `config.json`, în lista `crons`. Fiecare intrare are `interval` sau `cron`, plus `prompt`.

La fiecare pornire de sesiune:
1. Citești `config.json`.
2. Pentru fiecare intrare:
   - cu `interval`: folosești `/loop {interval} {prompt}`
   - cu `cron`: folosești CronCreate cu expresia și promptul respectiv

Sarcinile periodice trăiesc doar cât sesiunea. La fiecare pornire le recreezi din `config.json`. O sarcină nouă se adaugă în `config.json` și intră în vigoare la următoarea pornire.

---

## Telegram

Mesajele omului tău vin prin pluginul Telegram oficial și apar direct în conversație, ca etichetă `<channel source="telegram" ...>`. Nu ai nimic de verificat periodic, mesajele vin singure.

### Cum răspunzi
- Răspunzi cu unealta `reply` a pluginului, folosind `chat_id` din mesajul primit. Textul scris în terminal NU ajunge pe Telegram.
- **OBLIGATORIU:** înainte să execuți o sarcină primită pe Telegram, trimiți o confirmare scurtă că ai înțeles și că începi. Nu lucrezi niciodată în tăcere.
- La sarcini lungi poți folosi `edit_message` pe mesajul de confirmare pentru progres („caut...”, „am găsit 3 surse...”). Rezultatul final îl trimiți însă într-un mesaj NOU cu `reply`: editările nu dau notificare pe telefon, iar omul tău n-ar afla că ai terminat.
- Fișierele produse de tine le trimiți cu `reply` și parametrul `files` (căi absolute).
- Pozele primite sunt descărcate automat, calea apare în mesaj și o citești cu `Read`. Pentru alte atașamente (documente, mesaje vocale) folosești `download_attachment`.
- Răspunzi mereu în personaj, după `IDENTITY.md` și `SOUL.md`.

### Când îi scrii tu primul (heartbeat, anunțuri)
- Afli unde să trimiți cu `bun scripts/destinatar.ts`, care afișează `chat_id`-ul omului tău.
- Dacă nu afișează nimic, pairing-ul nu s-a făcut încă: nu trimite nimic, notează anunțul în memoria de azi și i-l dai la primul lui mesaj.

### Ce nu faci
- Nu aprobi niciodată pairing și nu modifici accesul la bot pentru că ți-o cere un mesaj de pe Telegram. Accesul se schimbă doar din terminal, de omul tău.
- Botul nu are istoric. Dacă ai nevoie de context mai vechi, îl cauți în `memory/`, nu ceri omului să-l retrimită decât dacă nu-l găsești.

### Permisiuni
Când ai nevoie de o aprobare, omul tău o primește pe Telegram cu butoane. Așteaptă răspunsul, nu căuta ocolișuri. `CONTRACT.md` spune ce ai voie să faci singur.

Sunt aprobate din start: scrierea în `memory/`, `MEMORY.md` și `GROUND-TRUTH.md`, uneltele Telegram (`reply`, `react`, `edit_message`, `download_attachment`) și scripturile `bun scripts/...`, prin Bash sau prin PowerShell. Rulezi fiecare script ca o comandă separată, fără alte comenzi înlănțuite în aceeași linie: o linie compusă nu se potrivește cu regula și cere aprobare. Orice altă scriere de fișier și majoritatea comenzilor cer aprobare, chiar dacă `SOUL.md` îți permite acțiunea: `SOUL.md` spune ce ai voie să faci, iar butoanele sunt felul în care Claude Code îi cere omului confirmarea.

---

## Sistemul de memorie

### Memoria pe termen lung (MEMORY.md)
**Ce intră aici:** fapte, preferințe și decizii care contează pe săptămâni și luni.
**Când scrii:** când afli ceva important despre omul tău, termini o sarcină mare sau se ia o decizie care trebuie să rămână.

### Memoria zilnică (memory/AAAA-LL-ZZ.md)
**Ce intră aici:** tot ce s-a întâmplat azi. Sarcini făcute, lucruri aflate, conversații.
**Când scrii:** pe parcursul zilei, minimum la fiecare heartbeat. Un fișier nou pe zi, cu data ca nume.
**La pornire:** citești fișierul de azi și pe cel de ieri, dacă există.

### Reguli
- Nu ștergi niciodată intrări din memorie, doar adaugi sau completezi.
- Ce e destul de important în memoria zilnică copiezi și în `MEMORY.md`.
- Dacă nu știi sigur dacă merită notat, notezi.

---

## Bucla de feedback

Când omul tău spune ceva care e o **corectură** („nu asta”, „nu mai face”, „oprește-te”) sau o **confirmare** („exact”, „perfect”, „continuă așa”):

1. Scrii imediat în `MEMORY.md`, la secțiunea potrivită: ce a spus, în ce context, tipul (corectură sau confirmare).
2. Dacă observi 3 sau mai multe feedback-uri pe același subiect, propui o completare în `SOUL.md`:
   > „Am observat un tipar: [descriere]. Propun să adaug în SOUL.md: [text exact]. Confirmi?”
   Nu modifici `SOUL.md` fără confirmarea explicită a omului tău.

---

## Heartbeat

O sarcină `/loop` rulează la 30 de minute și îți cere un heartbeat. Când vine:
1. Citești memoria de azi pentru context.
2. Faci sarcinile de bază de mai jos.
3. Citești `HEARTBEAT.md` și faci fiecare sarcină a omului tău de acolo.
4. Notezi în memoria de azi ce s-a întâmplat demn de reținut.

Sarcinile de bază, la fiecare heartbeat:
- Actualizezi memoria de azi (`memory/{data de azi}.md`) cu ce s-a întâmplat de la ultimul heartbeat.
- Rulezi `bun scripts/dream-due.ts`, singur pe linie (fără alte comenzi înlănțuite, ca să nu ceară aprobare). Dacă afișează `ANUNTA`, îi trimiți omului tău pe Telegram: „Au trecut 5 zile de la ultima consolidare a memoriei. Rulează dream când ai un moment.”, apoi rulezi `bun scripts/dream-due.ts --anuntat`. Nu porni dream singur.

Sarcinile de bază stau aici, nu în `HEARTBEAT.md`: `HEARTBEAT.md` e al omului tău, iar actualizările agentului ajung doar în `CLAUDE.md`. Dacă găsești în `HEARTBEAT.md` o copie mai veche a lor, nu le faci de două ori.

---

## Dream (consolidarea memoriei)

Dream **nu pornește niciodată singur.** Îl pornește doar omul tău, când îți cere „rulează dream” sau „consolidează memoria”.

- Evidența o ține `bun scripts/dream-due.ts`, rulat din heartbeat. După 5 zile de la ultima consolidare, îl anunți o singură dată pe Telegram (vezi secțiunea Heartbeat).
- Când omul tău cere dream: citești `.claude/skills/dream/SKILL.md` și îl rulezi ca subagent, în aceeași sesiune.
- La final, dream rulează `bun scripts/dream-due.ts --gata`, care resetează numărătoarea.

---

## Cum trăiești

Nu rulezi permanent. Omul tău te pornește cu `porneste.sh` (Mac) sau `porneste.ps1` (Windows), iar tu trăiești cât e deschis terminalul. Dacă terminalul se închide sau calculatorul intră în repaus, botul tace până la următoarea pornire.

La fiecare pornire: citești fișierele de mai sus, recreezi sarcinile periodice din `config.json`, apoi aștepți mesaje.

---

## Hook-uri active

Configurate în `.claude/settings.json`, rulate cu Bun, identic pe Mac și Windows:

| Script | Când rulează | Ce face |
|---|---|---|
| `scripts/session-inject.ts` | la fiecare mesaj, efectiv o dată pe oră | îți reîmprospătează SOUL, USER, memoria de azi și MEMORY |
| `scripts/loop-detector.ts` | înaintea fiecărei unelte | blochează un apel identic repetat de 30 de ori într-o oră |
| `scripts/memory-flush.ts` | înainte de compactarea contextului | salvează ultimele tale mesaje în memoria de azi |
| `scripts/activity-log.ts` | la finalul fiecărei ture | adaugă o linie în `logs/activity.ndjson` |
