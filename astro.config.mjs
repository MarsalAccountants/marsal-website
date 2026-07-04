// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/** Thin or non-marketing URLs — keep crawlable, omit from sitemap. */
const SITEMAP_EXCLUDE = ['/author/'];

/**
 * @param {string} url
 * @returns {number}
 */
function priorityFor(url) {
  const path = new URL(url).pathname;
  if (path === '/') return 1.0;
  if (path.startsWith('/local/paisley/')) return 0.9;
  if (path.startsWith('/services/')) return path.includes('/vat/') ? 0.95 : 0.9;
  if (path === '/contact/' || path === '/accountants-central-scotland/') return 0.85;
  if (path.startsWith('/articles/') && path !== '/articles/') return 0.8;
  if (path === '/articles/' || path === '/services/' || path === '/local/paisley/') return 0.75;
  if (
    path.startsWith('/privacy') ||
    path.startsWith('/gdpr') ||
    path.startsWith('/client-membership')
  ) {
    return 0.3;
  }
  return 0.6;
}

export default defineConfig({
  site: 'https://www.marsalaccountants.co.uk',
  srcDir: 'src/astro',
  integrations: [
    sitemap({
      filter: (page) => !SITEMAP_EXCLUDE.some((part) => page.includes(part)),
      serialize(item) {
        item.priority = priorityFor(item.url);
        return item;
      },
    }),
  ],
  server: {
    host: true, // listen on 0.0.0.0 so you can open from mobile/tablet on same WiFi
  },
});
