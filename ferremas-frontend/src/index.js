import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Configuración para development
if (process.env.NODE_ENV === 'development') {
  console.log('🚀 FERREMAS Frontend iniciando en modo desarrollo');
  console.log('🌐 Puerto configurado:', process.env.PORT || '3004');
  console.log('🔧 Variables de entorno:');
  console.log('  - API Inventario:', process.env.REACT_APP_API_INVENTARIO);
  console.log('  - API Ventas:', process.env.REACT_APP_API_VENTAS);
  console.log('  - API Transbank:', process.env.REACT_APP_API_TRANSBANK);
  console.log('  - WebPay Environment:', process.env.REACT_APP_WEBPAY_ENVIRONMENT);
  console.log('  - Return URL:', process.env.REACT_APP_WEBPAY_RETURN_URL);
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Manejo global de errores
window.addEventListener('error', (event) => {
  console.error('🚨 Error global capturado:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('🚨 Promise rechazada no manejada:', event.reason);
});

// Log cuando la app está lista
window.addEventListener('load', () => {
  console.log('✅ FERREMAS Frontend cargado completamente');
});