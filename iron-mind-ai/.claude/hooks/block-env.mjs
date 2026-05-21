#!/usr/bin/env node
// PreToolUse hook: block edits to real .env files (dev secrets: DB password, JWT secret).
// Allows .env.example / .env.sample / .env.template. Exit 2 blocks the tool call.
import { readFileSync } from 'node:fs';

let input = '';
try {
  input = readFileSync(0, 'utf8');
} catch {}

let data = {};
try {
  data = JSON.parse(input || '{}');
} catch {}

const fp = (data?.tool_input?.file_path || '').replace(/\\/g, '/');

const isEnv = /(^|\/)\.env(\.[a-z0-9]+)?$/i.test(fp);
const isTemplate = /\.env\.(example|sample|template|local\.example)$/i.test(fp);

if (isEnv && !isTemplate) {
  console.error(
    'Blocked by project hook: editing .env files is disabled — they hold dev secrets ' +
      '(DATABASE_URL password, JWT secret). If you genuinely need to change it, edit the file ' +
      'manually outside Claude, or update .env.example instead.',
  );
  process.exit(2);
}

process.exit(0);
