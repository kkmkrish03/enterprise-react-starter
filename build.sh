#!/bin/bash
echo "Building Enterprise Frontend Platform for production..."
npx nx build admin
echo "Build complete. Artifacts are in dist/apps/admin."
