import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { webpayService } from '../services/api';
import WebPayModal from './WebPayModal';

const CartModal = () => {
  const { state, actions, computed } = useApp();
  const [deliveryType, setDeliveryType] = useState('pickup');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showWebpay, setShowWebpay] = useState(false);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity === 0) {
      actions.removeFromCart(productId);
    } else {
      actions.updateCartQuantity(productId, newQuantity);
    }
  };

  const getDeliveryPrice = () => {
    return deliveryType === 'delivery' ? 3990 : 0;
  };

  const getFinalTotal = () => {
    return computed.getTotalPrice() + getDeliveryPrice();
  };


  if (!state.showCart) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">🛒 Carrito de Compras</h2>
          <button onClick={actions.toggleCart}>
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center space-x-2">
            ⚠️ <span>{error}</span>
          </div>
        )}

        {state.cart.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">Tu carrito está vacío</p>
            <button
              onClick={() => {
                actions.toggleCart();
                actions.setCurrentPage('products');
              }}
              className="mt-4 bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors"
            >
              Ver Productos
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Lista de productos */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {state.cart.map(item => (
                <div key={item.id} className="flex items-center space-x-4 border-b pb-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{item.name}</h3>
                    <p className="text-gray-600 text-xs">{item.brand}</p>
                    <p className="font-bold text-blue-900">${item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${(item.price * item.quantity).toLocaleString()}</p>
                    <button
                      onClick={() => actions.removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Opciones de entrega */}
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">Opciones de Entrega:</h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="delivery"
                    value="pickup"
                    checked={deliveryType === 'pickup'}
                    onChange={(e) => setDeliveryType(e.target.value)}
                    className="text-blue-600"
                  />
                  <span>🏪 Retiro en tienda (Gratis)</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="delivery"
                    value="delivery"
                    checked={deliveryType === 'delivery'}
                    onChange={(e) => setDeliveryType(e.target.value)}
                    className="text-blue-600"
                  />
                  <span>🚚 Despacho a domicilio (+$3.990)</span>
                </label>
              </div>
            </div>

            {/* Resumen de costos */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal ({computed.getTotalItems()} productos):</span>
                <span>${computed.getTotalPrice().toLocaleString()}</span>
              </div>
              {deliveryType === 'delivery' && (
                <div className="flex justify-between">
                  <span>Despacho:</span>
                  <span>+${getDeliveryPrice().toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold border-t pt-2">
                <span>Total:</span>
                <span className="text-blue-900">${getFinalTotal().toLocaleString()}</span>
              </div>
            </div>

            {/* Botón de pago - MODIFICADO PARA WEBPAY */}
            <button
              onClick={() => setShowWebpay(true)}
              disabled={loading || !state.isLoggedIn || state.cart.length === 0}
              className="w-full mt-4 bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              💳
              <span>
                {loading ? 'Procesando...' :
                 !state.isLoggedIn ? 'Inicia sesión para pagar' :
                 'Pagar con WebPay'}
              </span>
            </button>

            {!state.isLoggedIn && (
              <p className="text-center text-sm text-gray-600">
                <button
                  onClick={() => {
                    actions.toggleCart();
                    actions.toggleLogin();
                  }}
                  className="text-blue-600 hover:underline"
                >
                  Inicia sesión
                </button> para continuar con tu compra
              </p>
            )}
          </div>
        )}
      </div>

      {/* WebPay Modal */}
      {showWebpay && (
        <WebPayModal
          isOpen={showWebpay}
          onClose={() => setShowWebpay(false)}
          cartItems={state.cart}
          totalAmount={getFinalTotal()}
          userInfo={state.user}
          onPaymentSuccess={(transactionData) => {
            console.log('Pago exitoso:', transactionData);
            actions.clearCart();
            setShowWebpay(false);
            actions.setShowCart(false);
            alert('¡Pago realizado exitosamente!');
          }}
        />
      )}
    </div>
  );
};

export default CartModal;