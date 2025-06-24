# Comandos de Desarrollo - FERREMAS Frontend

## 🚀 Comandos Básicos

### Iniciar el proyecto en desarrollo
```bash
npm start
```
Inicia el servidor de desarrollo en http://localhost:3000

### Crear build de producción
```bash
npm run build
```
Genera los archivos optimizados para producción en la carpeta `build/`

### Ejecutar tests
```bash
npm test
```
Ejecuta las pruebas unitarias

### Analizar el bundle
```bash
npm run build
npx serve -s build
```

## 🔧 Comandos de Configuración

### Instalar todas las dependencias
```bash
npm install
```

### Actualizar dependencias
```bash
npm update
```

### Verificar vulnerabilidades
```bash
npm audit
npm audit fix
```

## 🐛 Debugging

### Ver logs detallados
```bash
npm start --verbose
```

### Limpiar caché de npm
```bash
npm start -- --reset-cache
```

### Verificar configuración de proxy
```bash
curl http://localhost:3000/api/products
```

## 📦 Gestión de Dependencias

### Instalar nueva dependencia
```bash
npm install nombre-paquete
```

### Instalar dependencia de desarrollo
```bash
npm install --save-dev nombre-paquete
```

### Desinstalar dependencia
```bash
npm uninstall nombre-paquete
```

## 🧪 Testing

### Ejecutar tests específicos
```bash
npm test -- --testNamePattern="nombre del test"
```

### Generar reporte de cobertura
```bash
npm test -- --coverage --watchAll=false
```

### Tests de componentes individuales
```bash
npm test src/components/Header.test.js
```

## 🔄 Integración con Backend

### Verificar conexión con APIs
```bash
# Verificar API de productos
curl http://localhost:3001/api/products

# Verificar API de autenticación
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ferremas.cl","password":"admin123"}'

# Verificar API de pagos
curl http://localhost:3001/api/payments/status/test
```

### Probar endpoints desde frontend
```javascript
// Abrir consola del navegador y ejecutar:
fetch('/api/products')
  .then(res => res.json())
  .then(data => console.log(data));
```

## 📱 Testing Responsivo

### Probar en diferentes tamaños
```bash
# Abrir Chrome DevTools
# F12 > Toggle Device Toolbar > Seleccionar dispositivo
```

### Simular conexión lenta
```bash
# Chrome DevTools > Network tab > Throttling > Slow 3G
```

## 🚀 Despliegue

### Build optimizado
```bash
npm run build
```

### Servir localmente el build
```bash
npx serve -s build
```

### Verificar tamaño del bundle
```bash
npm run build
du -sh build/static/js/*.js
```

## 🔍 Herramientas de Análisis

### Analizar bundle size
```bash
npm install -g webpack-bundle-analyzer
npm run build
npx webpack-bundle-analyzer build/static/js/*.js
```

### Lighthouse audit
```bash
npm install -g lighthouse
npm run build
npx serve -s build &
lighthouse http://localhost:5000 --view
```

## 🛠️ Troubleshooting

### Problemas comunes y soluciones

#### Error: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

#### Error de proxy
```bash
# Verificar que el backend esté ejecutándose
curl http://localhost:3001/health

# Revisar configuración de proxy en package.json
```

#### Error de CORS
```bash
# Verificar headers del backend
# Agregar en backend: app.use(cors())
```

#### Error de memoria
```bash
export NODE_OPTIONS=--max_old_space_size=4096
npm start
```

#### Puerto ocupado
```bash
# Cambiar puerto
PORT=3002 npm start

# O matar proceso
lsof -ti:3000 | xargs kill -9
```

## 📊 Monitoreo

### Ver performance en tiempo real
```javascript
// En consola del navegador
console.log(performance.getEntries());
```

### Medir tiempo de carga
```javascript
window.addEventListener('load', () => {
  console.log('Página cargada en:', performance.now(), 'ms');
});
```

## 🔧 Configuración Avanzada

### Variables de entorno por ambiente
```bash
# .env.development
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENV=development

# .env.production
REACT_APP_API_URL=https://api.ferremas.cl
REACT_APP_ENV=production
```

### Configuración de ESLint
```bash
npm install --save-dev eslint-config-prettier
```

### Pre-commit hooks
```bash
npm install --save-dev husky lint-staged
```

---

**💡 Tip:** Mantén este archivo como referencia durante el desarrollo del proyecto FERREMAS.