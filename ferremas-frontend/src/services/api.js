import axios from 'axios';

// URLs de las APIs desde variables de entorno
const API_URLS = {
  inventario: process.env.REACT_APP_API_INVENTARIO || 'http://localhost:3000/api',
  ventas: process.env.REACT_APP_API_VENTAS || 'http://localhost:3001/api',
  transbank: process.env.REACT_APP_API_TRANSBANK || 'http://localhost:3003/api'
};

// Configuración de axios con timeouts
const createApiClient = (baseURL) => {
  const client = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Interceptor para manejo de errores
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error(`API Error (${baseURL}):`, error.response?.data || error.message);
      return Promise.reject(error);
    }
  );

  return client;
};

// Clientes API
const apiInventario = createApiClient(API_URLS.inventario);
const apiVentas = createApiClient(API_URLS.ventas);
const apiTransbank = createApiClient(API_URLS.transbank);

// ==================== API INVENTARIO (Puerto 3000) ====================

export const inventarioService = {
  // Obtener todos los productos
  async getProducts() {
    try {
      const response = await apiInventario.get('/productos');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        data: []
      };
    }
  },

  // Obtener producto por ID
  async getProductById(id) {
    try {
      const response = await apiInventario.get(`/productos/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  },

  // Obtener productos por categoría
  async getProductsByCategory(category) {
    try {
      const response = await apiInventario.get(`/productos/categoria/${category}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        data: []
      };
    }
  },

  // Obtener categorías
  async getCategories() {
    try {
      const response = await apiInventario.get('/categorias');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        data: []
      };
    }
  },

  // Verificar stock
  async checkStock(productId, quantity) {
    try {
      const response = await apiInventario.get(`/productos/${productId}/stock`);
      const available = response.data.stock >= quantity;
      return {
        success: true,
        available,
        currentStock: response.data.stock
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        available: false
      };
    }
  }
};

// ==================== API VENTAS (Puerto 3001) ====================

export const ventasService = {
  // Crear nuevo pedido
  async createOrder(orderData) {
    try {
      const response = await apiVentas.post('/pedidos', orderData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  },

  // Obtener pedidos del usuario
  async getUserOrders(userId) {
    try {
      const response = await apiVentas.get(`/pedidos/usuario/${userId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        data: []
      };
    }
  },

  // Actualizar estado del pedido
  async updateOrderStatus(orderId, status) {
    try {
      const response = await apiVentas.put(`/pedidos/${orderId}/estado`, { status });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  },

  // Registrar venta completada
  async registerSale(saleData) {
    try {
      const response = await apiVentas.post('/ventas', saleData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }
};

// ==================== API TRANSBANK/WEBPAY (Puerto 3003) ====================

export const webpayService = {
  // Crear transacción Webpay
  async createTransaction(transactionData) {
    try {
      console.log('🔄 Creando transacción Webpay:', transactionData);
      
      const response = await apiTransbank.post('/webpay/transactions', {
        amount: transactionData.amount,
        buyOrder: transactionData.buyOrder,
        sessionId: transactionData.sessionId,
        returnUrl: transactionData.returnUrl || `${window.location.origin}/pago-exitoso`
      });

      console.log('✅ Transacción creada:', response.data);
      
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('❌ Error creando transacción:', error);
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  },

  // Confirmar transacción
  async confirmTransaction(token) {
    try {
      console.log('🔍 Confirmando transacción:', token);
      
      const response = await apiTransbank.put(`/webpay/transactions/${token}`);
      
      console.log('✅ Transacción confirmada:', response.data);
      
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('❌ Error confirmando transacción:', error);
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  },

  // Obtener estado de transacción
  async getTransactionStatus(token) {
    try {
      const response = await apiTransbank.get(`/webpay/transactions/${token}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  },

  // Realizar reembolso
  async refundTransaction(token, amount) {
    try {
      const response = await apiTransbank.post(`/webpay/transactions/${token}/refunds`, {
        amount
      });
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  },

  // Health check
  async healthCheck() {
    try {
      const response = await apiTransbank.get('/webpay/health');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }
};

// ==================== SERVICIOS AUXILIARES ====================

// Servicio de autenticación (mejorado)
export const authService = {
  login: async (credentials) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Determinar tipo de usuario
    let userType = 'cliente';
    let userName = credentials.email.split('@')[0];

    if (credentials.email.includes('admin')) {
      userType = 'admin';
      userName = 'Administrador FERREMAS';
    } else if (credentials.email.includes('vendedor')) {
      userType = 'vendedor';
      userName = 'Vendedor FERREMAS';
    }

    // Simular token JWT
    const token = `jwt_${Date.now()}_${Math.random().toString(36)}`;

    return {
      user: {
        id: Date.now(),
        name: userName,
        email: credentials.email,
        type: userType
      },
      token
    };
  },

  logout: async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { success: true };
  }
};

// Utilidades para formateo
export const formatUtils = {
  // Formatear precio chileno
  formatPrice: (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  },

  // Formatear fecha
  formatDate: (date) => {
    return new Intl.DateTimeFormat('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  },

  // Generar ID único para órdenes
  generateOrderId: () => {
    return `FERREMAS_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }
};

// Categorías de productos (fallback si la API no responde)
export const categories = [
  { id: 'all', name: 'Todos los Productos' },
  { id: 'herramientas-manuales', name: 'Herramientas Manuales' },
  { id: 'herramientas-electricas', name: 'Herramientas Eléctricas' },
  { id: 'materiales-basicos', name: 'Materiales Básicos' },
  { id: 'acabados', name: 'Pinturas y Acabados' },
  { id: 'seguridad', name: 'Equipos de Seguridad' }
];

// Datos mock como fallback (solo para desarrollo)
export const mockData = {
  products: [
    {
      id: 1,
      name: 'Martillo Stanley 16oz',
      brand: 'Stanley',
      price: 12990,
      category: 'herramientas-manuales',
      image: 'https://via.placeholder.com/300x300/1e40af/ffffff?text=Martillo',
      stock: 25,
      featured: true,
      codigo: 'FER-001',
      description: 'Martillo de carpintero con mango de fibra de vidrio.'
    }
    // ... otros productos mock como fallback
  ]
};

// Exportación por defecto con todos los servicios
const apiServices = {
  inventario: inventarioService,
  ventas: ventasService,
  webpay: webpayService,
  auth: authService,
  format: formatUtils
};

export default apiServices;