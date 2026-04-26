import fs from 'node:fs/promises';
import path from 'node:path';

const YOUTUBE_ID_RE =
  /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/))([\w-]{11})/;

export function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  const m = url.match(YOUTUBE_ID_RE);
  return m ? m[1] : null;
}

export function getThumbnailUrl(id: string): string {
  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
}

export function getThumbnailFallbackUrl(id: string): string {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

export function durationToISO(duration: string): string | null {
  if (!duration) return null;
  const parts = duration.split(':').map((p) => parseInt(p, 10));
  if (parts.some(Number.isNaN)) return null;
  let h = 0;
  let m = 0;
  let s = 0;
  if (parts.length === 3) [h, m, s] = parts;
  else if (parts.length === 2) [m, s] = parts;
  else if (parts.length === 1) [s] = parts;
  else return null;
  let iso = 'PT';
  if (h) iso += `${h}H`;
  if (m) iso += `${m}M`;
  if (s || (!h && !m)) iso += `${s}S`;
  return iso;
}

export interface OembedData {
  title: string;
  author_name: string;
  thumbnail_url: string;
}

const TTL_MS = 30 * 24 * 60 * 60 * 1000;

export async function fetchOembed(url: string): Promise<OembedData | null> {
  const id = extractYoutubeId(url);
  if (!id) return null;
  const cacheDir = path.join(process.cwd(), 'node_modules/.cache/youtube-oembed');
  const cachePath = path.join(cacheDir, `${id}.json`);
  try {
    const stat = await fs.stat(cachePath);
    if (Date.now() - stat.mtimeMs < TTL_MS) {
      return JSON.parse(await fs.readFile(cachePath, 'utf-8')) as OembedData;
    }
  } catch {
    /* cache miss */
  }
  try {
    const resp = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
    );
    if (!resp.ok) return null;
    const raw = (await resp.json()) as Record<string, unknown>;
    const data: OembedData = {
      title: String(raw.title ?? ''),
      author_name: String(raw.author_name ?? ''),
      thumbnail_url: String(raw.thumbnail_url ?? ''),
    };
    await fs.mkdir(cacheDir, { recursive: true });
    await fs.writeFile(cachePath, JSON.stringify(data));
    return data;
  } catch {
    return null;
  }
}
