# Matchday — Publish Guide

This is a standalone Vite + React + Tailwind project wrapping the Matchday
prototype so it can be built and hosted as a real, public URL.

## 1. Run it locally first

```bash
npm install
npm run dev
```

Opens at http://localhost:5173 — confirm it looks right before publishing.

## 2. Build it

```bash
npm run build
```

This produces a `dist/` folder — a plain set of static HTML/CSS/JS files.
That folder is literally what you publish; any static host works.

## 3. Fastest way to get a public link (no account needed)

1. Run `npm run build`
2. Go to **https://app.netlify.com/drop**
3. Drag the `dist` folder onto the page

You get a live URL in about 10 seconds. Good for sharing a preview link
today. Create a free Netlify account afterward if you want to keep that
same URL long-term and update it later.

## 4. Better for ongoing updates: Vercel or Netlify (Git-connected)

1. Push this folder to a new GitHub repo
2. Go to vercel.com (or netlify.com) → "New Project" → import that repo
3. Framework preset: **Vite**. Build command: `npm run build`. Output
   directory: `dist`. (Both platforms auto-detect this correctly for Vite.)
4. Deploy

Every time you push to GitHub after that, it redeploys automatically.

## 5. Alternative: GitHub Pages

```bash
npm install gh-pages --save-dev
```

Add to `package.json` `"scripts"`: `"deploy": "vite build && gh-pages -d dist"`,
and add `"homepage": "https://<your-username>.github.io/<repo-name>"` at the
top level. Then:

```bash
npm run deploy
```

Enable Pages in the repo's Settings → Pages → set source to the `gh-pages`
branch.

## Important: what this publishes

This ships the **frontend prototype only** — the same mock data and
in-memory state you've been testing. Once it's live:

- Every visitor sees their own independent session. Posts, registered
  grounds, and chat messages do **not** persist or sync between people —
  they reset on refresh, same as now.
- There's no real user accounts, database, or WebSocket server behind it.

That's expected for a prototype link you're sharing to show the concept or
get feedback. To make it a real multi-user platform, the frontend needs to
call the actual Django backend (from the first zip I gave you) instead of
the mock arrays — which means also hosting that backend somewhere with a
real Postgres+PostGIS database and Redis (e.g. Railway, Render, or Fly.io
all support Docker Compose-style multi-container setups reasonably
directly). Happy to help wire the frontend's fetch calls to those real
endpoints when you're ready for that step.
