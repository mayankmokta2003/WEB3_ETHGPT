import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Wallet } from './utils/wallet'

createRoot(document.getElementById('root')).render(
  <Wallet>
  <StrictMode>
    <App />
  </StrictMode>
  </Wallet>
)
