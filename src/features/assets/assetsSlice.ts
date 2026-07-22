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
      const exists = state.watchlist.some((asset) => asset.id === action.payload.id)
      if (!exists) {
        state.watchlist.push(action.payload)
      }
    },
    removeWatchlistAsset(state, action: PayloadAction<string>) {
      state.watchlist = state.watchlist.filter((asset) => asset.id !== action.payload)
    },
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
