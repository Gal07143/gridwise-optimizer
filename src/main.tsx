import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';
import './index.css';
import { seedTestData } from './services/devices/seedService';
import { SiteProvider } from '@/contexts/SiteContext';
import MicrogridProvider from '@/components/microgrid/MicrogridProvider';

// Initialize data if needed
seedTestData().catch(console.error);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SiteProvider>
      <MicrogridProvider>
        <App />
      </MicrogridProvider>
    </SiteProvider>
  </React.StrictMode>,
);
