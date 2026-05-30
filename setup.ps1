# =========================================================================
# Bodhika Enterprise Platform - Windows Setup & Initialization Script
# =========================================================================

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Initializing Bodhika Enterprise Starter Platform (Windows)..." -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Detect PostgreSQL Installation
Write-Host "`n[1/5] Checking for PostgreSQL..." -ForegroundColor Yellow
$psqlPath = $null

# Check if psql is in current PATH
$psqlCmd = Get-Command psql -ErrorAction SilentlyContinue
if ($psqlCmd) {
    $psqlPath = $psqlCmd.Source
    Write-Host "Found psql in PATH: $psqlPath" -ForegroundColor Green
} else {
    # Check common installation directories
    Write-Host "psql not in system PATH. Searching in C:\Program Files\PostgreSQL..." -ForegroundColor Gray
    $commonPaths = Get-ChildItem -Path "C:\Program Files\PostgreSQL" -Filter "psql.exe" -Recurse -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending
    
    if ($commonPaths -and $commonPaths.Count -gt 0) {
        $psqlFile = $commonPaths[0]
        $psqlPath = $psqlFile.FullName
        $binDir = [System.IO.Path]::GetDirectoryName($psqlPath)
        
        # Add to current session's path
        $env:PATH = "$binDir;$env:PATH"
        Write-Host "Found psql in directory: $psqlPath" -ForegroundColor Green
        Write-Host "Temporarily added $binDir to current process PATH." -ForegroundColor Gray
    }
}

# 2. Install PostgreSQL if missing
if (-not $psqlPath) {
    Write-Host "PostgreSQL is NOT detected on this system." -ForegroundColor Red
    Write-Host "Attempting silent installation via Windows Package Manager (winget)..." -ForegroundColor Cyan
    
    $wingetCheck = Get-Command winget -ErrorAction SilentlyContinue
    if ($wingetCheck) {
        Write-Host "Running: winget install PostgreSQL.PostgreSQL..." -ForegroundColor Gray
        & winget install PostgreSQL.PostgreSQL --silent --accept-package-agreements --accept-source-agreements
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "winget installation completed successfully!" -ForegroundColor Green
            # Wait a few seconds for registry and directories to update
            Start-Sleep -Seconds 5
            
            # Research standard directory
            $commonPaths = Get-ChildItem -Path "C:\Program Files\PostgreSQL" -Filter "psql.exe" -Recurse -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending
            if ($commonPaths -and $commonPaths.Count -gt 0) {
                $psqlPath = $commonPaths[0].FullName
                $binDir = [System.IO.Path]::GetDirectoryName($psqlPath)
                $env:PATH = "$binDir;$env:PATH"
                Write-Host "psql found after installation: $psqlPath" -ForegroundColor Green
            }
        } else {
            Write-Host "Winget installation returned an error. (Exit code: $LASTEXITCODE)" -ForegroundColor Yellow
            Write-Host "Please download and install PostgreSQL manually from: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
        }
    } else {
        Write-Host "winget is not available on this system. Please install PostgreSQL manually." -ForegroundColor Red
    }
}

# 3. Verify / Start PostgreSQL Service
Write-Host "`n[2/5] Checking PostgreSQL Service Status..." -ForegroundColor Yellow
$pgService = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue

if ($pgService) {
    Write-Host "PostgreSQL Service found: $($pgService.Name) (Status: $($pgService.Status))" -ForegroundColor Cyan
    if ($pgService.Status -ne 'Running') {
        Write-Host "Starting PostgreSQL service..." -ForegroundColor Gray
        Start-Service -Name $pgService.Name -ErrorAction SilentlyContinue
        
        # Check status again
        $pgService = Get-Service -Name $pgService.Name
        if ($pgService.Status -eq 'Running') {
            Write-Host "Service started successfully!" -ForegroundColor Green
        } else {
            Write-Host "Warning: Could not start PostgreSQL service automatically." -ForegroundColor Yellow
            Write-Host "Please start the service manually using Services.msc or an elevated cmd: 'net start $($pgService.Name)'" -ForegroundColor Yellow
        }
    } else {
        Write-Host "PostgreSQL service is already running." -ForegroundColor Green
    }
} else {
    Write-Host "PostgreSQL service not registered. If just installed, you may need to restart your terminal or machine." -ForegroundColor Yellow
}

# 4. Provision default database
Write-Host "`n[3/5] Seeding Default Database..." -ForegroundColor Yellow
if ($psqlPath) {
    Write-Host "Creating database 'bodhika_enterprise' (using user: postgres)..." -ForegroundColor Gray
    
    # We set default PGPASSWORD. EDB Windows installer defaults to "password" or blank depending on configuration.
    $env:PGPASSWORD = "password"
    
    # Attempt to create database
    & psql -U postgres -h localhost -d postgres -c "CREATE DATABASE bodhika_enterprise;" 2>&1 | Out-Null
    
    # Verify database connection and check if database exists
    $dbCheck = & psql -U postgres -h localhost -d postgres -t -c "SELECT 1 FROM pg_database WHERE datname='bodhika_enterprise';" 2>$null
    if ($dbCheck -and $dbCheck.Trim() -eq "1") {
        Write-Host "Database 'bodhika_enterprise' is ready!" -ForegroundColor Green
    } else {
        Write-Host "Database provisioning query completed. (Ensure PostgreSQL is running and postgres user has password 'password')" -ForegroundColor Cyan
    }
} else {
    Write-Host "Skipping database seeding because psql is not available on the path." -ForegroundColor Yellow
}

# 5. Set up Environment Variables (.env)
Write-Host "`n[4/5] Copying Environment Configurations..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "Created .env file from .env.example" -ForegroundColor Green
} else {
    Write-Host ".env file already exists. Skipping copy." -ForegroundColor Cyan
}

# 6. Install Node Modules dependencies
Write-Host "`n[5/5] Installing Workspace Dependencies..." -ForegroundColor Yellow
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
