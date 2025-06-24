#!/bin/bash

echo "🤖 FERREMAS - Pruebas Automatizadas 🤖"

# Verificar Node y Newman
echo -n "✓ Node.js instalado: "
node -v

echo -n "✓ Newman instalado: "
newman -v

# Ejecutar pruebas
echo "🧪 Ejecutando pruebas funcionales con Newman..."
newman run tests/multi-api-collection.json -r cli,html --reporter-html-export reports/newman/multi-api-report-$(date +"%Y%m%d_%H%M%S").html

echo "🎉 ¡Pruebas automatizadas completadas!"
