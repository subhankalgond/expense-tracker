import { jsx as _jsx } from "react/jsx-runtime";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
// Register PWA service worker
if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/sw.js')
            .then((registration) => {
            console.log('PWA ServiceWorker registered successfully:', registration.scope);
        })
            .catch((error) => {
            console.warn('PWA ServiceWorker registration failed:', error);
        });
    });
}
createRoot(document.getElementById('root')).render(_jsx(StrictMode, { children: _jsx(App, {}) }));
