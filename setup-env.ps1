# ==========================================
# Environment Setup Script (PowerShell)
# ==========================================
# This script helps you set up environment variables
# for local development or production deployment

$ErrorActionPreference = "Stop"

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Physical AI Platform - Environment Setup" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Function to generate JWT secret
function Generate-JWTSecret {
    $bytes = New-Object byte[] 32
    $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    $rng.GetBytes($bytes)
    return [System.BitConverter]::ToString($bytes).Replace("-", "").ToLower()
}

# Function to prompt for secure input
function Read-SecureInput {
    param(
        [string]$Prompt,
        [string]$Default = "",
        [switch]$IsSecret
    )

    if ($IsSecret) {
        $secure = Read-Host -Prompt $Prompt -AsSecureString
        $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
        $value = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
    } else {
        $value = Read-Host -Prompt $Prompt
    }

    if ([string]::IsNullOrWhiteSpace($value)) {
        return $Default
    }
    return $value
}

# Check environment type
Write-Host "What environment are you setting up?" -ForegroundColor Yellow
Write-Host "1) Local Development (with Docker Compose)"
Write-Host "2) Production Deployment (Vercel + Render)"
Write-Host ""
$envChoice = Read-Host "Enter choice (1 or 2)"

if ($envChoice -eq "1") {
    Write-Host ""
    Write-Host "Setting up LOCAL DEVELOPMENT environment..." -ForegroundColor Green
    Write-Host ""

    # Check if .env exists
    if (Test-Path ".env") {
        $overwrite = Read-Host ".env file already exists. Overwrite? (y/N)"
        if ($overwrite -ne "y" -and $overwrite -ne "Y") {
            Write-Host "Setup cancelled." -ForegroundColor Yellow
            exit 0
        }
    }

    # Copy local template
    Copy-Item ".env.local" ".env" -Force
    Write-Host "✓ Created .env file from template" -ForegroundColor Green
    Write-Host ""
    Write-Host "Now, let's configure the required variables:" -ForegroundColor Yellow
    Write-Host ""

    # Get Claude API key
    Write-Host "─────────────────────────────────────────────" -ForegroundColor Cyan
    Write-Host "1. Claude API Key (REQUIRED for RAG chatbot)" -ForegroundColor Yellow
    Write-Host "─────────────────────────────────────────────" -ForegroundColor Cyan
    Write-Host "Get your API key from: https://console.anthropic.com/"
    Write-Host ""
    $claudeKey = Read-SecureInput -Prompt "Enter your Claude API key (starts with sk-ant-)" -IsSecret

    if (-not [string]::IsNullOrWhiteSpace($claudeKey)) {
        # Update .env file
        $content = Get-Content ".env" -Raw
        $content = $content -replace "CLAUDE_API_KEY=sk-ant-api03-YOUR_ACTUAL_CLAUDE_API_KEY_HERE", "CLAUDE_API_KEY=$claudeKey"
        Set-Content ".env" -Value $content -NoNewline
        Write-Host "✓ Claude API key configured" -ForegroundColor Green
    } else {
        Write-Host "⚠ Warning: Claude API key not set. RAG chatbot won't work." -ForegroundColor Yellow
    }

    Write-Host ""
    Write-Host "─────────────────────────────────────────────" -ForegroundColor Cyan
    Write-Host "2. JWT Secret (auto-generating secure key...)" -ForegroundColor Yellow
    Write-Host "─────────────────────────────────────────────" -ForegroundColor Cyan
    $jwtSecret = Generate-JWTSecret
    $content = Get-Content ".env" -Raw
    $content = $content -replace "JWT_SECRET=development-secret-key-change-for-production-12345678901234567890", "JWT_SECRET=$jwtSecret"
    Set-Content ".env" -Value $content -NoNewline
    Write-Host "✓ Generated JWT secret: $($jwtSecret.Substring(0, 16))..." -ForegroundColor Green

    Write-Host ""
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host "✅ Local environment setup complete!" -ForegroundColor Green
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:"
    Write-Host "1. Start services: docker-compose up"
    Write-Host "2. Run migrations: docker-compose exec backend alembic upgrade head"
    Write-Host "3. Seed roles: docker-compose exec backend python scripts/seed_roles.py"
    Write-Host "4. Access services:"
    Write-Host "   - Website: http://localhost:3000"
    Write-Host "   - Backend API: http://localhost:8000/docs"
    Write-Host "   - RAG Service: http://localhost:8001/health"
    Write-Host ""

} elseif ($envChoice -eq "2") {
    Write-Host ""
    Write-Host "Setting up PRODUCTION environment..." -ForegroundColor Green
    Write-Host ""

    $outputFile = ".env.production"

    if (Test-Path $outputFile) {
        $overwrite = Read-Host "$outputFile already exists. Overwrite? (y/N)"
        if ($overwrite -ne "y" -and $overwrite -ne "Y") {
            Write-Host "Setup cancelled." -ForegroundColor Yellow
            exit 0
        }
    }

    Copy-Item ".env.production.template" $outputFile -Force

    Write-Host ""
    Write-Host "Collecting production environment variables..." -ForegroundColor Yellow
    Write-Host ""

    # Claude API Key
    Write-Host "─────────────────────────────────────────────" -ForegroundColor Cyan
    Write-Host "1. Claude API Key (REQUIRED)" -ForegroundColor Yellow
    Write-Host "─────────────────────────────────────────────" -ForegroundColor Cyan
    $claudeKey = Read-SecureInput -Prompt "Enter your Claude API key" -IsSecret
    $content = Get-Content $outputFile -Raw
    $content = $content -replace "CLAUDE_API_KEY=sk-ant-api03-YOUR_PRODUCTION_CLAUDE_API_KEY", "CLAUDE_API_KEY=$claudeKey"
    Set-Content $outputFile -Value $content -NoNewline

    # JWT Secret
    Write-Host ""
    Write-Host "─────────────────────────────────────────────" -ForegroundColor Cyan
    Write-Host "2. JWT Secret (auto-generating...)" -ForegroundColor Yellow
    Write-Host "─────────────────────────────────────────────" -ForegroundColor Cyan
    $jwtSecret = Generate-JWTSecret
    $content = Get-Content $outputFile -Raw
    $content = $content -replace "JWT_SECRET=CHANGE_ME_USE_OPENSSL_RAND_HEX_32_TO_GENERATE", "JWT_SECRET=$jwtSecret"
    Set-Content $outputFile -Value $content -NoNewline
    Write-Host "✓ Generated: $($jwtSecret.Substring(0, 16))..." -ForegroundColor Green

    # Qdrant
    Write-Host ""
    Write-Host "─────────────────────────────────────────────" -ForegroundColor Cyan
    Write-Host "3. Qdrant Cloud (Vector Database)" -ForegroundColor Yellow
    Write-Host "─────────────────────────────────────────────" -ForegroundColor Cyan
    Write-Host "Sign up at: https://cloud.qdrant.io/"
    Write-Host ""
    $qdrantUrl = Read-Host "Enter Qdrant URL (e.g., https://xxx.qdrant.io)"
    $qdrantKey = Read-SecureInput -Prompt "Enter Qdrant API key" -IsSecret

    if (-not [string]::IsNullOrWhiteSpace($qdrantUrl)) {
        $content = Get-Content $outputFile -Raw
        $content = $content -replace "QDRANT_URL=https://your-cluster-id.qdrant.io:6333", "QDRANT_URL=$qdrantUrl"
        Set-Content $outputFile -Value $content -NoNewline
    }
    if (-not [string]::IsNullOrWhiteSpace($qdrantKey)) {
        $content = Get-Content $outputFile -Raw
        $content = $content -replace "QDRANT_API_KEY=YOUR_QDRANT_API_KEY_HERE", "QDRANT_API_KEY=$qdrantKey"
        Set-Content $outputFile -Value $content -NoNewline
    }

    # Deployment URLs
    Write-Host ""
    Write-Host "─────────────────────────────────────────────" -ForegroundColor Cyan
    Write-Host "4. Deployment URLs (update after deploying)" -ForegroundColor Yellow
    Write-Host "─────────────────────────────────────────────" -ForegroundColor Cyan
    $vercelUrl = Read-Host "Enter Vercel URL (or press Enter to skip)"
    $backendUrl = Read-Host "Enter Backend URL (or press Enter to skip)"

    if (-not [string]::IsNullOrWhiteSpace($vercelUrl)) {
        $content = Get-Content $outputFile -Raw
        $content = $content -replace "FRONTEND_URL=https://your-app.vercel.app", "FRONTEND_URL=$vercelUrl"
        $content = $content -replace "ALLOWED_ORIGINS=https://your-app.vercel.app", "ALLOWED_ORIGINS=$vercelUrl"
        $content = $content -replace "CORS_ORIGINS=https://your-app.vercel.app", "CORS_ORIGINS=$vercelUrl"
        Set-Content $outputFile -Value $content -NoNewline
    }
    if (-not [string]::IsNullOrWhiteSpace($backendUrl)) {
        $content = Get-Content $outputFile -Raw
        $content = $content -replace "BACKEND_API_URL=https://physicalai-backend.onrender.com", "BACKEND_API_URL=$backendUrl"
        Set-Content $outputFile -Value $content -NoNewline
    }

    Write-Host ""
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host "✅ Production environment file created!" -ForegroundColor Green
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "File saved to: $outputFile" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  IMPORTANT SECURITY NOTES:" -ForegroundColor Yellow
    Write-Host "1. DO NOT commit this file to git!"
    Write-Host "2. Copy these values to your hosting platform's environment variables"
    Write-Host "3. Delete this file after copying the values"
    Write-Host ""
    Write-Host "Next steps:"
    Write-Host "1. For Vercel: Copy variables to Project Settings → Environment Variables"
    Write-Host "2. For Render: Copy variables to Service → Environment tab"
    Write-Host "3. Follow DEPLOY-NOW.md for full deployment guide"
    Write-Host ""

} else {
    Write-Host "Invalid choice. Exiting." -ForegroundColor Red
    exit 1
}
