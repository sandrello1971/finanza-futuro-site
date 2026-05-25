import type { APIRoute } from 'astro';
import { buildContentPath, buildFilename, buildMarkdown } from '@/lib/admin/markdown';
import { commitNewFile } from '@/lib/admin/github';
import { extractYouTubeId } from '@/lib/admin/youtube';

export const prerender = false;

const VALID_TARGETS = new Set(['dirigenti', 'post-exit', 'famiglie-hnwi', 'generale']);

type RequestPayload = {
  youtubeUrl: string;
  title: string;
  excerpt: string;
  takeaway: string[];
  target: string;
  duration?: string | null;
  transcript: string;
};

export const POST: APIRoute = async ({ request }) => {
  let body: RequestPayload;
  try {
    body = (await request.json()) as RequestPayload;
  } catch {
    return jsonError(400, 'Invalid JSON body');
  }

  const errors: string[] = [];
  if (!body.youtubeUrl) errors.push('youtubeUrl mancante');
  if (!body.title?.trim()) errors.push('title mancante');
  if (!body.excerpt?.trim()) errors.push('excerpt mancante');
  if (!Array.isArray(body.takeaway) || body.takeaway.length < 1) errors.push('takeaway vuoto');
  if (!body.target || !VALID_TARGETS.has(body.target)) errors.push('target non valido');
  if (!body.transcript?.trim() || body.transcript.trim().length < 50)
    errors.push('trascrizione troppo corta');

  if (errors.length > 0) return jsonError(400, errors.join('; '));

  const id = extractYouTubeId(body.youtubeUrl);
  if (!id) return jsonError(400, 'URL YouTube non valido');

  const filename = buildFilename(body.title, id);
  const filepath = buildContentPath(filename);
  const cleanTakeaway = body.takeaway.map((t) => t.trim()).filter(Boolean);

  const content = buildMarkdown({
    youtubeUrl: body.youtubeUrl,
    title: body.title.trim(),
    excerpt: body.excerpt.trim(),
    takeaway: cleanTakeaway,
    target: body.target,
    duration: body.duration ?? null,
    transcript: body.transcript.trim(),
  });

  try {
    const result = await commitNewFile({
      path: filepath,
      content,
      commitMessage: `video: pubblica "${body.title.trim().slice(0, 60)}"`,
    });
    return new Response(
      JSON.stringify({
        success: true,
        commitUrl: result.commitUrl,
        filePath: result.filePath,
        publicSlug: filename.replace(/\.md$/, ''),
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (e) {
    return jsonError(500, e instanceof Error ? e.message : String(e));
  }
};

function jsonError(status: number, message: string) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
