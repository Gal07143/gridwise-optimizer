
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';
import './index.css';
import { seedTestData } from './services/deviceService';

// Initialize data if needed
seedTestData().catch(console.error);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
