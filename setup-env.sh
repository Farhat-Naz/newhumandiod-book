#!/bin/bash

# ==========================================
# Environment Setup Script
# ==========================================
# This script helps you set up environment variables
# for local development or production deployment

set -e

echo "================================================"
echo "Physical AI Platform - Environment Setup"
echo "================================================"
echo ""

# Function to generate JWT secret
generate_jwt_secret() {
    if command -v openssl &> /dev/null; then
        openssl rand -hex 32
    else
        # Fallback if openssl not available
        cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 64 | head -n 1
    fi
}

# Function to prompt for input
prompt_input() {
    local prompt="$1"
    local default="$2"
    local secret="$3"

    if [ "$secret" = "secret" ]; then
        read -s -p "$prompt" value
        echo ""
    else
        read -p "$prompt" value
    fi

    if [ -z "$value" ]; then
        echo "$default"
    else
        echo "$value"
    fi
}

# Check environment type
echo "What environment are you setting up?"
echo "1) Local Development (with Docker Compose)"
echo "2) Production Deployment (Vercel + Render)"
echo ""
read -p "Enter choice (1 or 2): " env_choice

if [ "$env_choice" = "1" ]; then
    echo ""
    echo "Setting up LOCAL DEVELOPMENT environment..."
    echo ""

    # Copy local template
    if [ -f ".env" ]; then
        read -p ".env file already exists. Overwrite? (y/N): " overwrite
        if [ "$overwrite" != "y" ] && [ "$overwrite" != "Y" ]; then
            echo "Setup cancelled."
            exit 0
        fi
    fi

    cp .env.local.template .env

    echo ""
    echo "✓ Created .env file from template"
    echo ""
    echo "Now, let's configure the required variables:"
    echo ""

    # Get Claude API key
    echo "─────────────────────────────────────────────"
    echo "1. Claude API Key (REQUIRED for RAG chatbot)"
    echo "─────────────────────────────────────────────"
    echo "Get your API key from: https://console.anthropic.com/"
    echo ""
    CLAUDE_KEY=$(prompt_input "Enter your Claude API key (starts with sk-ant-): " "" "secret")

    if [ -n "$CLAUDE_KEY" ]; then
        # Update .env file
        sed -i.bak "s|CLAUDE_API_KEY=sk-ant-api03-YOUR_ACTUAL_CLAUDE_API_KEY_HERE|CLAUDE_API_KEY=$CLAUDE_KEY|g" .env
        rm .env.bak 2>/dev/null || true
        echo "✓ Claude API key configured"
    else
        echo "⚠ Warning: Claude API key not set. RAG chatbot won't work."
    fi

    echo ""
    echo "─────────────────────────────────────────────"
    echo "2. JWT Secret (auto-generating secure key...)"
    echo "─────────────────────────────────────────────"
    JWT_SECRET=$(generate_jwt_secret)
    sed -i.bak "s|JWT_SECRET=development-secret-key-change-for-production-12345678901234567890|JWT_SECRET=$JWT_SECRET|g" .env
    rm .env.bak 2>/dev/null || true
    echo "✓ Generated JWT secret: ${JWT_SECRET:0:16}..."

    echo ""
    echo "================================================"
    echo "✅ Local environment setup complete!"
    echo "================================================"
    echo ""
    echo "Next steps:"
    echo "1. Start services: docker-compose up"
    echo "2. Run migrations: docker-compose exec backend alembic upgrade head"
    echo "3. Seed roles: docker-compose exec backend python scripts/seed_roles.py"
    echo "4. Access services:"
    echo "   - Website: http://localhost:3000"
    echo "   - Backend API: http://localhost:8000/docs"
    echo "   - RAG Service: http://localhost:8001/health"
    echo ""

