# Nonprofit: Teardown Pack

Load this pack for charities, advocacy groups, foundations, and membership nonprofits. Nonprofits grow through donors, not customers, and US nonprofits publish their finances every year, so a teardown can line up fundraising moves against real revenue.

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

- "Donate", "Give monthly", "Fundraise", and "Ways to give" pages, often on a `donate.` or `give.` subdomain
- Donation platforms in scripts or CNAMEs (Classy, Givebutter, Donorbox, Blackbaud, Fundraise Up, Bloomerang, Funraise, Every.org) found with `teardown.mjs stack` and `teardown.mjs dns`
- A 501(c)(3) or EIN line in the footer, and "tax-deductible" language
- Peer-to-peer fundraising pages (`/fundraise`, personal pages under a campaign)
- `teardown.mjs detect <domain>` flags donation platforms and nonprofit language

## What Drives Growth Here

- **Monthly donors are the base.** Recurring giving is steadier and more valuable than one-time gifts, so the monthly ask and its placement matter.
- **Campaign moments drive spikes.** Giving Tuesday, year-end, disasters, matching campaigns, and anniversaries create most one-time revenue.
- **Peer-to-peer turns supporters into fundraisers.** Events, challenges, and birthday fundraisers reach networks the organization can't reach directly.
- **Major gifts and grants dominate many budgets.** Visible marketing may be a small share of revenue. Read the financials before crediting marketing.
- **Free ad credits change the math.** Google Ad Grants gives eligible nonprofits free search ads with rules attached.

## Signals to Collect

| Signal | Where or how | What it shows |
|---|---|---|
| ★ IRS Form 990 revenue by year | ProPublica Nonprofit Explorer and the IRS Tax Exempt Organization Search | Contributions, program revenue, fundraising expenses, and staff pay by year: real numbers, not estimates |
| ★ Revenue mix | Form 990 Schedule A and B summaries, annual reports | How much comes from small donors, major gifts, grants, and events |
| ★ Campaign calendar | Wayback captures of the homepage and donate page; `teardown.mjs hero <domain>` | Giving Tuesday, year-end, and matching campaigns, dated. Each becomes a move in moves.csv |
| Donate page and default amounts | `teardown.mjs history <url>` on the donate page | Changes to suggested amounts, the monthly default, and the ask |
| Donation platform changes | `teardown.mjs stack <domain>` | When they switched platforms, which often changes conversion |
| Peer-to-peer programs | Fundraising pages, event pages, challenge sites | Supporter-led campaigns and their reach |
| Matching gift tools | Employer matching widgets (Double the Donation and similar) | Whether they capture corporate matches |
| Google Ad Grants use | Search ads for their cause terms | Whether they use free search ads and on which topics |
| Email and SMS appeals | Subscribe under the user's real identity; log appeals | Appeal cadence, subject lines, and urgency framing |
| Charity ratings | Charity Navigator, Candid (GuideStar) profiles | Trust signals donors see, and changes in ratings |
| Corporate partners | Partner pages and cause-marketing campaigns | Sponsorship and cause-marketing revenue sources |
| Hiring | Careers pages | Development (fundraising) staffing, digital roles, major gifts officers |

## Going Inside

- Make a donation only with the user's explicit approval and budget, under their real identity. Then log the thank-you sequence, receipts, and the next ask.
- Subscribe to emails and SMS to record appeal cadence, especially around year-end and Giving Tuesday.
- Start a peer-to-peer fundraising page only if the user will actually fundraise. Don't create fake campaigns.

## Rules That Limit Copying

- **Charitable solicitation registration:** many US states require registration before asking residents for donations. Check with counsel before running a national campaign.
- **IRS rules** govern donation receipts, quid pro quo disclosures, and political activity limits for 501(c)(3) organizations.
- **Google Ad Grants policies** set eligibility, account structure, and quality requirements.
- **Cause marketing laws:** some states regulate commercial co-ventures, where a business promotes that a purchase benefits a charity.
- **Email and SMS consent rules** (CAN-SPAM, TCPA) apply to nonprofits too.

## Plays That Usually Transfer

| Play | Run it with |
|---|---|
| A monthly giving ask as the default on the donate page | **cro**, **offers** |
| A year-end and Giving Tuesday campaign sequence | **emails**, **launch** |
| Peer-to-peer fundraising for events and birthdays | **referrals**, **events** |
| Matching gift campaigns with a deadline | **offers** |
| Content that ranks for cause and issue searches | **content-strategy**, **seo-audit** |
| Donor thank-you and retention sequences | **emails**, **churn-prevention** |

## Metrics to Ask About

- **Donor retention rate:** share of last year's donors who gave again
- **Recurring donors** and monthly recurring revenue
- **Average gift** and gifts per donor
- **Donate page conversion rate**
- **Cost to raise a dollar:** fundraising expense divided by contributions
- **Peer-to-peer reach:** donors per fundraiser
