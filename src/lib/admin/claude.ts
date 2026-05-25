import Anthropic from '@anthropic-ai/sdk';

export type GeneratedMetadata = {
  title: string;
  excerpt: string;
  takeaway: string[];
  target: 'dirigenti' | 'post-exit' | 'famiglie-hnwi' | 'generale';
};

const SYSTEM_PROMPT = `Sei un editor di Finanza & Futuro, un sito di consulenza patrimoniale italiano.
A partire dalla trascrizione di un video YouTube, generi i metadati per la pubblicazione:

- title: titolo conciso e accattivante in italiano, max 70 caratteri, senza virgolette
- excerpt: paragrafo introduttivo di 2-3 frasi (max 280 caratteri) che riassume il contenuto e crea curiosità, in italiano, senza virgolette interne
- takeaway: 3-4 punti chiave estratti dal contenuto, ciascuno una frase completa e densa di informazione, in italiano
- target: pubblico principale a cui si rivolge il video, uno tra: "dirigenti" (per dirigenti e professionisti con stock option/bonus), "post-exit" (per imprenditori dopo vendita azienda), "famiglie-hnwi" (per famiglie con grandi patrimoni multigenerazionali), "generale" (contenuto di interesse trasversale, scelta di default se non chiaro)

Stile: professionale ma accessibile, niente clickbait, focus sul valore informativo. Italiano corretto, niente anglicismi inutili.

Rispondi SOLO con un JSON valido nel formato:
{"title": "...", "excerpt": "...", "takeaway": ["...", "...", "..."], "target": "..."}`;

export async function generateMetadata(
  videoTitle: string,
  transcript: string
): Promise<GeneratedMetadata> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY missing');

  const client = new Anthropic({ apiKey });

  const userPrompt = `Titolo originale YouTube: ${videoTitle}

Trascrizione:
${transcript.slice(0, 12000)}`;

  const response = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const textBlock = response.content.find((b) => b.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('Claude returned no text content');
  }
  const raw = textBlock.text.trim();

  const jsonStart = raw.indexOf('{');
  const jsonEnd = raw.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error(`Claude response is not JSON: ${raw.slice(0, 200)}`);
  }
  const parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1)) as GeneratedMetadata;

  if (!parsed.title || !parsed.excerpt || !Array.isArray(parsed.takeaway) || !parsed.target) {
    throw new Error('Claude response missing fields');
  }
  return parsed;
}
