import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { makeServer } from './api/server';

// Start MirageJS in all environments (including production on Vercel)
if (typeof window !== "undefined" && !window.serverStarted) {
  makeServer();
  window.serverStarted = true;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