elif [ "$env_choice" = "2" ]; then
    echo ""
    echo "Setting up PRODUCTION environment..."
    echo ""

    OUTPUT_FILE=".env.production"

    if [ -f "$OUTPUT_FILE" ]; then
        read -p "$OUTPUT_FILE already exists. Overwrite? (y/N): " overwrite
        if [ "$overwrite" != "y" ] && [ "$overwrite" != "Y" ]; then
            echo "Setup cancelled."
            exit 0
        fi
    fi

    cp .env.production.template "$OUTPUT_FILE"

    echo ""
    echo "Collecting production environment variables..."
    echo ""

    # Claude API Key
    echo "─────────────────────────────────────────────"
    echo "1. Claude API Key (REQUIRED)"
    echo "─────────────────────────────────────────────"
    CLAUDE_KEY=$(prompt_input "Enter your Claude API key: " "" "secret")
    sed -i.bak "s|CLAUDE_API_KEY=sk-ant-api03-YOUR_PRODUCTION_CLAUDE_API_KEY|CLAUDE_API_KEY=$CLAUDE_KEY|g" "$OUTPUT_FILE"

    # JWT Secret
    echo ""
    echo "─────────────────────────────────────────────"
    echo "2. JWT Secret (auto-generating...)"
    echo "─────────────────────────────────────────────"
    JWT_SECRET=$(generate_jwt_secret)
    sed -i.bak "s|JWT_SECRET=CHANGE_ME_USE_OPENSSL_RAND_HEX_32_TO_GENERATE|JWT_SECRET=$JWT_SECRET|g" "$OUTPUT_FILE"
    echo "✓ Generated: ${JWT_SECRET:0:16}..."

    # Qdrant
    echo ""
    echo "─────────────────────────────────────────────"
    echo "3. Qdrant Cloud (Vector Database)"
    echo "─────────────────────────────────────────────"
    echo "Sign up at: https://cloud.qdrant.io/"
    echo ""
    QDRANT_URL=$(prompt_input "Enter Qdrant URL (e.g., https://xxx.qdrant.io): " "")
    QDRANT_KEY=$(prompt_input "Enter Qdrant API key: " "" "secret")

    if [ -n "$QDRANT_URL" ]; then
        sed -i.bak "s|QDRANT_URL=https://your-cluster-id.qdrant.io:6333|QDRANT_URL=$QDRANT_URL|g" "$OUTPUT_FILE"
    fi
    if [ -n "$QDRANT_KEY" ]; then
        sed -i.bak "s|QDRANT_API_KEY=YOUR_QDRANT_API_KEY_HERE|QDRANT_API_KEY=$QDRANT_KEY|g" "$OUTPUT_FILE"
    fi

    # Deployment URLs
    echo ""
    echo "─────────────────────────────────────────────"
    echo "4. Deployment URLs (update after deploying)"
    echo "─────────────────────────────────────────────"
    VERCEL_URL=$(prompt_input "Enter Vercel URL (or press Enter to skip): " "https://your-app.vercel.app")
    BACKEND_URL=$(prompt_input "Enter Backend URL (or press Enter to skip): " "https://physicalai-backend.onrender.com")

    if [ -n "$VERCEL_URL" ]; then
        sed -i.bak "s|FRONTEND_URL=https://your-app.vercel.app|FRONTEND_URL=$VERCEL_URL|g" "$OUTPUT_FILE"
        sed -i.bak "s|ALLOWED_ORIGINS=https://your-app.vercel.app|ALLOWED_ORIGINS=$VERCEL_URL|g" "$OUTPUT_FILE"
        sed -i.bak "s|CORS_ORIGINS=https://your-app.vercel.app|CORS_ORIGINS=$VERCEL_URL|g" "$OUTPUT_FILE"
    fi
    if [ -n "$BACKEND_URL" ]; then
        sed -i.bak "s|BACKEND_API_URL=https://physicalai-backend.onrender.com|BACKEND_API_URL=$BACKEND_URL|g" "$OUTPUT_FILE"
    fi

    # Clean up backup files
    rm "$OUTPUT_FILE".bak 2>/dev/null || true

    echo ""
    echo "================================================"
    echo "✅ Production environment file created!"
    echo "================================================"
    echo ""
    echo "File saved to: $OUTPUT_FILE"
    echo ""
    echo "⚠️  IMPORTANT SECURITY NOTES:"
    echo "1. DO NOT commit this file to git!"
    echo "2. Copy these values to your hosting platform's environment variables"
    echo "3. Delete this file after copying the values"
    echo ""
    echo "Next steps:"
    echo "1. For Vercel: Copy variables to Project Settings → Environment Variables"
    echo "2. For Render: Copy variables to Service → Environment tab"
    echo "3. Follow DEPLOY-NOW.md for full deployment guide"
    echo ""

else
    echo "Invalid choice. Exiting."
    exit 1
fi
