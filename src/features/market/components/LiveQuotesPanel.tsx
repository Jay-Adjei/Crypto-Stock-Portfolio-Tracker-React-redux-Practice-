import { useMemo } from 'react'
import { useAppSelector } from '../../../app/hooks'
import { ASSET_CATALOG } from '../../../data/mockAssets'
import { LoadingSpinner } from '../../../components/LoadingSpinner'
import { useGetLiveQuotesQuery } from '../marketApi'

export function LiveQuotesPanel() {
  const pollingEnabled = useAppSelector((state) => state.settings.pollingEnabled)
  const pollingIntervalMs = useAppSelector(
    (state) => state.settings.pollingIntervalMs,
  )
  const watchlistIds = useAppSelector((state) =>
    state.assets.watchlist.map((asset) => asset.id),
  )
  const holdingIds = useAppSelector((state) =>
    state.assets.holdings.map((holding) => holding.assetId),
  )

  const assetIds = useMemo(() => {
    const tracked = Array.from(new Set([...watchlistIds, ...holdingIds]))
    return tracked.length > 0 ? tracked : ASSET_CATALOG.slice(0, 4).map((a) => a.id)
  }, [watchlistIds, holdingIds])

  const { data, error, isFetching, refetch } = useGetLiveQuotesQuery(assetIds, {
    pollingInterval: pollingEnabled ? pollingIntervalMs : 0,
  })

  return (
    <section className="animate-slide-in rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Level 3 · RTK Query Polling</h2>
          <p className="text-xs text-[var(--color-muted)]">
            useGetLiveQuotesQuery with pollingInterval
          </p>
        </div>
        <button
          type="button"
          onClick={() => void refetch()}
          className="rounded-md border border-[var(--color-border)] px-3 py-1.5 text-sm hover:bg-[var(--color-surface-2)]"
        >
          Refetch now
        </button>
      </div>

      {isFetching && <LoadingSpinner label="Polling live quotes…" />}

      {error ? (
        <p className="mb-2 text-sm text-[var(--color-loss)]">
          {typeof error === 'object' &&
          error !== null &&
          'error' in error &&
          typeof (error as { error?: unknown }).error === 'string'
            ? (error as { error: string }).error
            : 'Failed to load live quotes'}
        </p>
      ) : null}

      <ul className="mt-2 grid gap-2 sm:grid-cols-2">
        {(data ?? []).map((quote) => (
          <li
            key={quote.assetId}
            className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium uppercase">{quote.assetId}</span>
              <span
                className={
                  quote.change24h >= 0
                    ? 'text-[var(--color-gain)]'
                    : 'text-[var(--color-loss)]'
                }
              >
                {quote.change24h >= 0 ? '+' : ''}
                {quote.change24h.toFixed(2)}%
              </span>
            </div>
            <p className="mt-1 font-mono text-[var(--color-text)]">
              ${quote.price.toLocaleString()}
            </p>
            <p className="text-xs text-[var(--color-muted)]">
              {new Date(quote.updatedAt).toLocaleTimeString()}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
