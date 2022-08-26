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

const umdWebWorkerConfig = {
    mode: 'development',
    devtool: 'none',
    entry: './src/index_wp.ts',
    externals: {
      '@tuval/core': 'tuval$core',
      '@tuval/cg': 'tuval$core$graphics'
    },
    module: {
      rules: [
        {
          test: /\.wasm$/,
          type: 'javascript/auto',
          loaders: ['arraybuffer-loader'],
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
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
        }
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      libraryTarget: 'umd',
      filename: 'tuval-graphics-wp.js',
      path: path.resolve(__dirname, 'dist_wp'),
      globalObject: 'self'
    },
  };


module.exports = [umdWebWorkerConfig];