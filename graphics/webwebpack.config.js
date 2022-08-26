const path = require('path');

const webClientConfig = {
    target: 'web',
    mode: 'development',
    devtool: 'source-map',
    entry: './src/index_web.ts',
    module: {
        rules: [{
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
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192
                    }
                }]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            }
            /* , {
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
        filename: 'tuval-graphics.js',
        library: 'Tuval',
        path: path.resolve(__dirname, 'dist_web'),
    },
    plugins: [

    ]
};

module.exports = [webClientConfig];