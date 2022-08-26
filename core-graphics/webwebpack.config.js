const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
var target = 'web';
var libraryName = '@tuval/core-graphics';
function DtsBundlePlugin() { }
DtsBundlePlugin.prototype.apply = function (compiler) {
    compiler.plugin('done', function () {
        var dts = require('dts-bundle');

        dts.bundle({
            name: libraryName,
            main: 'dist_types/types/index.d.ts',
            out: '../../dist/index.d.ts',
            removeSource: true,
            outputAsModuleFolder: true // to use npm in-package typings
        });
    });
};

const webClientConfig = {
    target: 'web',
    mode: 'development',
    devtool: 'source-map',
    entry: './src/index_web.ts',
    module: {
        rules: [

            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.wasm$/,
                type: 'javascript/auto',
                loaders: ['arraybuffer-loader'],
            },
            {
                test: /\.css$/,
                use: ['to-string-loader', 'css-loader']
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192
                        }
                    }
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            }/* , {
                test: /\.js$/,
                use: ['webpack-conditional-loader']
            }, */
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    node: {
        child_process: 'empty',
        fs: 'empty',
        crypto: 'empty',
        net: 'empty',
        tls: 'empty'
    },
    output: {
        filename: 'tuval-core-graphics.js',
        library: 'Tuval',
        path: path.resolve(__dirname, 'dist_web'),
    },
    plugins: [
        /*   new CleanWebpackPlugin(
            {
              cleanAfterEveryBuildPatterns: ['./@types', './dist']
            }), */
        /*  new DeclarationBundlerPlugin({
           moduleName: '"@tuval/core"',
           out: '../@types/index.d.ts',
         }),  */
        /* new CopyWebpackPlugin([
          {
            from: './dist/tuval-core.js',
            to: './../graphics/node_modules/@tuval/core/index.js',
          },
          {
            from: './types/package.json',
            to: '../@types/package.json',
          },
          {
            from: './src/package.json',
            to: '../dist/package.json',
          },
        ]), */
    ]
};


module.exports = [webClientConfig];