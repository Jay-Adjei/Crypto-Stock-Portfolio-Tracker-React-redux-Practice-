import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import {
  setBaseCurrency,
  setPollingInterval,
  togglePolling,
} from '../settingsSlice'
import type { FiatCurrency } from '../../../types'

const CURRENCIES: FiatCurrency[] = ['USD', 'EUR', 'GBP']

export function CurrencySelector() {
  const dispatch = useAppDispatch()
  const baseCurrency = useAppSelector((state) => state.settings.baseCurrency)
  const pollingEnabled = useAppSelector((state) => state.settings.pollingEnabled)
  const pollingIntervalMs = useAppSelector(
    (state) => state.settings.pollingIntervalMs,
  )

  return (
    <section className="animate-slide-in rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 p-5">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-semibold">Level 1 · Settings</h2>
        <span className="text-xs text-[var(--color-muted)]">
          sync reducers + selectors
        </span>
      </div>

      <label className="block text-sm text-[var(--color-muted)]">
        Base currency
        <select
          className="mt-1 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-[var(--color-text)]"
          value={baseCurrency}
          onChange={(event) =>
            dispatch(setBaseCurrency(event.target.value as FiatCurrency))
          }
        >
          {CURRENCIES.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => dispatch(togglePolling())}
          className="rounded-md bg-[var(--color-accent-dim)] px-3 py-2 text-sm font-medium text-white hover:bg-[var(--color-accent)]"
        >
          Live ticker: {pollingEnabled ? 'On' : 'Off'}
        </button>

        <label className="text-sm text-[var(--color-muted)]">
          Interval (ms)
          <input
            type="number"
            min={2000}
            step={1000}
            value={pollingIntervalMs}
            onChange={(event) =>
              dispatch(setPollingInterval(Number(event.target.value) || 5000))
            }
            className="ml-2 w-28 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-2 py-1.5 text-[var(--color-text)]"
          />
        </label>
      </div>
    </section>
  )
}
