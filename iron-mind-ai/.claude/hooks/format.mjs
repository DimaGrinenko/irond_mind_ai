#!/usr/bin/env node
// PostToolUse hook: run Prettier on the file just edited (backend or mobile workspace).
// Silent and non-fatal — never blocks the edit if Prettier is missing or errors.
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

let input = '';
try {
  input = readFileSync(0, 'utf8');
} catch {}

let data = {};
try {
  data = JSON.parse(input || '{}');
} catch {}

const fp = data?.tool_input?.file_path || '';
if (!fp || !/\.(t|j)sx?$/.test(fp)) process.exit(0);

const norm = fp.replace(/\\/g, '/');

// Pick the workspace root that owns this file (prettier resolves the nearest config from cwd).
let cwd = null;
for (const ws of ['/backend/', '/mobile/']) {
  const i = norm.indexOf(ws);
  if (i !== -1) {
    cwd = norm.slice(0, i + ws.length - 1);
    break;
  }
}
if (!cwd || !existsSync(cwd)) process.exit(0);

try {
  // shell:true lets Windows resolve the npx/prettier shim; ignore output to stay quiet.
  execFileSync('npx', ['prettier', '--write', fp], {
    cwd,
    stdio: 'ignore',
    shell: true,
    timeout: 30000,
  });
} catch {
  // Prettier not installed in this workspace, or formatting failed — ignore, don't block.
}

process.exit(0);
