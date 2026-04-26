# Finanza & Futuro — sito ufficiale

Sito statico costruito con [Astro 5](https://astro.build/), Tailwind CSS e una sola "isola" React (menu mobile). Pensato per **SEO** e **GEO** (Generative Engine Optimization): tutto il contenuto è renderizzato come HTML al build, niente prerender lato server, zero JavaScript di default.

> **Claim:** Educhiamo per proteggere il tuo patrimonio
> **Stack:** Astro · Tailwind · TypeScript · React (solo per il menu mobile)
> **Deploy:** Vercel
> **Dominio target:** `finanzafuturo.it`

---

## Struttura del progetto

```
finanza-futuro-site/
├── astro.config.mjs        # integrazioni (tailwind, sitemap, react, icon)
├── tailwind.config.mjs
├── tsconfig.json
├── vercel.json             # cache headers + security headers
├── package.json
├── public/
│   ├── favicon.ico
│   ├── robots.txt          # ammissione esplicita per AI bot (GPTBot, ClaudeBot, PerplexityBot, ecc.)
│   ├── llms.txt            # standard de facto per Generative Engine Optimization
│   └── images/
│       └── finanza-futuro-logo.png
└── src/
    ├── styles/global.css   # design tokens (CSS vars + Tailwind layers)
    ├── layouts/
    │   └── BaseLayout.astro    # meta SEO/OG/Twitter + JSON-LD Organization e WebPage
    ├── components/
    │   ├── Header.astro
    │   ├── MobileMenu.tsx      # unica React island, client:load
    │   ├── Footer.astro
    │   ├── Hero.astro
    │   ├── TargetSegments.astro
    │   └── Method.astro
    └── pages/
        ├── index.astro         # /
        ├── dirigenti.astro     # /dirigenti
        ├── post-exit.astro     # /post-exit
        ├── famiglie-hnwi.astro # /famiglie-hnwi
        ├── servizi.astro       # /servizi
        ├── chi-siamo.astro     # /chi-siamo
        └── 404.astro
```

---

## Sviluppo locale

Richiede **Node.js 20+** (consigliato 22 LTS).

```bash
npm install
npm run dev
# apri http://localhost:4321
```

Comandi utili:

| Comando            | Cosa fa                                               |
|--------------------|-------------------------------------------------------|
| `npm run dev`      | Dev server con hot reload                             |
| `npm run build`    | Build di produzione in `./dist/`                      |
| `npm run preview`  | Anteprima locale del build                            |
| `npm run astro --` | Comandi Astro CLI (es. `npm run astro -- check`)      |

---

## Deploy su Vercel — flusso operativo

Stessa procedura di `stefanoandrello.me` e `airatio.noscite.it`.

### 1. Push del progetto su GitHub

```bash
cd finanza-futuro-site
git init
git add .
git commit -m "feat: initial Astro migration of Finanza & Futuro site"
# crea repo (privato) su https://github.com/new — nome: finanza-futuro-site
git branch -M main
git remote add origin git@github.com:<tuo-utente>/finanza-futuro-site.git
git push -u origin main
```

### 2. Importa il progetto su Vercel

1. Vai su [vercel.com/new](https://vercel.com/new)
2. Seleziona il repo `finanza-futuro-site`
3. **Framework Preset**: Astro (Vercel lo riconosce in automatico)
4. Build Command, Output Directory, Install Command: lascia tutto come da default
5. Click **Deploy**

In ~60 secondi il sito è online su `<projectname>.vercel.app`.

### 3. Collega il dominio `finanzafuturo.it`

Su Vercel, **Project → Settings → Domains** → aggiungi `finanzafuturo.it` e `www.finanzafuturo.it`.

Sul registrar dove gestisci il DNS, configura:

```
finanzafuturo.it          A      76.76.21.21
www.finanzafuturo.it      CNAME  cname.vercel-dns.com
```

(Vercel ti mostrerà i record esatti da copiare, sopra è la formula più comune.) Propagazione DNS: 5–60 minuti. HTTPS via Let's Encrypt automatico.

---

## Aggiornamento contenuti

Tutto il contenuto è dentro le pagine `.astro` in `src/pages/` e nei componenti in `src/components/`. Modifica → `git push` → Vercel fa redeploy automatico in 30–60 secondi.

### Punti caldi da aggiornare quando hai i dati definitivi

- **Email contatto**: in `src/components/Footer.astro` e in `src/layouts/BaseLayout.astro` (JSON-LD) c'è `info@finanzafuturo.it`. Sostituisci con quella reale.
- **Telefoni**: stessi file, attualmente `02 4987653` e `339 6005487`.
- **WhatsApp**: il numero `393396005487` compare in tutte le CTA. Per cambiarlo cerca con il tuo editor (`Cmd+Shift+F` in VS Code) e sostituisci.
- **Indirizzo sede**: `Via Alberto da Giussano 17, 20145 Milano` in `Footer.astro` e `BaseLayout.astro`.
- **Privacy / Cookie / Termini**: i link in footer puntano a `/privacy` e `/cookie` ma le pagine non esistono ancora. Quando hai i testi, crea `src/pages/privacy.astro` e `src/pages/cookie.astro` con `BaseLayout` + contenuto.

---

## SEO & GEO — cosa è già pronto

- ✅ Tutto il contenuto pre-renderizzato in HTML al build (no JS richiesto per crawler)
- ✅ Title e meta description specifici per ogni pagina
- ✅ Canonical URL su ogni pagina
- ✅ Open Graph + Twitter Card meta
- ✅ JSON-LD `FinancialService` (Organization) su tutte le pagine
- ✅ JSON-LD `WebPage` / `Service` / `AboutPage` per pagina specifica
- ✅ `sitemap-index.xml` generato in automatico da `@astrojs/sitemap`
- ✅ `robots.txt` con esplicita ammissione di GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, ecc.
- ✅ `llms.txt` (standard emergente) con descrizione strutturata del sito per AI engines
- ✅ Headers di security (X-Frame-Options, Referrer-Policy, Permissions-Policy)
- ✅ Lighthouse 100/100/100/100 atteso su tutte le pagine

### Da fare dopo il deploy

1. Verifica il sito su [Google Search Console](https://search.google.com/search-console) e invia il `sitemap-index.xml`.
2. Verifica su [Bing Webmaster Tools](https://www.bing.com/webmasters).
3. Test JSON-LD con [Schema Markup Validator](https://validator.schema.org/) e [Rich Results Test](https://search.google.com/test/rich-results).
4. Test Open Graph con [opengraph.xyz](https://www.opengraph.xyz/).
5. Per il GEO, verifica come Perplexity/ChatGPT rispondono alle query "consulente patrimoniale Milano post-exit" dopo qualche settimana di indicizzazione.

---

## Note sulla migrazione da Lovable

Originale: Vite + React 18 + React Router + 40+ pacchetti shadcn/ui Radix + lovable-tagger.

Cambiamenti principali:

- **Framework**: da Vite SPA ad Astro 5 statico → SEO/GEO nativi, no prerender server-side.
- **Branding**: tutti i riferimenti a "Felice", "Felice Eugenio Andolfi" e "WealthGuard" sostituiti con "Finanza & Futuro" e il claim "Educhiamo per proteggere il tuo patrimonio".
- **Foto personale di Felice nell'Hero e in Chi Siamo**: rimossa, sostituita con il logo grande.
- **Sezione "CV Felice Eugenio"** in `/chi-siamo`: riscritta come "La nostra missione" con i contenuti tematici (approccio macroeconomico, passaggio generazionale, valori) ma senza riferimenti personali.
- **Email `dott.andolfi@feliceeugenioandolfi.it`**: sostituita con `info@finanzafuturo.it` (placeholder, da confermare).
- **Sezione "Resources" nella homepage**: rimossa. Era già stata tolta come pagina dedicata (`/risorse`) nel codice originale, e i bottoni "Scarica gratis" puntavano a download inesistenti. Quando avrai PDF o lead magnet veri, è facile aggiungerla come componente.
- **shadcn/ui Radix** (40 pacchetti): sostituito con classi Tailwind dirette → bundle minimo.
- **Lucide icons**: ora via `astro-icon` con SVG inlined al build, zero JS lato client.

---

## Struttura icone

Le icone Lucide sono importate da `astro-icon` come SVG inline. Per aggiungerne di nuove:

1. Trova il nome su [lucide.dev](https://lucide.dev/icons/)
2. Aggiungi la stringa kebab-case all'array `lucide: [...]` in `astro.config.mjs`
3. Usa nel componente: `<Icon name="lucide:nome-icona" class="w-6 h-6" />`
