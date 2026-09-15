# SigurnoIT — web stranica

Statična, responzivna web stranica za fiktivnu firmu za informacijsku sigurnost
"SigurnoIT". Čist HTML/CSS/JS, bez build alata — spremna za GitHub Pages.

## Struktura

```
├── index.html                 Početna
├── o-nama.html                O nama (misija, vizija, čime se bavimo, tim)
├── usluge.html                Usluge + cjenik edukacija
├── novosti.html                Popis svih članaka
├── clanak-1.html, -2.html, -3.html   Pojedinačni članci
├── kontakt.html                Kontakt forma + lokacija (Google karta)
├── politika-privatnosti.html
├── uvjeti-koristenja.html
├── partials/
│   ├── header.html            Zaglavlje — učitava se na svaku stranicu
│   └── footer.html            Podnožje (kontakt, newsletter) — učitava se na svaku stranicu
├── css/style.css
└── js/
    ├── include.js             Ubacuje header/footer i upravlja izbornikom
    └── main.js                Validacija i slanje formi (newsletter, kontakt)
```

Zaglavlje i podnožje postoje samo jednom (`partials/`) i automatski se
ubacuju u svaku stranicu putem `include.js`, tako da se pri izmjeni
kontakt podataka, navigacije ili newslettera to radi na jednom mjestu.

## Pregled na svom računalu

`include.js` koristi `fetch()` za učitavanje `partials/header.html` i
`partials/footer.html`, a preglednici to iz sigurnosnih razloga ne
dopuštaju kad se datoteka otvori izravno (`file://`). Zato stranicu
pokrenite kroz lokalni server, npr.:

- VS Code → ekstenzija "Live Server" → desni klik na `index.html` → *Open with Live Server*, ili
- u terminalu, u ovoj mapi: `python3 -m http.server 8000`, pa otvorite `http://localhost:8000`

## Newsletter i kontakt forma — VAŽNA NAPOMENA

Ovo je statična stranica (samo HTML/CSS/JS), pa nema svoj poslužitelj
koji bi upisivao podatke u pravu bazu podataka. `js/main.js` je napisan
tako da:

1. prvo pokuša poslati podatke na pravi backend endpoint (`/api/newsletter`
   odnosno `/api/contact`),
2. ako endpoint ne postoji ili nije dostupan, podaci se privremeno spremaju
   u `localStorage` preglednika — **samo za potrebe testiranja izgleda i
   validacije forme**, ne kao stvarna baza.

Za pravo spremanje emailova/upita u bazu (obavezno prije puštanja stranice
u produkciju) potreban je pravi backend — najjednostavnije opcije:

- mala Node.js/PHP/Python funkcija koja prima POST zahtjev i upisuje u
  bazu (npr. PostgreSQL, MySQL, Airtable),
- gotova usluga poput Formspree, Getform ili Google Forms/Sheets kao
  privremeno rješenje.

Kad backend postoji, samo zamijenite `NEWSLETTER_ENDPOINT` i
`CONTACT_ENDPOINT` na vrhu `js/main.js` stvarnim adresama — ostatak koda
već je spreman.

## Objava na GitHubu (GitHub Pages)

1. Na GitHubu kreirajte novi, prazan repozitorij (bez README-a).
2. U ovoj mapi pokrenite:
   ```
   git remote add origin <URL_VAŠEG_REPOZITORIJA>
   git branch -M main
   git push -u origin main
   ```
3. Na GitHubu: **Settings → Pages → Source: Deploy from a branch → Branch: main / (root)**.
4. Nakon nekoliko minuta stranica će biti dostupna na
   `https://<vaš-username>.github.io/<naziv-repozitorija>/`.

Git repozitorij je već inicijaliziran i sadrži prvi commit ("Initial
commit — SigurnoIT web stranica"), spreman za `git push`.

## Testirano/prilagođeno za

Stranica je izrađena responzivno (fluidni grid + media queries na
~1024px, ~860px, ~640px), pa se izgled prilagođava mobitelu, tabletu i
laptopu/desktopu. Provjerite i sami u alatima za razvojne inspekcije
preglednika (Chrome/Firefox DevTools → Toggle device toolbar) prije
objave.

## Popis podataka koje treba prilagoditi prije objave

- Naziv firme, logo, adresa (trenutno: Ivana Gundulića 14, Daruvar), telefon, email
- Poveznice na Facebook/Instagram/LinkedIn (trenutno vode na općenite naslovnice)
- Imena i uloge stručnjaka u `o-nama.html`
- Cijene u `usluge.html`
- Sadržaj članaka u `clanak-1/2/3.html`
