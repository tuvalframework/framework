const path = require('path');
const DeclarationBundlerPlugin = require('./declaration-bundler-webpack-plugin.fix');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TypedocWebpackPlugin = require('typedoc-webpack-plugin');
const DtsBundleWebpack = require('dts-bundle-webpack');
const fs = require('fs');

var libraryName = '@tuval/forms';

function DtsBundlePlugin() {}
DtsBundlePlugin.prototype.apply = function(compiler) {
    compiler.plugin('done', function() {
        var dts = require('dts-bundle');
        if (!dts) {
            throw 'Dts not found.';
        }
        dts.bundle({
            name: libraryName,
            main: 'dist_types/types/index.d.ts',
            out: '../../dist/index.d.ts',
            verbose: true,
            removeSource: true,
            removeSource: false,
            outputAsModuleFolder: true // to use npm in-package typings
        });
    });
};

const opts = {
    WEB: true,
    NODE: false,
    version: 3,
    "ifdef-verbose": true, // add this for verbose output
    //"ifdef-triple-slash": false // add this to use double slash comment instead of default triple slash
};

const umdConfig = {
    mode: 'development',
    devtool: 'source-map',
    entry: './src/index.ts',
    externals: [
        '@tuval/core',
        '@tuval/cg',
        '@tuval/graphics',
        '@tuval/components/buttons',
        '@tuval/components/calendars',
        '@tuval/components/compression',
        '@tuval/components/core',
        '@tuval/components/data',
        '@tuval/components/diagram',
        '@tuval/components/dropdowns',
        '@tuval/components/excelexport',
        '@tuval/components/filemanager',
        '@tuval/components/fileutils',
        '@tuval/components/grids',
        '@tuval/components/inputs',
        '@tuval/components/layouts',
        '@tuval/components/lists',
        '@tuval/components/navigations',
        '@tuval/components/pdfexport',
        '@tuval/components/popups',
        '@tuval/components/splitbuttons',
        '@tuval/components/charts',
        '@tuval/components/svgbase',
        '@tuval/brokers/client',
    ],
    module: {
        rules: [
            /*   {
                test: /\.js$/,
                use: ['babel-loader', 'webpack-conditional-loader']
              }, */
            {
                test: /\.(wasm|eot|woff|woff2|svg|ttf)([\?]?.*)$/,
                type: 'javascript/auto',
                loader: 'arraybuffer-loader',
            },
            {
                test: /\.tsx?$/,
                //use: 'ts-loader',
                use: [
                    { loader: "ts-loader" },
                    //  { loader: "ifdef-loader", options: opts }
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['to-string-loader', 'css-loader']
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192
                    }
                }]
            },
            /*  {
               test: /\.(woff|woff2|eot|ttf|otf)$/,
               use: [
                 'file-loader'
               ]
             } */
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        fallback: {
            child_process: false,
            fs: false,
            crypto: false,
            net: false,
            tls: false,
            ws: false,
            os: false,
            path: false
        }
    },
    output: {
        libraryTarget: 'umd',
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        //new BundleAnalyzerPlugin(),
        {
            apply: (compiler) => {
                compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
                    var dts = require('dts-bundle');

                    dts.bundle({
                        name: libraryName,
                        main: 'dist_types/types/index.d.ts',
                        out: '../../dist/index.d.ts',
                        removeSource: true,
                        outputAsModuleFolder: true // to use npm in-package typings
                    });
                });
            }
        },
        {
            apply: (compiler) => {
                compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
                    fs.appendFile('./dist/index.js', `
// console.log('forms module loaded.');
`, (err) => {
                        if (err) throw err;
                        console.log('The lyrics were updated!');
                    });
                });
            }
        }
        /* new DtsBundleWebpack({
            name:libraryName,
            main: 'dist_types/types/index.d.ts',
            out: '../../dist/index.d.ts',
        }) */
        /* new CleanWebpackPlugin(
         {
           cleanAfterEveryBuildPatterns: ['./@types', './dist']
         }),  */
        /*   new DeclarationBundlerPlugin({
            moduleName: '"@tuval/core"',
            out: '../@types/index.d.ts',
          }), */
        //new DtsBundlePlugin(),
        /*  new CopyWebpackPlugin([
           {
             from: './dist/index.d.ts',
             to: '../diagram/node_modules/@tuval/core/index.d.ts'
           }
         ]),  */
        // new BundleAnalyzerPlugin(),
        /*  new TypedocWebpackPlugin({
          out: '../docs',
          module: 'commonjs',
          target: 'es6',
          name: 'Tuval Framework - Core',
          mode: 'file',
          theme: 'minimal',
          includeDeclarations: false,
          ignoreCompilerErrors: true,
        })  */
    ]
};

module.exports = [umdConfig /* webClientConfig */ /* umdConfig */ /* , umdWebProcess */ ];