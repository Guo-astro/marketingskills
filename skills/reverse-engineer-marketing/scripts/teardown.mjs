#!/usr/bin/env node
// Free-source collection and analysis for a growth teardown. Node 18+, no dependencies.
// Run with no arguments for usage.

import { gunzipSync } from 'node:zlib';
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const UA = 'Mozilla/5.0 (compatible; marketingskills-teardown/1.0)';
const WAYBACK_DELAY_MS = 1500;

export const SIGNATURES = [
  { tool: 'Meta Pixel', group: 'ads', patterns: [/connect\.facebook\.net\/[^"']*fbevents\.js/, /\bfbq\(\s*['"]init/] },
  { tool: 'Google Ads', group: 'ads', patterns: [/googleadservices\.com\/pagead\/conversion/, /['"]AW-\d{6,}/] },
  { tool: 'Microsoft Ads (UET)', group: 'ads', patterns: [/bat\.bing\.com\/bat\.js/] },
  { tool: 'X Ads', group: 'ads', patterns: [/static\.ads-twitter\.com\/uwt\.js/, /\btwq\(\s*['"]/] },
  { tool: 'Reddit Ads', group: 'ads', patterns: [/redditstatic\.com\/ads\/pixel\.js/, /\brdt\(\s*['"]init/] },
  { tool: 'TikTok Pixel', group: 'ads', patterns: [/analytics\.tiktok\.com\/i18n\/pixel/, /\bttq\.load\(/] },
  { tool: 'LinkedIn Insight', group: 'ads', patterns: [/snap\.licdn\.com\/li\.lms-analytics/, /_linkedin_partner_id/] },
  { tool: 'Quora Pixel', group: 'ads', patterns: [/a\.quora\.com\/qevents\.js/] },
  { tool: 'Google Analytics', group: 'analytics', patterns: [/googletagmanager\.com\/gtag\/js\?id=G-/, /google-analytics\.com\/analytics\.js/] },
  { tool: 'Google Tag Manager', group: 'analytics', patterns: [/googletagmanager\.com\/gtm\.js/, /['"]GTM-[A-Z0-9]{4,}/] },
  { tool: 'Segment', group: 'analytics', patterns: [/cdn\.segment\.com\/analytics\.js/] },
  { tool: 'PostHog', group: 'analytics', patterns: [/i\.posthog\.com/, /app\.posthog\.com/, /posthog\.init\(/] },
  { tool: 'Mixpanel', group: 'analytics', patterns: [/cdn\.mxpnl\.com/, /mixpanel\.init\(/] },
  { tool: 'Amplitude', group: 'analytics', patterns: [/cdn\.amplitude\.com/] },
  { tool: 'Hotjar', group: 'analytics', patterns: [/static\.hotjar\.com/] },
  { tool: 'Microsoft Clarity', group: 'analytics', patterns: [/clarity\.ms\/tag/] },
  { tool: 'Optimizely', group: 'testing', patterns: [/cdn\.optimizely\.com/] },
  { tool: 'VWO', group: 'testing', patterns: [/visualwebsiteoptimizer\.com/] },
  { tool: 'Rewardful', group: 'referral', patterns: [/r\.wdfl\.co/] },
  { tool: 'PartnerStack', group: 'referral', patterns: [/partnerstack\.com\/[^"']*\.js/] },
  { tool: 'Tolt', group: 'referral', patterns: [/cdn\.tolt\.io/] },
  { tool: 'FirstPromoter', group: 'referral', patterns: [/cdn\.firstpromoter\.com/] },
  { tool: 'Dub', group: 'referral', patterns: [/dubcdn\.com\/analytics/] },
  { tool: 'Intercom', group: 'lifecycle', patterns: [/widget\.intercom\.io/, /js\.intercomcdn\.com/] },
  { tool: 'HubSpot', group: 'lifecycle', patterns: [/js\.hs-scripts\.com/, /js\.hsforms\.net/] },
  { tool: 'Customer.io', group: 'lifecycle', patterns: [/assets\.customer\.io/] },
];

export function detectTools(html) {
  return SIGNATURES.filter(s => s.patterns.some(p => p.test(html))).map(s => s.tool);
}

// SPF includes and MX hosts name the services allowed to send or receive mail for the domain.
export const MAIL_SIGNATURES = [
  { tool: 'Google Workspace', pattern: /_spf\.google\.com|aspmx\.l\.google\.com|googlemail\.com/i },
  { tool: 'Microsoft 365', pattern: /spf\.protection\.outlook\.com|mail\.protection\.outlook\.com/i },
  { tool: 'SendGrid', pattern: /sendgrid\.net/i },
  { tool: 'Mailgun', pattern: /mailgun\.org/i },
  { tool: 'Amazon SES', pattern: /amazonses\.com/i },
  { tool: 'Postmark', pattern: /spf\.mtasv\.net/i },
  { tool: 'Mailchimp', pattern: /servers\.mcsv\.net|mandrillapp\.com/i },
  { tool: 'HubSpot', pattern: /hubspotemail\.net/i },
  { tool: 'Salesforce', pattern: /_spf\.salesforce\.com/i },
  { tool: 'Marketo', pattern: /mktomail\.com/i },
  { tool: 'Pardot', pattern: /pardot\.com/i },
  { tool: 'Customer.io', pattern: /customer\.io/i },
  { tool: 'Intercom', pattern: /intercom\.io/i },
  { tool: 'Zendesk', pattern: /zendesk\.com/i },
  { tool: 'Help Scout', pattern: /helpscoutemail\.com/i },
  { tool: 'Freshdesk', pattern: /freshdesk\.com|freshemail\.io/i },
  { tool: 'Brevo', pattern: /sendinblue\.com|brevo\.com/i },
  { tool: 'Klaviyo', pattern: /klaviyo/i },
];

// Domain-verification TXT records left by tools the company has connected.
export const VERIFICATION_SIGNATURES = [
  { tool: 'Google (Search Console or Workspace)', pattern: /^google-site-verification=/i },
  { tool: 'Meta Business (ads, commerce)', pattern: /^facebook-domain-verification=/i },
  { tool: 'Microsoft 365', pattern: /^MS=/ },
  { tool: 'Atlassian', pattern: /^atlassian-domain-verification=/i },
  { tool: 'Stripe', pattern: /^stripe-verification=/i },
  { tool: 'Apple', pattern: /^apple-domain-verification=/i },
  { tool: 'DocuSign', pattern: /^docusign=/i },
  { tool: 'Zoom', pattern: /^ZOOM_verify_/i },
  { tool: 'Adobe', pattern: /^adobe-(idp-site|sign)-verification=/i },
  { tool: 'OpenAI', pattern: /^openai-domain-verification=/i },
  { tool: 'HubSpot', pattern: /^hubspot-developer-verification=/i },
  { tool: 'Miro', pattern: /^miro-verification=/i },
  { tool: 'Anthropic', pattern: /^anthropic-domain-verification/i },
  { tool: 'TikTok (developer or ads)', pattern: /^tiktok-(developers-site-)?verification/i },
  { tool: 'Slack', pattern: /^slack-domain-verification/i },
  { tool: 'Notion', pattern: /^notion-domain-verification/i },
  { tool: 'Cursor', pattern: /^cursor-domain-verification/i },
  { tool: 'Postman', pattern: /^postman-domain-verification/i },
  { tool: 'HackerOne', pattern: /^h1-domain-verification/i },
  { tool: 'Pinterest', pattern: /^pinterest-site-verification/i },
  { tool: 'LinkedIn', pattern: /^linkedin-domain-verification/i },
];

// CNAME targets on common marketing subdomains reveal the platform behind them.
export const CNAME_SIGNATURES = [
  { tool: 'HubSpot', pattern: /hubspot|hs-sites/i },
  { tool: 'Marketo', pattern: /mktoweb|mktossl|marketo/i },
  { tool: 'Pardot', pattern: /pardot/i },
  { tool: 'Zendesk', pattern: /zendesk/i },
  { tool: 'Intercom', pattern: /intercom/i },
  { tool: 'Help Scout', pattern: /helpscout/i },
  { tool: 'incident.io', pattern: /incident\.io/i },
  { tool: 'Statuspage', pattern: /statuspage\.io/i },
  { tool: 'GitBook', pattern: /gitbook/i },
  { tool: 'Mintlify', pattern: /mintlify/i },
  { tool: 'ReadMe', pattern: /readme\.io|readmessl/i },
  { tool: 'Discourse', pattern: /discourse/i },
  { tool: 'Circle', pattern: /circle\.so/i },
  { tool: 'Webflow', pattern: /webflow/i },
  { tool: 'Framer', pattern: /framer/i },
  { tool: 'Ghost', pattern: /ghost\.io/i },
  { tool: 'Substack', pattern: /substack/i },
  { tool: 'beehiiv', pattern: /beehiiv/i },
  { tool: 'Unbounce', pattern: /unbounce/i },
  { tool: 'Instapage', pattern: /pageserve|instapage/i },
  { tool: 'Leadpages', pattern: /leadpages/i },
  { tool: 'Dub', pattern: /dub\.co/i },
  { tool: 'Vercel', pattern: /vercel/i },
  { tool: 'Netlify', pattern: /netlify/i },
  { tool: 'Shopify', pattern: /myshopify|shops\.myshopify/i },
];

export const MARKETING_SUBDOMAINS = [
  'www', 'blog', 'go', 'info', 'learn', 'get', 'try', 'lp', 'pages', 'email', 'news', 'newsletter',
  'help', 'support', 'docs', 'developers', 'community', 'forum', 'status', 'academy', 'partners',
  'affiliates', 'events', 'app', 'link', 'links', 'shop', 'store', 'careers', 'jobs',
];

export function detectDns({ txt = [], mx = [], cnames = {} }) {
  const spf = txt.filter(r => /^v=spf1/i.test(r)).join(' ');
  const mail = MAIL_SIGNATURES.filter(s => s.pattern.test(spf) || mx.some(m => s.pattern.test(m))).map(s => s.tool);
  const verifications = [];
  const otherVerifications = [];
  for (const r of txt) {
    const known = VERIFICATION_SIGNATURES.find(s => s.pattern.test(r));
    if (known) verifications.push(known.tool);
    else if (/verification|verify/i.test(r)) otherVerifications.push(r.split('=')[0]);
  }
  const subdomains = Object.entries(cnames).map(([sub, target]) => ({
    subdomain: sub,
    cname: target,
    tool: CNAME_SIGNATURES.find(s => s.pattern.test(target))?.tool || null,
  }));
  return {
    mail: [...new Set(mail)],
    verifications: [...new Set(verifications)],
    other_verifications: [...new Set(otherVerifications)],
    subdomains,
  };
}

// crt.sh rows: name_value holds one or more names separated by newlines.
export function parseCertificates(rows, domain) {
  const firstSeen = {};
  for (const row of rows) {
    const date = String(row.not_before || row.entry_timestamp || '').slice(0, 10);
    for (const raw of String(row.name_value || '').split('\n')) {
      const name = raw.trim().toLowerCase().replace(/^\*\./, '');
      if (!name.endsWith(`.${domain}`) || name === domain) continue;
      if (!firstSeen[name] || date < firstSeen[name]) firstSeen[name] = date;
    }
  }
  return Object.entries(firstSeen)
    .map(([subdomain, first_seen]) => ({ subdomain, first_seen }))
    .sort((a, b) => a.first_seen.localeCompare(b.first_seen));
}

const NOISE_LABEL = /^(pr-?\d+|preview|staging|stage|stg|dev|test|qa|uat|sandbox|internal|canary|deploy-preview)/i;

// Drops preview, staging, and other machine-generated names, and groups the rest by the label under the domain.
export function filterSubdomains(subs, domain) {
  const kept = [];
  const groups = {};
  let dropped = 0;
  for (const s of subs) {
    const labels = s.subdomain.slice(0, -(domain.length + 1)).split('.');
    if (labels.some(l => NOISE_LABEL.test(l)) || labels.length >= 3) { dropped++; continue; }
    const top = labels[labels.length - 1];
    groups[top] ??= { label: top, names: 0, first_seen: s.first_seen };
    groups[top].names++;
    if (labels.length === 1) kept.push(s);
  }
  const multi = Object.values(groups).filter(g => g.names > 1).sort((a, b) => b.names - a.names);
  return { subdomains: kept, groups: multi, dropped };
}

const decodeEntities = s => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');
const stripTags = s => decodeEntities(s.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

export function extractHero(html) {
  const title = stripTags(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '');
  const description = decodeEntities(
    html.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i)?.[1] ||
    html.match(/<meta[^>]+content=["']([^"']*)["'][^>]*name=["']description["']/i)?.[1] || ''
  ).trim();
  const h1 = stripTags(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '');
  return { title, description, h1 };
}

export function countLocs(xml) {
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map(m => m[1].replace(/&amp;/g, '&'));
}

const LOCALE = /^[a-z]{2}(-[a-z]{2,4})?$/i;

export function localeOf(url) {
  try {
    const seg = new URL(url).pathname.split('/').filter(Boolean)[0];
    return seg && LOCALE.test(seg) ? seg.toLowerCase() : null;
  } catch {
    return null;
  }
}

// Locale prefixes (/de/, /pt-br/) are skipped so translated copies group with their family.
export function pathFamily(url) {
  try {
    const segs = new URL(url).pathname.split('/').filter(Boolean);
    if (segs.length && LOCALE.test(segs[0])) segs.shift();
    return segs.length ? `/${segs[0].toLowerCase()}` : '/';
  } catch {
    return '(invalid)';
  }
}

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some(v => v !== '')) rows.push(row);
      row = [];
    } else field += c;
  }
  row.push(field);
  if (row.some(v => v !== '')) rows.push(row);
  const [header, ...body] = rows;
  return body.map(r => Object.fromEntries(header.map((h, i) => [h.trim(), (r[i] ?? '').trim()])));
}

export function toCsv(rows) {
  if (!rows.length) return '';
  const cols = Object.keys(rows[0]);
  const esc = v => {
    const s = v == null ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(','), ...rows.map(r => cols.map(c => esc(r[c])).join(','))].join('\n') + '\n';
}

const monthKey = d => d.slice(0, 7);
const mean = xs => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
const round1 = x => (x == null ? null : Math.round(x * 10) / 10);

function growthSeries(traffic, col) {
  return traffic.map((t, i) => {
    const prev = i > 0 ? Number(traffic[i - 1][col]) : NaN;
    const cur = Number(t[col]);
    return i > 0 && prev > 0 && Number.isFinite(cur) ? ((cur - prev) / prev) * 100 : null;
  });
}

function windowLift(growth, i) {
  const before = growth.slice(Math.max(i - 3, 0), i).filter(x => x != null);
  const after = growth.slice(i, i + 3).filter(x => x != null);
  if (!before.length || !after.length) return null;
  return round1(mean(after) - mean(before));
}

function ranks(xs) {
  const order = xs.map((v, i) => [v, i]).sort((a, b) => a[0] - b[0]);
  const r = new Array(xs.length);
  for (let i = 0; i < order.length;) {
    let j = i;
    while (j + 1 < order.length && order[j + 1][0] === order[i][0]) j++;
    for (let k = i; k <= j; k++) r[order[k][1]] = (i + j) / 2 + 1;
    i = j + 1;
  }
  return r;
}

export function spearman(xs, ys) {
  const pairs = xs.map((x, i) => [x, ys[i]]).filter(([x, y]) => x != null && y != null);
  if (pairs.length < 3) return null;
  const rx = ranks(pairs.map(p => p[0]));
  const ry = ranks(pairs.map(p => p[1]));
  const mx = mean(rx), my = mean(ry);
  let num = 0, dx = 0, dy = 0;
  for (let i = 0; i < rx.length; i++) {
    num += (rx[i] - mx) * (ry[i] - my);
    dx += (rx[i] - mx) ** 2;
    dy += (ry[i] - my) ** 2;
  }
  return dx && dy ? Math.round((num / Math.sqrt(dx * dy)) * 100) / 100 : null;
}

// Moves within CLUSTER_DAYS of the previous move join its cluster.
export const CLUSTER_DAYS = 42;
export const MIN_MONTHS = 18;
export const MIN_MOVES = 6;

export function analyzeMoves(moves, traffic) {
  traffic = [...traffic].sort((a, b) => a.month.localeCompare(b.month));
  const months = traffic.map(t => monthKey(t.month));
  const growth = growthSeries(traffic, 'visits');
  const brandGrowth = traffic.some(t => t.brand_searches) ? growthSeries(traffic, 'brand_searches') : null;

  const sorted = [...moves].sort((a, b) => a.date.localeCompare(b.date));
  const clusters = [];
  let last = null;
  for (const m of sorted) {
    const t = Date.parse(m.date);
    if (last == null || (t - last) / 86400000 >= CLUSTER_DAYS) clusters.push({ start: m.date, moves: [] });
    clusters[clusters.length - 1].moves.push(m);
    last = t;
  }

  const clusterRows = clusters.map((c, n) => {
    const i = months.indexOf(monthKey(c.start));
    return {
      cluster: n + 1,
      start: c.start,
      channels: [...new Set(c.moves.map(m => m.channel))].sort().join(' '),
      moves: c.moves.map(m => m.move).join(' | '),
      visit_lift_pts: i < 0 ? null : windowLift(growth, i),
      brand_lift_pts: i < 0 || !brandGrowth ? null : windowLift(brandGrowth, i),
    };
  });

  const channels = [...new Set(moves.map(m => m.channel))].sort();
  const leading = channels.map(channel => {
    const counts = months.map(mo => moves.filter(m => m.channel === channel && monthKey(m.date) === mo).length);
    const total = counts.reduce((a, b) => a + b, 0);
    if (months.length < MIN_MONTHS || total < MIN_MOVES) {
      return { channel, moves: total, months: months.length, note: 'too few to call' };
    }
    const row = { channel, moves: total, months: months.length };
    for (const k of [0, 1, 2]) row[`rho_lag${k}`] = spearman(counts.slice(0, counts.length - k), growth.slice(k));
    return row;
  });

  const top = clusterRows
    .filter(c => c.visit_lift_pts != null)
    .sort((a, b) => b.visit_lift_pts - a.visit_lift_pts)
    .slice(0, 3);
  return { clusters: clusterRows, top, leading };
}

export function moveKey(m) {
  return [m.channel, m.kind, (m.link || m.move || '').toLowerCase().replace(/\/+$/, '')].join('|');
}

export function diffMoves(oldMoves, newMoves) {
  const seen = new Set(oldMoves.map(moveKey));
  return newMoves.filter(m => !seen.has(moveKey(m)));
}

export function adLibraryLinks(name, domain) {
  const q = encodeURIComponent(name);
  return {
    meta: `https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=ALL&q=${q}&search_type=keyword_unordered`,
    google: `https://adstransparency.google.com/?domain=${encodeURIComponent(domain || name)}`,
    linkedin: `https://www.linkedin.com/ad-library/search?companyName=${q}`,
    tiktok: `https://library.tiktok.com/ads?adv_name=${q}`,
  };
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function get(url, { binary = false } = {}) {
  const res = await fetch(url, { headers: { 'user-agent': UA }, redirect: 'follow' });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return binary ? Buffer.from(await res.arrayBuffer()) : res.text();
}

async function sitemapUrls(domain, limit) {
  const base = `https://${domain}`;
  let roots = [];
  try {
    const robots = await get(`${base}/robots.txt`);
    roots = [...robots.matchAll(/^sitemap:\s*(\S+)/gim)].map(m => m[1]);
  } catch {}
  if (!roots.length) roots = [`${base}/sitemap.xml`];
  const queue = [...roots];
  const urls = new Set();
  const visited = new Set();
  while (queue.length && visited.size < 50 && urls.size < limit) {
    const sm = queue.shift();
    if (visited.has(sm)) continue;
    visited.add(sm);
    let xml;
    try {
      const buf = await get(sm, { binary: true });
      xml = (sm.endsWith('.gz') ? gunzipSync(buf) : buf).toString('utf8');
    } catch {
      continue;
    }
    const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map(m => m[1].replace(/&amp;/g, '&'));
    if (/<sitemapindex/i.test(xml)) queue.push(...locs);
    else for (const l of locs) urls.add(l);
  }
  return [...urls].slice(0, limit);
}

async function waybackMonthly(url, months) {
  const from = new Date();
  from.setMonth(from.getMonth() - months);
  const cdx = `https://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(url)}&output=json&from=${from.toISOString().slice(0, 7).replace('-', '')}&filter=statuscode:200&collapse=timestamp:6&fl=timestamp,original`;
  const rows = JSON.parse((await get(cdx)) || '[]');
  return rows.slice(1).map(([timestamp, original]) => ({ timestamp, original }));
}

async function cmdSite(domain, opts) {
  const urls = await sitemapUrls(domain, Number(opts.limit || 20000));
  const families = {};
  for (const u of urls) families[pathFamily(u)] = (families[pathFamily(u)] || 0) + 1;
  const locales = [...new Set(urls.map(localeOf).filter(Boolean))].sort();
  const rows = Object.entries(families).sort((a, b) => b[1] - a[1]).map(([family, pages]) => ({ family, pages }));
  if (opts.out) writeFileSync(opts.out, toCsv(urls.map(url => ({ url, family: pathFamily(url), locale: localeOf(url) || '' }))));
  return { domain, pulled: new Date().toISOString().slice(0, 10), urls: urls.length, locales, families: rows };
}

async function cmdStack(domain, opts) {
  const months = Number(opts.months || 24);
  const snaps = await waybackMonthly(`${domain}/`, months);
  const firstSeen = {};
  const lastSeen = {};
  const failed = [];
  for (const s of snaps) {
    try {
      const html = await get(`https://web.archive.org/web/${s.timestamp}id_/${s.original}`);
      const month = `${s.timestamp.slice(0, 4)}-${s.timestamp.slice(4, 6)}`;
      for (const tool of detectTools(html)) {
        firstSeen[tool] ??= month;
        lastSeen[tool] = month;
      }
    } catch {
      failed.push(s.timestamp);
    }
    await sleep(WAYBACK_DELAY_MS);
  }
  const firstMonth = snaps.length ? `${snaps[0].timestamp.slice(0, 4)}-${snaps[0].timestamp.slice(4, 6)}` : null;
  let live = [];
  try { live = detectTools(await get(`https://${domain}/`)); } catch {}
  const tools = SIGNATURES.map(s => s.tool)
    .filter(t => firstSeen[t] || live.includes(t))
    .map(tool => ({
      tool,
      group: SIGNATURES.find(s => s.tool === tool).group,
      first_seen: firstSeen[tool] || null,
      present_at_start: Boolean(firstSeen[tool]) && firstSeen[tool] === firstMonth,
      last_seen_archive: lastSeen[tool] || null,
      live_now: live.includes(tool),
    }));
  return {
    domain,
    pulled: new Date().toISOString().slice(0, 10),
    snapshots: snaps.length,
    failed_snapshots: failed,
    note: 'first_seen is the first monthly archive capture containing the script; the tool may predate it. present_at_start means it was already there at the start of the window. Scripts loaded only through a tag manager, or after consent, will not show, so live_now false is not proof of absence.',
    tools,
  };
}

async function cmdHistory(url, opts) {
  const months = Number(opts.months || 24);
  const snaps = await waybackMonthly(url, months);
  const changes = [];
  const noPrices = [];
  let prev = null;
  for (const s of snaps) {
    try {
      const html = await get(`https://web.archive.org/web/${s.timestamp}id_/${s.original}`);
      const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      const prices = [...new Set(text.match(/[$€£]\s?\d[\d,.]*(?:\s?\/\s?(?:mo|month|yr|year|user|seat))?/gi) || [])];
      const month = `${s.timestamp.slice(0, 4)}-${s.timestamp.slice(4, 6)}`;
      if (!prices.length) { noPrices.push(month); continue; }
      const sig = prices.join(' ');
      if (sig !== prev) {
        changes.push({ month, capture: `https://web.archive.org/web/${s.timestamp}/${s.original}`, prices: prices.slice(0, 20) });
        prev = sig;
      }
    } catch {}
    await sleep(WAYBACK_DELAY_MS);
  }
  return { url, pulled: new Date().toISOString().slice(0, 10), snapshots: snaps.length, note: 'Rows are months where the set of prices on the page changed. Open each capture to read what changed. Months in no_prices had no readable prices, often because the page renders prices with JavaScript.', changes, no_prices: noPrices };
}

async function cmdHero(url, opts) {
  const months = Number(opts.months || 24);
  const snaps = await waybackMonthly(url, months);
  const changes = [];
  let prev = null;
  for (const s of snaps) {
    try {
      const hero = extractHero(await get(`https://web.archive.org/web/${s.timestamp}id_/${s.original}`));
      const sig = `${hero.h1}|${hero.title}|${hero.description}`;
      if (hero.h1 || hero.title) {
        if (sig !== prev) {
          changes.push({ month: `${s.timestamp.slice(0, 4)}-${s.timestamp.slice(4, 6)}`, capture: `https://web.archive.org/web/${s.timestamp}/${s.original}`, ...hero });
          prev = sig;
        }
      }
    } catch {}
    await sleep(WAYBACK_DELAY_MS);
  }
  return { url, pulled: new Date().toISOString().slice(0, 10), snapshots: snaps.length, note: 'Rows are months where the headline, title, or meta description changed. Open the capture to read the full hero and the logo wall.', changes };
}

async function cmdDns(domain, { resolver } = {}) {
  const dns = resolver || (await import('node:dns')).promises;
  const safe = async fn => { try { return await fn(); } catch { return []; } };
  const txt = (await safe(() => dns.resolveTxt(domain))).map(parts => parts.join(''));
  const dmarc = (await safe(() => dns.resolveTxt(`_dmarc.${domain}`))).map(parts => parts.join(''));
  const mx = (await safe(() => dns.resolveMx(domain))).map(r => r.exchange);
  const cnames = {};
  await Promise.all(MARKETING_SUBDOMAINS.map(async sub => {
    const target = (await safe(() => dns.resolveCname(`${sub}.${domain}`)))[0];
    if (target) cnames[`${sub}.${domain}`] = target;
  }));
  return {
    domain,
    pulled: new Date().toISOString().slice(0, 10),
    ...detectDns({ txt, mx, cnames }),
    dmarc: dmarc[0] || null,
    note: 'Mail tools come from SPF and MX records, verifications from TXT records, platforms from CNAMEs on common marketing subdomains. A record shows a tool was connected, not how it is used.',
  };
}

async function cmdSubdomains(domain, opts = {}) {
  const res = await fetch(`https://crt.sh/?q=${encodeURIComponent(`%.${domain}`)}&output=json`, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(90000) });
  if (!res.ok) throw new Error(`crt.sh returned ${res.status}; it is often slow, so retry later`);
  const all = parseCertificates(await res.json(), domain);
  if (opts.all) return { domain, pulled: new Date().toISOString().slice(0, 10), count: all.length, subdomains: all };
  const { subdomains, groups, dropped } = filterSubdomains(all, domain);
  return {
    domain,
    pulled: new Date().toISOString().slice(0, 10),
    count: subdomains.length,
    filtered_out: dropped,
    note: 'first_seen is the earliest certificate issued for the name, usually days before launch. Preview, staging, and deeply nested names are filtered out (use --all to keep them). groups lists labels with many names under them, such as per-customer or programmatic subdomains.',
    groups,
    subdomains,
  };
}

async function cmdSitemapGrowth(domain, opts) {
  const months = Number(opts.months || 24);
  const sitemapUrl = opts.sitemap || `${domain}/sitemap.xml`;
  const snaps = await waybackMonthly(sitemapUrl.replace(/^https?:\/\//, ''), months);
  const rows = [];
  for (const s of snaps) {
    const month = `${s.timestamp.slice(0, 4)}-${s.timestamp.slice(4, 6)}`;
    try {
      const xml = await get(`https://web.archive.org/web/${s.timestamp}id_/${s.original}`);
      let urls = countLocs(xml);
      let children = 0;
      if (/<sitemapindex/i.test(xml)) {
        const childUrls = urls.slice(0, 25);
        children = childUrls.length;
        urls = [];
        for (const child of childUrls) {
          try { urls.push(...countLocs(await get(`https://web.archive.org/web/${s.timestamp}id_/${child}`))); } catch {}
          await sleep(WAYBACK_DELAY_MS);
        }
      }
      const families = {};
      for (const u of urls) families[pathFamily(u)] = (families[pathFamily(u)] || 0) + 1;
      rows.push({ month, urls: urls.length, child_sitemaps: children, families });
    } catch {
      rows.push({ month, urls: null, error: 'capture unreadable' });
    }
    await sleep(WAYBACK_DELAY_MS);
  }
  const firstSeen = {};
  for (const r of rows) for (const f of Object.keys(r.families || {})) firstSeen[f] ??= r.month;
  return {
    domain,
    pulled: new Date().toISOString().slice(0, 10),
    note: 'URL counts per monthly capture of the sitemap. family_first_seen dates when each page family first appeared in an archived sitemap; families seen in the first month were already there. Large sitemap indexes are capped at 25 child sitemaps per month.',
    family_first_seen: firstSeen,
    months: rows.map(({ families, ...r }) => r),
  };
}

const SC_BASE = 'https://api.scrapecreators.com';

export function scAdsRequests(name, { domain, pageId, country } = {}) {
  const q = new URLSearchParams();
  const reqs = {};
  if (pageId) {
    q.set('pageId', pageId);
    q.set('status', 'ACTIVE');
    q.set('trim', 'true');
    if (country) q.set('country', country);
    reqs.meta_ads = `${SC_BASE}/v1/facebook/adLibrary/company/ads?${q}`;
  } else {
    reqs.meta_companies = `${SC_BASE}/v1/facebook/adLibrary/search/companies?${new URLSearchParams({ query: name })}`;
  }
  if (domain) reqs.google_ads = `${SC_BASE}/v1/google/company/ads?${new URLSearchParams({ domain })}`;
  reqs.tiktok_ads = `${SC_BASE}/v1/tiktok/ad-library/search?${new URLSearchParams({ advertiser_name: name })}`;
  return reqs;
}

export async function cmdScAds(name, opts, fetchImpl = fetch) {
  const reqs = scAdsRequests(name, { domain: opts.domain, pageId: opts['page-id'], country: opts.country });
  if (opts['dry-run']) return { dry_run: true, requests: reqs };
  const key = process.env.SCRAPECREATORS_API_KEY;
  if (!key) throw new Error('Set SCRAPECREATORS_API_KEY, or use the ads command for free library links');
  const out = { name, pulled: new Date().toISOString().slice(0, 10) };
  for (const [label, url] of Object.entries(reqs)) {
    try {
      const res = await fetchImpl(url, { headers: { 'x-api-key': key } });
      out[label] = res.ok ? await res.json() : { error: `${res.status}` };
    } catch (err) {
      out[label] = { error: err.message };
    }
  }
  if (out.meta_companies) out.next_step = 'Pick the matching Meta page from meta_companies and rerun with --page-id <id> for its active ads.';
  return out;
}

function cmdMoves(opts) {
  if (!opts.moves || !opts.traffic) throw new Error('moves needs --moves moves.csv --traffic traffic.csv');
  const result = analyzeMoves(parseCsv(readFileSync(opts.moves, 'utf8')), parseCsv(readFileSync(opts.traffic, 'utf8')));
  if (opts.out) writeFileSync(opts.out, toCsv(result.clusters));
  return result;
}

function cmdDiff(opts) {
  if (!opts.old || !opts.new) throw new Error('diff needs --old moves-previous.csv --new moves.csv');
  const added = diffMoves(parseCsv(readFileSync(opts.old, 'utf8')), parseCsv(readFileSync(opts.new, 'utf8')));
  if (opts.out) writeFileSync(opts.out, toCsv(added));
  return { new_moves: added.length, moves: added };
}

function parseArgs(argv) {
  const pos = [];
  const opts = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) opts[key] = true;
      else { opts[key] = next; i++; }
    } else pos.push(argv[i]);
  }
  return { pos, opts };
}

const USAGE = `teardown.mjs: free-source collection and analysis for reverse-engineer-marketing

Commands:
  site <domain> [--limit 20000] [--out urls.csv]   Sitemap URLs grouped by path family
  stack <domain> [--months 24]                    Ad, analytics, testing, referral, and lifecycle
                                                  scripts by first month seen in Wayback captures
  history <url> [--months 24]                     Months a page's prices changed (pricing history)
  hero <url> [--months 24]                        Months the headline, title, or meta description changed
  sitemap-growth <domain> [--months 24] [--sitemap url]
                                                  Sitemap size and page families by month from Wayback
  dns <domain>                                    Mail tools, domain verifications, and platforms behind
                                                  common marketing subdomains, from DNS records
  subdomains <domain> [--all]                     Subdomains in certificate logs with first-seen dates,
                                                  preview and staging names filtered out unless --all
  ads <name> [--domain example.com]               Public ad library links for each network
  sc-ads <name> [--domain example.com] [--page-id id] [--country US] [--dry-run]
                                                  Active Meta, Google, and TikTok ads via ScrapeCreators
                                                  (needs SCRAPECREATORS_API_KEY)
  moves --moves moves.csv --traffic traffic.csv [--out moves-vs-growth.csv]
                                                  Lift per cluster of moves and leading channels
  diff --old previous.csv --new moves.csv [--out new-moves.csv]
                                                  Moves in the new log that were not in the old one

CSV columns:
  moves.csv    date,channel,kind,move,reach,link,evidence
  traffic.csv  month,visits,brand_searches   (one source for the whole series)

Output is JSON on stdout.`;

async function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  const { pos, opts } = parseArgs(rest);
  const domain = (pos[0] || '').replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  if (['site', 'stack', 'history', 'hero', 'sitemap-growth', 'dns', 'subdomains', 'ads', 'sc-ads'].includes(cmd) && !pos[0]) {
    console.log(USAGE);
    process.exitCode = 1;
    return;
  }
  let result;
  switch (cmd) {
    case 'site': result = await cmdSite(domain, opts); break;
    case 'stack': result = await cmdStack(domain, opts); break;
    case 'history': result = await cmdHistory(pos[0], opts); break;
    case 'hero': result = await cmdHero(pos[0], opts); break;
    case 'sitemap-growth': result = await cmdSitemapGrowth(domain, opts); break;
    case 'dns': result = await cmdDns(domain); break;
    case 'subdomains': result = await cmdSubdomains(domain, opts); break;
    case 'ads': result = adLibraryLinks(pos[0], opts.domain); break;
    case 'sc-ads': result = await cmdScAds(pos[0], opts); break;
    case 'moves': result = cmdMoves(opts); break;
    case 'diff': result = cmdDiff(opts); break;
    default:
      console.log(USAGE);
      return;
  }
  console.log(JSON.stringify(result, null, 2));
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  main().catch(err => {
    console.log(JSON.stringify({ error: err.message }));
    process.exitCode = 1;
  });
}
