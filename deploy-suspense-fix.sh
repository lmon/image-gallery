#!/bin/bash
set -e

cd /Users/lmonaco/Development/image-gallery

echo "📦 Committing Suspense fix for admin page..."
git add app/admin/page.tsx components/admin/AdminContent.tsx
git commit -m "Fix useSearchParams Suspense boundary requirement"

echo "🚀 Pushing to GitHub..."
git push

echo "✅ Changes pushed! Vercel will deploy automatically."

