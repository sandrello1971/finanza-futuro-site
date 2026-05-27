import { YoutubeTranscript } from 'youtube-transcript';

export type TranscriptResult = {
  text: string | null;
  error: string | null;
};

export async function fetchTranscript(id: string): Promise<TranscriptResult> {
  // Tentiamo prima italiano, poi default (lingua originale del video)
  const attempts: Array<{ label: string; opts?: { lang: string } }> = [
    { label: 'it', opts: { lang: 'it' } },
    { label: 'default', opts: undefined },
  ];

  let lastErr: unknown = null;
  for (const a of attempts) {
    try {
      const segments = await (a.opts
        ? YoutubeTranscript.fetchTranscript(id, a.opts)
        : YoutubeTranscript.fetchTranscript(id));
      const text = segments
        .map((s) => s.text)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
      if (text.length > 0) {
        return { text, error: null };
      }
    } catch (e) {
      lastErr = e;
    }
  }

  const msg = lastErr instanceof Error ? lastErr.message : String(lastErr ?? 'unknown');
  return { text: null, error: msg };
}
