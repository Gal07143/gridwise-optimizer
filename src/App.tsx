
import React from 'react';
import { Toaster } from 'sonner';
import { ErrorBoundary } from './components/ErrorBoundary';
import Routes from './Routes';
import { AppProviders } from './providers/AppProviders';
import './index.css';

function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <Routes />
        <Toaster position="top-right" />
      </AppProviders>
    </ErrorBoundary>
  );
}

export default App;
