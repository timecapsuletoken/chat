import './polyfills';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Removed unused `Router`
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Redirect HTTP to HTTPS in production
if (window.location.protocol !== 'https:' && process.env.NODE_ENV === 'production') {
  window.location.href = `https:${window.location.href.substring(window.location.protocol.length)}`;
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true, // Enable startTransition for state updates
        v7_relativeSplatPath: true, // Enable relative splat paths
      }}
    >
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// For performance measurements (optional)
reportWebVitals();
