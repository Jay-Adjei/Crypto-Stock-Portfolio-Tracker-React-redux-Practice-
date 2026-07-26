import { createSelector } from "@reduxjs/toolkit";
import { FX_RATES, getAssetById } from "../../data/mockAssets";
import type { RootState } from "../../app/store";
import type { Asset, FiatCurrency } from "../../types";

export interface PositionView {
  assetId: string;
  symbol: string;
  name: string;
  type: Asset["type"];
  quantity: number;
  price: number;
  value: number;
  change24h: number;
  allocationPct: number;
}

const selectHoldings = (state: RootState) => state.assets.holdings;
const selectQuotes = (state: RootState) => state.market.quotes;
const selectBaseCurrency = (state: RootState) => state.settings.baseCurrency;
const selectWatchlist = (state: RootState) => state.assets.watchlist;

export const selectFxMultiplier = createSelector(
  [selectBaseCurrency],
  (currency: FiatCurrency) => FX_RATES[currency] ?? 1,
);

// TODO [Level 3]: Write memoized selector for total portfolio value
export const selectTotalPortfolioValue = createSelector(
  [selectHoldings, selectQuotes, selectFxMultiplier],
  (holdings, quote, fx): number => {
    return holdings.reduce((total, holding) => {
      const price = quote[holding.assetId]?.price ?? 0;
      return total + holding.quantity * price * fx;
    }, 0);
  },
);

// TODO [Level 3]: Write memoized selector for portfolio positions / allocation
export const selectPortfolioPositions = createSelector(
  [
    getAssetById,
    selectHoldings,
    selectQuotes,
    selectFxMultiplier,
    selectTotalPortfolioValue,
  ],
  (_asset, _holding, _quote, _fx, _portValue): PositionView[] => {
    return [];
  },
);

// TODO [Level 3]: Write memoized selector for top gainers
export const selectTopGainers = (_state: RootState) => {
  void selectWatchlist;
  void selectHoldings;
  void selectQuotes;
  void getAssetById;
  return [] as Array<{
    assetId: string;
    symbol: string;
    name: string;
    change24h: number;
    price: number;
  }>;
};

export const selectAllocationBreakdown = createSelector(
  [selectPortfolioPositions],
  (positions) =>
    positions.map((position) => ({
      assetId: position.assetId,
      symbol: position.symbol,
      allocationPct: position.allocationPct,
      value: position.value,
    })),
);
