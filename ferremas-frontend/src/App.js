import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';

// Verificar si los componentes existen antes de importarlos
let Header, LoginModal, CartModal, HomePage, ProductsPage, ContactPage, AdminPage, PaymentSuccessPage;

try {
  Header = require('./components/Header').default;
  console.log('✅ Header cargado');
} catch (e) {
  console.error('❌ Error cargando Header:', e.message);
  Header = () => <div className="bg-blue-900 text-white p-4">FERREMAS - Header no disponible</div>;
}

try {
  LoginModal = require('./components/LoginModal').default;
  console.log('✅ LoginModal cargado');
} catch (e) {
  console.error('❌ Error cargando LoginModal:', e.message);
  LoginModal = () => null;
}

try {
  CartModal = require('./components/CartModal').default;
  console.log('✅ CartModal cargado');
} catch (e) {
  console.error('❌ Error cargando CartModal:', e.message);
  CartModal = () => null;
}

try {
  HomePage = require('./pages/HomePage').default;
  console.log('✅ HomePage cargado');
} catch (e) {
  console.error('❌ Error cargando HomePage:', e.message);
  HomePage = () => (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-4xl font-bold text-blue-900 mb-4">🏠 FERREMAS</h1>
      <p className="text-xl text-gray-600 mb-8">Distribuidora de Ferretería y Construcción</p>
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <p>Página de inicio temporal - Componente HomePage no disponible</p>
      </div>
    </div>
  );
}

try {
  ProductsPage = require('./pages/ProductsPage').default;
  console.log('✅ ProductsPage cargado');
} catch (e) {
  console.error('❌ Error cargando ProductsPage:', e.message);
  ProductsPage = () => (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-3xl font-bold mb-4">🛠️ Productos</h1>
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <p>Página de productos temporal - Componente ProductsPage no disponible</p>
      </div>
    </div>
  );
}

try {
  ContactPage = require('./pages/ContactPage').default;
  console.log('✅ ContactPage cargado');
} catch (e) {
  console.error('❌ Error cargando ContactPage:', e.message);
  ContactPage = () => (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-3xl font-bold mb-4">📞 Contacto</h1>
      <div className="space-y-4">
        <p>📧 Email: contacto@ferremas.cl</p>
        <p>📞 Teléfono: +56 2 2345 6789</p>
        <p>📍 Dirección: Av. Libertador B. O'Higgins 1234, Santiago</p>
      </div>
    </div>
  );
}

try {
  AdminPage = require('./pages/AdminPage').default;
  console.log('✅ AdminPage cargado');
} catch (e) {
  console.error('❌ Error cargando AdminPage:', e.message);
  AdminPage = () => (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-3xl font-bold mb-4">👨‍💼 Panel de Administración</h1>
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <p>Panel de admin temporal - Componente AdminPage no disponible</p>
      </div>
    </div>
  );
}

try {
  PaymentSuccessPage = require('./pages/PaymentSuccessPage').default;
  console.log('✅ PaymentSuccessPage cargado');
} catch (e) {
  console.error('❌ Error cargando PaymentSuccessPage:', e.message);
  PaymentSuccessPage = () => (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-green-800 mb-4">¡Pago Exitoso!</h1>
        <p className="text-green-600 mb-6">
          Tu pago ha sido procesado correctamente con Webpay.
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Componente PaymentSuccessPage temporal
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors"
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  );
}

// Componente de error para debugging
const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleError = (event) => {
      console.error('🚨 Error capturado en ErrorBoundary:', event.error);
      setError(event.error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-red-800 mb-4">🚨 Error en la Aplicación</h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-semibold">Error detectado:</p>
            <p className="text-sm">{error?.message || 'Error desconocido'}</p>
          </div>
          <button
            onClick={() => {
              setHasError(false);
              setError(null);
              window.location.reload();
            }}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Recargar Aplicación
          </button>
        </div>
      </div>
    );
  }

  return children;
};

// Componente interno que usa el contexto
const AppContent = () => {
  const { state, actions } = useApp();
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    console.log('🚀 AppContent iniciando...');
    
    // Información de debugging
    const debug = {
      currentPage: state.currentPage,
      isLoggedIn: state.isLoggedIn,
      cartItems: state.cart.length,
      productsLoaded: state.products.length,
      url: window.location.href,
      search: window.location.search,
      pathname: window.location.pathname
    };
    
    setDebugInfo(debug);
    console.log('🔍 Debug Info:', debug);

    // Detectar retorno de WebPay con debugging mejorado
    const handleWebpayReturn = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenWs = urlParams.get('token_ws');
      const pagoExitoso = urlParams.get('pago');
      const paymentReturn = urlParams.get('payment_return');
      
      // Verificar si estamos en ruta de pago exitoso
      const isPaymentSuccessRoute = window.location.pathname.includes('pago-exitoso');
      
      console.log('🔍 Verificando retorno de WebPay:', {
        tokenWs,
        pagoExitoso,
        paymentReturn,
        isPaymentSuccessRoute,
        currentPath: window.location.pathname,
        currentSearch: window.location.search,
        fullUrl: window.location.href
      });
      
      if (tokenWs || pagoExitoso === 'exitoso' || paymentReturn === 'true' || isPaymentSuccessRoute) {
        console.log('🎉 ¡Retorno de WebPay detectado! Redirigiendo a página de éxito...');
        
        // Limpiar URL
        window.history.replaceState({}, document.title, window.location.origin);
        
        // Cambiar a página de éxito
        actions.setCurrentPage('payment-success');
        
        // Limpiar carrito si hay datos
        const cartItems = JSON.parse(localStorage.getItem('pendingCart') || '[]');
        if (cartItems.length > 0) {
          actions.clearCart();
          localStorage.removeItem('pendingCart');
          localStorage.removeItem('pendingTotal');
          localStorage.removeItem('pendingUser');
        }
      }
    };

    // Ejecutar detección de retorno
    handleWebpayReturn();
    
  }, [state, actions]);

  // Renderizado condicional de páginas con debugging
  const renderCurrentPage = () => {
    console.log('🎯 Renderizando página:', state.currentPage);
    
    switch (state.currentPage) {
      case 'home':
        return <HomePage />;
      case 'products':
        return <ProductsPage />;
      case 'contact':
        return <ContactPage />;
      case 'admin':
        return <AdminPage />;
      case 'payment-success':
        console.log('✅ Mostrando página de pago exitoso');
        return <PaymentSuccessPage />;
      default:
        console.log('⚠️ Página no reconocida, mostrando home');
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {renderCurrentPage()}
      </main>
      
      {/* Modals */}
      <LoginModal />
      <CartModal />
      
      {/* Indicador de entorno y debugging */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-blue-900 text-white px-3 py-2 rounded-lg text-xs font-mono">
          <div>🧪 SANDBOX | Página: {state.currentPage}</div>
          <div>🛒 Carrito: {state.cart.length} | 👤 {state.isLoggedIn ? 'Logueado' : 'No logueado'}</div>
        </div>
      )}
      
      {process.env.REACT_APP_WEBPAY_ENVIRONMENT === 'sandbox' && (
        <div className="fixed bottom-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded-lg text-sm font-bold">
          🧪 SANDBOX MODE
        </div>
      )}
    </div>
  );
};

// Componente principal con Provider y ErrorBoundary
function App() {
  console.log('🚀 FERREMAS App iniciando...');
  
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;