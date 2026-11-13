import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// PWA (Manual) ❌ DISABLED
if ( false && 'serviceWorker' in navigator) {

  console.log("Service Worker available");

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./serviceWorker.js")
      .then((reg) => {
        console.log(`Success: ${reg.scope}`);
        console.log("reg.installing: ", reg.installing);
        console.log("reg.waiting: ", reg.waiting);
        console.log("reg.active: ", reg.active);
      })
      .catch((err) => {
        console.log(`Failure: `, err);
      })
  });

}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
