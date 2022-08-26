git add .
git commit -m "."
npm run build
rm index.js.map
npm version patch -m "Upgrade to new version"
git commit -m "version updated"
cp package.json dist
cd dist
npm publish --access public