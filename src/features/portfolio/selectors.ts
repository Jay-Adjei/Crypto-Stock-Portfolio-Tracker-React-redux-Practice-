import { createSelector } from '@reduxjs/toolkit'
import { FX_RATES, getAssetById } from '../../data/mockAssets'
import type { RootState } from '../../app/store'
import type { Asset, FiatCurrency } from '../../types'

export interface PositionView {
  assetId: string
  symbol: string
  name: string
  type: Asset['type']
  quantity: number
  price: number
  value: number
  change24h: number
  allocationPct: number
}

const selectHoldings = (state: RootState) => state.assets.holdings
const selectQuotes = (state: RootState) => state.market.quotes
const selectBaseCurrency = (state: RootState) => state.settings.baseCurrency
const selectWatchlist = (state: RootState) => state.assets.watchlist

export const selectFxMultiplier = createSelector(
  [selectBaseCurrency],
  (currency: FiatCurrency) => FX_RATES[currency] ?? 1,
)

/** Total portfolio value in the selected fiat currency. */
export const selectTotalPortfolioValue = createSelector(
  [selectHoldings, selectQuotes, selectFxMultiplier],
  (holdings, quotes, fx) => {
    return holdings.reduce((total, holding) => {
      const quote = quotes[holding.assetId]
      if (!quote) {
        return total
      }
      return total + holding.quantity * quote.price * fx
    }, 0)
  },
)

/** Per-holding breakdown with allocation percentages. */
export const selectPortfolioPositions = createSelector(
  [selectHoldings, selectQuotes, selectFxMultiplier, selectTotalPortfolioValue],
  (holdings, quotes, fx, totalValue): PositionView[] => {
    return holdings
      .map((holding) => {
        const asset = getAssetById(holding.assetId)
        const quote = quotes[holding.assetId]
        const price = (quote?.price ?? 0) * fx
        const value = holding.quantity * price
        return {
          assetId: holding.assetId,
          symbol: asset?.symbol ?? holding.assetId.toUpperCase(),
          name: asset?.name ?? holding.assetId,
          type: asset?.type ?? 'stock',
          quantity: holding.quantity,
          price,
          value,
          change24h: quote?.change24h ?? 0,
          allocationPct: totalValue > 0 ? (value / totalValue) * 100 : 0,
        }
      })
      .sort((a, b) => b.value - a.value)
  },
)

/** Top gainers among watchlist + holdings by 24h change. */
export const selectTopGainers = createSelector(
  [selectWatchlist, selectHoldings, selectQuotes],
  (watchlist, holdings, quotes) => {
    const ids = new Set([
      ...watchlist.map((asset) => asset.id),
      ...holdings.map((holding) => holding.assetId),
    ])

    return Array.from(ids)
      .map((assetId) => {
        const asset = getAssetById(assetId)
        const quote = quotes[assetId]
        return {
          assetId,
          symbol: asset?.symbol ?? assetId.toUpperCase(),
          name: asset?.name ?? assetId,
          change24h: quote?.change24h ?? 0,
          price: quote?.price ?? 0,
        }
      })
      .filter((row) => row.price > 0)
      .sort((a, b) => b.change24h - a.change24h)
      .slice(0, 5)
  },
)

export const selectAllocationBreakdown = createSelector(
  [selectPortfolioPositions],
  (positions) =>
    positions.map((position) => ({
      assetId: position.assetId,
      symbol: position.symbol,
      allocationPct: position.allocationPct,
      value: position.value,
    })),
)
