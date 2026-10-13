# Ghid de instalare

La final o să ai un agent personal cu care vorbești pe Telegram. Instalarea durează în jur de 20 de minute. Aproape tot faci prin chatul Claude Code din VS Code, iar terminalul îl folosești doar la pornire.

Ghidul are trei părți:
1. [Instalarea](#partea-1-instalarea), cinci pași
2. [Folosirea de zi cu zi](#partea-2-folosirea-de-zi-cu-zi)
3. [Ce merge prost](#partea-3-ce-merge-prost), organizată după ce vezi pe ecran

> Template-ul a fost testat pe Mac. Pe Windows nu a fost încă testat. Dacă ești pe Windows și ceva nu merge, notează exact ce mesaj vezi.

---

## Înainte să începi

Ai nevoie de:
- **VS Code** cu extensia **Claude Code** instalată și logată
- **Claude Code și în terminal.** Deschide terminalul din VS Code (meniul Terminal, apoi New Terminal) și scrie `claude --version`. Dacă vezi un număr de versiune, e în regulă. Dacă nu, vezi [„command not found: claude”](#în-terminal-apare-command-not-found-claude-sau-claude-nu-este-recunoscut)
- **Telegram** pe telefon
- **Un cont Claude** Pro, Max, Team sau Enterprise, ori o cheie din Console

> **Atenție dacă ai cont de firmă (Team sau Enterprise).** Agentul folosește funcția Channels din Claude Code, care e încă în research preview. Pe conturile de firmă e blocată până când Owner-ul organizației o activează din Organization settings, apoi Claude Code, apoi Channels. Pe Pro și Max merge direct.

---

## Partea 1: instalarea

### Pasul 1: descarcă agentul

Alege numele folderului cu grijă: **numele folderului devine numele agentului**, iar agentul își ține tokenul botului într-un loc care depinde de nume. Dacă redenumești folderul mai târziu, va trebui să refaci pasul cu tokenul.

Deschide chatul Claude Code în VS Code și lipește promptul de mai jos, după ce înlocuiești cele două valori dintre paranteze:

```
Clonează https://github.com/NovaCortex-Agentic-System/nova-asistent-telegram într-un folder nou numit [numele-agentului], în [locul unde vrei să stea, de exemplu folderul meu de proiecte]. Nu modifica nimic în el. La final spune-mi calea completă.
```

Apoi deschide folderul agentului în VS Code: meniul File, apoi Open Folder, și alegi folderul tocmai creat. De aici încolo lucrezi doar în fereastra asta.

### Pasul 2: configurarea

În chatul Claude Code din fereastra agentului scrie:

```
/onboarding
```

Agentul te ia pe rând prin:
- instalarea **Bun** (de el depinde pluginul Telegram) și a **pluginului Telegram**, fiecare cu acordul tău
- identitatea agentului, regulile lui, câteva lucruri despre tine și uneltele tale
- crearea botului în Telegram, prin **@BotFather**

La final, BotFather îți dă un **token** de forma `123456789:AAH...`. **Copiază-l, dar nu-l lipi în chat.** Scrie doar „am copiat tokenul”. Agentul îl ia singur din clipboard, îl verifică, îl salvează în afara folderului său și golește clipboard-ul. Tokenul nu apare nicăieri în conversație.

### Pasul 3: pornirea

Agentul trăiește într-un terminal separat, nu în chatul de configurare. Deschide terminalul în VS Code (meniul Terminal, apoi New Terminal) și scrie comanda pentru sistemul tău.

Pe Mac:

```
./porneste.sh
```

Pe Windows:

```
powershell -ExecutionPolicy Bypass -File .\porneste.ps1
```

La prima pornire, Claude Code te întreabă dacă ai încredere în folder. Răspunde da.

Chatul de configurare îl poți închide acum.

### Pasul 4: conectează-te la bot și închide ușa

1. Pe Telegram, caută botul după username-ul ales la BotFather și scrie-i orice mesaj. Botul îți răspunde cu un cod de 6 caractere.
2. În **terminalul unde rulează agentul** scrie, cu codul tău:

```
/telegram:access pair [codul]
```

3. Imediat după, tot acolo:

```
/telegram:access policy allowlist
```

Pasul 3 e obligatoriu. Fără el, oricine găsește botul primește coduri de conectare. Cu el, botul îi ignoră pe toți în afară de tine.

### Pasul 5: verificarea

Fă două teste:
1. Scrie-i botului „salut”. Trebuie să-ți răspundă în personaj, cu numele și stilul stabilite la configurare.
2. Scrie-i botului: „creează fișierul test-permisiune.txt în folderul tău cu textul merge”. Pe Telegram trebuie să apară un mesaj cu butoane care cere aprobarea ta. Aprobă. Fișierul trebuie să apară în folderul agentului. După test îl poți șterge.

Dacă ambele merg, agentul e gata.

---

## Partea 2: folosirea de zi cu zi

**Pornirea.** Deschizi folderul agentului în VS Code, deschizi terminalul și rulezi aceeași comandă de la Pasul 3.

**Oprirea.** În terminalul agentului scrii `/exit`. Și închiderea terminalului sau a VS Code îl oprește.

**Cât trăiește.** Cât e deschis terminalul și cât e treaz calculatorul. Când calculatorul intră în repaus, botul tace până la trezire.

**Ce face singur.** La fiecare 30 de minute, cât e pornit, parcurge lista din `HEARTBEAT.md` și își notează ziua în `memory/`. Lista o poți completa oricând.

**Dream.** O dată la 5 zile, agentul îți scrie pe Telegram că e timpul să-i consolidezi memoria. Nu o face singur. Când vrei, îi scrii „rulează dream”. Îți trimite la final ce a schimbat.

**Când îl corectezi.** Spune-i direct ce n-a fost bine („nu mai face asta”). Notează corectura în memorie. Dacă aceeași corectură apare de trei ori, îți propune să o treacă în regulile lui permanente, dar doar cu acordul tău.

---

## Partea 3: ce merge prost

Caută mai jos ce vezi pe ecran. Fiecare caz are cauza probabilă, cum verifici și ce faci.

### Botul nu răspunde deloc

**Cauza probabilă:** agentul nu e pornit, sau a fost pornit fără scriptul de pornire.

**Verifici:**
1. Terminalul în care ai rulat `porneste.sh` sau `porneste.ps1` e încă deschis și Claude Code rulează în el?
2. Calculatorul a intrat în repaus?
3. Ai pornit agentul cu scriptul? Dacă ai scris doar `claude` în terminal, sesiunea nu primește mesaje de pe Telegram.

**Faci:** pornești din nou cu comanda de la Pasul 3. Dacă ai cont de firmă, vezi și cazul următor.

### Am cont de firmă și botul nu răspunde, deși agentul e pornit

**Cauza probabilă:** Channels nu e activat în organizația ta.

**Faci:** îi ceri Owner-ului organizației să activeze Channels din Organization settings, apoi Claude Code, apoi Channels. Până atunci, botul nu poate primi mesaje.

### La pornire apare „Lipsește Bun”

**Cauza probabilă:** Bun nu e instalat, sau e instalat dar terminalul a fost deschis înainte de instalare.

**Faci:** închide terminalul, deschide unul nou și încearcă din nou. Dacă tot apare mesajul, rulează comanda de instalare afișată de script, apoi deschide încă o dată un terminal nou.

### În terminal apare „command not found: claude” sau „claude nu este recunoscut”

**Cauza probabilă:** ai extensia Claude Code în VS Code, dar nu și programul `claude` în terminal.

**Faci:** instalezi Claude Code pentru terminal, apoi deschizi un terminal nou.

Pe Mac:

```
curl -fsSL https://claude.ai/install.sh | bash
```

Pe Windows (PowerShell):

```
irm https://claude.ai/install.ps1 | iex
```

Dacă pe Windows apare „'irm' is not recognized”, ești în Command Prompt, nu în PowerShell. În terminalul din VS Code, la săgeata de lângă semnul plus, alegi PowerShell și rulezi comanda din nou.

La prima rulare a comenzii `claude` îți cere să te loghezi. Folosește același cont ca în VS Code.

### La pornire apare „Nu găsesc tokenul botului”

**Cauza probabilă:** n-ai terminat configurarea, sau ai redenumit sau mutat folderul agentului după configurare.

**Faci:** în chatul Claude Code din folderul agentului scrii `/onboarding`. Agentul vede ce e deja configurat și te duce doar prin pasul cu tokenul. Pentru tokenul existent, la BotFather trimiți `/mybots`, alegi botul, apoi API Token.

### Pe Windows apare „running scripts is disabled on this system”

**Cauza probabilă:** ai rulat `.\porneste.ps1` direct. Windows blochează implicit scripturile PowerShell descărcate.

**Faci:** pornești cu comanda completă de la Pasul 3: `powershell -ExecutionPolicy Bypass -File .\porneste.ps1`. Ocolirea e valabilă doar pentru rularea asta, nu schimbă setările calculatorului.

### Configurarea spune că tokenul nu arată a token

**Cauza probabilă:** în clipboard era altceva, sau tokenul a fost copiat pe jumătate.

**Faci:** la BotFather, copiază din nou tokenul întreg, inclusiv cifrele de la început și cele două puncte. Apoi scrie din nou „am copiat tokenul”.

### Am lipit din greșeală tokenul în chat

**Cauza:** tokenul a ajuns în istoricul conversației.

**Faci:** la BotFather trimiți `/revoke`, alegi botul și primești un token nou. Pe cel nou îl copiezi și scrii „am copiat tokenul”, fără să-l lipești.

### Botul îmi răspunde cu un cod în loc să-mi răspundă la mesaj

**Cauza probabilă:** conectarea de la Pasul 4 nu s-a terminat.

**Faci:** în terminalul agentului rulezi `/telegram:access pair [codul]` cu codul primit, apoi `/telegram:access policy allowlist`.

### Alți oameni primesc coduri de la botul meu

**Cauza probabilă:** n-ai rulat pasul care închide accesul.

**Faci:** în terminalul agentului: `/telegram:access policy allowlist`.

### A apărut pe Telegram un mesaj cu butoane

**Cauza:** agentul vrea să facă ceva care cere aprobarea ta (să scrie un fișier, să ruleze o comandă). E comportamentul normal.

**Faci:** citești ce vrea să facă și aprobi sau refuzi. Cât timp nu răspunzi, agentul așteaptă. Ce poate face fără să te întrebe stabilești în `CONTRACT.md`.

### Agentul a scris răspunsul în terminal, dar pe Telegram n-a venit nimic

**Cauza probabilă:** agentul a uitat să folosească unealta de trimitere pe Telegram. Textul din terminal nu ajunge la tine.

**Faci:** scrie-i pe Telegram „răspunde-mi aici, pe Telegram”. Dacă se repetă, corectează-l explicit, ca să-și noteze în memorie.

### Agentul a lucrat, dar n-am primit notificare când a terminat

**Cauza probabilă:** a actualizat mesajul de confirmare în loc să trimită unul nou. Pe Telegram, mesajele editate nu dau notificare.

**Faci:** spune-i „când termini, trimite-mi rezultatul într-un mesaj nou”. Regula e deja în `CLAUDE.md`, corectura îl ajută să și-o noteze.

### Nu găsesc aici problema mea

Notează exact ce mesaj apare și la ce pas. În chatul Claude Code din folderul agentului poți scrie: „La pasul [X] din GHID-INSTALARE.md văd [mesajul exact]. Ce se întâmplă?”
