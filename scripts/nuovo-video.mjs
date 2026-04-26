#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const YOUTUBE_ID_RE =
  /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/))([\w-]{11})/;

function extractId(url) {
  const m = url?.match(YOUTUBE_ID_RE);
  return m ? m[1] : null;
}

function slugify(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function isoToMMSS(iso) {
  const m = iso?.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!m) return null;
  const h = parseInt(m[1] || '0', 10);
  const min = parseInt(m[2] || '0', 10);
  const sec = parseInt(m[3] || '0', 10);
  if (h) return `${h}:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  return `${min}:${String(sec).padStart(2, '0')}`;
}

async function fetchOembedTitle(url) {
  try {
    const r = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
    );
    if (!r.ok) return null;
    return (await r.json()).title ?? null;
  } catch {
    return null;
  }
}

async function fetchDataApiDuration(id) {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return null;
  try {
    const r = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${id}&key=${key}`
    );
    if (!r.ok) return null;
    const d = await r.json();
    return d?.items?.[0]?.contentDetails?.duration ?? null;
  } catch {
    return null;
  }
}

async function fetchTranscript(id) {
  try {
    const mod = await import('youtube-transcript');
    const Yt = mod.YoutubeTranscript;
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

async function main() {
  const url = process.argv[2];
  if (!url) {
    console.error('Uso: npm run video <url-youtube>');
    process.exit(1);
  }
  const id = extractId(url);
  if (!id) {
    console.error('URL YouTube non valido:', url);
    process.exit(1);
  }

  console.log('▶  Estrazione ID:', id);
  const title = (await fetchOembedTitle(url)) ?? `video-${id}`;
  console.log('▶  Titolo:', title);

  const isoDuration = await fetchDataApiDuration(id);
  const duration = isoDuration ? isoToMMSS(isoDuration) : null;
  if (duration) console.log('▶  Durata:', duration, `(${isoDuration})`);
  else console.log('▶  Durata: non disponibile (manca YOUTUBE_API_KEY o video privato)');

  const transcript = await fetchTranscript(id);
  if (transcript) {
    console.log('▶  Trascrizione: scaricata (', transcript.length, 'caratteri)');
  } else {
    console.log(
      '▶  Trascrizione: non disponibile (pacchetto youtube-transcript non installato o sottotitoli mancanti)'
    );
  }

  const slug = slugify(title) || `video-${id}`;
  const date = todayISO();
  const filename = `${date}-${slug}.md`;
  const filepath = path.join(ROOT, 'src/content/risorse', filename);

  const frontmatterLines = [
    '---',
    `youtubeUrl: "${url}"`,
    `target: "TODO"  # dirigenti | post-exit | famiglie-hnwi | generale`,
    duration ? `duration: "${duration}"` : null,
    `takeaway:`,
    `  - "TODO punto chiave 1"`,
    `  - "TODO punto chiave 2"`,
    `  - "TODO punto chiave 3"`,
    '---',
  ].filter(Boolean);

  const body = [
    '',
    "TODO: paragrafo introduttivo (diventa l'excerpt automatico).",
    '',
    '## Trascrizione completa',
    '',
    transcript ?? 'TODO: incolla qui la trascrizione completa del video.',
    '',
  ].join('\n');

  await fs.mkdir(path.dirname(filepath), { recursive: true });
  await fs.writeFile(filepath, frontmatterLines.join('\n') + body);

  console.log('');
  console.log('✓ File creato:', path.relative(ROOT, filepath));
  console.log('  Apri con:    code', filepath);
  console.log('');
  console.log('Da completare manualmente:');
  console.log('  - target (sostituisci "TODO")');
  console.log('  - takeaway (3-6 punti chiave)');
  if (!duration) console.log('  - duration (opzionale, formato "12:34")');
  if (!transcript) console.log('  - trascrizione (incolla sotto "## Trascrizione completa")');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
