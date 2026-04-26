// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://finanzafuturo.it',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      i18n: {
        defaultLocale: 'it',
        locales: { it: 'it-IT' },
      },
    }),
    react(),
    icon({
      include: {
        lucide: [
          'arrow-right',
          'calendar',
          'check-circle',
          'phone',
          'mail',
          'search',
          'file-text',
          'bar-chart',
          'briefcase',
          'trending-up',
          'users',
          'users-2',
          'shield',
          'target',
          'banknote',
          'trending-down',
          'zap',
          'crown',
          'landmark',
          'heart',
          'award',
          'pie-chart',
          'calculator',
          'download',
          'menu',
          'x',
          'map-pin',
          'play-circle',
          'rss',
          'clock',
        ],
      },
    }),
  ],
});
