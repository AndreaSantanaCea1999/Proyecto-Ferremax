import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import ProductCard from '../components/ProductCard';
import { inventarioService, mockData } from '../services/api';

const ProductsPage = () => {
  const { state, actions } = useApp();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Cargar productos desde API Inventario
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        console.log('🔄 Cargando productos desde API Inventario...');
        const result = await inventarioService.getProducts();
        
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

    // Solo cargar si no hay productos o hay pocos productos
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
    { id: 'materiales-basicos', name: 'Materiales Básicos' },
    { id: 'acabados', name: 'Pinturas y Acabados' },
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
              Buscar productos
            </label>
            <input
              type="text"
              id="search"
              placeholder="Buscar por nombre o marca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Categorías */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Información de resultados */}
        <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
          <span>
            {loading ? 'Cargando productos...' : `${filteredProducts.length} productos encontrados`}
          </span>
          
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-blue-600 hover:text-blue-800"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
          <p className="mt-4 text-gray-600">Cargando productos desde la API...</p>
        </div>
      )}

      {/* Grid de productos */}
      {!loading && (
        <>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  showAddToCart={true}
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
            <button className="border-2 border-blue-900 text-blue-900 px-6 py-3 rounded-lg hover:bg-blue-900 hover:text-white transition-colors">
              📧 Solicitar Cotización
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;