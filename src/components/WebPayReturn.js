// ==================== COMPONENTE RETORNO WEBPAY ====================
// Archivo: src/components/WebPayReturn.js (CREAR NUEVO)

import React, { useState, useEffect } from 'react';
import { webpayService } from '../services/api';

const WebPayReturn = () => {
  const [estado, setEstado] = useState('procesando');
  const [resultadoPago, setResultadoPago] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    procesarRetornoWebPay();
  }, []);

  const procesarRetornoWebPay = async () => {
    try {
      console.log('🔄 Procesando retorno de WebPay...');
      
      // Obtener token desde URL
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token_ws') || urlParams.get('token');
      
      if (!token) {
        throw new Error('Token de transacción no encontrado');
      }

      console.log('🔑 Token recibido:', token);

      // Confirmar pago con TU backend
      const resultado = await webpayService.confirmTransaction(token);

      if (resultado.success) {
        console.log('✅ Pago confirmado:', resultado.data);
        setResultadoPago(resultado.data);
        setEstado('exitoso');
        
        // Limpiar datos guardados
        localStorage.removeItem('pendingCart');
        localStorage.removeItem('pendingTotal');
        localStorage.removeItem('pendingUser');
        
      } else {
        console.error('❌ Error confirmando pago:', resultado.error);
        setError(resultado.error);
        setEstado('fallido');
      }

    } catch (error) {
      console.error('❌ Error procesando retorno:', error);
      setError(error.message);
      setEstado('error');
    }
  };

  const formatearPeso = (valor) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(valor);
  };

  const irAlInicio = () => {
    window.location.href = '/';
  };

  // ==================== ESTADO: PROCESANDO ====================
  if (estado === 'procesando') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-6xl mb-4">🔄</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Procesando tu pago
            </h2>
            <p className="text-gray-600">
              Estamos confirmando tu transacción con el banco.
              <br />
              Por favor espera un momento...
            </p>
            
            <div className="mt-6 bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Importante:</strong> No cierres esta ventana.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== ESTADO: PAGO EXITOSO ====================
  if (estado === 'exitoso') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header exitoso */}
            <div className="bg-green-600 text-white p-6 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h1 className="text-2xl font-bold">¡Pago Exitoso!</h1>
              <p className="text-green-100 mt-2">
                Tu compra ha sido procesada correctamente
              </p>
            </div>

            {/* Detalles de la transacción */}
            <div className="p-6 space-y-6">
              {resultadoPago && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">💳 Detalles del Pago</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monto pagado:</span>
                      <span className="font-medium">{formatearPeso(resultadoPago.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estado:</span>
                      <span className="font-medium text-green-600">Autorizado</span>
                    </div>
                    {resultadoPago.authorization_code && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Código de Autorización:</span>
                        <span className="font-medium">{resultadoPago.authorization_code}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fecha:</span>
                      <span className="font-medium">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Próximos pasos */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-4">📋 Próximos Pasos</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-center gap-2">
                    <span>✅</span>
                    Tu pago ha sido procesado automáticamente
                  </li>
                  <li className="flex items-center gap-2">
                    <span>📧</span>
                    Recibirás un email de confirmación
                  </li>
                  <li className="flex items-center gap-2">
                    <span>📦</span>
                    Tu pedido entrará en preparación
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🚚</span>
                    Te notificaremos cuando esté listo
                  </li>
                </ul>
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={irAlInicio}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700"
                >
                  🏠 Volver al Inicio
                </button>
                <button
                  onClick={() => window.location.href = '/productos'}
                  className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700"
                >
                  🛒 Seguir Comprando
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== ESTADO: PAGO FALLIDO/ERROR ====================
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header de error */}
          <div className="bg-red-600 text-white p-6 text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold">
              {estado === 'fallido' ? 'Pago Rechazado' : 'Error en el Proceso'}
            </h1>
            <p className="text-red-100 mt-2">
              {estado === 'fallido' 
                ? 'Tu transacción no pudo ser procesada'
                : 'Ocurrió un problema durante el proceso'
              }
            </p>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-yellow-800 mb-2">
                <span>⚠️</span>
                <h3 className="font-semibold">¿Qué pasó?</h3>
              </div>
              <p className="text-sm text-yellow-700">
                {error || 'Tu transacción fue rechazada o cancelada durante el proceso.'}
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-4">💡 ¿Qué puedes hacer?</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Verifica que tu tarjeta tenga fondos suficientes</li>
                <li>• Contacta a tu banco para confirmar que no hay bloqueos</li>
                <li>• Intenta nuevamente con una tarjeta diferente</li>
                <li>• Considera usar transferencia bancaria como alternativa</li>
              </ul>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={irAlInicio}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700"
              >
                🔄 Intentar Nuevamente
              </button>
              <button
                onClick={irAlInicio}
                className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700"
              >
                🏠 Volver al Inicio
              </button>
            </div>

            {/* Información de contacto */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-600">
                Si el problema persiste, contáctanos al{' '}
                <a href="tel:+56223456789" className="text-blue-600 hover:underline">
                  +56 2 2345 6789
                </a>
                {' '}o{' '}
                <a href="mailto:soporte@ferremas.cl" className="text-blue-600 hover:underline">
                  soporte@ferremas.cl
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebPayReturn;