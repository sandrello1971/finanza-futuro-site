const YOUTUBE_ID_RE =
  /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/))([\w-]{11})/;

export function extractYouTubeId(url: string): string | null {
  const m = url?.match(YOUTUBE_ID_RE);
  return m ? m[1] : null;
}

export async function fetchOembedTitle(url: string): Promise<string | null> {
  try {
    const r = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
    );
    if (!r.ok) return null;
    const d = (await r.json()) as { title?: string };
    return d.title ?? null;
  } catch {
    return null;
  }
}

function isoToMMSS(iso: string): string | null {
  const m = iso.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!m) return null;
  const h = parseInt(m[1] || '0', 10);
  const min = parseInt(m[2] || '0', 10);
  const sec = parseInt(m[3] || '0', 10);
  if (h) return `${h}:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  return `${min}:${String(sec).padStart(2, '0')}`;
}

export async function fetchDuration(id: string): Promise<string | null> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return null;
  try {
    const r = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${id}&key=${key}`
    );
    if (!r.ok) return null;
    const d = (await r.json()) as { items?: Array<{ contentDetails?: { duration?: string } }> };
    const iso = d.items?.[0]?.contentDetails?.duration;
    return iso ? isoToMMSS(iso) : null;
  } catch {
    return null;
  }
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}
