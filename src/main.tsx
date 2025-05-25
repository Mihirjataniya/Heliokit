import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { Provider } from 'react-redux'
import { store } from './store'
import { ToastProvider } from './components/heliokit/Toast/Toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ToastProvider
        defaultDuration={3000}
        defaultTheme="dark"
        defaultPosition="bottom-center"
      >
      <App />
      </ToastProvider>
    </Provider>
  </StrictMode>,
)
