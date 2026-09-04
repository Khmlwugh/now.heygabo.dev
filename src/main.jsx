import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Now from './Now.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode><Now /></StrictMode>
)
