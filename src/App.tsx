
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './Routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DeviceProvider } from './contexts/DeviceContext';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DeviceProvider>
        <Router>
          <AppRoutes />
        </Router>
      </DeviceProvider>
    </QueryClientProvider>
  );
}

export default App;
