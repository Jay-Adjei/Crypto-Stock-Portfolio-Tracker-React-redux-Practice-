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

/**
 * TODO [Level 3]: Write memoized selector for total portfolio value
 *
 * Replace this naive function with createSelector([...inputs], (holdings, quotes, fx) => ...)
 * so the total is only recomputed when holdings, quotes, or FX change.
 *
 * Formula: sum(holding.quantity * quote.price * fx) for holdings that have quotes.
 *
 * FALLBACK: always returns 0 so the app compiles and renders.
 */
export const selectTotalPortfolioValue = (_state: RootState): number => {
  void selectHoldings
  void selectQuotes
  void selectFxMultiplier
  void createSelector
  return 0
}

/**
 * TODO [Level 3]: Write memoized selector for portfolio positions / allocation
 *
 * Build a PositionView[] with price, value, change24h, and allocationPct
 * (value / totalValue * 100). Sort by value descending.
 *
 * Prefer createSelector and reuse selectTotalPortfolioValue.
 *
 * FALLBACK: empty list.
 */
export const selectPortfolioPositions = (_state: RootState): PositionView[] => {
  void getAssetById
  void selectHoldings
  void selectQuotes
  void selectFxMultiplier
  void selectTotalPortfolioValue
  return []
}

/**
 * TODO [Level 3]: Write memoized selector for top gainers
 *
 * Union watchlist + holdings asset IDs, read change24h from quotes,
 * sort descending, return top 5.
 *
 * FALLBACK: empty list.
 */
export const selectTopGainers = (_state: RootState) => {
  void selectWatchlist
  void selectHoldings
  void selectQuotes
  void getAssetById
  return [] as Array<{
    assetId: string
    symbol: string
    name: string
    change24h: number
    price: number
  }>
}

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
