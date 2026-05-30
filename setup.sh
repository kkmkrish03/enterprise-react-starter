#!/bin/bash
# =========================================================================
# Bodhika Enterprise Platform - Unix/macOS Setup & Initialization Script
# =========================================================================

set -e

echo -e "\033[0;36m==========================================================\033[0m"
echo -e "\033[0;36mInitializing Bodhika Enterprise Starter Platform (Unix)...\033[0m"
echo -e "\033[0;36m==========================================================\033[0m"

# 1. Detect PostgreSQL Installation
echo -e "\n\033[0;33m[1/5] Checking for PostgreSQL...\033[0m"
if command -v psql >/dev/null 2>&1; then
    echo -e "\033[0;32mPostgreSQL is already installed: $(which psql)\033[0m"
else
    echo -e "\033[0;31mPostgreSQL is not detected on your system.\033[0m"
    
    # Detect Operating System
    OS="$(uname -s)"
    case "${OS}" in
        Linux*)
            if [ -f /etc/debian_version ]; then
                echo -e "Debian/Ubuntu detected. Installing PostgreSQL via apt..."
                sudo apt-get update
                sudo apt-get install -y postgresql postgresql-contrib
            elif [ -f /etc/redhat-release ]; then
                echo -e "RHEL/CentOS detected. Installing PostgreSQL via yum..."
                sudo yum install -y postgresql-server postgresql-contrib
                sudo postgresql-setup initdb || true
            else
                echo -e "\033[0;31mUnsupported Linux distribution. Please install PostgreSQL manually.\033[0m"
            fi
            ;;
        Darwin*)
            echo -e "macOS detected. Installing PostgreSQL via Homebrew..."
            if command -v brew >/dev/null 2>&1; then
                brew install postgresql@16
                brew link postgresql@16 --force || true
            else
                echo -e "\033[0;31mHomebrew is not installed. Please install Homebrew or install PostgreSQL manually.\033[0m"
            fi
            ;;
        *)
            echo -e "\033[0;31mUnknown OS: ${OS}. Please install PostgreSQL manually.\033[0m"
            ;;
    esac
fi

# 2. Verify / Start PostgreSQL Service
echo -e "\n\033[0;33m[2/5] Checking PostgreSQL Service Status...\033[0m"
OS="$(uname -s)"
if [ "${OS}" = "Darwin" ]; then
    if command -v brew >/dev/null 2>&1; then
        echo "Ensuring PostgreSQL service is started via Homebrew services..."
        brew services start postgresql@16 || brew services start postgresql || true
    fi
elif [ "${OS}" = "Linux" ]; then
    echo "Ensuring PostgreSQL service is running..."
    sudo systemctl start postgresql || sudo service postgresql start || true
fi

# 3. Seeding Database
echo -e "\n\033[0;33m[3/5] Seeding Default Database...\033[0m"
if command -v psql >/dev/null 2>&1; then
    echo "Creating database 'bodhika_enterprise' if not exists..."
    export PGPASSWORD="password"
    
    # Try with password default first
    psql -U postgres -h localhost -d postgres -c "CREATE DATABASE bodhika_enterprise;" >/dev/null 2>&1 || true
    
    # If connection refused or password error, try peer authentication via sudo for Linux
    if [ "${OS}" = "Linux" ]; then
        sudo -u postgres createdb bodhika_enterprise >/dev/null 2>&1 || true
    fi
    echo -e "\033[0;32mDatabase query completed.\033[0m"
else
    echo -e "\033[0;33mpsql command not available. Skipping database creation.\033[0m"
fi

# 4. Environment File Configuration
echo -e "\n\033[0;33m[4/5] Copying Environment Configurations...\033[0m"
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "\033[0;32mCreated .env file from .env.example\033[0m"
else
    echo -e "\033[0;34m.env file already exists. Skipping copy.\033[0m"
fi

# 5. Dependency installation
echo -e "\n\033[0;33m[5/5] Installing Workspace Dependencies...\033[0m"
npm install

echo -e "\n\033[0;32m==========================================================\033[0m"
echo -e "\033[0;32mSetup Completed! You can now run the project using:\033[0m"
echo -e "\033[0;32m  npm run dev\033[0m"
echo -e "\033[0;32m==========================================================\033[0m"
