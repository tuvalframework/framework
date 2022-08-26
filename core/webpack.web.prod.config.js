const path = require('path');
const DeclarationBundlerPlugin = require('./declaration-bundler-webpack-plugin.fix');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TypedocWebpackPlugin = require('typedoc-webpack-plugin');


var libraryName = '@tuval/core';

const webConfig = {
    target: 'web',
    //target: 'es5',
    //mode: 'development',
    //devtool: 'source-map',
    entry: './src/tuval-core.ts',
    module: {
        rules: [
            /*  {
               test: /\.js$/,
               use: ['babel-loader', 'webpack-conditional-loader']
             }, */
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    configFile: 'web.tsconfig.json'
                }
            },
            {
                test: /\.(wasm|eot|woff|woff2|svg|ttf)([\?]?.*)$/,
                type: 'javascript/auto',
                loader: 'arraybuffer-loader',
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
            /* {
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
        filename: 'tuval-core.js',
        library: {
            name: 'Tuval',
            type: 'assign-properties',
        },
        path: path.resolve(__dirname, 'dist_web'),
    },
    plugins: [
        //new BundleAnalyzerPlugin(),
    ]
};

module.exports = [webConfig /* webClientConfig */ /* umdConfig */ /* , umdWebProcess */ ];