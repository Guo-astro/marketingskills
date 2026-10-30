# Playbook Template

The output of a full teardown, `teardowns/<target>/playbook.md`. A quick scan uses the same sections, shorter: five plays, no channel-by-channel section.

---

```markdown
# How [Target] Grew: [Month Year] → [Month Year]

Prepared [date] for [user's company]. Public evidence only; no affiliation with [Target].
Every finding is marked SEEN (linked evidence) or INFERRED (reasoned from what was seen).

## Summary

- **The curve:** [~X → ~Y monthly US visits, source, dates]. Inflection: [month], [growth before → after].
- **What lined up with it:** [the top 1-3 clusters, one line each]
- **The loop:** [the product loop, if found, e.g. "Made with" badge on every free app, first seen [month]]
- **What to copy first:** [play #1 in one line]

## The Path

| Stage | What [Target] does | Evidence |
|---|---|---|
| Get noticed | [founder posts, ads, search, AI answers, creators] | SEEN/INFERRED + links |
| Sign up | [SSO, no card, waitlist, invite codes] | |
| First win | [first action, time to it] | |
| Pay | [plans, trial end rule, free limits] | |
| Share | [what reaches non-users: badges, shared outputs, invites, referrals] | |

## Timeline

| Date | Channel | Move | Reach | Lift (visits / brand) | Evidence |
|---|---|---|---|---|---|
| 2024-12 | product-loop | "Edit with [Target]" badge first seen on user sites | 4,100 domains | +18 / +9 pts (cluster) | SEEN [link] |

[Chart or table of the monthly curve with each move pinned to its month]

## By Channel

### [Channel]
- **Moves:** [what Target did here, dated]
- **Pattern:** [counted traits of the top quarter vs the bottom half]
- **House style:** [colors with hex values, fonts, templates, formats]
- **Formulas:** [2-3 fill-in templates, one real example each]
- **What worked:** [the number that moved, SEEN, linked]
- **What didn't:** [flat or complained about, linked]

[Repeat for X, YouTube, TikTok, Instagram, LinkedIn, Reddit, ads, search and AI answers, product loop. Write "not seen" for channels with no activity.]

## The Plays

### 1. [Play name] (stage: [pre-launch / early revenue / scaling])
- **The play:** [one line]
- **Evidence:** [SEEN/INFERRED, with links; started before or after the inflection; lift]
- **Effort:** [a day / a week / a quarter]
- **First result:** [time] — watch [metric]
- **Cost to try:** [$]
- **Prompt:**
  > [Paste-ready prompt for the user's agent, written for the user's company. Concrete: the pages to build, the posts to write with the formula filled in, the events to track, the list to find. Name the skill to use if one fits, e.g. "Use the programmatic-seo skill to..."]

[Plays 2-10]

## Plays to Skip

- **[Play]:** [why the evidence doesn't support it, or what Target had that the user doesn't]

## 14-Day Plan

Per channel the user will run:

| Day | Do | Formula / asset |
|---|---|---|
| 1 | [set up / post / test] | |
| ... | | |
| 14 | Check: [the one number] | |

## This Week

[The single play to start now, and its prompt again.]

## Method Notes

- **Sources:** [each source and what it was used for]
- **Dates:** [when each count was pulled]
- **Blocked or unavailable:** [pages and endpoints]
- **Images not read:** [count and channels]
- **Inferred claims:** [list]
- **Data cost:** [total, and per step]
```

---

## Writing Good Plays

A play is only useful if the user can start it today.

| Weak | Strong |
|---|---|
| "Post on LinkedIn more" | "Post your weekly signup number every Monday as a single metric card, using Target's format: one big number, the date, a one-line why" |
| "Do SEO" | "Build 30 `/templates/[use-case]` pages, the page family that carried 41% of Target's non-brand traffic before the inflection" |
| "Add virality" | "Add a removable 'Made with [Product]' link to every public output on the free plan, linking to a signup page that pre-fills the template" |

Every prompt names the specific asset to build, the formula or example to follow, and the metric to watch. Route to the skill that does the work: **programmatic-seo** for page families, **social** for posts, **ad-creative** for ads, **referrals** for affiliate programs, **free-tools** for calculators, **ai-seo** for AI answer visibility.
