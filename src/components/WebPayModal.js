import React, { useState, useEffect } from 'react';
import { webpayService, formatUtils } from '../services/api';

const WebPayModal = ({ isOpen, onClose, cartItems, totalAmount, onPaymentSuccess, userInfo }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('confirm'); // confirm, processing, redirect, error
  const [transactionData, setTransactionData] = useState(null);

  // Cerrar modal al hacer click fuera o Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    const handleClickOutside = (e) => {
      if (e.target.classList.contains('webpay-modal-backdrop')) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('click', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Resetear estado al abrir modal
  useEffect(() => {
    if (isOpen) {
      setStep('confirm');
      setError('');
      setTransactionData(null);
      setLoading(false);
    }
  }, [isOpen]);

  const handlePayment = async () => {
    setLoading(true);
    setError('');
    setStep('processing');

    try {
      // Validaciones previas
      if (!userInfo || !cartItems || cartItems.length === 0 || totalAmount <= 0) {
        throw new Error('Datos de pago incompletos');
      }

      // Guardar datos temporalmente para el retorno
      localStorage.setItem('pendingCart', JSON.stringify(cartItems));
      localStorage.setItem('pendingTotal', JSON.stringify(totalAmount));
      localStorage.setItem('pendingUser', JSON.stringify(userInfo));

      // Preparar datos de la transacción
      const transactionPayload = {
        amount: totalAmount,
        buyOrder: formatUtils.generateOrderId(),
        sessionId: `SES_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        returnUrl: `${window.location.origin}?payment_return=true`
      };

      console.log('🔄 Iniciando pago con Webpay:', transactionPayload);

      // Crear transacción en Webpay
      const result = await webpayService.createTransaction(transactionPayload);

      if (result.success && result.data) {
        setTransactionData(result.data);
        setStep('redirect');
        
        // Mostrar información antes de redirigir
        setTimeout(() => {
          redirectToWebpay(result.data);
        }, 3000);

      } else {
        throw new Error(result.error?.message || 'Error al crear la transacción con Webpay');
      }

    } catch (error) {
      console.error('❌ Error en el pago:', error);
      setError(error.message || 'Error al procesar el pago');
      setStep('error');
      
      // Limpiar datos temporales en caso de error
      localStorage.removeItem('pendingCart');
      localStorage.removeItem('pendingTotal');
      localStorage.removeItem('pendingUser');
    } finally {
      setLoading(false);
    }
  };

  const redirectToWebpay = (data) => {
    try {
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

      console.log('🚀 Redirigiendo a Webpay:', data.url);

      // Redirigir a Webpay
      form.submit();
    } catch (error) {
      console.error('❌ Error en redirección:', error);
      setError('Error al redirigir a Webpay');
      setStep('error');
    }
  };

  const handleRetry = () => {
    setStep('confirm');
    setError('');
    setTransactionData(null);
    setLoading(false);
  };

  const handleManualRedirect = () => {
    if (transactionData) {
      redirectToWebpay(transactionData);
    }
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
                Procesa tu pago de forma segura con Transbank
              </p>
            </div>

            {/* Resumen del pedido */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">📋 Resumen del Pedido</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Productos ({cartItems?.length || 0}):</span>
                  <span>${(totalAmount || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2">
                  <span>Total a pagar:</span>
                  <span className="text-blue-900">${(totalAmount || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Información del usuario */}
            {userInfo && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">👤 Datos del Cliente</h3>
                <p className="text-blue-800 text-sm">
                  <strong>Nombre:</strong> {userInfo.name || userInfo.email}
                </p>
                <p className="text-blue-800 text-sm">
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
                disabled={loading || !userInfo || !cartItems || cartItems.length === 0}
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
            <p className="text-sm text-gray-500">
              Por favor, no cierres esta ventana
            </p>
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
                <h3 className="font-semibold text-green-900 mb-2">✅ Datos de la Transacción</h3>
                <div className="text-green-800 text-sm space-y-1">
                  <p><strong>Orden:</strong> {transactionData.buy_order}</p>
                  <p><strong>Monto:</strong> ${(transactionData.amount || 0).toLocaleString()}</p>
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
              Si no eres redirigido automáticamente en 5 segundos,{' '}
              <button 
                onClick={handleManualRedirect}
                className="text-blue-600 hover:underline font-medium"
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
            
            <div className="text-sm text-gray-600 space-y-2">
              <p>Posibles soluciones:</p>
              <ul className="list-disc list-inside text-left">
                <li>Verifica tu conexión a internet</li>
                <li>Asegúrate de tener fondos suficientes</li>
                <li>Intenta con otra tarjeta</li>
                <li>Contacta a nuestro soporte si persiste</li>
              </ul>
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
                Reintentar Pago
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="webpay-modal-backdrop fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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