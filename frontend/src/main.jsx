// frontend/src/main.jsx

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BebidasProvider } from './context/BebidasContext.jsx'; // Importa o Provider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BebidasProvider> {/* Envolver o App com o Provider */}
      <App />
    </BebidasProvider>
  </StrictMode>,
)