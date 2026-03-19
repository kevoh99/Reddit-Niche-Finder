# Reddit Niche Finder

AI-powered niche website opportunity scanner. Discovers rising Reddit micro-niches and scores them across 5 dimensions: trend momentum, competition level, monetization potential, community growth, and website viability.

Built with React + Vite. Deploys to Vercel in ~3 minutes.

---

## Features

- 🎯 12 scored niche opportunities per scan
- ⭐ Save niches to a persistent sidebar
- ⇄ Compare up to 4 niches side-by-side with radar charts
- 💡 Copy website concepts to clipboard
- ↓ Export saved niches as CSV or JSON
- 🕐 Scan history — re-run previous topics instantly
- 🔒 API key stays server-side via Vercel serverless function

---

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=sk-ant-...
```

Get a key at https://console.anthropic.com

### 3. Run the dev server

```bash
npm run dev
```

Open http://localhost:5173

> **Note:** The `/api/discover` serverless function won't run locally with `vite dev`. 
> To test the API locally, install the Vercel CLI:
> ```bash
> npm i -g vercel
> vercel dev
> ```
> This spins up both Vite and the serverless function at http://localhost:3000

---

## Deploy to Vercel

### Option A: Via Vercel CLI (recommended)

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login
vercel login

# Deploy (from the project root)
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name: reddit-niche-finder (or anything)
# - In which directory is your code located? ./
# - Want to modify settings? N

# After the preview deployment, promote to production:
vercel --prod
```

### Option B: Via Vercel Dashboard

1. Push this project to a GitHub repository
2. Go to https://vercel.com/new
3. Click "Import Git Repository" and select your repo
4. Vercel auto-detects Vite — no build settings needed
5. Click "Deploy"

### Setting the API key in Vercel

After deploying (either method), add your environment variable:

1. Go to https://vercel.com/dashboard
2. Click your project → **Settings** → **Environment Variables**
3. Add:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** `sk-ant-...`
   - **Environments:** Production, Preview, Development ✓
4. Click **Save**
5. Go to **Deployments** and click **Redeploy** on the latest deployment

Your app is now live!

---

## Project Structure

```
reddit-niche-finder/
├── api/
│   └── discover.js          # Vercel serverless function (keeps API key secret)
├── src/
│   ├── components/
│   │   ├── NicheCard.jsx    # Individual niche card with scores
│   │   ├── CompareModal.jsx # Side-by-side comparison with radar chart
│   │   ├── SavedDrawer.jsx  # Saved niches sidebar + export
│   │   ├── ScanHistory.jsx  # Recent scan history chips
│   │   ├── ScoreViz.jsx     # ScoreBar + RadarViz shared components
│   │   └── Loader.jsx       # Animated loading state
│   ├── hooks/
│   │   └── useNiches.js     # Core state, API calls, localStorage
│   ├── App.jsx              # Root layout + wiring
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles + CSS variables
├── index.html
├── vite.config.js
├── vercel.json
├── .env.example
└── package.json
```

---

## Scoring Model

Each niche is scored 0–100 on 5 dimensions, combined into a weighted Opportunity Score:

| Dimension | Weight | What it measures |
|---|---|---|
| Trend Momentum | 25% | Upward trajectory, not just current heat |
| Low Competition | 25% | How achievable ranking is for a new site |
| Monetization | 20% | Revenue potential (affiliate, ads, SaaS, etc.) |
| Growth Rate | 15% | Community/audience size growth |
| Website Viability | 15% | Realism of building a standalone site/product |

**Tiers:** PRIME (80+) · STRONG (65–79) · SOLID (50–64) · WEAK (<50)

---

## Customizing

**Change the number of results:** Edit the `12` in `api/discover.js` prompt  
**Adjust score weights:** Edit `WEIGHTS` in `src/hooks/useNiches.js`  
**Add categories:** Edit `CATEGORIES` array in `src/App.jsx`
