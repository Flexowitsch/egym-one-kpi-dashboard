/**
 * Continuous check: does the Properties Glossary still describe the real system?
 *
 * The glossary is the naming contract between design and code. It is also the
 * one artefact nothing validates, which is why the inspection kept finding it
 * drifted. This turns that finding into a check that runs on every build.
 *
 * Three sources, reconciled:
 *
 *   1. inspection/glossary-entries.json   what the glossary claims, committed
 *   2. inspection/figma-properties.json   what the UI Kit actually has
 *   3. node_modules/@egym-private/…       what the code components actually have
 *
 * WHY THE FIGMA SIDE IS A SNAPSHOT
 * Reading the UI Kit needs the Desktop Bridge plugin open in Figma, which is a
 * human-attended action and cannot run in CI. So the read is a deliberate step
 * — `npm run snapshot:figma` prints the plugin code to paste — and its output
 * is committed. The check then runs continuously against that snapshot, and
 * reports how old it is. A stale snapshot is visible rather than silent.
 *
 * Exit code is 0 by default: this reports a standing condition, and failing the
 * build on it would only teach people to ignore the build. Pass --strict to
 * fail on drift once the glossary has been brought back in line.
 */
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const strict = process.argv.includes('--strict');

const read = (p) => JSON.parse(readFileSync(resolve(root, p), 'utf8'));

const figma = read('inspection/figma-properties.json');
const glossary = read('inspection/glossary-entries.json');

/* ---- what the code components expose -------------------------------------
   Two things count as a code-side property: a reflected class field on the
   element, and a named slot. The glossary describes both, so both are read. */
const pkgDir = resolve(root, 'node_modules/@egym-private/egym-one-design-system-web/dist/components');
const codeProps = new Set();
const codeSlots = new Set();
if (existsSync(pkgDir)) {
  for (const dir of readdirSync(pkgDir)) {
    const d = resolve(pkgDir, dir);
    let files = [];
    try { files = readdirSync(d); } catch { continue; }
    for (const f of files.filter((f) => f.endsWith('.d.ts'))) {
      const src = readFileSync(resolve(d, f), 'utf8');
      for (const m of src.matchAll(/^\s{4}([a-zA-Z][a-zA-Z0-9]*)\s*[:?]/gm)) codeProps.add(m[1]);
    }
    for (const f of files.filter((f) => f.endsWith('.js'))) {
      const src = readFileSync(resolve(d, f), 'utf8');
      for (const m of src.matchAll(/slot name="([a-z-]+)"/g)) codeSlots.add(m[1]);
    }
  }
}

/* ---- normalisation --------------------------------------------------------
   The glossary is written in camelCase, the UI Kit in kebab-case. Which of the
   two is correct is an open question in the CoP — so this check does not pick
   a winner. It converts between them only to tell "the same property, spelled
   differently" apart from "this property does not exist". */
const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const camel = (s) => s.replace(/[-\s]+([a-z0-9])/g, (_, c) => c.toUpperCase());

const figmaNames = new Set(Object.keys(figma.properties));
const inFigma = (n) => figmaNames.has(n) || figmaNames.has(kebab(n));
const figmaNameFor = (n) => (figmaNames.has(n) ? n : figmaNames.has(kebab(n)) ? kebab(n) : null);
const inCode = (n) => {
  const c = camel(n.replace(/^has /, 'has-'));
  return codeProps.has(c) || codeProps.has(camel(n)) || codeSlots.has(kebab(n)) ||
    codeSlots.has(kebab(n).replace(/^has-/, '')) || codeSlots.has(kebab(n).replace(/-content$/, ''));
};

const exact = [];
const caseDrift = [];
const codeOnly = [];
const orphan = [];

for (const entry of glossary.entries) {
  const name = typeof entry === 'string' ? entry : entry.name;
  const fName = figmaNameFor(name);
  if (fName === name) exact.push(name);
  else if (fName) caseDrift.push({ glossary: name, figma: fName });
  else if (inCode(name)) codeOnly.push(name);
  else orphan.push(name);
}

// High-usage Figma properties the glossary never mentions.
const covered = new Set(glossary.entries.flatMap((e) => {
  const n = typeof e === 'string' ? e : e.name;
  return [n, kebab(n)];
}));
const uncovered = Object.entries(figma.properties)
  .filter(([n]) => !covered.has(n))
  .sort((a, b) => b[1].sets - a[1].sets);

const ageDays = Math.round((Date.now() - Date.parse(figma.capturedAt)) / 86400000);

/* ---- report --------------------------------------------------------------- */
const line = (s = '') => console.log(s);
line();
line('Properties Glossary — reconciliation');
line('─'.repeat(64));
line(`Figma snapshot   ${figma.capturedAt}  (${ageDays}d old · ${figma.componentSets} component sets · ${figmaNames.size} properties)`);
line(`Glossary         ${glossary.entries.length} entries${glossary.partial ? `  ⚠ partial — ${glossary.note}` : ''}`);
line(`Code package     ${codeProps.size} reflected properties · ${codeSlots.size} named slots`);
line();
line(`✓ exact match in Figma        ${exact.length}`);
line(`± spelled differently         ${caseDrift.length}`);
caseDrift.forEach((d) => line(`    glossary "${d.glossary}"  →  Figma "${d.figma}"`));
line(`◑ code-side only              ${codeOnly.length}${codeOnly.length ? '   ' + codeOnly.join(', ') : ''}`);
line(`✗ in neither Figma nor code   ${orphan.length}${orphan.length ? '   ' + orphan.join(', ') : ''}`);
line();
line(`Not in the glossary at all: ${uncovered.length} properties. Most used:`);
uncovered.slice(0, 12).forEach(([n, m]) => line(`    ${String(m.sets).padStart(3)} sets  ${n}  (${m.type})`));
line();

if (ageDays > 30) {
  line(`⚠ The Figma snapshot is ${ageDays} days old. Re-run npm run snapshot:figma with the Desktop Bridge open.`);
  line();
}

writeFileSync(
  resolve(root, 'inspection/glossary-check.json'),
  JSON.stringify(
    {
      checkedAt: new Date().toISOString().slice(0, 10),
      figmaSnapshot: figma.capturedAt,
      snapshotAgeDays: ageDays,
      glossaryEntries: glossary.entries.length,
      glossaryPartial: Boolean(glossary.partial),
      exact: exact.length,
      caseDrift,
      codeOnly,
      orphan,
      uncoveredCount: uncovered.length,
      uncoveredTop: uncovered.slice(0, 20).map(([n, m]) => ({ name: n, type: m.type, sets: m.sets })),
    },
    null,
    2
  ) + '\n'
);

const drift = caseDrift.length + orphan.length;
if (strict && drift) {
  console.error(`✗ ${drift} glossary entries do not match the system.`);
  process.exit(1);
}
