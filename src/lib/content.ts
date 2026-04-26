import type { CollectionEntry } from 'astro:content';
import {
  extractYoutubeId,
  getThumbnailUrl,
  durationToISO,
  fetchOembed,
} from './youtube';

export function parseFilenameDate(id: string): Date | null {
  const m = id.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  const d = new Date(`${m[1]}-${m[2]}-${m[3]}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function markdownToPlainText(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function firstParagraph(body: string): string {
  const blocks = body
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);
  const para = blocks.find((b) => !b.startsWith('#'));
  if (!para) return '';
  return markdownToPlainText(para).replace(/\s+/g, ' ').trim();
}

export function truncate(text: string, max = 200): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).replace(/\s+\S*$/, '') + '…';
}

export interface DerivedEntry {
  youtubeId: string;
  title: string;
  excerpt: string;
  publishedAt: Date;
  thumbnail: string;
  duration: string | null;
  durationISO: string | null;
}

export async function deriveEntry(
  entry: CollectionEntry<'risorse'>
): Promise<DerivedEntry> {
  const youtubeId = extractYoutubeId(entry.data.youtubeUrl) ?? '';
  const oembed = await fetchOembed(entry.data.youtubeUrl);
  const title = entry.data.title ?? oembed?.title ?? entry.id;
  const body = (entry as { body?: string }).body ?? '';
  const excerpt = entry.data.excerpt ?? truncate(firstParagraph(body), 200);
  const publishedAt = parseFilenameDate(entry.id) ?? new Date(0);
  const thumbnail = entry.data.thumbnail ?? getThumbnailUrl(youtubeId);
  const duration = entry.data.duration ?? null;
  const durationISO = duration ? durationToISO(duration) : null;
  return { youtubeId, title, excerpt, publishedAt, thumbnail, duration, durationISO };
}
