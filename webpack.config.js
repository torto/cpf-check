const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

function base(options) {
    return {
        entry: './src/index.html',
        
        output: {
            path: './dist/',
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
        ].concat(options.plugins),

        devtool: "source-map",
    };
}

if (process.env.NODE_ENV === 'production') {
    module.exports = base({
        output: {
            filename: 'cpf.js'
        },
        plugins: [],
    });
} else {
    module.exports = base({
        output: {
            filename: 'cpf.development.js',
        },

        plugins: [
            new CircularDependencyPlugin(circularDepsConfig),
        ]
    })
}
