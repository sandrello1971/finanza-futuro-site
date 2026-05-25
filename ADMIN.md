# Area admin `/admin`

Interfaccia web protetta per pubblicare nuovi video YouTube nella sezione `/risorse` senza toccare il codice.

## Come funziona

1. **Login** su `https://www.finanzafuturo.it/admin/login` (username + password)
2. **Incolla URL YouTube** → il server scarica titolo, durata, sottotitoli e genera title/excerpt/takeaway con Claude
3. **Rivedi i campi** nel form di anteprima (modificabili)
4. **Pubblica** → viene committato un file `src/content/risorse/YYYY-MM-DD-slug.md` su GitHub → Vercel rileva il push e fa deploy (~1-2 min)

Il file generato è identico nel formato a quelli creati oggi con `npm run video`. Se Claude non riesce a generare i metadata (es. sottotitoli mancanti) i campi restano vuoti e si compilano a mano nell'admin stesso.

## Configurazione iniziale (una tantum)

### 1. Genera le env var di sicurezza

```bash
npm run admin:setup "scegli-una-password-robusta"
```

Lo script stampa `ADMIN_PASSWORD_HASH` (bcrypt) e `SESSION_SECRET` (random) da copiare su Vercel.

### 2. Crea un GitHub Personal Access Token (fine-grained)

- Vai su https://github.com/settings/personal-access-tokens
- "Generate new token (fine-grained)"
- Repository access: solo `sandrello1971/finanza-futuro-site`
- Permissions → Repository → **Contents: Read and write**
- Scadenza: 1 anno (poi va rigenerato)
- Copia il token (`github_pat_...`)

### 3. Imposta env var su Vercel

Project → Settings → Environment Variables (scope: Production + Preview):

| Nome | Valore |
|---|---|
| `ADMIN_USER` | username scelto (es. `belkys`) |
| `ADMIN_PASSWORD_HASH` | output di `admin:setup` |
| `SESSION_SECRET` | output di `admin:setup` |
| `GITHUB_TOKEN` | il PAT generato sopra |
| `GITHUB_REPO` | `sandrello1971/finanza-futuro-site` |
| `GITHUB_BRANCH` | `main` |
| `YOUTUBE_API_KEY` | la chiave Google API già usata in locale |
| `ANTHROPIC_API_KEY` | la chiave Anthropic |

Dopo aver impostato le env var, **fai un redeploy** (Deployments → ⋯ → Redeploy) perché le serverless function le leggano.

## Architettura tecnica

- **Astro 5** `output: 'static'` + adapter `@astrojs/vercel` → tutto il sito pubblico resta statico/CDN come prima
- **Opt-out SSR** solo su `src/pages/admin/*` e `src/pages/api/admin/*` (`export const prerender = false`)
- **Auth**: cookie `admin_session` HMAC-firmato con `SESSION_SECRET`, scadenza 7 giorni. Password bcrypt (cost 12) in env var
- **Middleware** `src/middleware.ts` protegge tutte le route `/admin/*` e `/api/admin/*` tranne `login`
- **Pubblicazione**: il backend committa il file Markdown via GitHub REST API → Vercel rileva il push e fa deploy automatico
- **No DB**: tutto stateless, solo env var + cookie

## Limitazioni note

- Vercel piano Hobby: timeout serverless 10s. Sufficiente per video corti/medi. Se Claude impiega troppo su trascrizioni molto lunghe (>30k caratteri), la trascrizione viene tagliata a 12k caratteri prima di passarla all'AI
- Sottotitoli YouTube: non sempre disponibili. Se mancano, il campo trascrizione resta vuoto e si incolla a mano nell'admin
- L'admin pubblica direttamente su `main`. Se serve una flow di review separata, valutare un branch dedicato (modifica `GITHUB_BRANCH`)

## Rotazione credenziali

- **Password admin**: `npm run admin:setup "nuova-pwd"` → aggiorna `ADMIN_PASSWORD_HASH` su Vercel → redeploy
- **GitHub PAT**: rigenera token → aggiorna `GITHUB_TOKEN` su Vercel → redeploy
- **Session secret**: rigenera (script o `openssl rand -base64 48`) → aggiorna → redeploy (invalida tutte le sessioni esistenti)
