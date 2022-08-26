const DeclarationBundlerPlugin = require('declaration-bundler-webpack-plugin');

let buggyFunc = DeclarationBundlerPlugin.prototype.generateCombinedDeclaration;
DeclarationBundlerPlugin.prototype.generateCombinedDeclaration = function (declarationFiles) {
    for (var fileName in declarationFiles) {
        let declarationFile = declarationFiles[fileName];
        declarationFile._value = declarationFile._value || declarationFile.source();
    }
    return buggyFunc.call(this, declarationFiles);
}

module.exports = DeclarationBundlerPlugin;