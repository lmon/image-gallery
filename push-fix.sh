#!/bin/bash
set -e

cd /Users/lmonaco/Development/image-gallery

echo "📦 Committing dateCreated fix..."
git add components/ImageDetail.tsx
git commit -m "Fix dateCreated to allow null values"

echo "🚀 Pushing to GitHub..."
git push

echo "✅ Changes pushed! Check Vercel deployment at: https://vercel.com/dashboard"

