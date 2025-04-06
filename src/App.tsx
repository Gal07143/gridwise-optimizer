
import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import Routes from './Routes';
import { AuthProvider } from '@/contexts/auth/AuthProvider';
import { SiteProvider } from '@/contexts/SiteContext';
import { ThemeProvider } from '@/components/theme/theme-provider';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  // Add a setup check to make sure everything loads properly
  const [isSetup, setIsSetup] = useState(false);

  useEffect(() => {
    // Simulate initialization process
    const setupApp = async () => {
      try {
        // Give browser a moment to initialize everything
        await new Promise(resolve => setTimeout(resolve, 100));
        setIsSetup(true);
      } catch (error) {
        console.error("Error during app initialization:", error);
        setIsSetup(true); // Continue anyway to avoid blocking the app
      }
    };

    setupApp();
  }, []);

  if (!isSetup) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-md bg-primary/20 animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Initializing application...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="energy-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SiteProvider>
            <Routes />
            <Toaster position="top-right" closeButton richColors />
          </SiteProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
