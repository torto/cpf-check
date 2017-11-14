const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const resolve = (path) => require('path').resolve(process.cwd(), path);
const webpack = require('webpack');


function base(options) {
    return {
        entry: './src/index.js',
        
        output: {
            path: resolve('dist/'),
            filename: options.output.filename,
            library: 'cpf',
            libraryTarget: 'umd',
            libraryExport: 'default',
            sourceMapFilename: 'cpf.min.map'
        },

        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: [{
                        loader: 'babel-loader'
                    }],
                    enforce: 'pre'
                }
            ],
        },

        plugins: [
            new webpack.EnvironmentPlugin(['NODE_ENV']),
        ],

        devtool: options.devtool,
    };
}

if (process.env.NODE_ENV === 'production') {
    module.exports = base({
        output: {
            filename: 'cpf.js'
        },
        devtool: "source-map",
    });
} else {
    module.exports = base({
        output: {
            filename: 'cpf.development.js',
        },
        devtool: "eval",
    })
}
