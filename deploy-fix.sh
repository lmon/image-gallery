#!/bin/bash
set -e

echo "📦 Committing changes..."
git add components/ImageDetail.tsx
git commit -m "Remove comments field from ImageDetail component"

echo "🚀 Pushing to GitHub..."
git push

echo "✅ Changes pushed! Vercel will automatically deploy in a few moments."
echo "Check your deployment at: https://vercel.com/dashboard"

