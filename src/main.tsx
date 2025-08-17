
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Robust initialization for preview environments
try {
  const container = document.getElementById('root');
  if (!container) {
    console.warn('Root element not found, creating fallback');
    // Create fallback root element for preview environments
    const fallbackRoot = document.createElement('div');
    fallbackRoot.id = 'root';
    document.body.appendChild(fallbackRoot);
  }

  const finalContainer = document.getElementById('root')!;
  const root = createRoot(finalContainer);
  
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} catch (error) {
  console.error('Failed to initialize app:', error);
  // Fallback initialization
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: system-ui; text-align: center;">
      <h1>PromptMetrics</h1>
      <p>Carregando aplicação...</p>
    </div>
  `;
}
