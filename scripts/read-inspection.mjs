/**
 * Extracts station scores from the DS inspection reports and merges them into
 * ds-kpi-data.json under `inspection`.
 *
 * The inspection is the closest thing the team has to a single "state of the
 * system" number, so the dashboard should never drift from it. Point this at the
 * ds-inspection folder and it re-reads the latest report.
 *
 *   node scripts/read-inspection.mjs ../ds-inspection
 *
 * Parses the "what changed" matrix in the report body, which looks like:
 *   | 1 | Coverage & gaps | 🔴 3 | 🔴 3 | 🔴 **3** | — | 3 | +2 components; … |
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
// Defaults to the reports vendored into this repo, so the build is
// self-contained and the score is auditable against its source. Pass a path to
// read from a working ds-inspection folder instead.
const inspectionDir = resolve(root, process.argv[2] ?? './inspection');
const reportsDir = resolve(inspectionDir, 'reports');

if (!existsSync(reportsDir)) {
  console.error(`No reports directory at ${reportsDir}`);
  console.error('Pass the path to the ds-inspection folder, e.g. `node scripts/read-inspection.mjs ../ds-inspection`');
  process.exit(1);
}

// Full inspections only — single-station re-runs don't carry the matrix.
const reports = readdirSync(reportsDir)
  .filter((f) => /^\d{4}-\d{2}-\d{2}-inspection\.md$/.test(f))
  .sort();

if (!reports.length) {
  console.error('No full inspection reports found (expected e.g. 2026-08-05-inspection.md)');
  process.exit(1);
}

const latest = reports[reports.length - 1];
const md = readFileSync(resolve(reportsDir, latest), 'utf8');
const date = basename(latest, '.md').slice(0, 10);

const light = (n) => (n <= 3 ? 'red' : n <= 7 ? 'yellow' : 'green');
const cell = (s) => {
  const m = String(s).match(/(\d+)/);
  return m ? Number(m[1]) : null;
};

const stations = [];
for (const line of md.split('\n')) {
  // matrix rows start with a station number and have at least 7 pipe-separated cells
  const cells = line.split('|').map((c) => c.trim());
  if (cells.length < 8) continue;
  const idx = Number(cells[1]);
  if (!Number.isInteger(idx) || idx < 1 || idx > 10) continue;
  const name = cells[2].replace(/\*\*/g, '').replace(/&amp;/g, '&');
  if (!name || /^-+$/.test(name)) continue;

  const shipped = cell(cells[5]);
  const potential = cell(cells[7]);
  if (shipped === null) continue;

  stations.push({
    n: idx,
    name,
    score: shipped,
    light: light(shipped),
    potential: potential !== null && potential !== shipped ? potential : null,
    // Keep positional — a station can be "N/I" (not inspected) in an earlier
    // column, and filtering nulls out would shift every later score left.
    history: [cell(cells[3]), cell(cells[4]), shipped],
    note: (cells[8] || '').replace(/`/g, '').replace(/\*\*/g, ''),
  });
}

if (stations.length !== 10) {
  console.warn(`Parsed ${stations.length} stations, expected 10 — check the matrix format in ${latest}`);
}

const shippedTotal = stations.reduce((a, s) => a + s.score, 0);
const potentialTotal = stations.reduce((a, s) => a + (s.potential ?? s.score), 0);

// Prior totals for the trend line. Only count a column where every station has a
// score — an incomplete pass (a station marked "not inspected") was pro-rated in
// the report and cannot be re-derived by summing this matrix.
const priorTotals = [0, 1].map((col) =>
  stations.every((s) => s.history[col] != null) ? stations.reduce((a, s) => a + s.history[col], 0) : null
);

const inspection = {
  source: `ds-inspection/reports/${latest}`,
  date,
  shippedTotal,
  potentialTotal,
  maxTotal: 100,
  reds: stations.filter((s) => s.light === 'red').length,
  yellows: stations.filter((s) => s.light === 'yellow').length,
  greens: stations.filter((s) => s.light === 'green').length,
  trend: [...priorTotals, shippedTotal].filter((v) => v !== null),
  stations,
};

const dataPath = resolve(root, 'ds-kpi-data.json');
const data = JSON.parse(readFileSync(dataPath, 'utf8'));
data.inspection = inspection;
writeFileSync(dataPath, JSON.stringify(data, null, 2) + '\n');

console.log(`Read ${latest}`);
console.log(`  ${stations.length} stations · ${shippedTotal}/100 shipped · ${potentialTotal}/100 achievable`);
console.log(`  ${inspection.reds} red · ${inspection.yellows} yellow · ${inspection.greens} green`);
console.log(`  trend: ${inspection.trend.join(' → ')}`);
