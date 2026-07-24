import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { MarketDataState, MarketQuote } from "../../types";
import { fetchMarketQuotes } from "./mockMarketApi";

const initialState: MarketDataState = {
  quotes: {},
  status: "idle",
  error: null,
  lastFetchedAt: null,
};

export const fetchMarketData = createAsyncThunk(
  "market/fetchMarketData",
  async (assetIds: string[], { rejectWithValue }) => {
    try {
      const quotes = await fetchMarketQuotes(assetIds);
      return quotes;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown market fetch error";
      return rejectWithValue(message);
    }
  },
);

const marketSlice = createSlice({
  name: "market",
  initialState,
  reducers: {
    applyPriceTicks(
      state,
      action: PayloadAction<
        Pick<MarketQuote, "assetId" | "price" | "change24h">[]
      >,
    ) {
      const now = new Date().toISOString();
      for (const tick of action.payload) {
        state.quotes[tick.assetId] = {
          assetId: tick.assetId,
          price: tick.price,
          change24h: tick.change24h,
          updatedAt: now,
        };
      }
    },
    clearMarketError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // TODO [Level 2]: Handle fetchMarketData.pending in extraReducers
    // TODO [Level 2]: Handle fetchMarketData.fulfilled in extraReducers
    // TODO [Level 2]: Handle fetchMarketData.rejected in extraReducers
    builder
      .addCase(fetchMarketData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMarketData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.quotes = Object.fromEntries(
          action.payload.map((item) => [item.assetId, item]),
        );
      })
      .addCase(fetchMarketData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { applyPriceTicks, clearMarketError } = marketSlice.actions;
export default marketSlice.reducer;
