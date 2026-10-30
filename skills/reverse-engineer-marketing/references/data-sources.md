# Data Sources for a Teardown

Where each stage's evidence comes from. The skill is tool-agnostic for search and traffic data: use whatever the user has, but keep one vendor per curve. Social posts come from ScrapeCreators or Apify. Free sources go first. Quote a paid call's cost before making it, and keep a running total against the cap.

## Contents
- The bundled script
- Free sources
- Search, traffic, and backlinks
- Social posts and ad libraries
- The user's own data
- When a source fails

---

## The Bundled Script

`scripts/teardown.mjs` (Node 18+, no dependencies, no API keys) covers the free evidence:

| Command | What it returns |
|---|---|
| `site <domain>` | Every sitemap URL, grouped by page family, with locale prefixes folded in |
| `stack <domain> --months 24` | Ad pixels, analytics, testing, referral, and lifecycle scripts, with the first month each appears in Wayback's monthly captures |
| `history <url> --months 24` | Months a page's listed prices changed, with the archive link for each |
| `ads <name> --domain <domain>` | Links to the Meta, Google, LinkedIn, and TikTok ad libraries for the company |
| `moves` | Lift per cluster of moves and leading channels (stage 4) |
| `diff` | Moves in a new log that weren't in the old one (Watch mode) |

Limits to state in the method notes:
- `stack` only sees scripts in the page source. Tags loaded through a tag manager or after a consent banner won't show, so a missing pixel isn't proof the channel wasn't used.
- `stack`'s first month is the first monthly capture with the script. If it equals the window's start month (`present_at_start`), the tool was already there.
- `history` reads prices from the HTML. Pages that render prices with JavaScript show up under `no_prices`. Open those captures by hand.

## Free Sources

| Source | Use it for |
|---|---|
| The target's site | Pricing, sign-up flow, docs, changelog dates, partner and affiliate pages, badges |
| Wayback Machine | When pages and page families first appeared: `web.archive.org/cdx/search/cdx?url=target.com/templates/*&output=json&collapse=urlkey` lists archived URLs with their dates |
| Ad libraries | Active ads, run dates, and landing pages (links from `ads`) |
| Google Trends | Relative brand interest by month, when no brand search volume is available |
| AI assistants | The stage 2 AI answer checks, run by hand |
| Search operators | `"made with target"`, `site:reddit.com "target"`, `site:target.com/compare` |
| Careers page | Open roles for the hiring check |

## Search, Traffic, and Backlinks

Use whichever of these the user already has. Pick one for the curve and keep it for the whole window, and for the user's own domain in stage 5.

| Source | Monthly history | Keywords by URL | Backlinks and anchors | Access |
|---|---|---|---|---|
| [DataForSEO](../../../tools/integrations/dataforseo.md) | Historical rank overview | Ranked keywords | Backlinks summary, anchors | Pay per call; CLI in the repo |
| [Semrush](../../../tools/integrations/semrush.md) | Organic traffic history | Organic positions | Backlinks, anchors | Subscription; MCP |
| [Ahrefs](../../../tools/integrations/ahrefs.md) | Organic traffic history | Organic keywords | Referring domains, anchors | Subscription; MCP |
| [Similarweb](../../../tools/integrations/similarweb.md) | Visits and traffic sources by month | Top keywords | - | Subscription |
| [RankParse](../../../tools/integrations/rankparse.md) | - | - | Backlinks, tech stack | Pay per call |

For tech stack beyond the page source, [TheirStack](../../../tools/integrations/theirstack.md) infers tools from job posts and also covers the hiring check. For news, funding, and mentions, [Exa](../../../tools/integrations/exa.md) searches the web by meaning. Multi-provider data gateways (one key, many vendors, billed per call) are listed in the [tools registry](../../../tools/REGISTRY.md).

## Social Posts and Ad Libraries

| Need | [ScrapeCreators](../../../tools/integrations/scrapecreators.md) | [Apify](../../../tools/integrations/apify.md) |
|---|---|---|
| YouTube videos and Shorts | `/v1/youtube/channel-videos`, `/v1/youtube/channel/shorts` | YouTube scraper actors |
| TikTok videos | `/v3/tiktok/profile/videos` | TikTok scraper actors |
| Instagram posts | `/v2/instagram/user/posts` | Instagram scraper actors |
| X posts | `/v1/twitter/user-tweets` | X scraper actors |
| Reddit mentions | `/v1/reddit/search` | Reddit scraper actors |
| Meta ads | `/v1/facebook/adLibrary/company/ads` | Meta Ad Library actors |
| Google ads | `/v1/google/company/ads` | Google Ads Transparency actors |
| TikTok ads | `/v1/tiktok/ad-library/search` | TikTok ad actors |
| LinkedIn posts and ads | Not used | Not used |

- **ScrapeCreators** is one key with one response style across platforms, which makes per-channel pulls quick. Billed in credits.
- **Apify** suits bulk pulls, scheduled runs, and platforms ScrapeCreators doesn't cover. Each actor has its own input and pricing; read its page first.
- **LinkedIn:** read the company page, employee posts, and the LinkedIn Ad Library by hand. This repo doesn't scrape LinkedIn.
- Media URLs expire. Download thumbnails and covers in the same run as the pull.
- The YouTube Data API (free with a key) and Reddit's public JSON are fine fallbacks when no paid source is set up.

## The User's Own Data

For stage 5:

| Source | What it adds |
|---|---|
| [Google Search Console](../../../tools/integrations/google-search-console.md) | Impressions and clicks by page family; whether the user has the target's winning families |
| [GA4](../../../tools/integrations/ga4.md), [PostHog](../../../tools/integrations/posthog.md), [Plausible](../../../tools/integrations/plausible.md) | Channel mix and signup conversion |
| [Google Ads](../../../tools/integrations/google-ads.md), [Meta Ads](../../../tools/integrations/meta-ads.md) | Which networks the user runs and what works there |
| The user's social accounts | The same content pull as stage 3, for a side-by-side |

Compare the user's real numbers only with each other. Against the target, use the same vendor's estimate for both domains.

## When a Source Fails

- **Blocked page:** try one other route (another fetcher, the Wayback copy). Still blocked → list it in the method notes and move on.
- **Endpoint error:** try one other source for the same job. Still failing → mark the item "unavailable". Never estimate it.
- **No history:** if a tool only returns current data, say the curve is unavailable before a date. Don't stitch in another vendor.
