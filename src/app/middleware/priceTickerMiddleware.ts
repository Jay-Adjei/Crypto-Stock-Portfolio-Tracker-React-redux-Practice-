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

  try {
    const ticks = await fetchPriceTick(assetIds)
    dispatch(applyPriceTicks(ticks))
  } catch {
    // Tick failures are non-fatal; the next interval will retry.
  }
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
