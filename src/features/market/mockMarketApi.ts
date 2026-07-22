import { BASE_PRICES_USD } from '../../data/mockAssets'
import type { MarketQuote } from '../../types'

const FAILURE_RATE = 0.18
const MIN_DELAY_MS = 400
const MAX_DELAY_MS = 1200

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

function jitterPrice(base: number): number {
  const drift = base * randomBetween(-0.02, 0.02)
  return Number((base + drift).toFixed(base >= 10 ? 2 : 4))
}

function jitterChange(): number {
  return Number(randomBetween(-6, 6).toFixed(2))
}

/**
 * Mock market API with simulated latency and intermittent failures.
 * Used by Level 2 (createAsyncThunk) and Level 3 (RTK Query / middleware).
 */
export async function fetchMarketQuotes(
  assetIds: string[],
): Promise<MarketQuote[]> {
  await delay(randomBetween(MIN_DELAY_MS, MAX_DELAY_MS))

  if (Math.random() < FAILURE_RATE) {
    throw new Error('Mock network error: market data service unavailable')
  }

  return assetIds.map((assetId) => {
    const base = BASE_PRICES_USD[assetId] ?? 100
    return {
      assetId,
      price: jitterPrice(base),
      change24h: jitterChange(),
      updatedAt: new Date().toISOString(),
    }
  })
}

/** Lightweight tick used by custom middleware for live updates. */
export async function fetchPriceTick(
  assetIds: string[],
): Promise<Pick<MarketQuote, 'assetId' | 'price' | 'change24h'>[]> {
  await delay(randomBetween(150, 350))

  if (Math.random() < FAILURE_RATE / 2) {
    throw new Error('Mock tick error: price feed hiccup')
  }

  return assetIds.map((assetId) => {
    const base = BASE_PRICES_USD[assetId] ?? 100
    return {
      assetId,
      price: jitterPrice(base),
      change24h: jitterChange(),
    }
  })
}
