import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { ThemeProvider } from './provider/ThemeProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
        <App />
        <Toaster
          position='top-right'
          reverseOrder={false}
          toastOptions={{
            style: {
              background: 'rgba(11, 11, 11, 1)',
              color: '#fff'
            },
            error: {
              style: {
                border: '1px solid #dc2626'
              }
            },
            success: {
              style: {
                border: '1px solid #84cc16'
              }
            }
          }}
        />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)
