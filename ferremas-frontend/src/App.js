import React, { useEffect } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import Header from './components/Header';
import LoginModal from './components/LoginModal';
import CartModal from './components/CartModal';
import ProductsPage from './pages/ProductsPage';
import AdminPage from './pages/AdminPage';
import ProductCard from './components/ProductCard';
import { mockData } from './services/api';

// Página de Inicio
const HomePage = () => {
  const { state, actions } = useApp();

  useEffect(() => {
    // Cargar productos si no están cargados
    if (state.products.length === 0) {
      actions.setProducts(mockData.products);
    }
  }, [state.products, actions]);

  const featuredProducts = state.products.filter(product => product.featured);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">FERREMAS</h1>
          <p className="text-xl md:text-2xl mb-4">Tu distribuidora de confianza desde 1980</p>
          <p className="text-lg mb-8 max-w-3xl mx-auto">
            Encuentra todo lo que necesitas para tus proyectos de construcción y ferretería. 
            Trabajamos con las mejores marcas como Bosch, Makita, Stanley y Sika para ofrecerte 
            productos de la más alta calidad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => actions.setCurrentPage('products')}
              className="bg-yellow-500 text-blue-900 px-8 py-3 rounded-lg text-lg font-bold hover:bg-yellow-400 transition-colors"
            >
              Ver Productos
            </button>
            <button 
              onClick={() => actions.setCurrentPage('contact')}
              className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-white hover:text-blue-900 transition-colors"
            >
              Contactar Vendedor
            </button>
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">¿Por qué elegir FERREMAS?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-xl font-bold mb-2">Experiencia desde 1980</h3>
              <p className="text-gray-600">
                Más de 40 años de experiencia en el sector de ferretería y construcción, 
                brindando confianza y calidad a nuestros clientes.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="text-5xl mb-4">📍</div>
              <h3 className="text-xl font-bold mb-2">7 Sucursales</h3>
              <p className="text-gray-600">
                4 sucursales en la Región Metropolitana y 3 en regiones, 
                con planes de expansión en todo Chile para estar más cerca de ti.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="text-5xl mb-4">📦</div>
              <h3 className="text-xl font-bold mb-2">Amplio Inventario</h3>
              <p className="text-gray-600">
                Miles de productos disponibles desde herramientas hasta materiales de construcción, 
                todo lo que necesitas en un solo lugar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Productos Destacados</h2>
            <p className="text-xl text-gray-600">
              Descubre nuestras mejores ofertas y productos más populares
            </p>
          </div>
          
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} featured={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Cargando productos destacados...</p>
            </div>
          )}

          <div className="text-center">
            <button 
              onClick={() => actions.setCurrentPage('products')}
              className="bg-blue-900 text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-blue-800 transition-colors"
            >
              Ver Todos los Productos
            </button>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nuestros Servicios</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">💳</div>
              <h3 className="text-xl font-bold mb-2">Pago Seguro</h3>
              <p className="text-gray-600">
                Múltiples opciones de pago: débito, crédito, transferencia bancaria. 
                Integración con WebPay para mayor seguridad.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-xl font-bold mb-2">Despacho a Domicilio</h3>
              <p className="text-gray-600">
                Entregamos tus productos directamente en tu obra o domicilio. 
                También puedes retirar gratis en cualquiera de nuestras sucursales.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-xl font-bold mb-2">Asesoría Especializada</h3>
              <p className="text-gray-600">
                Nuestro equipo de expertos te ayuda a encontrar exactamente 
                lo que necesitas para tu proyecto.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Página de Contacto
const ContactPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Contacto</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Estamos aquí para ayudarte. Contacta a nuestros especialistas o visita cualquiera de nuestras 7 sucursales.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Información de Contacto */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">📞 Información de Contacto</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <span className="text-blue-900">📞</span>
              <div>
                <p className="font-semibold">Teléfono Principal</p>
                <p className="text-gray-600">+56 2 2345 6789</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-blue-900">✉️</span>
              <div>
                <p className="font-semibold">Email General</p>
                <p className="text-gray-600">contacto@ferremas.cl</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-blue-900">📍</span>
              <div>
                <p className="font-semibold">Casa Matriz</p>
                <p className="text-gray-600">
                  Av. Libertador Bernardo O'Higgins 1234<br />
                  Santiago, Chile
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-blue-900">🕒</span>
              <div>
                <p className="font-semibold">Horarios de Atención</p>
                <p className="text-gray-600">
                  <strong>Lunes a Viernes:</strong> 08:00 - 19:00<br />
                  <strong>Sábados:</strong> 09:00 - 14:00<br />
                  <strong>Domingos:</strong> Cerrado
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sucursales */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">🏪 Nuestras Sucursales</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {[
              { name: 'Casa Matriz - Santiago Centro', address: 'Av. Libertador B. O\'Higgins 1234' },
              { name: 'Sucursal Las Condes', address: 'Av. Apoquindo 4567' },
              { name: 'Sucursal Maipú', address: 'Av. Américo Vespucio 7890' },
              { name: 'Sucursal Puente Alto', address: 'Av. Concha y Toro 1234' },
              { name: 'Sucursal Valparaíso', address: 'Av. Argentina 2345' },
              { name: 'Sucursal Concepción', address: 'Av. O\'Higgins 3456' },
              { name: 'Sucursal La Serena', address: 'Av. Francisco de Aguirre 4567' }
            ].map((sucursal, index) => (
              <div key={index} className="border-b pb-2">
                <h4 className="font-semibold text-blue-900">{sucursal.name}</h4>
                <p className="text-gray-600 text-sm">{sucursal.address}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12 bg-blue-900 text-white rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">¿Tienes un proyecto en mente?</h2>
        <p className="text-lg mb-6">
          Contacta a nuestros especialistas y te ayudamos a encontrar todo lo que necesitas
        </p>
        <div className="space-x-4">
          <button className="bg-yellow-500 text-blue-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors">
            📞 Llamar Ahora
          </button>
          <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-bold hover:bg-white hover:text-blue-900 transition-colors">
            ✉️ Enviar Email
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente interno que usa el contexto
const AppContent = () => {
  const { state, actions } = useApp();

 useEffect(() => {
  // Cargar productos iniciales
  if (state.products.length === 0) {
    actions.setProducts(mockData.products);
  }

  // Verificar si hay un token guardado para mantener la sesión
  const token = localStorage.getItem('token');
  const savedUser = localStorage.getItem('user');
  
  if (token && savedUser && !state.isLoggedIn) {
    try {
      const user = JSON.parse(savedUser);
      actions.setUser(user);
    } catch (error) {
      console.error('Error loading saved user:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  // 🆕 DETECTAR RETORNO DE WEBPAY
  const urlParams = new URLSearchParams(window.location.search);
  const tokenWs = urlParams.get('token_ws');
  const pagoExitoso = urlParams.get('pago');
  
  if (tokenWs || pagoExitoso === 'exitoso') {
    console.log('🎉 Retorno detectado desde Webpay');
    
    // Mostrar mensaje de éxito
    setTimeout(() => {
      alert('🎉 ¡Pago realizado exitosamente!\n\nGracias por tu compra en FERREMAS.\nRecibirás una confirmación por email.');
    }, 500);
    
    // Limpiar carrito
    actions.clearCart();
    
    // Ir a página principal
    actions.setCurrentPage('home');
    
    // Limpiar URL para que no se muestre el parámetro
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}, [state.products, state.isLoggedIn, actions]);

  // Guardar usuario en localStorage cuando cambie
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('user');
    }
  }, [state.user]);

  const renderCurrentPage = () => {
    switch (state.currentPage) {
      case 'home':
        return <HomePage />;
      case 'products':
        return <ProductsPage />;
      case 'contact':
        return <ContactPage />;
      case 'admin':
        return <AdminPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="min-h-screen">
        {renderCurrentPage()}
      </main>
      
      {/* Modales */}
      {state.showLogin && <LoginModal />}
      {state.showCart && <CartModal />}
      
      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-yellow-400 mb-4">FERREMAS</h3>
              <p className="text-gray-300 mb-4">
                Tu distribuidora de confianza desde 1980. Calidad y experiencia en cada producto.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Productos</h4>
              <ul className="space-y-2 text-gray-300">
                <li><button onClick={() => actions.setCategory('herramientas-manuales')} className="hover:text-white">Herramientas Manuales</button></li>
                <li><button onClick={() => actions.setCategory('herramientas-electricas')} className="hover:text-white">Herramientas Eléctricas</button></li>
                <li><button onClick={() => actions.setCategory('materiales-basicos')} className="hover:text-white">Materiales Básicos</button></li>
                <li><button onClick={() => actions.setCategory('acabados')} className="hover:text-white">Pinturas y Acabados</button></li>
                <li><button onClick={() => actions.setCategory('seguridad')} className="hover:text-white">Equipos de Seguridad</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-300">
                <li><button onClick={() => actions.setCurrentPage('home')} className="hover:text-white">Sobre Nosotros</button></li>
                <li><button onClick={() => actions.setCurrentPage('contact')} className="hover:text-white">Sucursales</button></li>
                <li><button onClick={() => actions.setCurrentPage('contact')} className="hover:text-white">Contacto</button></li>
                <li><button className="hover:text-white">Términos y Condiciones</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Atención al Cliente</h4>
              <div className="space-y-2 text-gray-300">
                <p>📞 +56 2 2345 6789</p>
                <p>✉️ contacto@ferremas.cl</p>
                <p className="text-sm">
                  <strong>Horarios:</strong><br />
                  Lun-Vie: 08:00-19:00<br />
                  Sáb: 09:00-14:00
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-blue-700 mt-8 pt-8 text-center">
            <p className="text-gray-300 text-sm">
              &copy; 2024 FERREMAS. Todos los derechos reservados. | Distribuidora de productos de ferretería y construcción desde 1980.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Componente principal con Provider
const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;