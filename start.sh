#!/bin/bash

echo "🚀 STARTING MEDUSA BACKEND"
echo "📁 Current directory: $(pwd)"

# Ensure we're starting the backend
if [ -d "medusa-backend" ]; then
    echo "✅ Found medusa-backend directory"
    cd medusa-backend
    echo "📁 Now in: $(pwd)"
    echo "🌐 Starting server on ${HOST:-0.0.0.0}:${PORT:-10000}..."
    npm run start
else
    echo "❌ ERROR: medusa-backend directory not found!"
    echo "📂 Available directories:"
    ls -la
    exit 1
fi
