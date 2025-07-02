#!/bin/bash

# Railway Installation Script
# This script ensures clean dependency installation for Railway deployment

echo "🚂 Railway Clean Installation Script"
echo "===================================="

# Clear any existing node_modules and lock files
echo "🧹 Cleaning existing dependencies..."
rm -rf node_modules
rm -f package-lock.json
rm -f yarn.lock
rm -f npm-shrinkwrap.json

# Clear npm cache
echo "🗑️ Clearing npm cache..."
npm cache clean --force

# Install dependencies with clean slate
echo "📦 Installing dependencies..."
npm install --no-package-lock --no-save

# Verify installation
echo "✅ Verifying installation..."
if [ -d "node_modules" ]; then
    echo "✅ Dependencies installed successfully"
    echo "📋 Installed packages:"
    npm list --depth=0 2>/dev/null | head -20
else
    echo "❌ Installation failed"
    exit 1
fi

echo "🎉 Railway installation complete!"
