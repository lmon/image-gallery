#!/bin/bash
set -e

cd /Users/lmonaco/Development/image-gallery

echo "📦 Committing NextAuth type definitions..."
git add types/next-auth.d.ts components/ImageDetail.tsx
git commit -m "Add NextAuth type definitions and fix dateCreated null handling"

echo "🚀 Pushing to GitHub..."
git push

echo "✅ Changes pushed! Check Vercel deployment at: https://vercel.com/dashboard"

