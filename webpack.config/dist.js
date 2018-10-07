const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: { index: __dirname + '/../src/index.js' },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    chunkFilename: '[name].redux-peach.js',
    publicPath: '/',
    library: 'reduxPeach',
    globalObject: 'this',
    libraryTarget: 'umd',
  },
  externals: [{ redux: 'redux' }],
  module: {
    rules: [
      {
        test: /\.(js)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-env'],
          plugins: [
            '@babel/plugin-transform-runtime',
            '@babel/plugin-syntax-dynamic-import',
          ],
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: path.join(__dirname, '..'),
    }),
    new UglifyJsPlugin(),
  ],
  resolve: {
    alias: {},
  },
}
