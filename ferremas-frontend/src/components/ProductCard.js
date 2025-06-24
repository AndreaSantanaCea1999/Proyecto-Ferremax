import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';

const ProductCard = ({ product, featured = false }) => {
  const { actions } = useApp();
  const [imageError, setImageError] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleAddToCart = () => {
    actions.addToCart(product);
    
    // Feedback visual
    const button = document.getElementById(`add-btn-${product.id}`);
    if (button) {
      const originalText = button.textContent;
      button.textContent = '¡Agregado! ✅';
      button.classList.add('bg-green-600', 'hover:bg-green-700');
      button.classList.remove('bg-blue-900', 'hover:bg-blue-800');
      
      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('bg-green-600', 'hover:bg-green-700');
        button.classList.add('bg-blue-900', 'hover:bg-blue-800');
      }, 1500);
    }
  };

  const getStockStatus = () => {
    if (product.stock === 0) {
      return { text: 'Sin stock', color: 'text-red-600' };
    } else if (product.stock <= 5) {
      return { text: `Últimas ${product.stock} unidades`, color: 'text-orange-600' };
    } else if (product.stock <= 10) {
      return { text: `Stock: ${product.stock} unidades`, color: 'text-yellow-600' };
    } else {
      return { text: `Stock: ${product.stock} unidades`, color: 'text-green-600' };
    }
  };

  const stockStatus = getStockStatus();

  return (
    <>
      <div className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${featured ? 'ring-2 ring-yellow-400' : ''}`}>
        {featured && (
          <div className="bg-yellow-400 text-blue-900 text-xs font-bold px-2 py-1 text-center">
            ⭐ DESTACADO
          </div>
        )}
        
        <div className="relative">
          <img 
            src={imageError ? 'https://via.placeholder.com/300x300/94a3b8/ffffff?text=Sin+Imagen' : product.image} 
            alt={product.name}
            className="w-full h-48 object-cover"
            onError={() => setImageError(true)}
          />
          
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold">AGOTADO</span>
            </div>
          )}
          
          <button 
            onClick={() => setShowDetails(true)}
            className="absolute top-2 right-2 bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-all"
          >
            👁️
          </button>
        </div>

        <div className="p-4">
          <div className="text-sm text-gray-600 mb-1">{product.brand}</div>
          <h3 className="font-bold mb-2 text-gray-900 line-clamp-2">{product.name}</h3>
          
          {product.codigo && (
            <div className="text-xs text-gray-500 mb-2">Código: {product.codigo}</div>
          )}
          
          <div className={`text-sm mb-3 ${stockStatus.color}`}>
            {stockStatus.text}
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-blue-900">
              ${product.price.toLocaleString()}
            </span>
            <button 
              id={`add-btn-${product.id}`}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="bg-blue-900 text-white px-3 py-2 rounded hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center space-x-1"
            >
              🛒 <span>Agregar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal de detalles del producto */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                <button 
                  onClick={() => setShowDetails(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img 
                    src={imageError ? 'https://via.placeholder.com/400x400/94a3b8/ffffff?text=Sin+Imagen' : product.image} 
                    alt={product.name}
                    className="w-full h-64 object-cover rounded-lg"
                    onError={() => setImageError(true)}
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-700">Marca:</h3>
                    <p>{product.brand}</p>
                  </div>
                  
                  {product.codigo && (
                    <div>
                      <h3 className="font-semibold text-gray-700">Código:</h3>
                      <p>{product.codigo}</p>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="font-semibold text-gray-700">Precio:</h3>
                    <p className="text-2xl font-bold text-blue-900">
                      ${product.price.toLocaleString()}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-700">Disponibilidad:</h3>
                    <p className={stockStatus.color}>{stockStatus.text}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-700">Descripción:</h3>
                    <p className="text-gray-600">
                      {product.description || `${product.name} de la marca ${product.brand}. Producto de alta calidad para tus proyectos de construcción y ferretería.`}
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => {
                      handleAddToCart();
                      setShowDetails(false);
                    }}
                    disabled={product.stock === 0}
                    className="w-full bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    🛒 <span>Agregar al Carrito</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;