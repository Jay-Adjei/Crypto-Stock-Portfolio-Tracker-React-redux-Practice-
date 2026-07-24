# Crypto & Stock Portfolio Tracker — React & Redux Learning Lab

A progressive, hands-on **fill-in-the-blanks** (code koan) project for learning **React**, **Redux Toolkit**, and **React-Redux**.

You implement missing pieces on `main`. Compare against the finished app anytime:

```bash
git diff solutions..main
```

---

## Two-branch workflow

| Branch | Purpose |
| --- | --- |
| `main` | **Lab environment** — TODO markers, incomplete logic, safe fallbacks so the app still compiles |
| `solutions` | **Complete reference** — fully working implementation |

The lab is designed so `npm run dev` always boots. Features stay functionally broken until you implement each TODO.

---

## Quick start

```bash
# Lab (incomplete — your workspace)
git checkout main
npm install
npm run dev

# Solutions (fully working)
git checkout solutions
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run oxlint |

---

## Tech stack

- **Vite** + **React 19** + **TypeScript**
- **Tailwind CSS** (v4 via `@tailwindcss/vite`)
- **Redux Toolkit** (`@reduxjs/toolkit`)
- **React-Redux** (`react-redux`)

---

## Folder structure

```text
src/
  app/
    store.ts                 # configureStore, middleware registration
    hooks.ts                 # typed useAppDispatch / useAppSelector
    middleware/
      priceTickerMiddleware.ts
  features/
    assets/                  # watchlist + holdings
    market/                  # async thunks, mock API, RTK Query
    portfolio/               # memoized selectors + summary UI
    settings/                # base currency + polling prefs
  components/                # Layout, ErrorBoundary, LoadingSpinner
  data/mockAssets.ts         # asset catalog + seed prices
  types/                     # shared domain types
