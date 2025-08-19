#!/bin/bash

echo "🎨 Image Pixelator - Starting Development Server"
echo "================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🚀 Starting development server..."
echo "📱 Open http://localhost:3000 in your browser"
echo "🌍 Multi-language versions:"
echo "   - English: http://localhost:3000/en/"
echo "   - 中文: http://localhost:3000/zh/"
echo "   - Español: http://localhost:3000/es/"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev