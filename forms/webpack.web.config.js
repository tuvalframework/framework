const path = require('path');
const DeclarationBundlerPlugin = require('./declaration-bundler-webpack-plugin.fix');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TypedocWebpackPlugin = require('typedoc-webpack-plugin');

const opts = {
    WEB: true,
    NODE: false,
    version: 3,
    "ifdef-verbose": true, // add this for verbose output
    //"ifdef-triple-slash": false // add this to use double slash comment instead of default triple slash
};

var libraryName = '@tuval/forms';

const webConfig = {
    target: 'web',
    //target: 'es5',
    mode: 'development',
    devtool: 'source-map',
    entry: './src/index.ts',
    module: {
        rules: [
            /*  {
               test: /\.js$/,
               use: ['babel-loader', 'webpack-conditional-loader']
             }, */
            {
                test: /\.tsx?$/,
                use: [
                    { loader: "ts-loader", options: { configFile: 'web.tsconfig.json' } },
                    { loader: "ifdef-loader", options: opts }
                ],
                exclude: /node_modules/,

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
        filename: 'tuval-forms.js',
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