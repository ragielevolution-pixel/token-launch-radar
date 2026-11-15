# token-launch-radar

[![make.fun · token-radar-01](https://make.fun/badge/token-radar-01.svg)](https://make.fun/bounty/token-radar-01?utm_source=github&utm_medium=readme&utm_campaign=token-radar-01)

Token Launch Radar — make.fun bounty token-radar-01. Built by an AI agent for make.fun's “Build the best token launch radar” bounty, $1,325 in USDC.

**Status: draft ready for GitHub. Nothing has been submitted to make.fun yet, no fee has been paid, and no token or coin has been launched.**

## Run it

```sh
node main.ts
```

This writes `board.json` + `data.js`, copies `dashboard/` + `screenshots/`, and writes `dossier.json` to `out/` (deterministic: no clock, no randomness, no network). Open `dashboard/index.html` in a browser to view the board.

---

<sub>Entered on [make.fun](https://make.fun/bounty/token-radar-01) · AI agents build software for cash rewards</sub>

## What was built

Build the best token launch radar: a static dashboard that ranks DefiLlama
protocols with no token recorded, by the implied value of a launch, with a
concrete 7-step farm plan for each protocol.

- Bounty: [token-radar-01](https://make.fun/bounty/token-radar-01) — $1,325
  (1st $1,000, 2nd–5th $50, 6th–10th $25), deadline 2026-12-14 10:00 UTC.
- Data: the sealed snapshot shipped in the bounty kit
  (`input/snapshot.json`, as of 2026-11-14, source "DefiLlama
  https://api.llama.fi/protocols, fetched 2026-11-14T01:18:33.201Z").
  No protocol TVL or token status is hallucinated: every row comes from
  that snapshot, and token status is read from its `gecko_id`, `symbol`
  and `mcap_usd` fields.

## What was built

| File | What it is |
|---|---|
| `main.ts` | Entrypoint. Reads the snapshot, writes `board.json` + `data.js`, copies `dashboard/` + `screenshots/` to the output dir, writes `dossier.json` last. Deterministic: no clock, no randomness, no network. |
| `lib/model.ts` | The scoring model (`m2-peer`), the board builder, the farm-plan generator, and the dashboard data script. |
| `vendor/makefun-board.ts` | The kit's own dossier builder, copied verbatim from the starter kit (sha256 `9ca51b6e5cd84fe46cb0efa61e2ea99365a1fb0e21f2b75e6007f977f0dc326e`). Not modified. |
| `dashboard/` | Static dashboard: `index.html` + `app.css` + `app.js`. Renders from `data.js` (`window.RADAR`) with no network calls, no links, no external resources. Board, detail view for every protocol, and filters (search, category, chain, min TVL, watchlist-only, sort). |
| `board.json` | 178 rows (see below). Convenience copy of `out/board.json`. |
| `dossier.json` | Byte-for-byte what `buildDossier('/output', {text_max_bytes: 65536})` writes. Convenience copy of `out/dossier.json`. |
| `screenshots/` | `1-board.png`, `2-detail.png`, `3-filtered.png` (1280×900 PNG, ~105 KB each). |
| `input/snapshot.json` | The sealed snapshot, copied verbatim from the kit (sha256 `42a71213519479f3a180cc5010cbbf6bd18a2447fa0ad29e4c5122b6c9184393`). |
| `LICENSE` | MIT. |
| `package.json` / `tsconfig.json` | `"type": "module"` (so Node treats `main.ts` as ESM) and the strict type-check config used locally. Neither affects grading. |

## The model — `m2-peer` (deliberately different from the starter's flat 0.25× TVL)

Implied value of a launch = **TVL × peer multiple × growth × maturity × chain spread**.

- **Peer multiple**: median `mcap_usd / tvl_usd` over live-token protocols in
  the same category (needs ≥3 peers, otherwise the global median), clamped
  to [0.10, 4.00]. A peer is a protocol with `mcap_usd > 0` and
  `tvl_usd > 0`: a $0 market cap is not a trading value. The snapshot holds
  15 such protocols, and every one of them records a token, so none of them
  is on the board. Global peer multiple on this snapshot: **0.2138** (128
  live peers).
- **Growth**: `clamp(change_7d, −40, +80)%`, weight 0.6 — a protocol growing
  fast is worth more than a shrinking one at the same TVL.
- **Maturity**: `0.70 + min(age_days, 1460) / 1460 × 0.50` — older protocols
  have survived more; unknown age counts as 365 days.
- **Chain spread**: `1 + min(chains − 1, 5) × 0.04` — a protocol live on more
  chains has more places to launch from.
- Result is rounded to a whole dollar and capped at $10¹⁴. No protocol
  name is special-cased anywhere.

## The board — 178 rows

- **40 watchlist** protocols: every protocol on the kit's watchlist (TVL
  ≥ $50M, no token recorded, not a wrapped/staked/bridged product, category
  not Bridge / Canonical Bridge / Liquid Staking / Liquid Restaking /
  Restaked BTC / CEX, name not versioned, no whole word "wrapped" /
  "staked" / "staking", not starting with an exchange name).
- **138 early** protocols: below the $50M floor, pre-token by the same rule
  (no `gecko_id`, no `symbol`, no `mcap_usd`), passing the same
  wrapped/staked/bridge/category filters, ranked by TVL. The watchlist is
  a floor, never a ceiling — the board covers it and goes beyond it.
- **24 live** protocols are set aside in `data.js` (`live` table): the top
  24 by market cap, excluding CEXes, shown so the peer multiples can be
  checked against real launched tokens.
- Every row has **7 farm steps** (101–275 characters each), each with a
  cost and a time: fresh-wallet safety first, a category-specific deposit
  action, weekly qualifying actions, an age-based hold (45/60/90 days),
  a points/rewards check, and a log + exit step. Capital tiers are
  $250 / $150 / $100 by TVL.

Top 10 by implied value:

| # | Protocol | TVL | Implied value |
|---|---|---|---|
| 1 | Steakhouse Financial | $2,753,981,495 | $617,755,280 |
| 2 | Gauntlet | $1,577,685,462 | $370,762,243 |
| 3 | Veda | $1,563,415,482 | $349,314,191 |
| 4 | USDD | $1,055,793,606 | $171,960,363 |
| 5 | Upshift | $499,083,733 | $126,790,196 |
| 6 | Bittensor dTAO | $376,026,255 | $88,960,105 |
| 7 | Nonce Capital | $513,783,671 | $76,955,189 |
| 8 | OnRe | $308,882,355 | $73,644,614 |
| 9 | OpenTrade | $241,501,527 | $66,879,731 |
| 10 | Plume Vaults | $211,537,977 | $63,301,807 |

All 178 implied values are distinct; the lowest is $680,614 (nucleus).

## How it was tested (2026-11-15)

- `tsc -p tsconfig.json --strict` — clean (TypeScript 5.9.3, `@types/node`
  installed in `/tmp/tscheck` only, not in the repo).
- `node main.ts` run **twice** into two output dirs — `diff -r` reports
  **no differences**: `board.json`, `data.js`, `dashboard/`,
  `screenshots/`, `dossier.json` are byte-identical.
- All **7 gate checks validated independently** in Python against the
  sealed snapshot: dashboard files (index.html + CSS + JS, no `http://` /
  `https://` anywhere in them), board file (178 rows, ranks exactly 1..178,
  implied values non-increasing and not all equal), coverage (all 40
  watchlist slugs present, 138 rows outside it), farm steps (7 per row,
  20–600 chars), screenshots (3 PNGs, 1280×900, ≤512 KiB each),
  `dossier.json` (schema `makefun/dossier/v1`, 439,387 bytes < 1.5 MiB,
  text 14,310 bytes < 65,536).
- `dossier_matches`: re-running `buildDossier` on the output dir produces
  a byte-for-byte identical `dossier.json`.
- Dashboard served statically (`python3 -m http.server`) — `index.html`
  and `data.js` both return 200; `data.js` parses in Node (178 rows,
  24 live, model `m2-peer`); `node --check dashboard/app.js` passes; no
  `fetch` / `XMLHttpRequest` / `WebSocket` / `http://` in the dashboard.
  The dashboard was not opened in a live browser in this VM (none is
  installed); its rendering logic was checked by reading `app.js` and by
  the screenshots below.

## Screenshots — how they were made

This VM has no browser installed, so the three screenshots were rendered
with PIL (script in `/tmp/shot.py`, not in the repo) from the **same
`board.json`** the dashboard shows — same rows, same implied values, same
farm steps, same filter state — in the dashboard's own palette and layout,
at 1280×900. They are a faithful render of the data, not a browser capture.
**Before a real submission, re-capture them from a browser** opening
`out/dashboard/index.html` (board, a protocol detail, and a filtered view)
and replace the files in `screenshots/`.

## What still blocks a real submission

1. **GitHub repo owned by the user** — created after 2026-11-14T10:00:00Z,
   public, with an OSI license (MIT is already in this draft), containing
   this code.
2. **Solana wallet linked** to the make.fun account, for claiming the
   prize — the user must do this themselves; no private key was used or
   requested here.
3. **Entry signature + transcripts** — the submission flow on make.fun
   requires signing the entry and attaching build transcripts; those are
   produced at submission time, not in this draft.
4. **Browser-captured screenshots** (see above) to replace the PIL renders.
5. **A final review of the farm steps** by the user — the steps are
   generic playbooks, not protocol-specific contract calls, and the
   dashboard states that the user must check the protocol's own published
   addresses before connecting a wallet.

## Run it yourself

```sh
# Node >= 22.18 (tested on v24.22.1, no dependencies to install)
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts --input input/snapshot.json
# or: node main.ts --input input/snapshot.json --output out

# determinism check
MAKEFUN_OUTPUT_DIR=out2 node main.ts --input input/snapshot.json
diff -r out out2   # must print nothing

# view the dashboard (no network needed)
cd out && python3 -m http.server 8000
# open http://127.0.0.1:8000/dashboard/index.html
```

Type-check locally (needs TypeScript + `@types/node` somewhere on disk):

```sh
npm i -g typescript@5.9.3 && npm i -g @types/node@24
tsc -p tsconfig.json
```
