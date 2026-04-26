import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { deriveEntry } from '@/lib/content';

export async function GET(context: APIContext) {
  const all = await getCollection('risorse');
  const enriched = await Promise.all(
    all.map(async (entry) => ({ entry, derived: await deriveEntry(entry) }))
  );
  const sorted = enriched.sort(
    (a, b) => b.derived.publishedAt.getTime() - a.derived.publishedAt.getTime()
  );

  return rss({
    title: 'Finanza & Futuro · Risorse',
    description:
      'Video di educazione finanziaria per dirigenti e imprenditori post-exit. Trascrizione completa di ogni episodio.',
    site: context.site!,
    items: sorted.map(({ entry, derived }) => ({
      title: derived.title,
      pubDate: derived.publishedAt,
      description: derived.excerpt,
      link: `/risorse/${entry.id}`,
    })),
    customData: '<language>it-IT</language>',
  });
}
