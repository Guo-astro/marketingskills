# Data Sources for a Teardown

Where each step's evidence comes from. Try the free route first. Use a paid source when the free one is blocked, too slow, or missing history. Quote each paid call's price before the first call and keep a running total against the budget cap.

## Contents
- Free sources that do most of the work
- Sources by step
- Social content pulls
- When a source fails

---

## Free Sources That Do Most of the Work

| Source | What it gives a teardown |
|---|---|
| The target's own site | Pricing, sign-up flow, changelog dates, partner and affiliate pages, badges, the sitemap (`/sitemap.xml`) |
| Wayback Machine (`web.archive.org`) | When pages, pricing, pixels, and badges first appeared. The CDX API (`web.archive.org/cdx/search/cdx?url=target.com/*&output=json`) lists every capture and the URLs that existed at each date |
| Page source | Analytics and ad pixels: `fbq(` Meta, `gtag(`/`AW-` Google Ads, `twq(` X, `rdt(` Reddit, `ttq` TikTok, `_linkedin_partner_id` LinkedIn, plus affiliate scripts (Rewardful, PartnerStack, Tolt, FirstPromoter) |
| Ad libraries | Meta Ad Library, Google Ads Transparency Center, LinkedIn Ad Library, TikTok Ad Library and Creative Center |
| Google Trends | Brand search interest over time, a free stand-in for brand search volume |
| Search operators | `site:target.com/compare`, `"made with target"`, `"target" site:reddit.com` |
| Public social profiles | Recent posts and engagement, when the page loads without login |

**Dating a pixel with Wayback:** pull the homepage captures with the CDX API, fetch one capture per month (`web.archive.org/web/<YYYYMMDD>id_/https://target.com/`), and record the first month each pixel's signature appears. That's the earliest the channel could have run, which is SEEN. That ads ran from that month is INFERRED.

## Sources by Step

| Step | Free route | Paid options in the tools registry |
|---|---|---|
| 1. Site and path | Fetch pages directly; the sitemap; search operators | [Firecrawl](../../../tools/integrations/firecrawl.md) map and scrape, [Browserbase](../../../tools/integrations/browserbase.md) for pages that need a browser |
| 2. Stack and news | Page source + Wayback; the target's blog, changelog, and press page | [RankParse](../../../tools/integrations/rankparse.md) tech stack, [TheirStack](../../../tools/integrations/theirstack.md) technographics, [Exa](../../../tools/integrations/exa.md) for news and funding coverage |
| 3. Traffic curve | Google Trends for brand interest (relative, not visits) | [DataForSEO](../../../tools/integrations/dataforseo.md) historical rank overview (monthly organic and paid estimates), [Semrush](../../../tools/integrations/semrush.md) or [Ahrefs](../../../tools/integrations/ahrefs.md) organic traffic history, [Similarweb](../../../tools/integrations/similarweb.md) visits and traffic sources by month |
| 4. Search and AI answers | Ask the AI assistants directly; search operators for page families | DataForSEO ranked keywords, Semrush or Ahrefs organic keywords; AI visibility tools listed in **ai-seo** |
| 5. Ads | The ad libraries above | [Apify](../../../tools/integrations/apify.md) ad library scrapers for bulk pulls; Semrush or Similarweb for paid search history |
| 6. Who talks about them | Search on X, YouTube, and Reddit sorted by top | [Exa](../../../tools/integrations/exa.md) for mentions, Apify scrapers for X, YouTube, and Reddit, [SparkToro](../../../tools/integrations/sparktoro.md) for where the audience pays attention |
| 7. Own content | Public profiles | Apify scrapers per platform (see below) |
| 8. Links and loops | Search operators for badge text (`"made with target"`) | DataForSEO backlinks summary and anchors, Ahrefs or Semrush backlinks and anchors, RankParse backlinks |
| 9. Hiring | The careers page; job boards | [TheirStack](../../../tools/integrations/theirstack.md) job search by company |

Multi-provider data gateways (one key, many providers, metered per call) are listed in the [tools registry](../../../tools/REGISTRY.md). They suit teardowns because one run touches many providers.

**Use one traffic source for the whole curve.** Estimates from different vendors disagree by large factors. A curve that switches vendors midway shows jumps that never happened.

## Social Content Pulls

Step 7 needs the latest 60 posts or 6 months per channel, with engagement and media URLs.

| Channel | Keep | Notes |
|---|---|---|
| YouTube | Title, thumbnail URL, views, publish date, length, Shorts vs long | The YouTube Data API is free with a key; also pull the channel's "popular" sort once for all-time winners |
| TikTok | Description, hashtags, cover, plays, saves, shares, length, sound | Cover URLs expire within hours; download them in the same run |
| Instagram | Kind (reel, carousel, photo), image, caption, likes, comments | Image URLs expire; download right away |
| X | Text, views, likes, reposts, media | Founder accounts often outperform the brand account; pull both |
| LinkedIn | Text, images, document carousels, reactions; company page vs staff posts | Never scrape LinkedIn. Read the public company page and posts manually, or use an approved provider's official API |
| Reddit | Title, subreddit, self or link post, score, comments | Reddit's public JSON (`reddit.com/user/<name>/submitted.json`) covers most needs |

Apify has scrapers for most of these. Check each scraper's terms, and the registry's note on which scrapers to avoid.

## When a Source Fails

- **Blocked page**: try one other route (a different fetcher, the Wayback copy). Still blocked → list it as blocked in the method notes and move on.
- **Endpoint error**: try one alternative source for the same job. Still failing → mark the item "unavailable", never estimate it.
- **No history**: some tools only return current data. Say the curve is unavailable before a date rather than stitching in another vendor.
