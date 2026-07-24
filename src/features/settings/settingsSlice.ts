import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { FiatCurrency } from '../../types'

export interface SettingsState {
  baseCurrency: FiatCurrency
  pollingEnabled: boolean
  pollingIntervalMs: number
}

const initialState: SettingsState = {
  baseCurrency: 'USD',
  pollingEnabled: true,
  pollingIntervalMs: 5000,
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setBaseCurrency(state, action: PayloadAction<FiatCurrency>) {
      // TODO [Level 1]: Implement setBaseCurrency reducer
      void state
      void action
    },
    // Worked examples — polling prefs are provided for Level 3 wiring.
    togglePolling(state) {
      state.pollingEnabled = !state.pollingEnabled
    },
    setPollingInterval(state, action: PayloadAction<number>) {
      state.pollingIntervalMs = action.payload
    },
  },
})

export const { setBaseCurrency, togglePolling, setPollingInterval } =
  settingsSlice.actions
export default settingsSlice.reducer
