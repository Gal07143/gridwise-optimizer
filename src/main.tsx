import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { queryClient } from './lib/react-query'
import { ErrorBoundary } from './components/ErrorBoundary'
import './index.css'

// Get the root element
const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Failed to find the root element. Please check if the element with id "root" exists in your HTML.')
}

// Create the root
const root = ReactDOM.createRoot(rootElement)

// Render the app
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))',
              },
              success: {
                iconTheme: {
                  primary: 'hsl(var(--success))',
                  secondary: 'hsl(var(--background))',
                },
              },
              error: {
                iconTheme: {
                  primary: 'hsl(var(--destructive))',
                  secondary: 'hsl(var(--background))',
                },
              },
            }}
          />
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
