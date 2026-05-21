#!/usr/bin/env node
// i18n-audit scanner: report hardcoded Cyrillic strings in mobile screens/components.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const DIRS = ["mobile/src/screens", "mobile/src/components"];
const cyr = /[А-Яа-яЁё]/;

let hits = 0;
function walk(dir) {
  let entries;
  try { entries = readdirSync(dir); } catch { return; }
  for (const name of entries) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) { walk(p); continue; }
    if (!/\.(t|j)sx?$/.test(name)) continue;
    readFileSync(p, "utf8").split(/\r?\n/).forEach((line, i) => {
      const t = line.trim();
      if (t.startsWith("//") || t.startsWith("*") || t.startsWith("import")) return;
      if (cyr.test(line)) {
        hits++;
        console.log(`${p}:${i + 1}: ${t.slice(0, 120)}`);
      }
    });
  }
}

for (const d of DIRS) walk(join(ROOT, d));
console.log(`\n${hits} line(s) with Cyrillic found — each a candidate for t('...').`);