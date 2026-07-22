import { useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { ASSET_CATALOG, getAssetById } from '../../../data/mockAssets'
import { LoadingSpinner } from '../../../components/LoadingSpinner'
import { clearMarketError, fetchMarketData } from '../marketSlice'

export function MarketDashboard() {
  const dispatch = useAppDispatch()
  const { quotes, status, error, lastFetchedAt } = useAppSelector(
    (state) => state.market,
  )
  const watchlistIds = useAppSelector((state) =>
    state.assets.watchlist.map((asset) => asset.id),
  )
  const holdingIds = useAppSelector((state) =>
    state.assets.holdings.map((holding) => holding.assetId),
  )

  const assetIds = useMemo(() => {
    const tracked = Array.from(new Set([...watchlistIds, ...holdingIds]))
    return tracked.length > 0 ? tracked : ASSET_CATALOG.map((asset) => asset.id)
  }, [watchlistIds, holdingIds])

  const rows = assetIds.map((assetId) => {
    const asset = getAssetById(assetId)
    const quote = quotes[assetId]
    return {
      assetId,
      symbol: asset?.symbol ?? assetId.toUpperCase(),
      name: asset?.name ?? assetId,
      price: quote?.price,
      change24h: quote?.change24h,
      updatedAt: quote?.updatedAt,
    }
  })

  return (
    <section className="animate-slide-in rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Level 2 · Market Data</h2>
          <p className="text-xs text-[var(--color-muted)]">
            createAsyncThunk + extraReducers lifecycle
          </p>
        </div>
        <button
          type="button"
          onClick={() => dispatch(fetchMarketData(assetIds))}
          disabled={status === 'loading'}
          className="rounded-md bg-[var(--color-accent-dim)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-accent)] disabled:opacity-50"
        >
          Fetch market data
        </button>
      </div>

      {status === 'loading' && <LoadingSpinner label="Fetching quotes…" />}

      {error && (
        <div className="mb-3 flex items-start justify-between gap-3 rounded-md border border-[var(--color-loss)]/40 bg-[var(--color-loss)]/10 px-3 py-2 text-sm">
          <p className="text-[var(--color-loss)]">{error}</p>
          <button
            type="button"
            className="text-[var(--color-muted)] hover:underline"
            onClick={() => dispatch(clearMarketError())}
          >
            Dismiss
          </button>
        </div>
      )}

      {lastFetchedAt && (
        <p className="mb-3 text-xs text-[var(--color-muted)]">
          Last manual fetch: {new Date(lastFetchedAt).toLocaleTimeString()}
        </p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead className="text-[var(--color-muted)]">
            <tr className="border-b border-[var(--color-border)]">
              <th className="py-2 font-medium">Asset</th>
              <th className="py-2 font-medium">Price (USD)</th>
              <th className="py-2 font-medium">24h</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const change = row.change24h
              const changeColor =
                change === undefined
                  ? 'text-[var(--color-muted)]'
                  : change >= 0
                    ? 'text-[var(--color-gain)]'
                    : 'text-[var(--color-loss)]'
              return (
                <tr
                  key={row.assetId}
                  className="border-b border-[var(--color-border)]/60"
                >
                  <td className="py-2">
                    <span className="font-medium">{row.symbol}</span>
                    <span className="ml-2 text-[var(--color-muted)]">{row.name}</span>
                  </td>
                  <td className="py-2 font-mono">
                    {row.price === undefined ? '—' : row.price.toLocaleString()}
                  </td>
                  <td className={`py-2 font-mono ${changeColor}`}>
                    {change === undefined
                      ? '—'
                      : `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
