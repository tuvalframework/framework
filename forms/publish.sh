npm run build
rm index.js.map
npm version patch -m "Upgrade to new version"
cp package.json dist
cd dist
npm publish --access public