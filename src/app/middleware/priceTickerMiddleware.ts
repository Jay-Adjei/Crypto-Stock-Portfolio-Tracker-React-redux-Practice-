import {
  createListenerMiddleware,
  isAnyOf,
  type TypedStartListening,
} from '@reduxjs/toolkit'
import { applyPriceTicks } from '../../features/market/marketSlice'
import { fetchPriceTick } from '../../features/market/mockMarketApi'
import {
  setPollingInterval,
  togglePolling,
} from '../../features/settings/settingsSlice'
import type { AppDispatch, RootState } from '../store'

export const priceTickerMiddleware = createListenerMiddleware()

type AppStartListening = TypedStartListening<RootState, AppDispatch>

const startAppListening =
  priceTickerMiddleware.startListening as AppStartListening

let tickerHandle: ReturnType<typeof setInterval> | null = null

function stopTicker() {
  if (tickerHandle !== null) {
    clearInterval(tickerHandle)
    tickerHandle = null
  }
}

function collectTrackedAssetIds(state: RootState): string[] {
  const fromWatchlist = state.assets.watchlist.map((asset) => asset.id)
  const fromHoldings = state.assets.holdings.map((holding) => holding.assetId)
  return Array.from(new Set([...fromWatchlist, ...fromHoldings]))
}

async function runTick(dispatch: AppDispatch, getState: () => RootState) {
  const state = getState()
  if (!state.settings.pollingEnabled) {
    return
  }

  const assetIds = collectTrackedAssetIds(state)
  if (assetIds.length === 0) {
    return
  }

  // TODO [Level 3]: Implement live price tick logic in middleware
  // Hint:
  //   1) await fetchPriceTick(assetIds)
  //   2) dispatch(applyPriceTicks(ticks))
  //   3) swallow errors so a single failed tick does not stop the interval
  //
  // FALLBACK: no-op — live middleware ticks will not update market.quotes yet.
  void dispatch
  void fetchPriceTick
  void applyPriceTicks
  void assetIds
}

function restartTicker(dispatch: AppDispatch, getState: () => RootState) {
  stopTicker()
  const { pollingEnabled, pollingIntervalMs } = getState().settings
  if (!pollingEnabled) {
    return
  }

  void runTick(dispatch, getState)
  tickerHandle = setInterval(() => {
    void runTick(dispatch, getState)
  }, pollingIntervalMs)
}

startAppListening({
  matcher: isAnyOf(togglePolling, setPollingInterval),
  effect: (_action, api) => {
    restartTicker(api.dispatch, api.getState)
  },
})

/** Call once after store creation to kick off the live ticker. */
export function startPriceTicker(dispatch: AppDispatch, getState: () => RootState) {
  restartTicker(dispatch, getState)
}
