import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ThemeProvider theme={theme}>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <App />
    </GoogleOAuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
