import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { ASSET_CATALOG, getAssetById } from '../../../data/mockAssets'
import { removeHolding, upsertHolding } from '../assetsSlice'

export function HoldingsPanel() {
  const dispatch = useAppDispatch()
  const holdings = useAppSelector((state) => state.assets.holdings)
  const [assetId, setAssetId] = useState(ASSET_CATALOG[0]?.id ?? '')
  const [quantity, setQuantity] = useState('1')

  const handleUpsert = () => {
    const qty = Number(quantity)
    if (!assetId || Number.isNaN(qty) || qty <= 0) {
      return
    }
    dispatch(upsertHolding({ assetId, quantity: qty }))
  }

  return (
    <section className="animate-slide-in rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 p-5">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-semibold">Level 1 · Holdings</h2>
        <span className="text-xs text-[var(--color-muted)]">portfolio positions</span>
      </div>

      <div className="grid gap-2 sm:grid-cols-[1fr_120px_auto]">
        <select
          className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2"
          value={assetId}
          onChange={(event) => setAssetId(event.target.value)}
        >
          {ASSET_CATALOG.map((asset) => (
            <option key={asset.id} value={asset.id}>
              {asset.symbol} — {asset.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          min="0"
          step="any"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2"
          placeholder="Qty"
        />
        <button
          type="button"
          onClick={handleUpsert}
          className="rounded-md bg-[var(--color-accent-dim)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-accent)]"
        >
          Save holding
        </button>
      </div>

      <ul className="mt-4 space-y-2">
        {holdings.map((holding) => {
          const asset = getAssetById(holding.assetId)
          return (
            <li
              key={holding.assetId}
              className="flex items-center justify-between rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm"
            >
              <span>
                <span className="font-medium">{asset?.symbol ?? holding.assetId}</span>
                <span className="text-[var(--color-muted)]">
                  {' '}
                  · qty {holding.quantity}
                </span>
              </span>
              <button
                type="button"
                onClick={() => dispatch(removeHolding(holding.assetId))}
                className="text-[var(--color-loss)] hover:underline"
              >
                Remove
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
