const path = require('path');

module.exports = {
    mode: "development",
    devtool: "inline-source-map",
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
        extensions: ['.ts', '.js', '.jsx', '.tsx'],
        alias : {
            Main: path.resolve(__dirname, 'src/'),
            Operations : path.resolve(__dirname, 'src/Operations/'),
            Shapes: path.resolve(__dirname, 'src/2D-Shapes/'),
            Base: path.resolve(__dirname, 'src/Base/'),
            Functions: path.resolve(__dirname, 'src/Functions/'),
            Utils: path.resolve(__dirname, 'src/Utils/'),
            Interfaces: path.resolve(__dirname, 'src/2D-Shapes/Interfaces/'),
        }
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public/dist'), // Serve content from the dist directory
        },
        compress: true,
        port: 9000,
    }
}