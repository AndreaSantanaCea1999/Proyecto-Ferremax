import React, { useEffect } from 'react';
import { MapPin, Package, CreditCard, Star, Award, Truck } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import ProductCard from '../components/ProductCard';
import { mockData } from '../services/api';

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
              <Award className="mx-auto mb-4 text-blue-900" size={48} />
              <h3 className="text-xl font-bold mb-2">Experiencia desde 1980</h3>
              <p className="text-gray-600">
                Más de 40 años de experiencia en el sector de ferretería y construcción, 
                brindando confianza y calidad a nuestros clientes.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <MapPin className="mx-auto mb-4 text-blue-900" size={48} />
              <h3 className="text-xl font-bold mb-2">7 Sucursales</h3>
              <p className="text-gray-600">
                4 sucursales en la Región Metropolitana y 3 en regiones, 
                con planes de expansión en todo Chile para estar más cerca de ti.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <Package className="mx-auto mb-4 text-blue-900" size={48} />
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

      {/* Marcas */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Marcas de Confianza</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-2xl font-bold text-blue-600">BOSCH</h3>
              <p className="text-sm text-gray-600">Herramientas Eléctricas</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-2xl font-bold text-teal-600">MAKITA</h3>
              <p className="text-sm text-gray-600">Herramientas Profesionales</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-2xl font-bold text-yellow-600">STANLEY</h3>
              <p className="text-sm text-gray-600">Herramientas Manuales</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-2xl font-bold text-red-600">SIKA</h3>
              <p className="text-sm text-gray-600">Pinturas y Acabados</p>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nuestros Servicios</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <CreditCard className="mx-auto mb-4 text-blue-900" size={48} />
              <h3 className="text-xl font-bold mb-2">Pago Seguro</h3>
              <p className="text-gray-600">
                Múltiples opciones de pago: débito, crédito, transferencia bancaria. 
                Integración con WebPay para mayor seguridad.
              </p>
            </div>
            <div className="text-center">
              <Truck className="mx-auto mb-4 text-blue-900" size={48} />
              <h3 className="text-xl font-bold mb-2">Despacho a Domicilio</h3>
              <p className="text-gray-600">
                Entregamos tus productos directamente en tu obra o domicilio. 
                También puedes retirar gratis en cualquiera de nuestras sucursales.
              </p>
            </div>
            <div className="text-center">
              <Star className="mx-auto mb-4 text-blue-900" size={48} />
              <h3 className="text-xl font-bold mb-2">Asesoría Especializada</h3>
              <p className="text-gray-600">
                Nuestro equipo de expertos te ayuda a encontrar exactamente 
                lo que necesitas para tu proyecto.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Tienes un proyecto en mente?</h2>
          <p className="text-xl mb-8">
            Contacta a nuestros especialistas y te ayudamos a encontrar todo lo que necesitas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => actions.setCurrentPage('contact')}
              className="bg-yellow-500 text-blue-900 px-8 py-3 rounded-lg text-lg font-bold hover:bg-yellow-400 transition-colors"
            >
              Contactar Especialista
            </button>
            <button 
              onClick={() => actions.setCurrentPage('products')}
              className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-white hover:text-blue-900 transition-colors"
            >
              Explorar Catálogo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;