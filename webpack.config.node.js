const path = require('path')
const webpack = require('webpack')

process.env.GECTU_IS_BROWSER = '0'

const cjsConfig = {
  mode: 'production',
  target: 'node14',
  devtool: 'source-map',
  entry: {
    cjs: {
      import: './dist/cjs/index',
      library: {
        type: 'commonjs',
      },
    },
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'ge-commercetools-utils-node.[name].js',
  },
  plugins: [new webpack.EnvironmentPlugin(['GECTU_IS_BROWSER'])],
}

const esmConfig = {
  mode: 'production',
  target: 'node14',
  entry: {
    esm: {
      import: './dist/esm/index',
      library: {
        type: 'module',
      },
    },
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'ge-commercetools-utils-node.[name].js',
  },
  plugins: [new webpack.EnvironmentPlugin(['GECTU_IS_BROWSER'])],
  experiments: {
    outputModule: true,
  },
}

module.exports = [cjsConfig, esmConfig]
