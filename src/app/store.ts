import { configureStore } from '@reduxjs/toolkit'
import assetsReducer from '../features/assets/assetsSlice'
import marketReducer from '../features/market/marketSlice'
import { marketApi } from '../features/market/marketApi'
import settingsReducer from '../features/settings/settingsSlice'
import {
  priceTickerMiddleware,
  startPriceTicker,
} from './middleware/priceTickerMiddleware'

export const store = configureStore({
  reducer: {
    assets: assetsReducer,
    market: marketReducer,
    settings: settingsReducer,
    [marketApi.reducerPath]: marketApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(marketApi.middleware)
      .prepend(priceTickerMiddleware.middleware),
})

startPriceTicker(store.dispatch, store.getState)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
