import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { mockData } from '../services/api';

const AdminPanel = () => {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalSales: 0,
    totalCustomers: 0
  });

  // Datos mock para demostración con más órdenes
  const mockOrders = [
    {
      id: 'ORD-001',
      customerName: 'Juan Pérez',
      customerEmail: 'juan@email.com',
      items: [
        { name: 'Martillo Stanley 16oz', quantity: 1, price: 12990 },
        { name: 'Destornillador Phillips', quantity: 2, price: 3990 }
      ],
      total: 20970,
      status: 'por_despachar',
      deliveryType: 'pickup',
      createdAt: '2024-01-15T10:30:00Z',
      paymentStatus: 'paid'
    },
    {
      id: 'ORD-002',
      customerName: 'María González',
      customerEmail: 'maria@email.com',
      items: [
        { name: 'Taladro Percutor Bosch', quantity: 1, price: 89990 }
      ],
      total: 93980,
      status: 'entregado',
      deliveryType: 'delivery',
      createdAt: '2024-01-14T15:45:00Z',
      paymentStatus: 'paid',
      deliveredAt: '2024-01-16T09:00:00Z'
    },
    {
      id: 'ORD-003',
      customerName: 'Carlos Silva',
      customerEmail: 'carlos@email.com',
      items: [
        { name: 'Pintura Látex Blanco 1L', quantity: 3, price: 8990 },
        { name: 'Casco de Seguridad Blanco', quantity: 1, price: 4990 }
      ],
      total: 31960,
      status: 'por_despachar',
      deliveryType: 'pickup',
      createdAt: '2024-01-15T14:20:00Z',
      paymentStatus: 'paid'
    },
    {
      id: 'ORD-004',
      customerName: 'Ana Martínez',
      customerEmail: 'ana@email.com',
      items: [
        { name: 'Sierra Circular Makita', quantity: 1, price: 125990 },
        { name: 'Lentes de Seguridad', quantity: 2, price: 3990 }
      ],
      total: 133970,
      status: 'por_despachar',
      deliveryType: 'delivery',
      createdAt: '2024-01-16T09:15:00Z',
      paymentStatus: 'paid'
    }
  ];

  useEffect(() => {
    loadOrders();
    loadStats();
  }, []);

  const loadOrders = () => {
    setOrders(mockOrders);
  };

  const loadStats = () => {
    const totalOrders = mockOrders.length;
    const pendingOrders = mockOrders.filter(order => order.status === 'por_despachar').length;
    const totalSales = mockOrders.reduce((sum, order) => sum + order.total, 0);
    const totalCustomers = new Set(mockOrders.map(order => order.customerEmail)).size;

    setStats({
      totalOrders,
      pendingOrders,
      totalSales,
      totalCustomers
    });
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, deliveredAt: newStatus === 'entregado' ? new Date().toISOString() : order.deliveredAt }
        : order
    ));
    
    // Recalcular estadísticas
    setTimeout(loadStats, 100);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'por_despachar':
        return '⏳';
      case 'en_preparacion':
        return '📦';
      case 'en_camino':
        return '🚚';
      case 'entregado':
        return '✅';
      default:
        return '❓';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'por_despachar':
        return 'Por Despachar';
      case 'en_preparacion':
        return 'En Preparación';
      case 'en_camino':
        return 'En Camino';
      case 'entregado':
        return 'Entregado';
      default:
        return 'Desconocido';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (state.user?.type !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Acceso Denegado:</strong> No tienes permisos para acceder a esta sección.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
        <p className="text-gray-600">Gestiona pedidos y ventas de FERREMAS</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="text-2xl mr-4">🛍️</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pedidos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="text-2xl mr-4">⏳</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="text-2xl mr-4">💰</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Ventas Totales</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalSales.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="text-2xl mr-4">👥</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Clientes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'orders'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              📋 Pedidos
            </button>
            <button
              onClick={() => setActiveTab('sales')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sales'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              📊 Registro de Ventas
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Gestión de Pedidos</h2>
              
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg">Pedido #{order.id}</h3>
                        <p className="text-gray-600">{order.customerName} - {order.customerEmail}</p>
                        <p className="text-sm text-gray-500">
                          Creado: {formatDate(order.createdAt)}
                        </p>
                        {order.deliveredAt && (
                          <p className="text-sm text-green-600">
                            Entregado: {formatDate(order.deliveredAt)}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{getStatusIcon(order.status)}</span>
                        <span className="font-medium">{getStatusText(order.status)}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Productos:</h4>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.name} x{item.quantity}</span>
                            <span>${(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">
                          Entrega: {order.deliveryType === 'pickup' ? '🏪 Retiro en tienda' : '🚚 Despacho a domicilio'}
                        </p>
                        <p className="font-bold">Total: ${order.total.toLocaleString()}</p>
                      </div>
                      
                      {order.status === 'por_despachar' && (
                        <div className="space-x-2">
                          <button
                            onClick={() => updateOrderStatus(order.id, 'en_preparacion')}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                          >
                            📦 Marcar en Preparación
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'entregado')}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                          >
                            ✅ Marcar como Entregado
                          </button>
                        </div>
                      )}
                      
                      {order.status === 'en_preparacion' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'entregado')}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                        >
                          ✅ Marcar como Entregado
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'sales' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Registro de Ventas</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pedido
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.customerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          ${order.total.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{getStatusIcon(order.status)}</span>
                            <span className="text-sm">{getStatusText(order.status)}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-bold text-blue-900 mb-2">📈 Resumen de Ventas</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Total de Pedidos:</span>
                    <span className="ml-2 font-bold">{stats.totalOrders}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Ventas Totales:</span>
                    <span className="ml-2 font-bold">${stats.totalSales.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Promedio por Pedido:</span>
                    <span className="ml-2 font-bold">
                      ${stats.totalOrders > 0 ? Math.round(stats.totalSales / stats.totalOrders).toLocaleString() : '0'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;