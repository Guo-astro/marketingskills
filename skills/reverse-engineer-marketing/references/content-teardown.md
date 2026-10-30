# Content Teardown, Channel by Channel

Step 7 of the teardown in full: how to read what a company publishes on each channel and turn it into formulas the user can reuse. Step 6 covers what others say about the company. This covers what the company makes.

## Contents
- Pull and rank
- Look
- Channel checklists
- Write-up
- Contact sheets

---

## Pull and Rank

1. **Pull** the latest 60 posts or the past 6 months per handle, whichever comes first. Save rows to `teardowns/<target>/<channel>/posts.csv` with the date pulled.
2. **Engagement metric per channel**:

| Channel | Rank by |
|---|---|
| YouTube, TikTok, X | Views |
| Instagram | Likes + comments |
| LinkedIn | Reactions + comments |
| Reddit | Score |

3. **Drop posts under 7 days old.** Their numbers haven't settled.
4. **With code**, mark the top quarter and the bottom half. Compare within a channel only, never across.
5. **Under 20 posts** on a channel: report them, but call no pattern ("too few posts to call a pattern").

## Look

Download the thumbnail, cover, first slide, or image of every top-quarter post and five bottom-half posts in one batch (TikTok and Instagram links expire within hours). Then open each file and read it.

- What the image shows is SEEN. Why it might work is INFERRED.
- An image that didn't download is "not read". Never describe it from its caption or title.

## Channel Checklists

### YouTube
- **Title**: length, a number or dollar amount, first person ("I built..."), a question, brackets, the promise
- **Thumbnail**: a face and its emotion, words on it (count them; four or fewer is usual), product or outcome shown, a before/after split, contrast and main color, logo
- Do the title and thumbnail repeat each other or add to each other?
- Shorts vs long-form, and video length

### TikTok
- **Cover**: which frame was chosen, and the words on it
- **Hook**: the first line of the description and the on-screen text in the opening seconds
- **Format**: talking head, screen recording, slideshow, skit, green screen
- **Sound**: trending or original
- Length, hashtag count, posting rhythm

### Instagram
- The mix of reels, carousels, and photos, and which kind wins
- **Cover or first slide**: headline size, word count, template
- **Carousels**: slide count, and what the last slide asks for
- **Caption**: the line before "more"
- **The grid as a whole**: repeated colors, fonts, frames, logo placement

### X
- **The first line** (before "Show more"), length, thread vs single post
- **Media**: none, product screenshot, chart or metric card, video, meme
- Founder vs brand account: which outperforms?
- Do numbers (revenue, users, growth) drive the best posts?

### LinkedIn
- **The two lines before "see more"**
- **Format**: text, image, document carousel, video
- People vs product in the image
- Company page vs staff posts, and whether staff posts match the company's LinkedIn ads (step 5)

### Reddit
- **Title pattern**: question, story, "I made..."
- Which subreddits, self vs link posts
- Whether the account discloses who it works for

## Write-Up

Per channel:

- **Pattern**: three to five traits the top quarter shares and the bottom half lacks, each counted ("8 of 9 top thumbnails show a face; 2 of 12 bottom ones do"). The counts are SEEN; why the trait works is INFERRED.
- **House style**: what repeats across every post. Colors (named, with hex values read off the images), fonts or lettering, templates, logo placement, recurring formats or series.
- **Formulas**: the two or three fill-in templates behind the top titles, covers, or hooks, each with one real example. Example: "I built [outcome] in [short time] with [product]" → "I built a CRM in 20 minutes with Lovable".
- **What changed**: before vs after the inflection from step 3, where the dates allow (full mode only).

For breaking down why one specific post went viral, see the reverse-engineering framework in **social**.

## Contact Sheets

One image per channel: top-quarter thumbnails in one row, bottom-half samples in the row below, each labeled with its engagement number and date. It's the quickest way for a person to check the pattern you claimed. Build it from the downloaded files with any image library (or ffmpeg's `tile` filter) and link it in the write-up.
