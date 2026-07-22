import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  title?: string
}

interface State {
  hasError: boolean
  message: string
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    message: '',
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('UI error boundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-lg border border-[var(--color-loss)]/40 bg-[var(--color-loss)]/10 p-4 text-sm">
          <p className="font-semibold text-[var(--color-loss)]">
            {this.props.title ?? 'Something went wrong'}
          </p>
          <p className="mt-1 text-[var(--color-muted)]">{this.state.message}</p>
          <button
            type="button"
            className="mt-3 rounded bg-[var(--color-surface-2)] px-3 py-1.5 text-[var(--color-text)] hover:bg-[var(--color-border)]"
            onClick={() => this.setState({ hasError: false, message: '' })}
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
