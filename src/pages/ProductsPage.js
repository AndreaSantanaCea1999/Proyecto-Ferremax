import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import ProductCard from '../components/ProductCard';
import { productService, mockData } from '../services/api';

const ProductsPage = () => {
  const { state, actions } = useApp();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Cargar productos desde API
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        console.log('🔄 Cargando productos desde API...');
        const result = await productService.getProducts();
        
        if (result.success && result.data.length > 0) {
          console.log('✅ Productos cargados desde API:', result.data.length);
          actions.setProducts(result.data);
        } else {
          console.warn('⚠️ API no devolvió productos, usando datos mock');
          actions.setProducts(mockData.products);
        }
      } catch (error) {
        console.error('❌ Error cargando productos:', error);
        console.log('🔄 Fallback a datos mock');
        actions.setProducts(mockData.products);
      } finally {
        setLoading(false);
      }
    };

    // Solo cargar si no hay productos
    if (state.products.length === 0) {
      loadProducts();
    }
  }, [state.products.length, actions]);

  // Filtrar productos
  const filteredProducts = state.products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Categorías disponibles
  const categories = [
    { id: 'all', name: 'Todos los Productos' },
    { id: 'herramientas-manuales', name: 'Herramientas Manuales' },
    { id: 'herramientas-electricas', name: 'Herramientas Eléctricas' },
    { id: 'materiales-construccion', name: 'Materiales de Construcción' },
    { id: 'pinturas', name: 'Pinturas y Acabados' },
    { id: 'seguridad', name: 'Equipos de Seguridad' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Catálogo de Productos FERREMAS
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Encuentra todo lo que necesitas para tus proyectos de construcción y ferretería.
          Trabajamos con las mejores marcas del mercado.
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Búsqueda */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              🔍 Buscar productos
            </label>
            <input
              id="search"
              type="text"
              placeholder="Buscar por nombre o marca..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Categorías */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              📂 Categoría
            </label>
            <select
              id="category"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Resultados */}
        <div className="mt-4 text-sm text-gray-600">
          {loading ? (
            'Cargando productos...'
          ) : (
            `Mostrando ${filteredProducts.length} de ${state.products.length} productos`
          )}
        </div>
      </div>

      {/* Productos */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
          <span className="ml-4 text-gray-600">Cargando productos...</span>
        </div>
      ) : (
        <>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  featured={product.featured}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No se encontraron productos
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 
                  `No hay productos que coincidan con "${searchTerm}"` :
                  'No hay productos en esta categoría'
                }
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors"
              >
                Ver todos los productos
              </button>
            </div>
          )}
        </>
      )}

      {/* Información adicional */}
      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">
            ¿No encuentras lo que buscas?
          </h2>
          <p className="text-blue-800 mb-4">
            Nuestro equipo de especialistas está aquí para ayudarte
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => actions.setCurrentPage('contact')}
              className="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors"
            >
              📞 Contactar Especialista
            </button>
            <button 
              onClick={() => actions.setCurrentPage('contact')}
              className="border-2 border-blue-900 text-blue-900 px-6 py-3 rounded-lg hover:bg-blue-900 hover:text-white transition-colors"
            >
              📧 Solicitar Cotización
            </button>
          </div>
        </div>
      </div>

      {/* Marcas y garantías */}
      <div className="mt-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Trabajamos con las Mejores Marcas
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-center">
          {['Bosch', 'Stanley', 'DeWalt', 'Makita', 'Black & Decker', 'Truper'].map((brand, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="text-2xl mb-2">🏷️</div>
              <p className="font-semibold text-gray-700">{brand}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Beneficios */}
      <div className="mt-12 bg-gradient-to-r from-blue-900 to-blue-700 rounded-lg text-white p-8">
        <h2 className="text-2xl font-bold text-center mb-6">¿Por qué elegir FERREMAS?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-3">🚚</div>
            <h3 className="font-bold mb-2">Entrega Rápida</h3>
            <p className="text-blue-100">Despacho a todo Chile en 24-48 horas</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">🛡️</div>
            <h3 className="font-bold mb-2">Garantía Total</h3>
            <p className="text-blue-100">Garantía en todos nuestros productos</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">👥</div>
            <h3 className="font-bold mb-2">Atención Especializada</h3>
            <p className="text-blue-100">Asesores técnicos especializados</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;