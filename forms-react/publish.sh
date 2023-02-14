npm run build
rm index.js.map
npm version prerelease --preid=beta
cp package.json dist
cd dist
npm publish --access public