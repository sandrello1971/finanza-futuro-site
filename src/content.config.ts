import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const risorse = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/risorse' }),
  schema: z.object({
    title: z.string(),
    youtubeId: z.string(),
    target: z.enum(['dirigenti', 'post-exit', 'famiglie-hnwi', 'generale']),
    publishedAt: z.coerce.date(),
    duration: z.string(),
    durationISO: z.string(),
    excerpt: z.string(),
    takeaway: z.array(z.string()).min(2).max(6),
    thumbnail: z.string().optional(),
  }),
});

export const collections = { risorse };
