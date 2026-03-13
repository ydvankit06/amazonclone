import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { CartProvider } from './context/CartContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import ToastContainer from './components/ToastContainer.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <ToastProvider>
          <CartProvider>
            <App />
            <ToastContainer />
          </CartProvider>
        </ToastProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);
