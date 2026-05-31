# =========================================================================
# Bodhika Enterprise Platform - Windows Setup & Initialization Script
# =========================================================================

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Initializing Bodhika Enterprise Starter Platform (Windows)..." -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Local-first mode enabled. Data will persist in browser LocalStorage." -ForegroundColor Cyan

# 1. Set up Environment Variables (.env)
Write-Host "`n[1/2] Copying Environment Configurations..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "Created .env file from .env.example" -ForegroundColor Green
} else {
    Write-Host ".env file already exists. Skipping copy." -ForegroundColor Cyan
}

# 2. Install Node Modules dependencies
Write-Host "`n[2/2] Installing Workspace Dependencies..." -ForegroundColor Yellow
Write-Host "Running: npm install..." -ForegroundColor Gray
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nWorkspace dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "`nWarning: npm install completed with errors or warnings." -ForegroundColor Yellow
}

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "Setup Completed! You can now run the project using:" -ForegroundColor Green
Write-Host "  npm run dev" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
