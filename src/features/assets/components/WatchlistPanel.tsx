import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { ASSET_CATALOG } from '../../../data/mockAssets'
import type { Asset } from '../../../types'
import { addWatchlistAsset, removeWatchlistAsset } from '../assetsSlice'

const EMPTY_WATCHLIST: Asset[] = []

export function WatchlistPanel() {
  const dispatch = useAppDispatch()

  // TODO [Level 1]: Select watchlist from the store
  const watchlist = useAppSelector(() => EMPTY_WATCHLIST)
  void dispatch

  const [selectedId, setSelectedId] = useState(ASSET_CATALOG[0]?.id ?? '')

  const available = ASSET_CATALOG.filter(
    (asset) => !watchlist.some((item) => item.id === asset.id),
  )

  const handleAdd = () => {
    const asset = ASSET_CATALOG.find((item) => item.id === selectedId)
    if (!asset) {
      return
    }

    // TODO [Level 1]: Dispatch addWatchlistAsset from the watchlist UI
    void addWatchlistAsset
    void asset
  }

  const handleRemove = (assetId: string) => {
    // TODO [Level 1]: Dispatch removeWatchlistAsset when Remove is clicked
    void removeWatchlistAsset
    void assetId
  }

  return (
    <section className="animate-slide-in rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 p-5">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-semibold">Level 1 · Watchlist</h2>
        <span className="text-xs text-[var(--color-muted)]">
          useDispatch / useSelector
        </span>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <select
          className="flex-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2"
          value={selectedId}
          onChange={(event) => setSelectedId(event.target.value)}
        >
          {available.length === 0 ? (
            <option value="">All assets watched</option>
          ) : (
            available.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.symbol} — {asset.name}
              </option>
            ))
          )}
        </select>
        <button
          type="button"
          disabled={available.length === 0}
          onClick={handleAdd}
          className="rounded-md bg-[var(--color-accent-dim)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Add to watchlist
        </button>
      </div>

      <ul className="mt-4 space-y-2">
        {watchlist.length === 0 ? (
          <li className="text-sm text-[var(--color-muted)]">
            Watchlist is empty.
          </li>
        ) : (
          watchlist.map((asset) => (
            <li
              key={asset.id}
              className="flex items-center justify-between rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2"
            >
              <div>
                <p className="font-medium">
                  {asset.symbol}{' '}
                  <span className="text-xs uppercase text-[var(--color-muted)]">
                    {asset.type}
                  </span>
                </p>
                <p className="text-sm text-[var(--color-muted)]">{asset.name}</p>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(asset.id)}
                className="text-sm text-[var(--color-loss)] hover:underline"
              >
                Remove
              </button>
            </li>
          ))
        )}
      </ul>
    </section>
  )
}
