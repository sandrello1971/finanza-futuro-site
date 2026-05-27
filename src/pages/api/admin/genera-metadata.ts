import type { APIRoute } from 'astro';
import { generateMetadata } from '@/lib/admin/claude';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let body: { title?: string; transcript?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError(400, 'Invalid JSON body');
  }

  const title = body.title?.trim() || 'Video Finanza & Futuro';
  const transcript = body.transcript?.trim() ?? '';
  if (transcript.length < 100) {
    return jsonError(400, 'Trascrizione troppo corta (servono almeno 100 caratteri)');
  }

  try {
    const metadata = await generateMetadata(title, transcript);
    return new Response(JSON.stringify({ metadata }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
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
