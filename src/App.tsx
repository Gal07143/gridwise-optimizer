
import { Suspense, lazy } from 'react';
import AppRoutes from './AppRoutes';
import LoadingScreen from './components/LoadingScreen';
import { ThemeProvider } from './theme/ThemeConfig';
import { Toaster } from '@/components/ui/sonner';
import SmartDependencyErrorBoundary from './components/ui/SmartDependencyErrorBoundary';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <SmartDependencyErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="ems-theme">
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<LoadingScreen />}>
            <AppRoutes />
            <Toaster position="top-right" closeButton richColors />
          </Suspense>
        </QueryClientProvider>
      </ThemeProvider>
    </SmartDependencyErrorBoundary>
  );
}

export default App;
