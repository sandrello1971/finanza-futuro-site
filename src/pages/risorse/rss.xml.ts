import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const items = (await getCollection('risorse')).sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime()
  );

  return rss({
    title: 'Finanza & Futuro · Risorse',
    description:
      'Video di educazione finanziaria per dirigenti e imprenditori post-exit. Trascrizione completa di ogni episodio.',
    site: context.site!,
    items: items.map((entry) => ({
      title: entry.data.title,
      pubDate: entry.data.publishedAt,
      description: entry.data.excerpt,
      link: `/risorse/${entry.id}`,
    })),
    customData: '<language>it-IT</language>',
  });
}
