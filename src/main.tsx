import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Dismiss boot loader smoothly
if (typeof window !== 'undefined') {
  requestAnimationFrame(() => {
    const loader = document.getElementById('boot-loader');
    if (loader) {
      setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
          loader.remove();
        }, 200);
      }, 50);
    }
  });
}

