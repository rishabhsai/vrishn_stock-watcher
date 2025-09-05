# vrishn deployment needs

This document lists secrets, API keys, URLs, accounts, and infrastructure required to run the vrishn frontend (SvelteKit) and backend (FastAPI + jobs + Fastify WS).

Fill and keep them in your private `.env` based on `env.example`.

## Domains and Branding
- Primary site domain: `vrishn.com`
- API domain (optional): `api.vrishn.com` or same-origin
- Websocket domain (optional): `ws.vrishn.com` or same-origin
- CDN for images (optional): `cdn.vrishn.com`
- Google Tag Manager: configure your GTM container (replace GTM-NZBJ9W63 if using GTM)

## Core Services
- PocketBase (users, payments, lists, etc.)
  - URL: e.g., `http://127.0.0.1:8090` or hosted
  - Admin email/password (backend jobs)
- Backend API (FastAPI) served on 8000 by default
  - Requires `STOCKNEAR_API_KEY` secret (shared with frontend `VITE_STOCKNEAR_API_KEY`)
- Realtime/Websocket (Fastify @ 2000 by default)

## Required Secrets and Keys
Match keys in `env.example`.

- Authentication
  - FASTAPI_USERNAME, FASTAPI_PASSWORD
  - STOCKNEAR_API_KEY (shared secret between FE/BE headers)

- Providers / Data
  - FMP_API_KEY (Financial Modeling Prep)
  - BENZINGA_API_KEY
  - FINRA_API_KEY, FINRA_API_SECRET
  - INTRINIO_API_KEY
  - FRED_API_KEY
  - COINGECKO_API_KEY

- OpenAI / LLM
  - OPENAI_API_KEY
  - CHAT_MODEL, FAST_CHAT_MODEL, REASON_CHAT_MODEL (model names)

- PocketBase Admin
  - POCKETBASE_ADMIN_EMAIL, POCKETBASE_PASSWORD

- Email (SES)
  - AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION_SES

- Web Push (VAPID)
  - VITE_VAPID_PUBLIC_KEY, VITE_VAPID_PRIVATE_KEY

- Discord / Social
  - DISCORD_BOT_TOKEN
  - VITE_DISCORD_BOT_TOKEN (server routes)
  - REDDIT_BOT_API_KEY, REDDIT_BOT_API_SECRET, REDDIT_USERNAME, REDDIT_PASSWORD, REDDIT_USER_AGENT
  - REDDIT_API_KEY, REDDIT_API_SECRET (crawler)
  - LINKEDIN_ACCESS_TOKEN
  - Facebook/Meta: FACEBOOK_ACCESS_TOKEN, FACEBOOK_PAGE_ID, FACEBOOK_APP_ID, FACEBOOK_APP_SECRET

- Lemon Squeezy
  - VITE_LEMON_SQUEEZY_SECRET_KEY (webhook signature)
  - VITE_LEMON_SQUEEZY_API_KEY (frontend management calls)
  - VITE_LEMON_SQUEEZY_* product/variant IDs
  - LEMON_SQUEEZY_API_KEY (backend cron sync)

- Misc Sources (jobs)
  - FDA_CALENDAR, CRAMER_WEBSITE, SENATE_API_KEY

## Infrastructure
- Reverse proxy (nginx/Caddy) routing:
  - vrishn.com → SvelteKit (frontend)
  - api.vrishn.com → FastAPI (backend)
  - ws.vrishn.com or api.vrishn.com:2000 → Fastify WS
  - pocketbase.vrishn.com → PocketBase (optional)
- Redis at localhost:6380 (used by backend caching). Provide managed Redis or run locally and adjust host/port if needed.
- SQLite files stored in backend `app/` for datasets; ensure persistent volume if deploying.

## Email Templates and From Address
- Update sender emails in backend templates (currently placeholders reference stocknear). Rebrand to vrishn (we will update code).

## Assets
- Replace `frontend/static/pwa-*.png`, manifest name/short_name, and any logos with vrishn assets.

## DNS / SSL
- A/AAAA records for frontend, API, WS, PB (if public)
- TLS certs via Let’s Encrypt

## Optional Analytics
- If using GTM, configure container and replace the ID in `+layout.svelte`.

## Post-Setup
- Copy `env.example` to `.env` and fill values per environment.
- Configure CORS allowed origins to your vrishn domains.
- Test login, payments, push notifications, and scheduled jobs.

