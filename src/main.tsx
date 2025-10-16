
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { logger } from './utils/logger';

// Initialize performance monitoring
if (import.meta.env.PROD) {
  // Report web vitals
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS((metric) => logger.performance('CLS', metric));
    getFID((metric) => logger.performance('FID', metric));
    getFCP((metric) => logger.performance('FCP', metric));
    getLCP((metric) => logger.performance('LCP', metric));
    getTTFB((metric) => logger.performance('TTFB', metric));
  }).catch((error) => {
    console.error('Failed to load web-vitals:', error);
  });
}

// Initialize PWA
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        logger.info('SW registered: ', registration.scope);

        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New version available
                logger.info('New SW version available');
                // You could show a notification to the user here
              }
            });
          }
        });
      })
      .catch((registrationError) => {
        logger.error('SW registration failed: ', registrationError);
      });
  });
}

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
