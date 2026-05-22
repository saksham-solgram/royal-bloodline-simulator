# Deploy to bloodline.scayn.in

## Vercel environment variables

Set these in **Project → Settings → Environment Variables** (Production + Preview):

| Variable | Value |
|----------|--------|
| `VITE_SUPABASE_URL` | `https://evbipzazcsparwrfjajy.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | *(anon key from Supabase → Settings → API)* |
| `VITE_HOST_PASSWORD` | *(your host panel password)* |

Redeploy after adding variables.

## Custom domain DNS (scayn.in on Cloudflare)

`scayn.in` uses **Cloudflare** nameservers. In Cloudflare → DNS → Records, add:

| Type | Name | Target | Proxy |
|------|------|--------|-------|
| **CNAME** | `bloodline` | `cname.vercel-dns.com` | DNS only (grey cloud) recommended |
| **CNAME** | `dynasty` | `cname.vercel-dns.com` | DNS only (grey cloud) recommended |

Both domains are already attached to the Vercel project `dynasty-game`. DNS may take a few minutes to propagate.

**Live now (no DNS wait):** https://dynasty-game.vercel.app

## URLs after deploy

- https://bloodline.scayn.in/
- https://bloodline.scayn.in/play
- https://bloodline.scayn.in/play?room=HABSBURG
- https://bloodline.scayn.in/host
