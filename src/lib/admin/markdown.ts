import { slugify } from './youtube';

export type VideoPayload = {
  youtubeUrl: string;
  title: string;
  excerpt: string;
  takeaway: string[];
  target: string;
  duration?: string | null;
  transcript: string;
};

function escapeYamlString(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function buildMarkdown(p: VideoPayload): string {
  const lines: string[] = ['---'];
  lines.push(`youtubeUrl: ${p.youtubeUrl}`);
  lines.push(`target: ${p.target}`);
  lines.push(`title: "${escapeYamlString(p.title)}"`);
  lines.push(`excerpt: "${escapeYamlString(p.excerpt)}"`);
  if (p.duration) lines.push(`duration: "${escapeYamlString(p.duration)}"`);
  lines.push('takeaway:');
  for (const t of p.takeaway) {
    lines.push(`  - "${escapeYamlString(t)}"`);
  }
  lines.push('---');
  lines.push('');
  lines.push(p.excerpt);
  lines.push('');
  lines.push('## Trascrizione completa');
  lines.push('');
  lines.push(p.transcript.trim());
  lines.push('');
  return lines.join('\n');
}

export function buildFilename(title: string, fallbackId: string): string {
  const slug = slugify(title) || `video-${fallbackId}`;
  return `${todayISO()}-${slug}.md`;
}

export function buildContentPath(filename: string): string {
  return `src/content/risorse/${filename}`;
}
