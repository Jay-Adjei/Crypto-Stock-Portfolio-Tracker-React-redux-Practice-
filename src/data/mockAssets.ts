import type { Asset, CurrencyRates } from '../types'

/** Catalog of tradeable assets used across the lab. */
export const ASSET_CATALOG: Asset[] = [
  { id: 'btc', symbol: 'BTC', name: 'Bitcoin', type: 'crypto' },
  { id: 'eth', symbol: 'ETH', name: 'Ethereum', type: 'crypto' },
  { id: 'sol', symbol: 'SOL', name: 'Solana', type: 'crypto' },
  { id: 'ada', symbol: 'ADA', name: 'Cardano', type: 'crypto' },
  { id: 'aapl', symbol: 'AAPL', name: 'Apple Inc.', type: 'stock' },
  { id: 'msft', symbol: 'MSFT', name: 'Microsoft', type: 'stock' },
  { id: 'nvda', symbol: 'NVDA', name: 'NVIDIA', type: 'stock' },
  { id: 'tsla', symbol: 'TSLA', name: 'Tesla', type: 'stock' },
  { id: 'googl', symbol: 'GOOGL', name: 'Alphabet', type: 'stock' },
  { id: 'amzn', symbol: 'AMZN', name: 'Amazon', type: 'stock' },
]

/** Seed prices in USD for the mock market service. */
export const BASE_PRICES_USD: Record<string, number> = {
  btc: 67500,
  eth: 3450,
  sol: 148,
  ada: 0.62,
  aapl: 198,
  msft: 430,
  nvda: 118,
  tsla: 248,
  googl: 176,
  amzn: 186,
}

/** Approximate FX rates relative to USD. */
export const FX_RATES: CurrencyRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
}

export function getAssetById(assetId: string): Asset | undefined {
  return ASSET_CATALOG.find((asset) => asset.id === assetId)
}
