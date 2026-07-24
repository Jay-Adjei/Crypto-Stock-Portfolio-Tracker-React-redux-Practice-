import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Asset, Holding } from '../../types'

export interface AssetsState {
  watchlist: Asset[]
  holdings: Holding[]
}

const initialState: AssetsState = {
  watchlist: [],
  holdings: [
    { assetId: 'btc', quantity: 0.25 },
    { assetId: 'eth', quantity: 2.5 },
    { assetId: 'aapl', quantity: 10 },
  ],
}

const assetsSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    addWatchlistAsset(state, action: PayloadAction<Asset>) {
      // TODO [Level 1]: Implement addWatchlistAsset reducer
      void state
      void action
    },
    removeWatchlistAsset(state, action: PayloadAction<string>) {
      // TODO [Level 1]: Implement removeWatchlistAsset reducer
      void state
      void action
    },
    // Worked example — holdings reducers are provided so Level 1 can focus on the watchlist.
    upsertHolding(state, action: PayloadAction<Holding>) {
      const existing = state.holdings.find((h) => h.assetId === action.payload.assetId)
      if (existing) {
        existing.quantity = action.payload.quantity
      } else {
        state.holdings.push(action.payload)
      }
    },
    removeHolding(state, action: PayloadAction<string>) {
      state.holdings = state.holdings.filter((h) => h.assetId !== action.payload)
    },
  },
})

export const {
  addWatchlistAsset,
  removeWatchlistAsset,
  upsertHolding,
  removeHolding,
} = assetsSlice.actions

export default assetsSlice.reducer
