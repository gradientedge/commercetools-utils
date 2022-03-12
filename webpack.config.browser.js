const path = require('path')
const webpack = require('webpack')

process.env.GECTU_IS_BROWSER = '1'

module.exports = {
  mode: 'production',
  target: 'web',
  devtool: 'source-map',
  entry: {
    cjs: {
      import: './dist/cjs/index',
      library: {
        type: 'commonjs',
      },
    },
    esm: {
      import: './dist/esm/index',
      library: {
        type: 'module',
      },
    },
  },
  externals: {
    https: 'https',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'ge-commercetools-utils-browser.[name].js',
  },
  plugins: [
    new webpack.EnvironmentPlugin(['GECTU_IS_BROWSER']),
    new webpack.IgnorePlugin({
      resourceRegExp: /^https$/,
    }),
  ],
  experiments: {
    outputModule: true,
  },
}
