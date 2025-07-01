#!/bin/bash

# N-400 Naturalization Helper - Vercel Deployment Script
echo "🇺🇸 Deploying N-400 Naturalization Helper to Vercel..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Clean build directory
echo "🧹 Cleaning build directory..."
rm -rf build

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete! Your N-400 Naturalization Helper is now live!"
echo "🌐 Visit your app at the URL provided above"
