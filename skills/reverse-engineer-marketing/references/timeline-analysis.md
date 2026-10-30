# Moves vs Growth: Timeline Analysis

Step 9 of the teardown. It uses no new data calls: every input was pulled in steps 2-8. The goal is to see which moves lined up with growth speeding up. It can't prove which moves caused it.

## Contents
- Inputs
- Method
- Script
- Reading the results

---

## Inputs

**`moves.csv`**: one row per dated move.

| Column | Example |
|---|---|
| date | 2025-03-11 |
| channel | x, youtube, tiktok, instagram, linkedin, reddit, ads, search, ai, product-loop, pr, funding, launch, hiring |
| move | Founder posts "1,500 customers a day" |
| kind | launch, raise, founder-post, creator-video, ad-start, loop-first-seen, page-family, content-format, hire |
| reach | 376000 (views, likes, or score; blank if none) |
| link | URL |
| evidence | SEEN or INFERRED |

**`traffic.csv`**: one row per month from step 3: `month, visits, brand_searches` (one vendor for the whole series).

## Method

1. **Growth speed.** Month-over-month growth % for visits and for brand searches, then the change in growth (speeding up or slowing down).
2. **Lift per move.** Average growth in the 2 months before the move vs the move's month and the 2 after. Lift = after minus before, in percentage points. Compute it for visits and for brand searches.
3. **Clusters.** Moves less than 30 days apart form one cluster. Report lift per cluster and list its moves. Never credit one move inside a cluster.
4. **Spread speed.** For posts, engagement ÷ days since posting, ranked within its channel. The top quarter are fast spreaders.
5. **Leading channel.** Per channel: monthly count of moves vs growth 0, 1, and 2 months later, using Spearman correlation. Report the coefficient and how many months it rests on. Under 12 months or under 5 moves on a channel → list the rows and call no relationship.

## Script

```python
import pandas as pd

moves = pd.read_csv("moves.csv", parse_dates=["date"])
traffic = pd.read_csv("traffic.csv", parse_dates=["month"]).sort_values("month")
traffic["growth"] = traffic["visits"].pct_change() * 100
traffic["brand_growth"] = traffic["brand_searches"].pct_change() * 100

# Cluster moves less than 30 days apart
moves = moves.sort_values("date").reset_index(drop=True)
moves["cluster"] = (moves["date"].diff().dt.days.fillna(999) >= 30).cumsum()

def lift(month, col):
    idx = traffic.index[traffic["month"] == month]
    if len(idx) == 0:
        return None
    i = traffic.index.get_loc(idx[0])
    before = traffic[col].iloc[max(i - 2, 0):i].mean()
    after = traffic[col].iloc[i:i + 3].mean()
    return round(after - before, 1)

clusters = moves.groupby("cluster").agg(
    start=("date", "min"), moves=("move", list), channels=("channel", lambda c: sorted(set(c)))
)
clusters["month"] = clusters["start"].dt.to_period("M").dt.to_timestamp()
clusters["visit_lift_pts"] = clusters["month"].apply(lambda m: lift(m, "growth"))
clusters["brand_lift_pts"] = clusters["month"].apply(lambda m: lift(m, "brand_growth"))
print(clusters.sort_values("visit_lift_pts", ascending=False).head(3))

# Leading channel: monthly move counts vs growth k months later
monthly = moves.assign(month=moves["date"].dt.to_period("M").dt.to_timestamp())
counts = monthly.pivot_table(index="month", columns="channel", values="move", aggfunc="count").fillna(0)
merged = traffic.set_index("month")[["growth"]].join(counts, how="left").fillna(0)
for channel in counts.columns:
    n_moves = int(counts[channel].sum())
    if len(merged) < 12 or n_moves < 5:
        print(f"{channel}: {n_moves} moves over {len(merged)} months, too few to call")
        continue
    for k in (0, 1, 2):
        rho = merged[channel].corr(merged["growth"].shift(-k), method="spearman")
        print(f"{channel} -> growth +{k}mo: rho={rho:.2f} over {len(merged) - k} months")

clusters.to_csv("moves-vs-growth.csv")
```

## Reading the Results

- **Largest lift**: the three clusters with the biggest visit lift. Name every move in each. The lift is SEEN, as numbers. That the moves caused it is INFERRED.
- **Leading channel**: the channel whose move counts correlate with growth one or two months later. Monthly data and overlapping moves make this weak evidence; say so.
- **Fast spreaders that moved nothing**: posts in the top quarter for spread speed with no lift after. These are the plays to skip, because they look good on a timeline and did nothing for growth.
- **Brand searches vs visits**: if brand searches jump and organic visits don't, the move created demand that came in through other channels (direct, AI answers, word of mouth). If visits jump and brand searches don't, look at non-brand SEO or paid.
- **Confounders to name**: funding announcements, press waves, a category-wide surge (check two peers' curves), seasonality, and vendor estimate changes.
