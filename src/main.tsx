import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'
import GlobalErrorBoundary from './components/ui/GlobalErrorBoundary'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div role="alert" className="p-4 bg-red-50 text-red-800 rounded-lg">
    <h2 className="text-lg font-semibold">Something went wrong:</h2>
    <pre className="mt-2 p-2 bg-red-100 rounded">{error.message}</pre>
    <button 
      onClick={resetErrorBoundary}
      className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
    >
      Try again
    </button>
  </div>
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <GlobalErrorBoundary>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </GlobalErrorBoundary>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
