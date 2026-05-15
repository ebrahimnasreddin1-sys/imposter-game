import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './contexts/LanguageContext.jsx'
import { SettingsProvider } from './contexts/SettingsContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </LanguageProvider>
  </StrictMode>,
)
