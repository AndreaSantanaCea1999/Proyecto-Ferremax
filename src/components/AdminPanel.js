// ==================== ADMIN PANEL MEJORADO ====================
// Archivo: src/components/AdminPanel.js (REEMPLAZAR COMPLETAMENTE)

import React, { useState, useEffect } from 'react';
import { 
  reportesService, 
  ventasService, 
  inventarioService, 
  bancoService,
  formatUtils 
} from '../services/api';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [reporteVentas, setReporteVentas] = useState(null);
  const [reporteInventario, setReporteInventario] = useState(null);
  const [ordenes, setOrdenes] = useState([]);
  const [tipoCambio, setTipoCambio] = useState(null);
  const [periodoReporte, setPeriodoReporte] = useState('mes');

  useEffect(() => {
    cargarDashboard();
  }, []);

  const cargarDashboard = async () => {
    setLoading(true);
    try {
      console.log('📊 Cargando dashboard administrativo...');
      
      // Cargar datos en paralelo
      const [ventasResult, inventarioResult, ordenesResult, cambioResult] = await Promise.all([
        reportesService.getVentasReporte(periodoReporte),
        reportesService.getInventarioReporte(),
        ventasService.getAllOrders(),
        bancoService.getExchangeRate()
      ]);

      if (ventasResult.success) setReporteVentas(ventasResult.data);
      if (inventarioResult.success) setReporteInventario(inventarioResult.data);
      if (ordenesResult.success) setOrdenes(ordenesResult.data);
      if (cambioResult.success) setTipoCambio(cambioResult.data);

      console.log('✅ Dashboard cargado correctamente');
    } catch (error) {
      console.error('❌ Error cargando dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const actualizarPeriodo = async (nuevoPeriodo) => {
    setPeriodoReporte(nuevoPeriodo);
    setLoading(true);
    
    const ventasResult = await reportesService.getVentasReporte(nuevoPeriodo);
    if (ventasResult.success) {
      setReporteVentas(ventasResult.data);
    }
    setLoading(false);
  };

  const actualizarEstadoOrden = async (ordenId, nuevoEstado) => {
    setLoading(true);
    const result = await ventasService.updateOrderStatus(ordenId, nuevoEstado);
    if (result.success) {
      setOrdenes(ordenes.map(orden => 
        orden.id === ordenId ? { ...orden, estado: nuevoEstado } : orden
      ));
      console.log(`✅ Orden ${ordenId} actualizada a: ${nuevoEstado}`);
    } else {
      alert('Error actualizando orden: ' + result.error);
    }
    setLoading(false);
  };

  const exportarReporte = (tipo) => {
    const data = tipo === 'ventas' ? reporteVentas : reporteInventario;
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte_${tipo}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // ==================== DASHBOARD TAB ====================
  const DashboardTab = () => (
    <div className="space-y-6">
      {/* Header con controles */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">📊 Dashboard Administrativo</h2>
        <div className="flex gap-4">
          <select 
            value={periodoReporte} 
            onChange={(e) => actualizarPeriodo(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="semana">Última Semana</option>
            <option value="mes">Este Mes</option>
            <option value="año">Este Año</option>
          </select>
          <button 
            onClick={cargarDashboard}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {loading ? '🔄 Cargando...' : '🔄 Actualizar'}
          </button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">💰 Ventas {periodoReporte}</p>
              <p className="text-2xl font-bold text-green-600">
                {reporteVentas ? formatUtils.formatPrice(reporteVentas.totalVentas) : 'Cargando...'}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {reporteVentas && `${reporteVentas.cantidadOrdenes} órdenes procesadas`}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">📦 Productos en Stock</p>
              <p className="text-2xl font-bold text-blue-600">
                {reporteInventario ? reporteInventario.totalProductos : 'Cargando...'}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {reporteInventario && `Valor: ${formatUtils.formatPrice(reporteInventario.valorInventario)}`}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">🕒 Órdenes Pendientes</p>
              <p className="text-2xl font-bold text-orange-600">
                {ordenes.filter(o => o.estado === 'pendiente' || o.estado === 'pendiente_pago').length}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Requieren atención inmediata
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">💵 Tipo de Cambio USD</p>
              <p className="text-2xl font-bold text-purple-600">
                {tipoCambio ? `$${tipoCambio.rate.toFixed(0)}` : 'Cargando...'}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {tipoCambio && formatUtils.formatDate(tipoCambio.date)}
          </p>
        </div>
      </div>

      {/* Alertas de Stock Bajo */}
      {reporteInventario && reporteInventario.alertasStock.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-yellow-800">
            <span>⚠️</span>
            <h3 className="font-semibold">Alertas de Stock Bajo</h3>
          </div>
          <div className="mt-2 space-y-1">
            {reporteInventario.alertasStock.map(producto => (
              <p key={producto.id} className="text-sm text-yellow-700">
                📦 {producto.name} - Solo {producto.stock} unidades restantes
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Órdenes Recientes */}
      <div className="bg-white rounded-lg shadow-md border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">🛒 Órdenes Recientes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ordenes.slice(0, 10).map((orden) => (
                <tr key={orden.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{orden.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {orden.cliente?.email || 'Cliente anónimo'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatUtils.formatPrice(orden.total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      orden.estado === 'pagado' ? 'bg-green-100 text-green-800' :
                      orden.estado === 'pendiente_pago' ? 'bg-yellow-100 text-yellow-800' :
                      orden.estado === 'enviado' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {orden.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatUtils.formatDate(orden.fecha)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <select 
                      value={orden.estado}
                      onChange={(e) => actualizarEstadoOrden(orden.id, e.target.value)}
                      className="border rounded px-2 py-1 text-xs"
                    >
                      <option value="pendiente_pago">Pendiente Pago</option>
                      <option value="pagado">Pagado</option>
                      <option value="en_preparacion">En Preparación</option>
                      <option value="enviado">Enviado</option>
                      <option value="entregado">Entregado</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ==================== REPORTES TAB ====================
  const ReportesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">📈 Reportes y Análisis</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => exportarReporte('ventas')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            📊 Exportar Ventas
          </button>
          <button 
            onClick={() => exportarReporte('inventario')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            📦 Exportar Inventario
          </button>
        </div>
      </div>

      {/* Reporte de Ventas */}
      {reporteVentas && (
        <div className="bg-white rounded-lg shadow-md border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            💰 Reporte de Ventas - {reporteVentas.periodo}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Vendido</p>
              <p className="text-xl font-bold text-green-600">
                {formatUtils.formatPrice(reporteVentas.totalVentas)}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Órdenes Procesadas</p>
              <p className="text-xl font-bold text-blue-600">
                {reporteVentas.cantidadOrdenes}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Promedio por Venta</p>
              <p className="text-xl font-bold text-purple-600">
                {formatUtils.formatPrice(reporteVentas.promedioVenta)}
              </p>
            </div>
          </div>
          
          <div className="text-xs text-gray-500">
            📅 Reporte generado: {formatUtils.formatDate(reporteVentas.generado)}
          </div>
        </div>
      )}

      {/* Reporte de Inventario */}
      {reporteInventario && (
        <div className="bg-white rounded-lg shadow-md border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📦 Reporte de Inventario
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Productos</p>
              <p className="text-xl font-bold text-blue-600">
                {reporteInventario.totalProductos}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Stock Total</p>
              <p className="text-xl font-bold text-green-600">
                {reporteInventario.stockTotal} unidades
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Valor Inventario</p>
              <p className="text-xl font-bold text-purple-600">
                {formatUtils.formatPrice(reporteInventario.valorInventario)}
              </p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-600">Stock Bajo</p>
              <p className="text-xl font-bold text-red-600">
                {reporteInventario.productosStockBajo} productos
              </p>
            </div>
          </div>
          
          <div className="text-xs text-gray-500">
            📅 Reporte generado: {formatUtils.formatDate(reporteInventario.generado)}
          </div>
        </div>
      )}

      {/* Conversión de Divisas */}
      {tipoCambio && (
        <div className="bg-white rounded-lg shadow-md border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            💱 Información de Divisas (Expansión Internacional)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Tipo de Cambio Actual</h4>
              <p className="text-2xl font-bold text-blue-600">
                1 USD = ${tipoCambio.rate.toFixed(2)} CLP
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Actualizado: {formatUtils.formatDate(tipoCambio.date)}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">Ventas Internacionales</h4>
              {reporteVentas && (
                <div className="space-y-2">
                  <p className="text-sm text-green-700">
                    Ventas en USD: ${(reporteVentas.totalVentas / tipoCambio.rate).toFixed(2)}
                  </p>
                  <p className="text-sm text-green-700">
                    Promedio en USD: ${(reporteVentas.promedioVenta / tipoCambio.rate).toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ==================== RENDER PRINCIPAL ====================
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Navegación de pestañas */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setActiveTab('reportes')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reportes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              📈 Reportes
            </button>
          </nav>
        </div>

        {/* Contenido de pestañas */}
        {loading && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🔄</div>
            <p className="text-gray-600">Cargando datos del dashboard...</p>
          </div>
        )}

        {!loading && activeTab === 'dashboard' && <DashboardTab />}
        {!loading && activeTab === 'reportes' && <ReportesTab />}
      </div>
    </div>
  );
};

export default AdminPanel;