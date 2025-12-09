#!/bin/bash
set -e

cd /Users/lmonaco/Development/image-gallery

echo "📦 Committing environment debug endpoint..."
git add app/api/debug/env/route.ts
git commit -m "Add environment variables debug endpoint"

echo "🚀 Pushing to GitHub..."
git push

echo "✅ Changes pushed!"
echo ""
echo "After deployment, visit:"
echo "https://your-vercel-domain.vercel.app/api/debug/env"
echo ""
echo "This will show which environment variables are actually set in production."

