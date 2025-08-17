
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
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
  
  // Import App component dynamically to ensure all dependencies are loaded
  import('./App.tsx').then((AppModule) => {
    const App = AppModule.default;
    const root = createRoot(finalContainer);
    
    root.render(
      React.createElement(StrictMode, null,
        React.createElement(App, null)
      )
    );
  }).catch(error => {
    console.error('Failed to load App:', error);
    // Fallback content
    finalContainer.innerHTML = `
      <div style="padding: 20px; font-family: system-ui; text-align: center;">
        <h1>PromptMetrics</h1>
        <p>Carregando aplicação...</p>
        <p style="color: red; font-size: 12px;">Erro: ${error.message}</p>
      </div>
    `;
  });
} catch (error) {
  console.error('Failed to initialize app:', error);
  // Fallback initialization
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: system-ui; text-align: center;">
      <h1>PromptMetrics</h1>
      <p>Erro ao carregar a aplicação</p>
      <p style="color: red; font-size: 12px;">${error.message}</p>
    </div>
  `;
}
