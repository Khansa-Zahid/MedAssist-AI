import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In a real production app this would report to an error-tracking
    // service (Sentry, etc). Logged here so it's still visible in dev tools.
    console.error("AI Symptom Chat crashed:", error, info.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-mist-100 px-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-soft">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-clay-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-6 w-6 text-clay-500"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l6.518 11.593c.75 1.334-.213 2.987-1.743 2.987H3.482c-1.53 0-2.493-1.653-1.743-2.987L8.257 3.1zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h1 className="mt-4 font-display text-lg font-medium text-ink-900">
              Something went wrong
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-ink-400">
              This is just a display issue — your conversation history is safe
              in your browser. Reloading usually fixes it.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="mt-5 w-full rounded-2xl bg-sage-500 px-4 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-sage-600"
            >
              Reload the app
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
