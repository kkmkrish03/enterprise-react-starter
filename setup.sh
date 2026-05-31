#!/bin/bash
# =========================================================================
# Bodhika Enterprise Platform - Unix/macOS Setup & Initialization Script
# =========================================================================

set -e

echo -e "\033[0;36m==========================================================\033[0m"
echo -e "\033[0;36mInitializing Bodhika Enterprise Starter Platform (Unix)...\033[0m"
echo -e "\033[0;36m==========================================================\033[0m"
echo -e "\033[0;36mLocal-first mode enabled. Data will persist in browser LocalStorage.\033[0m"

# 1. Environment File Configuration
echo -e "\n\033[0;33m[1/2] Copying Environment Configurations...\033[0m"
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "\033[0;32mCreated .env file from .env.example\033[0m"
else
    echo -e "\033[0;34m.env file already exists. Skipping copy.\033[0m"
fi

# 2. Dependency installation
echo -e "\n\033[0;33m[2/2] Installing Workspace Dependencies...\033[0m"
npm install

echo -e "\n\033[0;32m==========================================================\033[0m"
echo -e "\033[0;32mSetup Completed! You can now run the project using:\033[0m"
echo -e "\033[0;32m  npm run dev\033[0m"
echo -e "\033[0;32m==========================================================\033[0m"
