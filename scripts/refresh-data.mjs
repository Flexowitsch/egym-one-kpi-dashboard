/**
 * Refreshes the parts of ds-kpi-data.json that can be measured directly from
 * the GitHub API, and leaves everything else untouched.
 *
 * What this can measure automatically:
 *   - components shipped in code       (contents of the web package)
 *   - open human PRs + median age      (pulls API)
 *   - dependabot PRs + oldest age
 *   - git tags and GitHub releases
 *   - age of the CONTRIBUTING PR draft
 *
 * What it cannot, and why:
 *   - Jira (DSC) counts   — needs an Atlassian token; set JIRA_* to enable
 *   - Notion BMA plan     — needs a Notion integration token
 *   - Figma/Supernova     — no unattended API access today
 *   Those fields stay as last written, and the dashboard shows their own asOf.
 *
 * Requires GITHUB_TOKEN with read access to the private design system repo.
 * Run: GITHUB_TOKEN=… node scripts/refresh-data.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dataPath = resolve(root, 'ds-kpi-data.json');
const data = JSON.parse(readFileSync(dataPath, 'utf8'));

const OWNER = 'egym';
const REPO = 'lib-egym-one-design-system';

// GitHub logins of the design system team itself. Anyone not on this list who
// merges a PR counts as a community contributor. Keep it current — a stale list
// inflates the community number.
const CORE_TEAM = ['pedromedley', 'ricciardelli', 'Flexowitsch', 'kolsware', 'martykuentzel'];

const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

if (!token) {
  console.error('No GITHUB_TOKEN set — cannot refresh. Data left unchanged.');
  process.exit(1);
}

const gh = async (path, params = {}) => {
  const url = new URL(`https://api.github.com${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'User-Agent': 'egym-one-kpi-dashboard' },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${path}`);
  return res.json();
};

const median = (xs) => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
};
const ageDays = (iso) => Math.round((Date.now() - new Date(iso)) / 86400000);

const warnings = [];
const today = new Date().toISOString().slice(0, 10);

/* ---------------------------------------------------- components in code */
try {
  const dir = await gh(`/repos/${OWNER}/${REPO}/contents/packages/egym-one-design-system-web/src/components`);
  const components = dir
    .filter((e) => e.type === 'dir' && e.name.startsWith('eo-'))
    .map((e) =>
      e.name
        .replace(/^eo-/, '')
        .split('-')
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join(' ')
    )
    .sort();
  data.coverage.codedComponents = components;
  data.coverage.inCode = components.length;
  data.coverage.inCodePct = Math.round((components.length / data.coverage.coreSetTotal) * 100);
  console.log(`components in code: ${components.length} (${data.coverage.inCodePct}% of ${data.coverage.coreSetTotal})`);
} catch (e) {
  warnings.push(`components: ${e.message}`);
}

/* ------------------------------------------------------------------- PRs */
try {
  const prs = [];
  for (let page = 1; page <= 5; page++) {
    const batch = await gh(`/repos/${OWNER}/${REPO}/pulls`, { state: 'open', per_page: 100, page });
    prs.push(...batch);
    if (batch.length < 100) break;
  }
  const bots = prs.filter((p) => p.user?.type === 'Bot' || p.user?.login?.includes('dependabot'));
  const humans = prs.filter((p) => !bots.includes(p));

  data.communityVelocity.openHumanPRs = {
    count: humans.length,
    medianAgeDays: median(humans.map((p) => ageDays(p.created_at))) ?? 0,
  };
  const botAges = bots.map((p) => ageDays(p.created_at));
  data.communityVelocity.dependabotPRs = {
    count: bots.length,
    medianAgeDays: median(botAges) ?? 0,
    oldestDays: botAges.length ? Math.max(...botAges) : 0,
  };

  const contributing = prs.find((p) => /contributing/i.test(p.title));
  if (contributing) data.communityVelocity.contributingPRDraftAgeDays = ageDays(contributing.created_at);

  console.log(`open PRs: ${humans.length} human (median ${data.communityVelocity.openHumanPRs.medianAgeDays} d), ${bots.length} bot`);
} catch (e) {
  warnings.push(`pulls: ${e.message}`);
}

/* ------------------------------------------------------- tags + releases */
try {
  const [tags, releases] = await Promise.all([
    gh(`/repos/${OWNER}/${REPO}/tags`, { per_page: 100 }),
    gh(`/repos/${OWNER}/${REPO}/releases`, { per_page: 100 }),
  ]);
  data.communityVelocity.gitTags = tags.length;
  data.communityVelocity.gitHubReleases = releases.length;
  console.log(`tags: ${tags.length}, releases: ${releases.length}`);
} catch (e) {
  warnings.push(`tags/releases: ${e.message}`);
}

/* --------------------------------------------------------- merged PR mix */
try {
  const merged = [];
  for (let page = 1; page <= 3; page++) {
    const batch = await gh(`/repos/${OWNER}/${REPO}/pulls`, { state: 'closed', per_page: 100, page, sort: 'updated', direction: 'desc' });
    merged.push(...batch.filter((p) => p.merged_at));
    if (batch.length < 100) break;
  }
  const humanMerged = merged.filter((p) => p.user?.type !== 'Bot' && !p.user?.login?.includes('dependabot'));

  // "Community" means contributors outside the design system team. Counting every
  // human PR would fold the core team's own work into the community number and
  // make adoption look roughly twice as healthy as it is.
  const community = humanMerged.filter((p) => !CORE_TEAM.includes(p.user.login));

  const allTimes = humanMerged.map((p) => Math.round((new Date(p.merged_at) - new Date(p.created_at)) / 86400000));
  if (allTimes.length) {
    data.communityVelocity.medianTimeToMergeDays = median(allTimes);
    data.communityVelocity.timeToMergeTailDays = [...allTimes].sort((a, b) => b - a).slice(0, 3);
    data.communityVelocity.externalContributors = new Set(community.map((p) => p.user.login)).size;
    data.communityVelocity.mergedCommunityPRs = community.length;
    data.communityVelocity.mergedHumanPRsTotal = humanMerged.length;
    console.log(
      `merged human PRs: ${humanMerged.length} total, ${community.length} from ${data.communityVelocity.externalContributors} external contributors · median ${data.communityVelocity.medianTimeToMergeDays} d`
    );
  }
} catch (e) {
  warnings.push(`merged PRs: ${e.message}`);
}

/* -------------------------------------------------------------- finalise */
data.meta.asOf = today;
data.meta.refreshedBy = 'scripts/refresh-data.mjs (GitHub API)';
data.meta.notAutoRefreshed = [
  'jira — needs an Atlassian token (JIRA_BASE_URL, JIRA_EMAIL, JIRA_TOKEN)',
  'bmaBuildPlan — needs a Notion integration token',
  'coverage.coreSetTotal — set from Figma library analytics, reviewed manually',
];
if (warnings.length) {
  data.meta.refreshWarnings = warnings;
  console.warn('\nWarnings:');
  warnings.forEach((w) => console.warn(`  ${w}`));
}

writeFileSync(dataPath, JSON.stringify(data, null, 2) + '\n');
console.log(`\nWrote ds-kpi-data.json (asOf ${today})`);
if (warnings.length) process.exitCode = 0; // partial refresh is still useful
