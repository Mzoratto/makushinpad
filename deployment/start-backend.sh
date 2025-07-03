#!/bin/bash

# Start script for Medusa backend on Render
# This ensures we start from the correct directory

echo "🚀 Starting Shin Shop Medusa Backend..."
echo "📁 Current directory: $(pwd)"

# Change to medusa-backend directory
cd medusa-backend || {
    echo "❌ Error: medusa-backend directory not found"
    exit 1
}

echo "📁 Now in: $(pwd)"
echo "🌐 Starting server on ${HOST:-0.0.0.0}:${PORT:-10000}..."

# Start the backend
npm run start
