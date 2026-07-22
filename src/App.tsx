import { Layout } from './components/Layout'
import { ErrorBoundary } from './components/ErrorBoundary'
import { WatchlistPanel } from './features/assets/components/WatchlistPanel'
import { HoldingsPanel } from './features/assets/components/HoldingsPanel'
import { MarketDashboard } from './features/market/components/MarketDashboard'
import { LiveQuotesPanel } from './features/market/components/LiveQuotesPanel'
import { PortfolioSummary } from './features/portfolio/components/PortfolioSummary'
import { CurrencySelector } from './features/settings/components/CurrencySelector'

function App() {
  return (
    <Layout>
      <div className="grid gap-6 lg:grid-cols-2">
        <CurrencySelector />
        <WatchlistPanel />
        <HoldingsPanel />
        <ErrorBoundary title="Market dashboard crashed">
          <MarketDashboard />
        </ErrorBoundary>
      </div>

      <ErrorBoundary title="Live quotes panel crashed">
        <LiveQuotesPanel />
      </ErrorBoundary>

      <ErrorBoundary title="Portfolio summary crashed">
        <PortfolioSummary />
      </ErrorBoundary>
    </Layout>
  )
}

export default App
