#!/bin/bash

echo "=== COMPLETE BUILD DIAGNOSTIC ==="
echo ""

echo "1. main.tsx content:"
cat src/main.tsx
echo ""

echo "2. TypeScript check:"
npx tsc --noEmit 2>&1 | head -20
echo ""

echo "3. Vite build test:"
rm -rf dist/
npx vite build 2>&1 | tail -30
echo ""

echo "4. Check build output:"
ls -la dist/ 2>/dev/null || echo "No dist folder"
echo ""

if [ -f "dist/index.html" ]; then
  echo "5. index.html content:"
  cat dist/index.html
  echo ""
  echo "6. Script tags:"
  grep -i script dist/index.html || echo "No script tags"
fi