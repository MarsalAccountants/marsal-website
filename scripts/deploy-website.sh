#!/usr/bin/env bash
# Marsal marketing site — build on the droplet after git pull.
# Usage: set SITE_ROOT, then: ./deploy-website.sh
set -euo pipefail

# Absolute path to the marsal-website repo (folder containing package.json).
# Example: /var/www/marsal-website
SITE_ROOT="${SITE_ROOT:-/var/www/marsal-website}"

cd "$SITE_ROOT"

echo "==> $(pwd)"
echo "==> git pull"
git pull origin main

echo "==> npm ci"
npm ci

echo "==> npm run build"
npm run build

echo "==> sanity check"
test -f dist/images/tax-tables.avif && echo "OK: tax-tables.avif"
test -f dist/images/who-we-are.jpg && echo "OK: who-we-are.jpg"
test -f dist/resources/tax-tables/index.html && echo "OK: tax-tables page"

echo "==> reload nginx (optional; comment out if not using nginx on this box)"
if command -v nginx >/dev/null 2>&1; then
  sudo nginx -t && sudo systemctl reload nginx && echo "nginx reloaded"
else
  echo "nginx not found; reload your web server or app service manually."
fi

echo "Done."
