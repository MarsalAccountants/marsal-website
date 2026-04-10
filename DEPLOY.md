# Deploying the Marsal marketing site (Astro)

Local `npm run dev` always shows your latest files. **Production only updates** after you deploy a **fresh `dist/`** (and nginx must serve that folder). If that does not happen, new images and pages are missing, and bad nginx rules can make missing URLs return the **homepage HTML** instead of 404.

## What must be true on the server

1. A **git clone** of `marsal-website` (or a copy that you `git pull` in).
2. After each pull: **`npm ci`** (or `npm install`) then **`npm run build`**.
3. **Nginx (or Caddy) `root`** must point at the **`dist/`** directory produced by that build (or whatever path actually contains `index.html` and `images/`).
4. Nginx must **not** send every unknown URL to `/index.html` in a way that also catches **`/images/*.avif`** and other static files (see [Nginx](#nginx) below).

## One-time: find the real paths on the droplet

SSH in, then:

```bash
# List likely web roots
ls -la /var/www /srv /opt /home 2>/dev/null

# Find git checkouts (may show where marsal-website lives)
find /var /opt /srv /home /root -maxdepth 6 -type d -name marsal-website 2>/dev/null

# See how nginx is configured
sudo nginx -T 2>/dev/null | grep -E 'root |server_name|try_files|listen'
```

Note the directory that contains **`dist/`** after a build and the **`root`** nginx uses for `www.marsalaccountants.co.uk` (or your domain).

## Deploy commands (run on the server)

From the **repository root** (the folder that has `package.json` for this website):

```bash
git pull origin main
npm ci
npm run build
sudo nginx -t && sudo systemctl reload nginx
```

If you use a **systemd** unit that only restarts a process, restart that unit after `build` instead of (or as well as) reloading nginx.

**Verify** the new files exist:

```bash
ls -la dist/images/tax-tables.avif dist/images/who-we-are.jpg
ls -la dist/resources/tax-tables/index.html
```

## Nginx

### Symptom: image or page URL shows the **home page**

Often caused by:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

If **`/images/foo.avif`** is missing (old `dist/`), nginx serves **`/index.html`** — the browser loads the homepage. Fix **deployment** first so files exist; then tighten config.

### Safer pattern for a static Astro site

Prefer letting Astro’s real files win, and avoid a global fallback that masks missing assets:

```nginx
server {
    listen 443 ssl http2;
    server_name www.marsalaccountants.co.uk;

    # SET THIS to your built site, e.g. /var/www/marsal-website/dist
    root /var/www/marsal-website/dist;

    location /images/ {
        try_files $uri =404;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location / {
        try_files $uri $uri/ =404;
    }
}
```

Adjust `server_name` and `root` to match your droplet. Some teams use `try_files $uri $uri/ /index.html` only when they truly need SPA fallback; for static Astro, **`=404`** or real files per route are usually enough.

After editing:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

## Quick checks from your PC

Replace the domain if needed:

```text
https://www.marsalaccountants.co.uk/images/tax-tables.avif
https://www.marsalaccountants.co.uk/resources/tax-tables/
```

- **Good:** `tax-tables.avif` downloads or displays as an image; `tax-tables/` shows the tax tables page.
- **Bad:** “View source” on the `.avif` URL shows **HTML** (your homepage) → wrong `root`, old build, or `try_files` fallback hiding missing files.

## Caching

Browsers and CDNs cache images by URL. After deploy, if an old image still appears, try a private window or hard refresh. For aggressive caches, a one-off query string (e.g. `?v=2`) on the `img src` can bust cache (use sparingly).

## Script

See `scripts/deploy-website.sh` — copy to the server, set `SITE_ROOT`, `chmod +x`, run after `git pull`.
