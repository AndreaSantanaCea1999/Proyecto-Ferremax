#!/bin/bash

echo "🤖 FERREMAS - Pruebas Automatizadas 🤖"

# Verificar node
if ! command -v node &> /dev/null; then
  echo "❌ Node.js no está instalado. Instálalo primero."
  exit 1
else
  echo "✓ Node.js instalado: $(node -v)"
fi

# Verificar newman
if ! command -v newman &> /dev/null; then
  echo "❌ Newman no está instalado globalmente."
  echo "Ejecuta: npm install -g newman newman-reporter-html"
  exit 1
else
  echo "✓ Newman instalado: $(newman -v)"
fi

# Leer config.json
CONFIG_FILE="config.json"
if [ ! -f "$CONFIG_FILE" ]; then
  echo "❌ Archivo $CONFIG_FILE no encontrado."
  exit 1
fi

# Leer variables de config.json (simple)
inventario_baseUrl=$(jq -r '.apis.inventario.baseUrl' $CONFIG_FILE)
inventario_healthCheck=$(jq -r '.apis.inventario.healthCheck' $CONFIG_FILE)
ventas_baseUrl=$(jq -r '.apis.ventas.baseUrl' $CONFIG_FILE)
ventas_healthCheck=$(jq -r '.apis.ventas.healthCheck' $CONFIG_FILE)
transbank_baseUrl=$(jq -r '.apis.transbank.baseUrl' $CONFIG_FILE)
transbank_healthCheck=$(jq -r '.apis.transbank.healthCheck' $CONFIG_FILE)

echo "✓ Configuración cargada."

# Verificar que las APIs estén arriba
check_api() {
  local baseUrl=$1
  local healthCheck=$2
  local name=$3
  echo "Verificando $name..."
  status=$(curl -s -o /dev/null -w "%{http_code}" "$baseUrl$healthCheck")
  if [ "$status" -eq 200 ]; then
    echo "✓ $name está corriendo."
  else
    echo "❌ $name no responde (HTTP $status)."
  fi
}

check_api "$inventario_baseUrl" "$inventario_healthCheck" "API Inventario"
check_api "$ventas_baseUrl" "$ventas_healthCheck" "API Ventas y Pagos"
check_api "$transbank_baseUrl" "$transbank_healthCheck" "API Transbank"

echo "🧪 Ejecutando pruebas funcionales con Newman..."
npm run newman

if [ $? -eq 0 ]; then
  echo "✅ Pruebas funcionales completadas exitosamente"
  echo "📊 Reporte generado: reports/newman/multi-api-report.html"
else
  echo "❌ Fallaron algunas pruebas funcionales"
fi

echo "🎉 ¡Pruebas automatizadas completadas!"
