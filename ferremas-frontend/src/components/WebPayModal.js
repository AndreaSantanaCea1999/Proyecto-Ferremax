import React, { useState, useEffect } from 'react';
import { webpayService, formatUtils } from '../services/api';

const WebPayModal = ({ isOpen, onClose, cartItems, totalAmount, onPaymentSuccess, userInfo }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('confirm'); // confirm, processing, success, error
  const [transactionData, setTransactionData] = useState(null);

  // Cerrar modal al hacer click fuera
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Resetear estado al abrir modal
  useEffect(() => {
    if (isOpen) {
      setStep('confirm');
      setError('');
      setTransactionData(null);
    }
  }, [isOpen]);

  const handlePayment = async () => {
    setLoading(true);
    setError('');
    setStep('processing');

    try {
      // Preparar datos de la transacción
      const transactionPayload = {
        amount: totalAmount,
        buyOrder: formatUtils.generateOrderId(),
        sessionId: `SES_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        returnUrl: `${window.location.origin}?pago=exitoso`
      };

      console.log('🔄 Iniciando pago con Webpay:', transactionPayload);

      // Crear transacción en Webpay
      const result = await webpayService.createTransaction(transactionPayload);

      if (result.success && result.data) {
        setTransactionData(result.data);
        
        // Mostrar información antes de redirigir
        setStep('redirect');
        
        // Crear formulario para redirigir a Webpay
        setTimeout(() => {
          redirectToWebpay(result.data);
        }, 3000);

      } else {
        throw new Error(result.error?.message || 'Error al crear la transacción');
      }

    } catch (error) {
      console.error('❌ Error en el pago:', error);
      setError(error.message || 'Error al procesar el pago');
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  const redirectToWebpay = (data) => {
    // Crear formulario para redirección automática
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = data.url;
    form.style.display = 'none';

    const tokenInput = document.createElement('input');
    tokenInput.type = 'hidden';
    tokenInput.name = 'token_ws';
    tokenInput.value = data.token;

    form.appendChild(tokenInput);
    document.body.appendChild(form);

    // Redirigir a Webpay
    form.submit();
  };

  const handleRetry = () => {
    setStep('confirm');
    setError('');
    setTransactionData(null);
  };

  if (!isOpen) return null;

  const renderStep = () => {
    switch (step) {
      case 'confirm':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
              <div className="text-6xl mb-4">💳</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Confirmar Pago con Webpay
              </h2>
              <p className="text-gray-600">
                Serás redirigido al portal seguro de Transbank
              </p>
            </div>

            {/* Resumen del pedido */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Resumen del Pedido</h3>
              
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <div className="flex-1">
                      <span className="text-gray-900">{item.name}</span>
                      <span className="text-gray-500 ml-2">x{item.quantity}</span>
                    </div>
                    <span className="font-medium">
                      {formatUtils.formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total a Pagar:</span>
                  <span className="text-blue-900">
                    {formatUtils.formatPrice(totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Información del cliente */}
            {userInfo && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Información del Cliente</h3>
                <p className="text-blue-800">
                  <strong>Nombre:</strong> {userInfo.name}
                </p>
                <p className="text-blue-800">
                  <strong>Email:</strong> {userInfo.email}
                </p>
              </div>
            )}

            {/* Información de seguridad */}
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">🔒 Pago Seguro</h3>
              <ul className="text-green-800 text-sm space-y-1">
                <li>✓ Conexión SSL encriptada</li>
                <li>✓ Procesado por Transbank</li>
                <li>✓ Tarjetas Visa, Mastercard, American Express</li>
                <li>✓ Débito y crédito</li>
              </ul>
            </div>

            {/* Error si existe */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <span className="text-red-500 text-xl mr-2">⚠️</span>
                  <span className="text-red-800">{error}</span>
                </div>
              </div>
            )}

            {/* Botones */}
            <div className="flex space-x-4">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                onClick={handlePayment}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Procesando...' : 'Pagar con Webpay'}
              </button>
            </div>
          </div>
        );

      case 'processing':
        return (
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">⏳</div>
            <h2 className="text-2xl font-bold text-gray-900">
              Procesando Pago...
            </h2>
            <p className="text-gray-600">
              Estamos creando tu transacción segura con Webpay
            </p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
            </div>
          </div>
        );

      case 'redirect':
        return (
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-2xl font-bold text-gray-900">
              ¡Transacción Creada!
            </h2>
            <p className="text-gray-600">
              Redirigiendo al portal seguro de Webpay...
            </p>
            
            {transactionData && (
              <div className="bg-green-50 rounded-lg p-4 text-left">
                <h3 className="font-semibold text-green-900 mb-2">Datos de la Transacción</h3>
                <div className="text-green-800 text-sm space-y-1">
                  <p><strong>Orden:</strong> {transactionData.buy_order}</p>
                  <p><strong>Monto:</strong> {formatUtils.formatPrice(transactionData.amount)}</p>
                  <p><strong>Token:</strong> {transactionData.token?.substring(0, 20)}...</p>
                </div>
              </div>
            )}

            <div className="flex justify-center space-x-2">
              <div className="animate-bounce">🔒</div>
              <div className="animate-bounce" style={{animationDelay: '0.1s'}}>💳</div>
              <div className="animate-bounce" style={{animationDelay: '0.2s'}}>✨</div>
            </div>

            <p className="text-sm text-gray-500">
              Si no eres redirigido automáticamente, 
              <button 
                onClick={() => redirectToWebpay(transactionData)}
                className="text-blue-600 hover:underline ml-1"
              >
                haz clic aquí
              </button>
            </p>
          </div>
        );

      case 'error':
        return (
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-red-900">
              Error en el Pago
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={handleRetry}
                className="flex-1 px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default WebPayModal;