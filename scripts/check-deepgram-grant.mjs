#!/usr/bin/env node
/**
 * Checks whether DEEPGRAM_API_KEY can mint short-lived tokens for Voice Agent.
 * Usage: npm run check:deepgram
 * Does not print the API key or access token.
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

function loadEnvKey() {
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    throw new Error('.env not found');
  }
  const line = fs
    .readFileSync(envPath, 'utf8')
    .split('\n')
    .find((l) => l.startsWith('DEEPGRAM_API_KEY='));
  if (!line) {
    throw new Error('DEEPGRAM_API_KEY missing from .env');
  }
  return line
    .slice('DEEPGRAM_API_KEY='.length)
    .trim()
    .replace(/^['"]|['"]$/g, '');
}

async function main() {
  const key = loadEnvKey();
  console.log('DEEPGRAM_API_KEY loaded (length=%d)', key.length);

  const grantRes = await fetch('https://api.deepgram.com/v1/auth/grant', {
    method: 'POST',
    headers: {
      Authorization: `Token ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ttl_seconds: 60 }),
  });

  let grantBody = {};
  try {
    grantBody = await grantRes.json();
  } catch {
    /* ignore */
  }

  console.log('POST /v1/auth/grant ->', grantRes.status);
  if (grantRes.ok) {
    console.log(
      'OK — token mint works (expires_in=%s). Restart Next.js and try Start session.',
      grantBody.expires_in ?? '?'
    );
    return;
  }

  console.log(
    'Error:',
    grantBody.err_msg || grantBody.message || grantBody.err_code || '(none)'
  );

  if (grantRes.status === 403) {
    console.log(`
FIX REQUIRED (this is not an app bug):
1. Open https://console.deepgram.com/ → correct project
2. Settings → API Keys → Create a New API Key
3. Permissions must be Member, Admin, or Owner
   (Console: Create Key → Advanced → choose Member)
4. Paste the new secret into .env as DEEPGRAM_API_KEY=...
5. Fully restart: stop npm run dev, start again
6. Re-run: npm run check:deepgram

A usage-only key can call STT but CANNOT call /v1/auth/grant.
`);
    process.exitCode = 1;
    return;
  }

  process.exitCode = 1;
}

main().catch((err) => {
  console.error(err.message || err);
  process.exitCode = 1;
});
