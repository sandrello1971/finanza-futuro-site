#!/usr/bin/env node
// Genera ADMIN_PASSWORD_HASH e SESSION_SECRET da configurare su Vercel.
// Uso: node scripts/admin-setup.mjs "la-tua-password-scelta"

import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';

const password = process.argv[2];
if (!password) {
  console.error('Uso: node scripts/admin-setup.mjs "<password>"');
  process.exit(1);
}
if (password.length < 10) {
  console.error('Password troppo corta: usa almeno 10 caratteri.');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);
const sessionSecret = crypto.randomBytes(48).toString('base64url');

console.log('');
console.log('Copia queste env var su Vercel (Project → Settings → Environment Variables):');
console.log('');
console.log(`ADMIN_PASSWORD_HASH=${hash}`);
console.log(`SESSION_SECRET=${sessionSecret}`);
console.log('');
console.log('Aggiungi anche manualmente:');
console.log(`  ADMIN_USER=<nome-utente-che-scegli>`);
console.log(`  GITHUB_TOKEN=<PAT fine-grained con scope "Contents: Read and write" sul repo>`);
console.log(`  GITHUB_REPO=sandrello1971/finanza-futuro-site`);
console.log(`  GITHUB_BRANCH=main`);
console.log(`  YOUTUBE_API_KEY=<la chiave che gia usi>`);
console.log(`  ANTHROPIC_API_KEY=<la chiave Anthropic>`);
console.log('');
