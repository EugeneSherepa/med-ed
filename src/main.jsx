import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './router/AppRouter'; // Adjust path if needed
import { AuthProvider } from './context/AuthContext'; // 🚀 Import the provider
import "./styles/index.scss"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </React.StrictMode>
);