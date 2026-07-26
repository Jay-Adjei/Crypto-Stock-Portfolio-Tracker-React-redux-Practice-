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
  (asset, holdings, quotes, fx, portValue): PositionView[] => {
    return holdings.map((holding) => {
      const assetId = holding.assetId; // Get assetId from holding
      const assetData = asset; // asset is already the looked-up asset
      const symbol = assetData?.symbol ?? "";
      const name = assetData?.name ?? "";
      const type = assetData?.type;
      const quantity = holding.quantity; // Direct property access
      const price = quotes[assetId]?.price ?? 0;
      const value = quantity * price * fx;
      const allocationPct = portValue > 0 ? (value / portValue) * 100 : 0;

      return {
        assetId,
        symbol,
        name,
        type: type as Asset["type"],
        quantity,
        price,
        value,
        change24h: quotes[assetId]?.change24h ?? 0,
        allocationPct,
      };
    });
  },
);

// TODO [Level 3]: Write memoized selector for top gainers
export const selectTopGainers = createSelector(
  [selectWatchlist, selectHoldings, selectQuotes],
  (list, holdings, quotes) => {
    return holdings.map((holding) => {
      const asset = getAssetById(holding.assetId);
      const assetId = asset?.id;
      const symbol = asset?.symbol;
      const name = asset?.name;
      return {
        assetId,
        symbol,
        name,
        change24h: quotes[holding?.assetId]?.change24h ?? 0,
        price: quotes[holding?.assetId]?.price ?? 0,
      };
    });
  },
);

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
