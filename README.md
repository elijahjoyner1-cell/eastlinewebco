# EastLineWebCo website (Cloudflare)

The finished site is in `public/`. Editable source is in `source/`. There is no build step for deploying: Cloudflare just serves `public/`.

Cloudflare now recommends Workers (static assets) for new sites. Classic Cloudflare Pages still works. Pick one option below.

## Option A: Automatic deploys from GitHub (recommended)

Every push to your main branch goes live on its own.

1. Create a GitHub repo and push this folder to it.
2. Cloudflare dashboard > Workers & Pages > Create application > Import a Git repository.
3. Choose the repo. Build command: leave empty. Deploy command: `npx wrangler deploy` (Workers) or, if you chose Pages, set Build output directory to `public`.
4. Save and deploy. Your site appears at a `*.workers.dev` (or `*.pages.dev`) address.

## Option B: Drag and drop (no tools needed)

Cloudflare dashboard > Workers & Pages > Create application > Pages > Upload assets. Name the project `eastlinewebco`, then drag the `public` folder in.

## Option C: One command from your computer

    npx wrangler login
    npx wrangler deploy                                              # Workers static assets, uses wrangler.jsonc
    # or, for classic Pages:
    npx wrangler pages deploy public --project-name=eastlinewebco

## Connect the forms to your inbox

Edit `public/assets/config.js` (and `source/src/assets/config.js` so rebuilds keep it):

1. Create a free account at https://web3forms.com (or https://formspree.io) and enter the inbox that should receive requests.
2. Web3Forms: `formEndpoint: "https://api.web3forms.com/submit"` and `formExtra: { access_key: "YOUR-KEY", subject: "New EastLineWebCo request" }`.
   Formspree: `formEndpoint: "https://formspree.io/f/YOUR_ID"`.
3. Set `email` to your real business address.
4. Redeploy (push to GitHub, or repeat Option B or C).

Until this is set, the forms show visitors a copy-and-email fallback and say nothing was sent.

## Custom domain

Dashboard > your project > Settings > Domains > Add. If your domain's DNS is on Cloudflare, it connects in a click and SSL is automatic.

## Editing the site

Prices: `source/src/assets/config.js` and the service list in `source/build.py`. Text: `source/src/pages/*.html`.
Rebuild (Python 3 and `pip install fonttools`): `cd source && python3 build.py`, then copy `source/dist/site/*` into `public/` (keep `_headers`).
