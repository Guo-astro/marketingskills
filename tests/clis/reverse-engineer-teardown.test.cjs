const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const SCRIPT = path.join(__dirname, '..', '..', 'skills', 'reverse-engineer-marketing', 'scripts', 'teardown.mjs');
const load = () => import(pathToFileURL(SCRIPT).href);

test('detectTools finds pixels and affiliate scripts', async () => {
  const { detectTools } = await load();
  const html = `
    <script src="https://connect.facebook.net/en_US/fbevents.js"></script><script>fbq('init','123')</script>
    <script src="https://www.googletagmanager.com/gtag/js?id=AW-123456789"></script><script>gtag('config','AW-123456789')</script>
    <script src="https://r.wdfl.co/rw.js"></script>
  `;
  const tools = detectTools(html);
  assert.ok(tools.includes('Meta Pixel'));
  assert.ok(tools.includes('Google Ads'));
  assert.ok(tools.includes('Rewardful'));
  assert.ok(!tools.includes('TikTok Pixel'));
});

test('pathFamily skips locale prefixes', async () => {
  const { pathFamily, localeOf } = await load();
  assert.equal(pathFamily('https://x.com/templates/crm'), '/templates');
  assert.equal(pathFamily('https://x.com/pt-br/templates/crm'), '/templates');
  assert.equal(pathFamily('https://x.com/'), '/');
  assert.equal(localeOf('https://x.com/de/blog/a'), 'de');
  assert.equal(localeOf('https://x.com/blog/a'), null);
});

test('parseCsv handles quotes, commas, and newlines', async () => {
  const { parseCsv, toCsv } = await load();
  const rows = parseCsv('a,b\n"x, y","say ""hi"""\n1,2\n');
  assert.deepEqual(rows, [{ a: 'x, y', b: 'say "hi"' }, { a: '1', b: '2' }]);
  assert.deepEqual(parseCsv(toCsv(rows)), rows);
});

test('analyzeMoves clusters nearby moves and scores lift', async () => {
  const { analyzeMoves } = await load();
  const traffic = ['2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06', '2025-07', '2025-08']
    .map((month, i) => ({ month, visits: String([100, 105, 110, 115, 200, 300, 330, 340][i]), brand_searches: '' }));
  const moves = [
    { date: '2025-04-20', channel: 'x', kind: 'founder-post', move: 'ARR post' },
    { date: '2025-05-10', channel: 'product-loop', kind: 'loop-first-seen', move: 'Badge' },
    { date: '2025-08-01', channel: 'ads', kind: 'ad-start', move: 'Meta ads' },
  ];
  const { clusters, top, leading } = analyzeMoves(moves, traffic);
  assert.equal(clusters.length, 2);
  assert.equal(clusters[0].moves, 'ARR post | Badge');
  assert.ok(clusters[0].visit_lift_pts > 0);
  assert.equal(top[0].cluster, 1);
  assert.ok(leading.every(l => l.note === 'too few to call'));
});

test('spearman returns 1 for monotonic series', async () => {
  const { spearman } = await load();
  assert.equal(spearman([1, 2, 3, 4], [10, 20, 30, 40]), 1);
  assert.equal(spearman([1, 2, 3, 4], [40, 30, 20, 10]), -1);
});

test('diffMoves returns only moves missing from the previous log', async () => {
  const { diffMoves } = await load();
  const old = [{ channel: 'ads', kind: 'ad-start', link: 'https://a.com/x/', move: 'Meta' }];
  const fresh = [
    { channel: 'ads', kind: 'ad-start', link: 'https://a.com/x', move: 'Meta (renamed)' },
    { channel: 'search', kind: 'page-family', link: 'https://a.com/templates', move: 'Templates' },
  ];
  assert.deepEqual(diffMoves(old, fresh).map(m => m.move), ['Templates']);
});

test('adLibraryLinks builds one link per network', async () => {
  const { adLibraryLinks } = await load();
  const links = adLibraryLinks('Acme Co', 'acme.com');
  assert.deepEqual(Object.keys(links), ['meta', 'google', 'linkedin', 'tiktok']);
  assert.match(links.meta, /q=Acme%20Co/);
  assert.match(links.google, /domain=acme\.com/);
});
