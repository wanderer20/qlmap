const path              = require('path')
const webpack           = require('webpack')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require("copy-webpack-plugin")
const uglifyJsPlugin    = require('uglifyjs-webpack-plugin')

module.exports = {
    entry: './src/index.js',
    output: {
        library: 'QLMap',
        libraryTarget: 'umd',
        libraryExport: 'default',
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '/img/[name].[ext]'
                    }
                }]
            },
            // {
            //     test: /\.svg$/,
            //     use: [
            //         {
            //             loader: 'svg-inline-loader'
            //         },
            //     ],
            // }

        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                from: "./src/maps",
                to: "./maps"
            },
        ]),
        new uglifyJsPlugin(),
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, 'dist/index.html')
        }),
        new webpack.HotModuleReplacementPlugin(),
    ]
}