```

---

## State architecture

```text
RootState
├── assets
│   ├── watchlist: Asset[]
│   └── holdings: Holding[]
├── market
│   ├── quotes: Record<assetId, MarketQuote>
│   ├── status: idle | loading | succeeded | failed
│   ├── error: string | null
│   └── lastFetchedAt: string | null
├── settings
│   ├── baseCurrency: USD | EUR | GBP
│   ├── pollingEnabled: boolean
│   └── pollingIntervalMs: number
└── marketApi (RTK Query cache)
```

**Mental model**

1. **Assets** — what you track (watchlist) and what you own (holdings)
2. **Market** — prices + 24h change from a mock network layer
3. **Settings** — display currency and live-ticker preferences
4. **Portfolio (derived)** — net worth, allocation, top gainers via selectors (not stored)

---

## Where to work (TODO → file map)

Search the codebase for `TODO [Level` or open these files directly. Every incomplete task lives in one of the paths below.

| Level | Objective | File |
| --- | --- | --- |
| 1 | Implement `addWatchlistAsset` reducer | `src/features/assets/assetsSlice.ts` |
| 1 | Implement `removeWatchlistAsset` reducer | `src/features/assets/assetsSlice.ts` |
| 1 | Select watchlist from the store | `src/features/assets/components/WatchlistPanel.tsx` |
| 1 | Dispatch `addWatchlistAsset` from the UI | `src/features/assets/components/WatchlistPanel.tsx` |
| 1 | Dispatch `removeWatchlistAsset` from the UI | `src/features/assets/components/WatchlistPanel.tsx` |
| 1 | Implement `setBaseCurrency` reducer | `src/features/settings/settingsSlice.ts` |
| 1 | Select `baseCurrency` from the store | `src/features/settings/components/CurrencySelector.tsx` |
| 1 | Dispatch `setBaseCurrency` from the UI | `src/features/settings/components/CurrencySelector.tsx` |
| 2 | Handle `fetchMarketData.pending` | `src/features/market/marketSlice.ts` |
| 2 | Handle `fetchMarketData.fulfilled` | `src/features/market/marketSlice.ts` |
| 2 | Handle `fetchMarketData.rejected` | `src/features/market/marketSlice.ts` |
| 3 | Memoized selector: total portfolio value | `src/features/portfolio/selectors.ts` |
| 3 | Memoized selector: positions / allocation | `src/features/portfolio/selectors.ts` |
| 3 | Memoized selector: top gainers | `src/features/portfolio/selectors.ts` |
| 3 | Live price tick logic in middleware | `src/app/middleware/priceTickerMiddleware.ts` |
| 3 | Enable RTK Query `pollingInterval` | `src/features/market/components/LiveQuotesPanel.tsx` |

**Already provided (read these, don’t rewrite from scratch)**

| Purpose | File |
| --- | --- |
| Store setup + middleware registration | `src/app/store.ts` |
| Typed Redux hooks | `src/app/hooks.ts` |
| Holdings reducers (worked Level 1 example) | `src/features/assets/assetsSlice.ts` (`upsertHolding` / `removeHolding`) |
| Holdings UI (worked example) | `src/features/assets/components/HoldingsPanel.tsx` |
| Mock market API (latency + random failures) | `src/features/market/mockMarketApi.ts` |
| Async thunk definition for market fetch | `src/features/market/marketSlice.ts` (`fetchMarketData`) |
| Market fetch UI (spinner / errors already wired) | `src/features/market/components/MarketDashboard.tsx` |
| RTK Query API slice | `src/features/market/marketApi.ts` |
| Portfolio summary UI (consumes your selectors) | `src/features/portfolio/components/PortfolioSummary.tsx` |

Find every marker quickly:

```bash
git grep -n "TODO \[Level" -- src
```

---

## Learning levels

### Level 1 — Beginner (Watchlist & local state)

**Objectives**

- Configure the Redux store
- Write synchronous reducers with `createSlice`
- Wire UI with `useAppDispatch` and `useAppSelector`

**Files to edit**

1. `src/features/assets/assetsSlice.ts` — `addWatchlistAsset` / `removeWatchlistAsset`
2. `src/features/assets/components/WatchlistPanel.tsx` — `useAppSelector` + `dispatch`
3. `src/features/settings/settingsSlice.ts` — `setBaseCurrency`
4. `src/features/settings/components/CurrencySelector.tsx` — select currency + dispatch

**Tagged tasks**

```text
// TODO [Level 1]: Implement addWatchlistAsset reducer
// TODO [Level 1]: Implement removeWatchlistAsset reducer
// TODO [Level 1]: Implement setBaseCurrency reducer
// TODO [Level 1]: Dispatch addWatchlistAsset from the watchlist UI
// TODO [Level 1]: Select watchlist from the store
// TODO [Level 1]: Dispatch setBaseCurrency from the settings UI
```

**Done when**

- You can add/remove watchlist items
- Changing USD / EUR / GBP updates portfolio formatting

---

### Level 2 — Intermediate (Async thunks & mock API)

**Objectives**

- Use `createAsyncThunk` for network-style work
- Handle `pending` / `fulfilled` / `rejected` in `extraReducers`
- Surface loading spinners and error alerts in the UI

**Files to edit**

1. `src/features/market/marketSlice.ts` — fill in `extraReducers` for `fetchMarketData`

**Read-only helpers for this level**

- `src/features/market/mockMarketApi.ts` — simulated network delay + failures
- `src/features/market/components/MarketDashboard.tsx` — already dispatches the thunk and reads `status` / `error` / `quotes`

**Tagged tasks**

```text
// TODO [Level 2]: Handle fetchMarketData.pending in extraReducers
// TODO [Level 2]: Handle fetchMarketData.fulfilled in extraReducers
// TODO [Level 2]: Handle fetchMarketData.rejected in extraReducers
```

**Done when**

- “Fetch market data” shows a spinner, then fills the quote table
- Occasional mock failures show a dismissible error

---

### Level 3 — Advanced (Polling, middleware, memoized selectors)

**Objectives**

- Live updates via RTK Query polling and/or custom middleware
- Derive expensive portfolio metrics with `createSelector`
- Avoid recalculating net worth / allocation on unrelated renders

**Files to edit**

1. `src/features/portfolio/selectors.ts` — total value, positions/allocation, top gainers
2. `src/app/middleware/priceTickerMiddleware.ts` — `runTick` live price updates
3. `src/features/market/components/LiveQuotesPanel.tsx` — `pollingInterval` on `useGetLiveQuotesQuery`

**Read-only helpers for this level**

- `src/features/market/marketApi.ts` — RTK Query endpoint
- `src/features/portfolio/components/PortfolioSummary.tsx` — renders selector output

**Tagged tasks**

```text
// TODO [Level 3]: Write memoized selector for total portfolio value
// TODO [Level 3]: Write memoized selector for portfolio positions / allocation
// TODO [Level 3]: Write memoized selector for top gainers
// TODO [Level 3]: Implement live price tick logic in middleware
// TODO [Level 3]: Enable RTK Query pollingInterval for live quotes
```

**Done when**

- Portfolio totals and allocation bars update from quotes
- Live ticker / RTK Query panel refreshes on the configured interval

---

## Suggested study path

1. Read `src/app/store.ts` and `src/app/hooks.ts`
2. Level 1 → `assetsSlice.ts`, `WatchlistPanel.tsx`, `settingsSlice.ts`, `CurrencySelector.tsx`
3. Level 2 → `marketSlice.ts` (`extraReducers` only)
4. Level 3 → `selectors.ts`, `priceTickerMiddleware.ts`, `LiveQuotesPanel.tsx`
5. Diff your work: `git diff solutions..main`

---

## Checking your answers

```bash
# See every lab gap vs the reference implementation
git diff solutions..main

# Focus on one file
git diff solutions..main -- src/features/market/marketSlice.ts
```

Stay on `main` while learning. Peek at `solutions` only when stuck.

---

## Notes for instructors / self-learners

- Fallbacks on `main` (empty arrays, unchanged state, `0` totals) keep TypeScript and Vite happy
- The mock API intentionally fails sometimes — that is part of Level 2
- Seed holdings (`BTC`, `ETH`, `AAPL`) ship so portfolio math has data before you add more
