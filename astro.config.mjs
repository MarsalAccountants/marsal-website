// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.marsalaccountants.co.uk',
  srcDir: 'src/astro',
  integrations: [
    sitemap({
      serialize(item) {
        const u = item.url;
        if (u.includes('/services/vat/')) item.priority = 0.95;
        else if (u.includes('/local/paisley/')) item.priority = 0.88;
        return item;
      },
    }),
  ],
  server: {
    host: true, // listen on 0.0.0.0 so you can open from mobile/tablet on same WiFi
  },
});
