#!/bin/bash
# Deployment script for marcusgoll.com
# Run this on your VPS after pulling latest code

set -e  # Exit on error

echo "🚀 Starting deployment..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are you in the project directory?"
    exit 1
fi

# Pull latest code
echo "📥 Pulling latest code from GitHub..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "❌ Build failed! Deployment aborted."
    exit 1
fi

echo ""
echo "✅ Build successful!"
echo ""

# Restart the application
echo "🔄 Restarting application..."

# Try PM2 first
if command -v pm2 &> /dev/null; then
    pm2 restart marcusgoll || pm2 start npm --name "marcusgoll" -- start
    pm2 save
    echo "✅ Application restarted with PM2"
else
    echo "⚠️  PM2 not found. Please restart your application manually."
    echo "   Recommended: Install PM2 with 'npm install -g pm2'"
fi

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📊 Application status:"
if command -v pm2 &> /dev/null; then
    pm2 status marcusgoll
fi

echo ""
echo "🌐 Your site should be live at:"
echo "   http://178.156.129.179:3000"
echo ""
echo "💡 Next steps:"
echo "   1. Test the site in your browser"
echo "   2. Check for any errors: pm2 logs marcusgoll"
echo "   3. Monitor performance: pm2 monit"
echo ""
