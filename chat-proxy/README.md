# Chat proxy (Cloudflare Worker)

GitHub Pages serves static files only — there is no server and no environment
variables. Any key committed to this repo, or set in a JS file the browser
downloads, is public. So the DeepSeek key lives in a tiny Cloudflare Worker
instead, and the site calls that Worker.

```
browser  ──POST /  ──►  Cloudflare Worker  ──►  api.deepseek.com
                        (holds DEEPSEEK_API_KEY as a secret)
```

## Deploy (about 5 minutes, free tier)

1. Install Wrangler and log in:

   ```bash
   npm install -g wrangler && wrangler login
   ```

2. From this directory, store the key as a secret (it is prompted for, never
   written to a file):

   ```bash
   wrangler secret put DEEPSEEK_API_KEY
   ```

3. Deploy:

   ```bash
   wrangler deploy
   ```

4. Copy the printed URL (`https://portfolio-chat.<subdomain>.workers.dev`) into
   `config.js` at the repo root as `chatEndpoint`, then commit and push.

## Notes

- `ALLOWED_ORIGINS` in `worker.js` restricts which sites may call the proxy.
  Add or remove domains there.
- Message count and total length are capped to limit abuse. For stricter
  control, add Cloudflare Rate Limiting on the Worker route.
- To rotate the key, run `wrangler secret put DEEPSEEK_API_KEY` again — no site
  changes needed.
