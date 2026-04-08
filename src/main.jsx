import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router/dom";
import { Toaster } from 'react-hot-toast';
import './index.css'
import { router } from './routes/router.jsx';
import { AppProvider } from './context/AppContext.jsx';
import AuthProvider from './context/AuthProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AppProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </AppProvider>
    </AuthProvider>
  </StrictMode>
)
