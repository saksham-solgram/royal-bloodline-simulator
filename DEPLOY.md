# Deploy to bloodline.scayn.in

## Vercel environment variables

Set these in **Project → Settings → Environment Variables** (Production + Preview):

| Variable | Value |
|----------|--------|
| `VITE_SUPABASE_URL` | `https://evbipzazcsparwrfjajy.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | *(anon key from Supabase → Settings → API)* |
| `VITE_HOST_PASSWORD` | *(your host panel password)* |

Redeploy after adding variables.

## Custom domain DNS (scayn.in)

At your DNS provider for **scayn.in**, add:

| Type | Name | Value |
|------|------|--------|
| **CNAME** | `bloodline` | `cname.vercel-dns.com` |

In Vercel: **Project → Settings → Domains → Add** `bloodline.scayn.in`

Optional alias: add `dynasty.scayn.in` the same way (second CNAME `dynasty` → `cname.vercel-dns.com`).

## URLs after deploy

- https://bloodline.scayn.in/
- https://bloodline.scayn.in/play
- https://bloodline.scayn.in/play?room=HABSBURG
- https://bloodline.scayn.in/host
