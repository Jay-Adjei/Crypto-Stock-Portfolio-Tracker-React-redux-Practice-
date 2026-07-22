import type { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-8 border-b border-[var(--color-border)] pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
          React + Redux Lab
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Crypto & Stock Portfolio Tracker
        </h1>
        <p className="mt-2 max-w-2xl text-[var(--color-muted)]">
          Progressive fill-in-the-blanks exercises across three levels: sync
          reducers, async thunks, then RTK Query polling with memoized selectors.
        </p>
      </header>
      <main className="space-y-8">{children}</main>
    </div>
  )
}
