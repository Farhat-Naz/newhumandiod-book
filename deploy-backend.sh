#!/bin/bash
# ==========================================
# ONE-COMMAND BACKEND DEPLOYMENT SCRIPT
# ==========================================
# This script deploys all backend services to Railway automatically
# ==========================================

set -e  # Exit on error

echo "🚀 Starting Backend Deployment..."
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

echo "✅ Railway CLI installed"
echo ""

# Login to Railway
echo "🔑 Please login to Railway (will open browser)..."
echo "   - If you don't have an account, sign up at https://railway.app"
echo "   - Use GitHub to sign in (it's free)"
echo ""
railway login

echo ""
echo "✅ Logged in to Railway"
echo ""

# Create a new Railway project
echo "📁 Creating Railway project..."
railway init --name "physicalai-backend-services"

echo ""
echo "✅ Project created"
echo ""

# Deploy Backend Service
echo "🔨 Deploying Backend API..."
cd backend
railway up --service backend --detach
cd ..

# Deploy RAG Service
echo "🔨 Deploying RAG Service..."
cd rag
railway up --service rag --detach
cd ..

# Deploy Agent Service
echo "🔨 Deploying Agent Service..."
cd agent
railway up --service agent --detach
cd ..

echo ""
echo "⏳ Deployments started! Railway is building your services..."
echo ""
echo "📋 Next steps:"
echo "   1. Go to: https://railway.app/dashboard"
echo "   2. Click on your project: 'physicalai-backend-services'"
echo "   3. Add environment variables to each service"
echo "   4. Get the public URLs for each service"
echo ""
echo "✅ Script completed!"
