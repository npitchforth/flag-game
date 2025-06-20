#!/bin/bash

# Development Workflow Script - Prevents Duplicates
set -e

echo "🚀 Starting safe development workflow..."

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  You have uncommitted changes. Please commit or stash them first."
    echo "   git add -A && git commit -m 'Save current state'"
    exit 1
fi

# Check for duplicate folders
DUPLICATES=$(find . -maxdepth 1 -name "* 2*" -o -name "*_backup*" -o -name "*_copy*" -o -name "*_duplicate*")
if [ ! -z "$DUPLICATES" ]; then
    echo "⚠️  Found potential duplicate folders:"
    echo "$DUPLICATES"
    echo "Please clean these up before proceeding."
    exit 1
fi

# Build web assets
echo "📦 Building web assets..."
npm run build

# Sync with Capacitor
echo "🔄 Syncing with Capacitor..."
npx cap sync

# Check if Android build works
echo "🤖 Testing Android build..."
cd android
./gradlew assembleDebug
cd ..

echo "✅ All checks passed! Your project is clean and ready."
echo "💡 Use 'npm run cap:build:android' for future builds" 