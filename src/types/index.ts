export type AssetType = 'crypto' | 'stock'

export type FiatCurrency = 'USD' | 'EUR' | 'GBP'

export interface Asset {
  id: string
  symbol: string
  name: string
  type: AssetType
}

export interface Holding {
  assetId: string
  quantity: number
}

export interface MarketQuote {
  assetId: string
  price: number
  change24h: number
  updatedAt: string
}

export interface MarketDataState {
  quotes: Record<string, MarketQuote>
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  lastFetchedAt: string | null
}

export type CurrencyRates = Record<FiatCurrency, number>
