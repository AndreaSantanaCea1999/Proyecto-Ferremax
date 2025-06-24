#!/bin/bash

echo "🚀 Configurando proyecto FERREMAS Frontend..."

# Verificar que Node.js esté instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js 16+ desde https://nodejs.org/"
    exit 1
fi

# Verificar versión de Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Se requiere Node.js 16 o superior. Versión actual: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detectado"

# Crear estructura de directorios
echo "📁 Creando estructura de directorios..."
mkdir -p src/components
mkdir -p src/pages
mkdir -p src/services
mkdir -p src/contexts
mkdir -p public

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Instalar dependencias adicionales
echo "📦 Instalando dependencias adicionales..."
npm install axios lucide-react

# Crear archivo .env si no existe
if [ ! -f .env ]; then
    echo "⚙️ Creando archivo .env..."
    cat > .env << EOL
REACT_APP_API_URL=http://localhost:3001
REACT_APP_WEBPAY_ENVIRONMENT=TEST
EOL
fi

echo ""
echo "🎉 ¡Configuración completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Copia todos los archivos proporcionados a sus respectivas carpetas"
echo "2. Asegúrate de que tu backend esté ejecutándose en el puerto 3001"
echo "3. Ejecuta 'npm start' para iniciar el frontend"
echo ""
echo "👥 Usuarios de prueba:"
echo "   Administrador: admin@ferremas.cl / admin123"
echo "   Cliente: cliente@test.cl / cliente123"
echo ""
echo "🌐 El frontend se ejecutará en: http://localhost:3000"
echo "🔗 Backend esperado en: http://localhost:3001"