import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { App as CapacitorApp } from '@capacitor/app';
import App from './App.tsx';
import './index.css';

function Root() {
  useEffect(() => {
    CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      if (!canGoBack) {
        CapacitorApp.exitApp();
      } else {
        window.history.back();
      }
    });

    CapacitorApp.addListener('pause', () => {
      console.log('App paused');
    });

    CapacitorApp.addListener('resume', () => {
      console.log('App resumed');
    });
  }, []);

  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
