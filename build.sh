#!/bin/bash

echo "🔧 FORCING MEDUSA BACKEND BUILD"
echo "📁 Current directory: $(pwd)"
echo "📂 Contents: $(ls -la)"

# Ensure we're building the backend, not frontend
if [ -d "medusa-backend" ]; then
    echo "✅ Found medusa-backend directory"
    cd medusa-backend
    echo "📁 Now in: $(pwd)"
    echo "📦 Installing backend dependencies..."
    npm install
    echo "🔨 Building backend..."
    npm run build:prod
    echo "✅ Backend build completed!"
else
    echo "❌ ERROR: medusa-backend directory not found!"
    echo "📂 Available directories:"
    ls -la
    exit 1
fi
