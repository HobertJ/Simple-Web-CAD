const path = require('path');

module.exports = {
    entry: './src/index.ts',
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, 'public/dist'),
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ],
    },
    resolve: {
        extensions: ['.ts', '.js', '.jsx', 'tsx'],
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public/dist'), // Serve content from the dist directory
        },
        compress: true,
        port: 9000,
    }
}