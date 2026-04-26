# Sha Muu — Sushi & Burmese Asian Fusion

Online ordering system for Sha Muu, 23 North 900 West, Salt Lake City.

## Environment Variables (set in Railway)

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (from Neon) |
| `STRIPE_SECRET_KEY` | Stripe secret key (sk_test_... or sk_live_...) |
| `NEXT_PUBLIC_URL` | Your Railway public URL |

## Pages

| Path | Description |
|---|---|
| `/` | Home page |
| `/menu` | Customer ordering page |
| `/track/[id]` | Order status tracking |
| `/admin` | Kitchen dashboard |
