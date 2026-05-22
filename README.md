# Save the Royal Bloodline

Cinematic multiplayer dynasty simulator for live presentations (3–15 players). Jackbox-meets-Reigns energy — marry for power, risk the jaw, survive five generations.

**Live URL target:** `bloodline.scayn.in` or `dynasty.scayn.in`

## Stack

- React + Vite + Tailwind CSS v4 + Framer Motion
- Supabase Realtime (rooms, players, choices)
- Vercel deployment

## Quick start

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the SQL Editor
3. Copy Project URL + anon key

### 2. Environment

```bash
cp .env.example .env
```

Fill in:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_HOST_PASSWORD=habsburg
```

### 3. Run locally

```bash
npm install
npm run dev
```

- Players: http://localhost:5173/play
- Host: http://localhost:5173/host (password from `.env`)

Default room code: **HABSBURG**

## Presentation flow

1. Open `/host` on laptop — load room code, share QR: `/play?room=HABSBURG`
2. Audience joins on phones, enters noble name
3. Host **START GAME** → 20s marriage choices per generation
4. Host **NEXT GENERATION** cycles: choices → reveal → leaderboard → next gen
5. Failsafes: **SYNC ALL CLIENTS**, **FORCE ADVANCE**, **EMERGENCY RESET**

## Deploy (Vercel + scayn.in)

1. Push to GitHub repo `royal-bloodline-simulator`
2. Import project in Vercel, add env vars
3. Add domain `bloodline.scayn.in` in Vercel → DNS CNAME to `cname.vercel-dns.com` on scayn.in

## Repo setup

```bash
git init
git add .
git commit -m "Initial royal bloodline multiplayer game"
gh repo create royal-bloodline-simulator --public --source=. --remote=origin
git push -u origin main
```

## Game design

Probability theatre — not a biology quiz. Stats: dynasty health, political power, inbreeding risk, prestige/score. Outcomes are weighted by risk for dramatic/funny reveals.
