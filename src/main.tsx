import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createHashRouter, RouterProvider } from 'react-router-dom'
import appRoutes from './appRoutes.tsx'
import { Provider } from 'react-redux'
import store from './core/store.ts'
import { Toaster } from 'sonner'

// const router = createBrowserRouter(appRoutes);
const router = createHashRouter(appRoutes)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster richColors toastOptions={{ duration: 2500 }} />
    </Provider>
  </StrictMode>,
)
