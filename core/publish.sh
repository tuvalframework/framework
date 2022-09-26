echo "Starting"
npm run buildnode
npm run build
npm version patch -m "Upgrade to new version"

cp package.json dist
cd dist
mkdir node
cp ../dist_node/index.js node
rm index.js.map
npm publish --access public