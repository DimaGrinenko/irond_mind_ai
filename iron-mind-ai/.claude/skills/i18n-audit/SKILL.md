---
name: i18n-audit
description: Audit the mobile app for localization gaps — hardcoded Russian (Cyrillic) strings in screens/components and missing RU/EN key parity in i18n/index.ts. Use when the user asks to check translations, find hardcoded strings, or before shipping a screen in English.
---

# i18n audit

Iron Mind AI is bilingual (RU + EN) via a hand-rolled t(key) in mobile/src/i18n/index.ts. The recurring bug class is hardcoded Cyrillic strings that never go through t(), so EN users see Russian (Alert.alert text, <Text> content, placeholders, button labels).

## Steps

1. Find hardcoded Cyrillic — run the bundled scanner:
   ```powershell
   node "$CLAUDE_PROJECT_DIR/.claude/skills/i18n-audit/scan.mjs"
   ```
   It walks mobile/src/screens and mobile/src/components, skips i18n/ and data/, and reports file:line for every Cyrillic string. Treat each hit as a candidate to replace with t('...').

2. Check RU/EN key parity — open mobile/src/i18n/index.ts, locate the ru and en dictionaries, confirm every key in one exists in the other. Report keys present in ru but missing in en (and vice versa).

3. Report, grouped by file. Do not auto-fix unless asked — surface the list first.

## Known intentional Cyrillic (not bugs)
- mobile/src/data/supplements.ts — RU supplement DB (EN lives in supplements_en.ts; flag if supplements_en.ts has fewer entries).
- mobile/src/data/foods.ts — RU food names.
- Program day titles seeded from the backend DB (e.g. "Фулбади А") — needs a backend i18n key, note separately.