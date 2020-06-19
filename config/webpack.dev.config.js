const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
console.log(__dirname, '-------------')
module.exports = {
    mode: 'development',
    entry: './index.tsx',
    output: {
        path: __dirname + "/build",
        filename: "bundle.js"
    },
    module: {
        //loaders加载器
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: "babel-loader",
            },
            {
                test: /\.(png|jpg|gif)$/i,
                loader: 'url-loader',
                options: {
                    esModule: false, // 这里设置为false
                }
            },
            {
                test: /\.(tsx|ts)?$/,
                use: 'awesome-typescript-loader',
                exclude: /node_modules/
            }
        ]
    },
    devServer: {
        hot: true,
        port: 8080,
        progress: true,
        contentBase: './build',
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "QZ REACT",
            template: 'index.html'
        })
    ],
    resolve: {
        extensions: ['.js', '.jsx', ".ts", ".tsx"], //后缀名自动补全
    }
};