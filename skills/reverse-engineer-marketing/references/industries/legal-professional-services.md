# Legal and Professional Services: Teardown Pack

Load this pack when the target sells expertise by the hour, case, or engagement: law firms, accounting and tax firms, consultancies, and financial advisory firms. Growth here is reputation plus intake. Most clients come from referrals, directories, and search for a specific problem, and a few high-value matters can make the year.

## Contents
- How to recognize it
- What drives growth here
- Signals to collect
- Going inside
- Rules that limit copying
- Plays that usually transfer
- Metrics to ask about

---

## How to Recognize It

- Practice area pages (`/practice-areas/`, `/services/<area>`), attorney or partner bio pages, and "free consultation" or "case evaluation" CTAs.
- Intake and chat tools built for law and professional services (Clio Grow, Lawmatics, Intaker, Ngage, Smith.ai) found by `teardown.mjs stack <domain>`.
- Call tracking on personal injury and consumer law sites, found by `teardown.mjs phones <url>`.
- Disclaimers: "attorney advertising", "prior results do not guarantee", and for advisors, "Form ADV" or "registered investment adviser" links.
- `teardown.mjs detect <domain>` flags legal and advisory sites from these patterns.

## What Drives Growth Here

- **Two different models.** Consumer firms (personal injury, family, criminal, immigration, tax resolution) buy demand: search ads, TV, billboards, lead generators. Business firms (corporate law, audit, consulting) build reputation: content, speaking, rankings, referrals.
- **Case value sets the budget.** A single personal injury case can fund heavy ad spend, which is why legal search terms are among the most expensive in paid search.
- **Intake is the bottleneck.** Many firms lose cases to slow callbacks. Fast intake (24/7 answering, chat, text-back) is often the real growth move.
- **Referral networks are channels.** Other professionals refer work. Watch for co-referral partners, bar referral services, and lead-sharing networks.
- **Rankings and directories carry weight:** Chambers, Legal 500, Best Lawyers, Super Lawyers, Avvo for law; directory and association listings for accountants and advisors.

## Signals to Collect

| Signal | Where or how | What it shows |
|---|---|---|
| Practice area and location page rollout | `teardown.mjs site` and `sitemap-growth` | Which matters they target and when they expanded; each launch is a move in moves.csv |
| ★ Paid search on problem terms | Paid SERP checks for "[practice] lawyer [city]" and competitors' names | Where they spend and whether they bid on rival firms |
| TV, radio, billboard, and podcast ads | Their media or "as seen on" pages, podcast-ad search, social posts | Mass-media consumer firms; dates are moves |
| Directory and ranking presence | Avvo, Justia, FindLaw, Martindale, Chambers, Legal 500; CPA and advisor directories | Where clients and referrers look |
| Attorney or partner count over time | Wayback captures of the people page | Growth, laterals, and new offices; each hire wave is a move |
| ★ Case results and verdict pages | Results pages over time via Wayback | What they lead with, and how they reuse wins in marketing |
| Thought leadership | Blog, client alerts, webinars, speaking, bylines in trade press | Reputation engine for business firms |
| Reviews | Official Places API or manual reads; Avvo and directory reviews | Review velocity and reply style |
| Intake and chat tools | `teardown.mjs stack <domain>` | After-hours capture and speed to lead |
| ★ Advisor filings | SEC Investment Adviser Public Disclosure (Form ADV) | Assets under management and client counts over time for advisory firms |
| Court and bar records | Public court dockets and state bar profiles | Case volume and practice focus; read by hand |
| Lead generator presence | Lead-gen sites in the practice area, sponsored listings | Whether they buy leads instead of generating them |

## Going Inside

- **Don't open a fake matter.** A fake consultation request takes an attorney's or advisor's time and can create conflict-check records. Only contact them if the user has a genuine need.
- With approval and a genuine need: submit the intake form or call, then time the response by call, text, and email, and record the intake questions, the fee discussion, and the follow-up.
- Without a genuine need, use public intake pages, chat widgets' opening messages, and published fee pages.
- Never share or ask for confidential details about a real legal or financial situation that isn't the user's own.

## Rules That Limit Copying

- **Lawyer advertising rules:** ABA Model Rules 7.1 to 7.3 and each state's version govern misleading claims, testimonials, specialization claims, "expert" wording, and solicitation. Some states require "attorney advertising" labels or filing ads with the bar. Check with counsel in each state.
- **Referral fees:** many states restrict paying for referrals or sharing fees with non-lawyers. A lead-buying play may not be allowed.
- **Accounting:** AICPA and state board rules cover advertising and independence. Audit firms face extra limits.
- **Financial advisors:** the SEC Marketing Rule governs testimonials, endorsements, and performance advertising for registered investment advisers. FINRA rules apply to broker-dealers.
- **Platform policies:** Google and Meta have extra rules for legal services and financial services ads in some markets.

## Plays That Usually Transfer

| Play | Run it with |
|---|---|
| Practice area and location pages built around specific problems | **programmatic-seo**, **site-architecture** |
| 24/7 intake with fast call, text, and chat follow-up | **revops**, **sms** |
| Directory and ranking submissions | **directory-submissions** |
| Thought leadership program: alerts, webinars, speaking | **content-strategy**, **events**, **public-relations** |
| Referral partner program with other professionals | **co-marketing**, **referrals** |
| Call tracking and case-value attribution | **conversion-tracking**, **attribution** |
| FAQ and AI-answer coverage for common legal questions | **ai-seo** |

## Metrics to Ask About

- **Cost per signed client:** spend divided by retained clients, not leads.
- **Intake conversion:** share of inquiries that become consultations, and consultations that sign.
- **Speed to lead:** minutes from inquiry to first contact.
- **Average fee or case value:** by practice area and channel.
- **Referral share:** work from referral partners vs marketing.
- **Utilization and realization:** for business firms, billable use of capacity and collected vs billed.
- **AUM growth:** for advisors, net new assets excluding market movement.
