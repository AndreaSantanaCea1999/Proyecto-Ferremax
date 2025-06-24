import React from 'react';
import { useApp } from '../contexts/AppContext';

const PaymentSuccessPage = () => {
  const { actions } = useApp();

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-green-800 mb-4">
          ¡Pago Exitoso!
        </h1>
        <p className="text-green-600 mb-6">
          Tu pago ha sido procesado correctamente con Webpay.
          Recibirás una confirmación por email.
        </p>
        <button
          onClick={() => actions.setCurrentPage('home')}
          className="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors"
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;