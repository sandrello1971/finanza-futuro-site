import type { APIRoute } from 'astro';
import { extractYouTubeId, fetchDuration, fetchOembedTitle } from '@/lib/admin/youtube';
import { fetchTranscript } from '@/lib/admin/transcript';
import { generateMetadata } from '@/lib/admin/claude';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let body: { url?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError(400, 'Invalid JSON body');
  }

  const url = body.url?.trim();
  if (!url) return jsonError(400, 'Manca URL YouTube');

  const id = extractYouTubeId(url);
  if (!id) return jsonError(400, 'URL YouTube non valido');

  const [videoTitle, duration, transcriptResult] = await Promise.all([
    fetchOembedTitle(url),
    fetchDuration(id),
    fetchTranscript(id),
  ]);

  const transcript = transcriptResult.text;
  const transcriptError = transcriptResult.error;

  let metadata: Awaited<ReturnType<typeof generateMetadata>> | null = null;
  let metadataError: string | null = null;
  if (transcript && transcript.length > 100) {
    try {
      metadata = await generateMetadata(videoTitle ?? `Video ${id}`, transcript);
    } catch (e) {
      metadataError = e instanceof Error ? e.message : String(e);
    }
  }

  return new Response(
    JSON.stringify({
      youtubeUrl: url,
      videoId: id,
      videoTitle: videoTitle ?? `Video ${id}`,
      duration,
      transcript: transcript ?? '',
      transcriptAvailable: !!transcript,
      transcriptError,
      metadata,
      metadataError,
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};

function jsonError(status: number, message: string) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
