#!/bin/bash

# GitHub Pages Deployment Script for PDC IITGN Website

echo "🚀 Starting GitHub Pages deployment..."

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the project root directory."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🔨 Building the application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📤 The static files are ready in the 'out' directory"
    echo ""
    echo "📋 Next steps:"
    echo "1. Commit your changes: git add . && git commit -m 'Deploy to GitHub Pages'"
    echo "2. Push to GitHub: git push origin main"
    echo "3. GitHub Actions will automatically deploy to GitHub Pages"
    echo ""
    echo "🌐 Your site will be available at: https://[username].github.io/[repository-name]"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi
