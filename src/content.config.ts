import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const risorse = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/risorse' }),
  schema: z.object({
    youtubeUrl: z.string().url(),
    target: z.enum(['dirigenti', 'post-exit', 'famiglie-hnwi', 'generale']),
    takeaway: z.array(z.string()).min(2).max(6),
    title: z.string().optional(),
    excerpt: z.string().optional(),
    duration: z.string().optional(),
    thumbnail: z.string().optional(),
  }),
});

export const collections = { risorse };
