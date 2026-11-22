import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error('Uncaught error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo } = this.state;
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-lg w-full">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <span className="text-red-600 text-2xl">!</span>
            </div>
            <h1 className="font-bold text-2xl text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-sm text-gray-500 mb-4">
              An unexpected error occurred in the admin dashboard.
            </p>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4 overflow-auto max-h-48">
                <p className="text-sm font-semibold text-red-700 mb-1">Error details:</p>
                <pre className="text-xs text-red-600 whitespace-pre-wrap">{error.message || String(error)}</pre>
                {errorInfo && (
                  <pre className="text-xs text-red-500 mt-2 whitespace-pre-wrap">{errorInfo.componentStack}</pre>
                )}
              </div>
            )}
            <button
              onClick={this.handleRetry}
              className="w-full bg-rust text-white font-semibold py-3 rounded-md hover:bg-rust/90 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;