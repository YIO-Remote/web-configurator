const merge = require('webpack-merge');
const production = require('./webpack.config.prod');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(production, {
    plugins: [
        new BundleAnalyzerPlugin({
            analyzerMode: 'server'
        })
    ]
});
