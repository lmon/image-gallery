#!/bin/bash
set -e

cd /Users/lmonaco/Development/image-gallery

echo "📦 Committing debug endpoint..."
git add app/api/debug/db/route.ts
git commit -m "Add database connection debug endpoint"

echo "🚀 Pushing to GitHub..."
git push

echo "✅ Changes pushed!"
echo ""
echo "Once deployed, test the connection by visiting:"
echo "https://your-vercel-domain.vercel.app/api/debug/db"
echo ""
echo "This will show:"
echo "  - Environment variable status"
echo "  - MySQL connection test"
echo "  - Work table query test"

