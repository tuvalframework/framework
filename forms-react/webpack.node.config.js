const path = require('path');
const DeclarationBundlerPlugin = require('./declaration-bundler-webpack-plugin.fix');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TypedocWebpackPlugin = require('typedoc-webpack-plugin');


const opts = {
    WEB: false,
    NODE: true,
    version: 3,
    "ifdef-verbose": true, // add this for verbose output
    //"ifdef-triple-slash": false // add this to use double slash comment instead of default triple slash
};

var libraryName = '@tuval/core';

const nodeConfig = {
    mode: 'development',
    target: 'node',
    devtool: 'source-map',
    //devtool: 'none',
    entry: './src/tuval-core.ts',
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
                    { loader: "ifdef-loader", options: opts }
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
        /* fallback: {
            child_process: false,
            fs: false,
            crypto: false,
            net: false,
            tls: false,
            ws: false,
            os: false,
            path: false
        } */
    },
    output: {
        /* libraryTarget: 'global', */
        filename: 'index.js',
        library: {
            name: 'Tuval',
            type: 'umd',
        },
        path: path.resolve(__dirname, 'dist_node'),
    },
    plugins: [
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

module.exports = [nodeConfig /* webClientConfig */ /* umdConfig */ /* , umdWebProcess */ ];