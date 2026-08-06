/**
 * Vendors the real EGYM One design system into docs/vendor/ so GitHub Pages can
 * serve it without reaching the private Artifactory registry at deploy time.
 *
 * Two outputs:
 *   docs/vendor/egym-one-ds.js      bundled ESM — the actual eo-* web components
 *   docs/vendor/egym-one-tokens.css the published token stylesheet (988 --eo-* custom properties)
 *
 * Run locally (needs Artifactory auth in ~/.npmrc), then commit the output.
 * Re-run after bumping the design system version in package.json.
 */
import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = resolve(root, 'docs/vendor');
const pkgDir = resolve(root, 'node_modules/@egym-private/egym-one-design-system-web');

if (!existsSync(pkgDir)) {
  console.error('Design system package not installed. Run `npm install` with Artifactory auth first.');
  process.exit(1);
}

const dsVersion = JSON.parse(readFileSync(resolve(pkgDir, 'package.json'), 'utf8')).version;
mkdirSync(outDir, { recursive: true });

// Only the components this dashboard actually uses. Importing a component module
// registers its custom element via lit's @customElement decorator.
const COMPONENTS = ['eo-card', 'eo-label', 'eo-alert', 'eo-button', 'eo-divider', 'eo-tooltip'];

const entry = resolve(root, '.ds-entry.js');
writeFileSync(
  entry,
  COMPONENTS.map((c) => `import '@egym-private/egym-one-design-system-web/${c}';`).join('\n') +
    `\nexport const DS_VERSION = ${JSON.stringify(dsVersion)};\n`
);

await build({
  entryPoints: [entry],
  bundle: true,
  format: 'esm',
  minify: true,
  target: ['es2022'],
  outfile: resolve(outDir, 'egym-one-ds.js'),
  banner: {
    js: `/* EGYM One Design System ${dsVersion} — bundled from @egym-private/egym-one-design-system-web.\n   Components: ${COMPONENTS.join(', ')}. Regenerate with \`npm run vendor\`. */`,
  },
  logLevel: 'warning',
});

// The published token stylesheet, verbatim. This is the real Style Dictionary output
// from the 4-tier cascade (Core -> Brand -> Appearance -> Breakpoint).
const tokensCss = readFileSync(resolve(pkgDir, 'dist/style.css'), 'utf8');
writeFileSync(
  resolve(outDir, 'egym-one-tokens.css'),
  `/* EGYM One token system, as published in @egym-private/egym-one-design-system-web@${dsVersion}.\n   Verbatim copy of dist/style.css — do not hand-edit. Regenerate with \`npm run vendor\`. */\n` +
    tokensCss
);

const tokenCount = new Set(tokensCss.match(/--eo-[a-z0-9-]+/g) || []).size;
writeFileSync(
  resolve(outDir, 'ds-version.json'),
  JSON.stringify({ version: dsVersion, components: COMPONENTS, tokenCount, vendoredAt: new Date().toISOString() }, null, 2)
);

console.log(`Vendored design system ${dsVersion}`);
console.log(`  components: ${COMPONENTS.join(', ')}`);
console.log(`  tokens:     ${tokenCount} --eo-* custom properties`);
