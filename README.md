# FERREMAS - Frontend React

Frontend de la distribuidora de productos de ferretería y construcción FERREMAS, desarrollado en React con integración completa al backend Express+Node.js.

## 🚀 Características Principales

- ✅ **Catálogo de productos** con filtros por categoría y búsqueda
- ✅ **Sistema de carrito de compras** funcional
- ✅ **Integración con WebPay** para pagos seguros
- ✅ **Panel de administración** para gestión de pedidos
- ✅ **Sistema de autenticación** multi-rol (Cliente, Administrador, Vendedor, Bodeguero, Contador)
- ✅ **Diseño responsivo** que funciona en desktop y móvil
- ✅ **Integración preparada** para APIs de inventario, banco y Transbank

## 📋 Requisitos Previos

- Node.js 16.0 o superior
- npm 8.0 o superior
- Backend Express+Node.js ejecutándose en puerto 3001

## 🛠️ Instalación

### 1. Clonar o crear el proyecto
```bash
# Crear directorio del proyecto
mkdir ferremas-frontend
cd ferremas-frontend

# Inicializar proyecto React
npx create-react-app . --template javascript
```

### 2. Instalar dependencias adicionales
```bash
npm install axios lucide-react
```

### 3. Configurar estructura de archivos
Crea la estructura de carpetas exactamente como se muestra:

```
ferremas-frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── LoginModal.js
│   │   ├── CartModal.js
│   │   ├── ProductCard.js
│   │   └── AdminPanel.js
│   ├── pages/
│   │   ├── HomePage.js
│   │   ├── ProductsPage.js
│   │   ├── ContactPage.js
│   │   └── AdminPage.js
│   ├── services/
│   │   └── api.js
│   ├── contexts/
│   │   └── AppContext.js
│   ├── App.js
│   ├── index.js
│   └── index.css
└── package.json
```

### 4. Copiar todos los archivos proporcionados
- Reemplaza el contenido de cada archivo con el código proporcionado
- Asegúrate de que todos los archivos estén en sus carpetas correctas

### 5. Configurar variables de entorno (opcional)
Crea un archivo `.env` en la raíz del proyecto:

```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_WEBPAY_ENVIRONMENT=TEST
```

## 🚀 Ejecución

### 1. Iniciar el frontend
```bash
npm start
```

El frontend se ejecutará en `http://localhost:3000`

### 2. Verificar conexión con backend
Asegúrate de que tu backend Express+Node.js esté ejecutándose en el puerto 3001.

## 👥 Usuarios de Prueba

Para testing, puedes usar estas credenciales:

| Tipo | Email | Contraseña | Descripción |
|------|-------|------------|-------------|
| Administrador | admin@ferremas.cl | admin123 | Acceso completo al panel de administración |
| Vendedor | vendedor@ferremas.cl | vend123 | Gestión de ventas y pedidos |
| Cliente | cliente@test.cl | cliente123 | Compras y consultas |

## 🛒 Funcionalidades Principales

### Para Clientes:
1. **Explorar productos** - Navega por las categorías de herramientas y materiales
2. **Buscar productos** - Usa la barra de búsqueda para encontrar productos específicos
3. **Agregar al carrito** - Selecciona productos y cantidad deseada
4. **Realizar compra** - Procesa el pago mediante WebPay
5. **Opciones de entrega** - Elige entre retiro en tienda o despacho a domicilio

### Para Administradores:
1. **Ver dashboard** - Estadísticas de ventas y pedidos
2. **Gestionar pedidos** - Ver todos los pedidos y cambiar estados
3. **Registro de ventas** - Historial completo de transacciones
4. **Estados de pedidos**:
   - Por despachar
   - En preparación
   - En camino
   - Entregado

## 🔧 Integración con Backend

### APIs Necesarias en el Backend:

#### Autenticación:
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario

#### Productos (API de Inventario):
- `GET /api/products` - Obtener todos los productos
- `GET /api/products/:id` - Obtener producto por ID
- `GET /api/products/category/:category` - Productos por categoría
- `GET /api/products/search?q=query` - Buscar productos

#### Pedidos:
- `POST /api/orders` - Crear nuevo pedido
- `GET /api/orders` - Obtener pedidos del usuario
- `GET /api/orders/:id` - Obtener pedido específico
- `PATCH /api/orders/:id/status` - Actualizar estado del pedido

#### Pagos (Integración con Transbank):
- `POST /api/payments/init` - Inicializar transacción WebPay
- `POST /api/payments/confirm` - Confirmar transacción
- `GET /api/payments/status/:orderId` - Estado del pago

#### Banco (Conversión de divisas):
- `GET /api/bank/exchange-rate` - Obtener tipo de cambio
- `POST /api/bank/convert` - Convertir moneda

#### Administración:
- `GET /api/admin/orders` - Todos los pedidos (solo admin)
- `GET /api/admin/sales` - Reporte de ventas
- `PATCH /api/admin/orders/:id` - Actualizar pedido

## 🎨 Personalización

### Colores del tema:
- Azul principal: `#1e3a8a` (blue-900)
- Amarillo destacado: `#fbbf24` (yellow-400)
- Gris de fondo: `#f9fafb` (gray-50)

### Modificar productos:
Los productos están definidos en `src/services/api.js` en el objeto `mockData`. En producción, estos vendrán de tu API de inventario.

## 📱 Diseño Responsivo

El frontend está optimizado para:
- **Desktop** (1024px+)
- **Tablet** (768px - 1023px)
- **Mobile** (320px - 767px)

## 🔒 Seguridad

- Tokens JWT para autenticación
- Validación de roles de usuario
- Sanitización de inputs
- HTTPS recomendado para producción

## 🚀 Despliegue en Producción

### 1. Build del proyecto:
```bash
npm run build
```

### 2. Variables de entorno para producción:
```env
REACT_APP_API_URL=https://tu-backend.com
REACT_APP_WEBPAY_ENVIRONMENT=PRODUCTION
```

### 3. Servir archivos estáticos:
Los archivos del build pueden servirse con nginx, Apache o cualquier servidor web.

## 📞 Soporte

Para problemas o consultas:
- Email: soporte@ferremas.cl
- Teléfono: +56 2 2345 6789

## 📄 Licencia

© 2024 FERREMAS. Todos los derechos reservados.

---

**Desarrollado para la asignatura ASY5131 - Integración de Plataformas**