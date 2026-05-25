export async function fetchTranscript(id: string): Promise<string | null> {
  try {
    const mod = await import('youtube-transcript');
    const Yt = (mod as { YoutubeTranscript: { fetchTranscript: typeof fetchTranscriptImpl } })
      .YoutubeTranscript;
    const segments = await Yt.fetchTranscript(id, { lang: 'it' });
    return segments
      .map((s) => s.text)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  } catch {
    return null;
  }
}

type fetchTranscriptImpl = (id: string, opts: { lang: string }) => Promise<Array<{ text: string }>>;
