import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, isOffline: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    // Check if it's a network/offline error
    if (!navigator.onLine || error?.message?.includes("Failed to fetch") || error?.message?.includes("Network Error")) {
      this.setState({ isOffline: true });
    }
  }

  componentDidMount() {
    window.addEventListener("offline", () => this.setState({ hasError: true, isOffline: true }));
    window.addEventListener("online", () => this.setState({ hasError: false, isOffline: false }));
  }

  componentWillUnmount() {
    window.removeEventListener("offline", () => {});
    window.removeEventListener("online", () => {});
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            {this.state.isOffline ? (
              <span className="text-3xl">📡</span>
            ) : (
              <span className="text-3xl">⚠️</span>
            )}
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            {this.state.isOffline ? "You're Offline" : "Something Went Wrong"}
          </h1>
          <p className="text-gray-400 text-sm mb-8 max-w-sm">
            {this.state.isOffline
              ? "Check your internet connection and try again."
              : "An unexpected error occurred. Please try refreshing the page."}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm hover:bg-gray-700 transition-colors"
            >
              Refresh Page
            </button>
            <button
              onClick={() => { this.setState({ hasError: false, isOffline: false }); window.location.href = "/"; }}
              className="border border-gray-300 text-gray-600 px-6 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}