#!/bin/bash

# Build script for Medusa backend on Render
# This ensures we build from the correct directory

echo "🔧 Building Shin Shop Medusa Backend..."
echo "📁 Current directory: $(pwd)"
echo "📂 Contents: $(ls -la)"

# Change to medusa-backend directory
cd medusa-backend || {
    echo "❌ Error: medusa-backend directory not found"
    exit 1
}

echo "📁 Now in: $(pwd)"
echo "📂 Backend contents: $(ls -la)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the backend
echo "🔨 Building backend..."
npm run build:prod

echo "✅ Build completed successfully!"
