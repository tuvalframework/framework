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

const umdWepWorkerConfig = {
    mode: 'development',
    devtool: 'none',
    entry: './src/index_wp.ts',
    module: {
      rules: [
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
    externals: {
      '@tuval/core': 'tuval$core'
    },
    /* externals: {
           "@tuval/core": "tuval.desktop.core"
          }, */
    output: {
      libraryTarget: 'umd',
      filename: 'tuval-core-graphics-wp.js',
      path: path.resolve(__dirname, 'dist_wp'),
      globalObject: 'self'
    }
  };


module.exports = [umdWepWorkerConfig];