import axios from 'axios';

// ==================== CONFIGURACIÓN PARA SANDBOX - RUTAS CORREGIDAS ====================

// URLs de las 3 APIs según tu .env
const API_URLS = {
  inventario: process.env.REACT_APP_API_INVENTARIO || 'http://localhost:3000/api',
  ventas: process.env.REACT_APP_API_VENTAS || 'http://localhost:3001/api', 
  transbank: process.env.REACT_APP_API_TRANSBANK || 'http://localhost:3003/api'
};

// Configuración específica para SANDBOX
const WEBPAY_CONFIG = {
  environment: process.env.REACT_APP_WEBPAY_ENVIRONMENT || 'sandbox',
  returnUrl: process.env.REACT_APP_WEBPAY_RETURN_URL || 'http://localhost:3004/pago-exitoso',
  frontendPort: process.env.PORT || '3004'
};

console.log('🔧 Configurando APIs para SANDBOX (rutas corregidas):', API_URLS);
console.log('💳 Configuración WebPay SANDBOX:', WEBPAY_CONFIG);

// Configuración de axios con timeouts específicos
const createApiClient = (baseURL, name) => {
  const client = axios.create({
    baseURL,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Interceptor para logging detallado
  client.interceptors.request.use(
    (config) => {
      console.log(`📤 ${name} Request:`, {
        method: config.method?.toUpperCase(),
        url: `${config.baseURL}${config.url}`,
        data: config.data
      });
      return config;
    },
    (error) => {
      console.error(`❌ ${name} Request Error:`, error);
      return Promise.reject(error);
    }
  );

  // Interceptor para respuestas
  client.interceptors.response.use(
    (response) => {
      console.log(`📥 ${name} Response:`, {
        status: response.status,
        url: response.config.url,
        dataSize: response.data ? Object.keys(response.data).length : 0
      });
      return response;
    },
    (error) => {
      console.error(`❌ ${name} Error:`, {
        status: error.response?.status,
        message: error.response?.data || error.message,
        url: error.config?.url
      });
      return Promise.reject(error);
    }
  );

  return client;
};

// Clientes para las 3 APIs
const apiInventario = createApiClient(API_URLS.inventario, 'API Inventario');
const apiVentas = createApiClient(API_URLS.ventas, 'API Ventas');
const apiTransbank = createApiClient(API_URLS.transbank, 'API Transbank');

// ==================== API INVENTARIO (Puerto 3000) ====================

export const inventarioService = {
  async getProducts() {
    try {
      console.log('🔄 Obteniendo productos desde API Inventario...');
      const response = await apiInventario.get('/productos');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Error obteniendo productos:', error);
      return {
        success: false,
        error: error.response?.data || error.message,
        data: []
      };
    }
  },

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
  async createOrder(orderData) {
    try {
      console.log('📦 Creando pedido en API Ventas:', orderData);
      const response = await apiVentas.post('/pedidos', orderData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Error creando pedido:', error);
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  },

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

  async getAllOrders() {
    try {
      const response = await apiVentas.get('/pedidos');
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

  async updateOrderStatus(orderId, status) {
    try {
      console.log(`📝 Actualizando pedido ${orderId} a estado: ${status}`);
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

  async registerSale(saleData) {
    try {
      console.log('📊 Registrando venta en API Ventas:', saleData);
      const response = await apiVentas.post('/ventas', saleData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Error registrando venta:', error);
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }
};

// ==================== API TRANSBANK - RUTAS CORREGIDAS ====================

export const webpayService = {
  // Crear transacción Webpay - RUTA CORREGIDA
  async createTransaction(transactionData) {
    try {
      console.log('💳 Creando transacción SANDBOX (rutas corregidas):', transactionData);
      
      // Validaciones
      if (!transactionData.amount || transactionData.amount <= 0) {
        throw new Error('Monto inválido para la transacción');
      }

      if (!transactionData.buyOrder || !transactionData.sessionId) {
        throw new Error('Datos de transacción incompletos');
      }

      // Preparar datos para SANDBOX
      const sandboxTransactionData = {
        amount: transactionData.amount,
        buyOrder: transactionData.buyOrder,
        sessionId: transactionData.sessionId,
        returnUrl: WEBPAY_CONFIG.returnUrl
      };

      console.log('🧪 Datos para SANDBOX (ruta corregida):', sandboxTransactionData);

      // 🔄 INTENTAR DIFERENTES RUTAS DE TU API
      let response;
      let usedRoute = '';

      try {
        // Intentar primero con /webpay (según tus rutas disponibles)
        console.log('🔄 Intentando ruta: /webpay');
        response = await apiTransbank.post('/webpay', sandboxTransactionData);
        usedRoute = '/webpay';
        console.log('✅ Ruta /webpay funcionó!');
      } catch (webpayError) {
        console.log('❌ Ruta /webpay falló, intentando /transbank');
        try {
          // Si falla, intentar con /transbank
          response = await apiTransbank.post('/transbank', sandboxTransactionData);
          usedRoute = '/transbank';
          console.log('✅ Ruta /transbank funcionó!');
        } catch (transbankError) {
          console.log('❌ Ruta /transbank falló, intentando /webpay/transactions');
          try {
            // Si falla, intentar la ruta original
            response = await apiTransbank.post('/webpay/transactions', sandboxTransactionData);
            usedRoute = '/webpay/transactions';
            console.log('✅ Ruta /webpay/transactions funcionó!');
          } catch (originalError) {
            // Si todas fallan, lanzar el error original
            throw webpayError;
          }
        }
      }

      console.log(`✅ Transacción SANDBOX creada exitosamente usando ${usedRoute}:`, response.data);
      
      return {
        success: true,
        data: response.data.data || response.data,
        usedRoute: usedRoute
      };
    } catch (error) {
      console.error('❌ Error creando transacción SANDBOX:', error);
      
      // Log detallado del error
      if (error.response) {
        console.error('SANDBOX Error Details:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          url: error.config?.url,
          method: error.config?.method
        });
      }
      
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  },

  // Confirmar transacción - RUTA CORREGIDA
  async confirmTransaction(token) {
    try {
      console.log('🔍 Confirmando transacción SANDBOX (rutas corregidas):', token);
      
      if (!token) {
        throw new Error('Token de transacción requerido');
      }

      // 🔄 INTENTAR DIFERENTES RUTAS PARA CONFIRMACIÓN
      let response;
      let usedRoute = '';

      try {
        // Intentar primero con PUT /webpay/{token}
        console.log('🔄 Intentando confirmación: PUT /webpay/' + token);
        response = await apiTransbank.put(`/webpay/${token}`);
        usedRoute = `/webpay/${token}`;
        console.log('✅ Confirmación /webpay funcionó!');
      } catch (webpayError) {
        console.log('❌ Confirmación /webpay falló, intentando /transbank');
        try {
          // Si falla, intentar con /transbank
          response = await apiTransbank.put(`/transbank/${token}`);
          usedRoute = `/transbank/${token}`;
          console.log('✅ Confirmación /transbank funcionó!');
        } catch (transbankError) {
          console.log('❌ Confirmación /transbank falló, intentando ruta original');
          try {
            // Si falla, intentar la ruta original
            response = await apiTransbank.put(`/webpay/transactions/${token}`);
            usedRoute = `/webpay/transactions/${token}`;
            console.log('✅ Confirmación ruta original funcionó!');
          } catch (originalError) {
            // Si todas fallan, lanzar el error original
            throw webpayError;
          }
        }
      }
      
      console.log(`✅ Transacción SANDBOX confirmada usando ${usedRoute}:`, response.data);
      
      return {
        success: true,
        data: response.data.data || response.data,
        usedRoute: usedRoute
      };
    } catch (error) {
      console.error('❌ Error confirmando transacción SANDBOX:', error);
      
      if (error.response) {
        console.error('SANDBOX Confirm Error:', {
          status: error.response.status,
          data: error.response.data,
          url: error.config?.url
        });
      }
      
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  },

  // Verificar estado de transacción
  async getTransactionStatus(token) {
    try {
      // Intentar diferentes rutas para status
      let response;
      try {
        response = await apiTransbank.get(`/webpay/${token}/status`);
      } catch (webpayError) {
        try {
          response = await apiTransbank.get(`/transbank/${token}/status`);
        } catch (transbankError) {
          response = await apiTransbank.get(`/webpay/transactions/${token}/status`);
        }
      }
      
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

// ==================== SERVICIO DE AUTENTICACIÓN ====================

export const authService = {
  async login(credentials) {
    try {
      const response = await apiVentas.post('/auth/login', credentials);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        return {
          success: true,
          data: response.data
        };
      }
      
      throw new Error('No se recibió token de autenticación');
    } catch (error) {
      console.warn('⚠️ API auth falló, usando autenticación mock');
      
      const mockUsers = [
        {
          id: 1,
          email: 'admin@ferremas.cl',
          password: 'admin123',
          name: 'Administrador FERREMAS',
          type: 'admin'
        },
        {
          id: 2,
          email: 'vendedor@ferremas.cl',
          password: 'vend123',
          name: 'Juan Pérez',
          type: 'vendedor'
        },
        {
          id: 3,
          email: 'cliente@test.cl',
          password: 'cliente123',
          name: 'María González',
          type: 'cliente'
        }
      ];
      
      const user = mockUsers.find(
        u => u.email === credentials.email && u.password === credentials.password
      );

      if (user) {
        const token = btoa(JSON.stringify({ id: user.id, email: user.email, type: user.type }));
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({
          id: user.id,
          email: user.email,
          name: user.name,
          type: user.type
        }));

        return {
          success: true,
          data: {
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              type: user.type
            },
            token
          }
        };
      } else {
        return {
          success: false,
          error: { message: 'Credenciales inválidas' }
        };
      }
    }
  },

  async register(userData) {
    try {
      const response = await apiVentas.post('/auth/register', userData);
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

// ==================== SERVICIO UNIFICADO DE PRODUCTOS ====================

export const productService = {
  async getProducts() {
    try {
      const result = await inventarioService.getProducts();
      
      if (result.success && result.data.length > 0) {
        console.log('✅ Productos cargados desde API Inventario');
        return result;
      }
      
      throw new Error('API Inventario no devolvió productos');
    } catch (error) {
      console.warn('⚠️ API Inventario falló, usando productos mock');
      
      const mockProducts = [
        {
          id: 1,
          name: 'Taladro Percutor Profesional',
          brand: 'Bosch',
          price: 89990,
          image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400',
          category: 'herramientas-electricas',
          stock: 15,
          featured: true,
          description: 'Taladro percutor profesional ideal para trabajos pesados en concreto y mampostería.'
        },
        {
          id: 2,
          name: 'Martillo de Carpintero',
          brand: 'Stanley',
          price: 12990,
          image: 'https://images.unsplash.com/photo-1585128792020-43c98e8e85f0?w=400',
          category: 'herramientas-manuales',
          stock: 25,
          featured: false,
          description: 'Martillo de carpintero con mango de madera, perfecto para trabajos de construcción.'
        },
        {
          id: 3,
          name: 'Sierra Circular 7 1/4"',
          brand: 'DeWalt',
          price: 156990,
          image: 'https://images.unsplash.com/photo-1585128792020-43c98e8e85f0?w=400',
          category: 'herramientas-electricas',
          stock: 8,
          featured: true,
          description: 'Sierra circular profesional con motor de alta potencia para cortes precisos.'
        },
        {
          id: 4,
          name: 'Cemento Portland 25kg',
          brand: 'Polpaico',
          price: 4990,
          image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400',
          category: 'materiales-construccion',
          stock: 50,
          featured: false,
          description: 'Cemento Portland de alta calidad para construcción y obras menores.'
        },
        {
          id: 5,
          name: 'Pintura Látex Blanco 1L',
          brand: 'Sherwin Williams',
          price: 8990,
          image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400',
          category: 'pinturas',
          stock: 30,
          featured: false,
          description: 'Pintura látex lavable de alta cobertura, ideal para interiores.'
        },
        {
          id: 6,
          name: 'Llave Inglesa 12"',
          brand: 'Bahco',
          price: 18990,
          image: 'https://images.unsplash.com/photo-1585128792020-43c98e8e85f0?w=400',
          category: 'herramientas-manuales',
          stock: 20,
          featured: false,
          description: 'Llave inglesa ajustable de 12 pulgadas, fabricada en acero al cromo vanadio.'
        }
      ];

      return {
        success: true,
        data: mockProducts
      };
    }
  },

  async getProductById(id) {
    try {
      return await inventarioService.getProductById(id);
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
};

// Alias para compatibilidad
export const salesService = ventasService;

export const mockData = {
  products: [],
  users: []
};

// ==================== UTILIDADES DE FORMATO ====================

export const formatUtils = {
  formatPrice: (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  },

  generateOrderId: () => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `FERR-${timestamp.slice(-6)}${random}`;
  },

  formatDate: (date) => {
    return new Date(date).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validateRUT: (rut) => {
    const rutRegex = /^[0-9]+-[0-9kK]{1}$/;
    return rutRegex.test(rut);
  }
};

// ==================== INTERCEPTORES ====================

[apiVentas, apiInventario].forEach(api => {
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
});

[apiVentas, apiInventario, apiTransbank].forEach(api => {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.warn('🔑 Token expirado, limpiando sesión');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload();
      }
      return Promise.reject(error);
    }
  );
});

console.log('🚀 Servicios API configurados con rutas corregidas:');
console.log('📦 Inventario:', API_URLS.inventario);
console.log('💰 Ventas:', API_URLS.ventas);
console.log('💳 Transbank SANDBOX (rutas corregidas):', API_URLS.transbank);
console.log('🎯 Return URL:', WEBPAY_CONFIG.returnUrl);

// Exportación sin warnings
const apiServices = {
  inventarioService,
  ventasService,
  webpayService,
  authService,
  productService,
  salesService,
  formatUtils
};

export default apiServices;