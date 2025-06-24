import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';

const PaymentSuccessPage = () => {
  const { actions } = useApp();
  const [purchaseData, setPurchaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar datos de la compra desde localStorage
    const loadPurchaseData = () => {
      try {
        const cartItems = JSON.parse(localStorage.getItem('pendingCart') || '[]');
        const totalAmount = JSON.parse(localStorage.getItem('pendingTotal') || '0');
        const userData = JSON.parse(localStorage.getItem('pendingUser') || '{}');
        
        if (cartItems.length > 0) {
          setPurchaseData({
            items: cartItems,
            total: totalAmount,
            user: userData,
            orderNumber: `FERR-${Date.now().toString().slice(-8)}`,
            date: new Date().toLocaleDateString('es-CL'),
            time: new Date().toLocaleTimeString('es-CL')
          });
        }
      } catch (error) {
        console.error('Error cargando datos de compra:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPurchaseData();

    // Limpiar datos después de 5 minutos para seguridad
    const cleanup = setTimeout(() => {
      localStorage.removeItem('pendingCart');
      localStorage.removeItem('pendingTotal');
      localStorage.removeItem('pendingUser');
    }, 5 * 60 * 1000);

    return () => clearTimeout(cleanup);
  }, []);

  const handleContinueShopping = () => {
    actions.setCurrentPage('products');
  };

  const handleGoHome = () => {
    actions.setCurrentPage('home');
  };

  const generateInvoiceNumber = () => {
    return `FERR-${Date.now().toString().slice(-8)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-green-600">Cargando información de tu compra...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          
          {/* Mensaje principal de éxito */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center mb-6">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-green-800 mb-4">
              ¡Pago Exitoso!
            </h1>
            <p className="text-green-600 text-lg mb-2">
              Tu compra ha sido procesada correctamente
            </p>
            <p className="text-gray-600">
              Recibirás una confirmación por email en los próximos minutos
            </p>
          </div>

          {/* Detalles de la compra */}
          {purchaseData && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">📋 Resumen de tu Compra</h2>
              
              {/* Información del pedido */}
              <div className="border-b pb-4 mb-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Número de Orden:</p>
                    <p className="font-semibold">{purchaseData.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Fecha:</p>
                    <p className="font-semibold">{purchaseData.date} - {purchaseData.time}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Cliente:</p>
                    <p className="font-semibold">{purchaseData.user.name || purchaseData.user.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Email:</p>
                    <p className="font-semibold">{purchaseData.user.email}</p>
                  </div>
                </div>
              </div>

              {/* Productos comprados */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-3">Productos Comprados:</h3>
                <div className="space-y-2">
                  {purchaseData.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.brand}</p>
                        <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${(item.price * item.quantity).toLocaleString()}</p>
                        <p className="text-sm text-gray-500">${item.price.toLocaleString()} c/u</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Pagado:</span>
                  <span className="text-green-600">${purchaseData.total.toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Pagado con WebPay (Transbank)</p>
              </div>
            </div>
          )}

          {/* Información importante */}
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-blue-900 mb-3">📌 Información Importante</h3>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li className="flex items-start">
                <span className="mr-2">📧</span>
                <span>Recibirás una confirmación por email con los detalles de tu compra</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🚚</span>
                <span>Tu pedido será procesado en las próximas 24 horas hábiles</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📞</span>
                <span>Para consultas, contacta a nuestro soporte: +56 2 2345 6789</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🏪</span>
                <span>También puedes contactarnos en cualquiera de nuestras sucursales</span>
              </li>
            </ul>
          </div>

          {/* Próximos pasos */}
          <div className="bg-yellow-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-yellow-900 mb-3">⏭️ Próximos Pasos</h3>
            <ol className="space-y-2 text-yellow-800 text-sm list-decimal list-inside">
              <li>Te enviaremos un email de confirmación</li>
              <li>Prepararemos tu pedido en nuestras bodegas</li>
              <li>Te contactaremos para coordinar la entrega</li>
              <li>Recibirás tus productos en la dirección indicada</li>
            </ol>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleContinueShopping}
              className="flex-1 bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors font-medium"
            >
              🛒 Seguir Comprando
            </button>
            <button
              onClick={handleGoHome}
              className="flex-1 border-2 border-blue-900 text-blue-900 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              🏠 Volver al Inicio
            </button>
          </div>

          {/* Footer con información de soporte */}
          <div className="text-center mt-8 text-gray-600 text-sm">
            <p>¿Necesitas ayuda? Contacta nuestro soporte:</p>
            <p className="font-medium">📞 +56 2 2345 6789 | ✉️ soporte@ferremas.cl</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;