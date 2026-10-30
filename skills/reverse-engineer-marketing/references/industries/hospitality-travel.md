# Hospitality and Travel: Teardown Pack

Load this pack for hotels, vacation rentals, restaurants and chains, and travel brands and tour operators. Growth here is a fight with intermediaries: online travel agencies, metasearch, and delivery apps own much of the demand, so the key question is how a brand wins direct bookings without losing the reach those platforms bring.

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

- A booking engine, reservation widget, or "Order online" button as the main call to action.
- Booking and reservation tools in the page source or as CNAMEs on `book.`, `reservations.`, `order.` subdomains, visible through `teardown.mjs stack` and `teardown.mjs dns` (hotel booking engines, restaurant reservation and online ordering platforms).
- Location pages with addresses, menus, rooms, or tour dates; schema for hotels, restaurants, or events.
- Loyalty program pages and "Book direct" messaging.
- `teardown.mjs detect <domain>` flags these together as hospitality or travel.

## What Drives Growth Here

- **Direct vs third-party mix.** Every booking through an OTA or delivery app costs a commission. A shift toward direct booking is often the real growth story, even when total demand is flat.
- **Metasearch and Google matter.** Hotel and travel brands compete in Google Hotels, metasearch, and Google Business Profiles. Rankings, rates shown there, and reviews drive clicks.
- **Reviews and photos convert.** Ratings on travel and review platforms decide whether a listing gets clicked at all.
- **Seasonality and events.** Demand follows seasons, holidays, and local events. Compare a month with the same month last year.
- **Loyalty and repeat visits.** For chains and restaurants, the loyalty app and the CRM drive repeat frequency, which is where margin lives.

## Signals to Collect

| Signal | Where or how | What it shows |
|---|---|---|
| ★ Book-direct offers over time | `teardown.mjs history <url>` and `teardown.mjs hero <domain>` for "best rate", member rate, or direct-only perks | When they started pushing direct bookings; each change becomes a move in moves.csv |
| ★ Rate parity spot checks | Compare the price for the same date on their site, OTAs, and Google Hotels | Whether they undercut OTAs with member rates or keep parity |
| Location and opening history | `teardown.mjs sitemap-growth <domain>` for location pages, plus archived location lists | Openings and closings by date; each opening becomes a move |
| OTA and delivery app presence | Their listings on the main OTAs, metasearch, and delivery apps | Which intermediaries they rely on, and which they dropped |
| Review volume and ratings | Travel review platforms and Google ratings through official APIs or manual checks, not Maps scrapers | Demand and guest sentiment per location; review spikes become moves |
| Loyalty program changes | Archived loyalty pages and app store version history | New tiers, points changes, and app launches; dated changes become moves |
| Menu or package price changes | `teardown.mjs history <url>` on menu, rooms, or tour pages | Pricing moves and limited-time offers |
| Paid ads | `teardown.mjs sc-ads`, ad libraries, and metasearch ad presence | Seasonal spend, destination targeting, and promo offers |
| Creator and UGC content | ScrapeCreators pulls on TikTok, Instagram, and YouTube for the brand and locations | Creator-driven demand, often the main channel for restaurants and experiences |
| Email and SMS capture | Popups and sign-up forms on the site | The offer used to build the direct list |
| ★ Event and seasonal calendar | Archived homepage banners and event pages | How they fill low seasons and slow nights |
| Partnerships | Airline, credit card, and local tourism board partnerships, with dates | Co-marketing channels that bring travelers |

## Going Inside

- **Join the loyalty program and email list** with approval, under the user's real identity, and log every message by day and offer for 30 to 60 days.
- **Walk the booking or ordering flow** to the final confirmation step and stop there. Screenshot fees, add-ons, upsells (room upgrades, add-on tours, desserts), and cancellation terms.
- **Install the loyalty or ordering app** and note the first-order offer and push cadence.
- **Guardrails:** never complete a booking, reservation, or order the user won't use. A no-show costs a small hotel a room and a restaurant a table. Only book if the user genuinely plans to stay or eat, and cancel within the free window if plans change.

## Rules That Limit Copying

- **Price display and fees:** the FTC's rule on junk fees (US), covering short-term lodging and live events, and similar EU and UK rules require total prices upfront. Resort fees and service fees must be disclosed.
- **Rate parity clauses:** OTA contracts may limit how a property can price direct bookings; several European countries restrict these clauses. Check the user's own OTA contracts.
- **Reviews:** platform policies and the FTC's rule on fake reviews bar incentivized or fake reviews, and review gating.
- **Alcohol and food:** alcohol advertising rules and allergen labeling rules limit menu and promo copy.
- **Short-term rentals:** many cities require registration and limit listings.

## Plays That Usually Transfer

| Play | Run it with |
|---|---|
| A member rate or direct-booking perk promoted on the booking page | **offers**, **cro** |
| A loyalty program built around repeat visits | **referrals**, **emails** |
| Location pages with local content, menus, and schema | **programmatic-seo**, **schema** |
| A creator program for local food or travel creators | **influencer-marketing** |
| Seasonal and event campaigns to fill slow periods | **events**, **emails** |
| An email and SMS capture offer on the site | **popups**, **sms** |
| A review request flow after every stay or meal | **referrals** |

## Metrics to Ask About

- **Direct booking share:** bookings or orders through owned channels vs intermediaries.
- **Commission cost per booking:** fees paid to OTAs and delivery apps.
- **Occupancy and RevPAR:** for hotels, rooms filled and revenue per available room.
- **Covers and average check:** for restaurants, guests served and spend per guest.
- **Repeat visit rate:** guests or customers who come back in a period.
- **Review score and volume per location.**
- **Loyalty members and active rate:** members who booked or ordered recently.
