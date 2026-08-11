# Muscle Gain Tracker

A personal muscle-gain, nutrition, and home-training dashboard. Built with
React + Vite + Tailwind, backed by a free Supabase database so your data
syncs between your iPhone and computer, and deployed free via GitHub Pages.

## What's in Phase 1 (this build)

- Editable profile & settings (age, height, weight, goal, activity level)
- Calorie & macro calculator (BMR/TDEE-based starting target)
- Daily weight tracking with 7-day rolling average + trend chart
- Waist tracking with a weight-vs-waist comparison chart
- Automatic weekly "sweet spot" calorie adjustment recommendation
- Daily food diary with calories/protein/carbs/fat/fibre progress bars
- Works as a home-screen app on iPhone (PWA)

**Phase 2** (not yet built): meal-prep templates, progress photos, and the
cheap-bulking Prisma food/price database — send me your food list and I'll
add these next.

---

## One-time setup

### 1. Create a free Supabase project

1. Go to [supabase.com](https://supabase.com) → sign up free (no credit card).
2. Create a new project (pick any name/region, e.g. "muscle-app").
3. Once it's ready, open **SQL Editor** in the left sidebar, paste the
   entire contents of [`supabase/schema.sql`](./supabase/schema.sql), and
   click **Run**. This creates all the tables and security rules.
4. Go to **Authentication → Providers** and make sure **Email** is enabled
   (it is by default). Optionally go to **Authentication → URL
   Configuration** and add your future GitHub Pages URL (see step 3 below)
   to "Redirect URLs" once you know it, e.g.
   `https://yourusername.github.io/muscle-app/`.
5. Go to **Settings → API**. Copy the **Project URL** and the **anon
   public** key — you'll need both next.

### 2. Local development (optional, to preview before deploying)

```bash
npm install
cp .env.example .env
# edit .env and paste in your Supabase URL + anon key
npm run dev
```

Open the printed localhost URL. Sign in with your own email — Supabase
will send you a magic link (check your inbox).

### 3. Deploy for free via GitHub Pages

1. Create a new **public** GitHub repo (private repos need a paid plan for
   Pages to work simply) — call it `muscle-app` to match the default
   config, or if you pick a different name, edit `base` in
   `vite.config.js` and `start_url`/`scope` in `public/manifest.webmanifest`
   to match.
2. Push this project to that repo:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/muscle-app.git
   git push -u origin main
   ```
3. In the repo on GitHub: **Settings → Pages → Build and deployment →
   Source** → select **GitHub Actions**.
4. In the repo: **Settings → Secrets and variables → Actions → New
   repository secret**. Add two secrets:
   - `VITE_SUPABASE_URL` = your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon public key
5. Push again (or re-run the "Deploy to GitHub Pages" workflow under the
   **Actions** tab). After it finishes, your app is live at
   `https://YOUR_USERNAME.github.io/muscle-app/`.
6. Go back to Supabase **Authentication → URL Configuration** and add that
   exact URL to the allowed redirect URLs, so the magic-link sign-in works.

### 4. Add it to your iPhone home screen

1. Open your GitHub Pages URL in **Safari** on your iPhone.
2. Sign in with your email (tap the magic link Supabase emails you).
3. Tap the **Share** button → **Add to Home Screen**.
4. It now opens full-screen like a native app, with your data synced from
   whatever device you log entries on.

---

## Project structure

```
src/
  components/   Reusable UI pieces (charts, progress bars, nav bar)
  context/      Auth context (Supabase session)
  hooks/        Data-fetching hooks (profile, weight, waist, food log)
  lib/          Pure calculation logic (calories, macros, sweet-spot algorithm)
  pages/        One file per screen (Dashboard, Weight, Waist, Food, Settings)
supabase/
  schema.sql    Run this once in Supabase's SQL Editor
.github/workflows/
  deploy.yml    Auto-builds and deploys to GitHub Pages on every push to main
```

## Making changes later

Just ask for the change, and edit the relevant file(s) directly rather than
regenerating the whole app — this is a normal multi-file codebase, so
changes stay small and git-trackable, unlike a single giant HTML file.
