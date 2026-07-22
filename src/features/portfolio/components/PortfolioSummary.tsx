import { useAppSelector } from '../../../app/hooks'
import {
  selectAllocationBreakdown,
  selectPortfolioPositions,
  selectTopGainers,
  selectTotalPortfolioValue,
} from '../selectors'

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value)
}

export function PortfolioSummary() {
  const currency = useAppSelector((state) => state.settings.baseCurrency)
  const totalValue = useAppSelector(selectTotalPortfolioValue)
  const positions = useAppSelector(selectPortfolioPositions)
  const allocation = useAppSelector(selectAllocationBreakdown)
  const topGainers = useAppSelector(selectTopGainers)

  return (
    <section className="animate-slide-in rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 p-5">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-semibold">Level 3 · Portfolio Insights</h2>
        <span className="text-xs text-[var(--color-muted)]">
          memoized createSelector
        </span>
      </div>

      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
        <p className="text-sm text-[var(--color-muted)]">Total portfolio value</p>
        <p className="mt-1 text-3xl font-semibold tracking-tight">
          {formatMoney(totalValue, currency)}
        </p>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div>
          <h3 className="mb-2 text-sm font-semibold text-[var(--color-muted)]">
            Positions & allocation
          </h3>
          <ul className="space-y-2">
            {positions.length === 0 ? (
              <li className="text-sm text-[var(--color-muted)]">No holdings yet.</li>
            ) : (
              positions.map((position) => (
                <li
                  key={position.assetId}
                  className="rounded-md border border-[var(--color-border)] px-3 py-2 text-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{position.symbol}</span>
                    <span className="font-mono">
                      {formatMoney(position.value, currency)}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-[var(--color-muted)]">
                    <span>
                      {position.quantity} × {formatMoney(position.price, currency)}
                    </span>
                    <span>{position.allocationPct.toFixed(1)}%</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded bg-[var(--color-bg)]">
                    <div
                      className="h-full bg-[var(--color-accent)]"
                      style={{ width: `${Math.min(position.allocationPct, 100)}%` }}
                    />
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-[var(--color-muted)]">
            Top gainers (24h)
          </h3>
          <ul className="space-y-2">
            {topGainers.length === 0 ? (
              <li className="text-sm text-[var(--color-muted)]">
                Fetch market data or wait for live ticks.
              </li>
            ) : (
              topGainers.map((row) => (
                <li
                  key={row.assetId}
                  className="flex items-center justify-between rounded-md border border-[var(--color-border)] px-3 py-2 text-sm"
                >
                  <span>
                    <span className="font-medium">{row.symbol}</span>
                    <span className="ml-2 text-[var(--color-muted)]">{row.name}</span>
                  </span>
                  <span
                    className={
                      row.change24h >= 0
                        ? 'font-mono text-[var(--color-gain)]'
                        : 'font-mono text-[var(--color-loss)]'
                    }
                  >
                    {row.change24h >= 0 ? '+' : ''}
                    {row.change24h.toFixed(2)}%
                  </span>
                </li>
              ))
            )}
          </ul>

          <h3 className="mb-2 mt-5 text-sm font-semibold text-[var(--color-muted)]">
            Allocation snapshot
          </h3>
          <ul className="space-y-1 text-sm">
            {allocation.map((row) => (
              <li key={row.assetId} className="flex justify-between">
                <span>{row.symbol}</span>
                <span className="text-[var(--color-muted)]">
                  {row.allocationPct.toFixed(1)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
