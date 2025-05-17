import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ThemeProvider } from './provider/ThemeProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ToastCustom from './components/features/ToastCustom'
import { Provider } from 'react-redux'
import { store } from './redux/store'

const queryClient = new QueryClient()
createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
          <App />
          <ToastCustom />
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </Provider>
)
