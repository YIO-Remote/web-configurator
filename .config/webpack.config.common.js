const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader').VueLoaderPlugin;
const pkg = require('../package.json');

module.exports = {
    context: path.resolve(__dirname, '../src'),
    entry: './index.ts',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.js', '.ts', '.html', '.css', 'scss', '.json']
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.ts$/,
                loader: 'ts-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg|ttf|woff|woff2|eot)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    }
                ]
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: 'index.html',
            favicon: '../assets/images/favicon-32.png'
        }),
        new webpack.DefinePlugin({
            'process.env.__VERSION__': JSON.stringify(pkg.version)
        })
    ]
};