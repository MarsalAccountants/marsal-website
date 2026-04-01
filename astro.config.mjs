// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.marsalaccountants.co.uk',
  srcDir: 'src/astro',
  integrations: [sitemap()],
  server: {
    host: true, // listen on 0.0.0.0 so you can open from mobile/tablet on same WiFi
  },
});
