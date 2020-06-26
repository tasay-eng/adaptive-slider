const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  entry: {
    app: './src/app.ts'
  },
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
             MiniCssExtractPlugin.loader,
            {loader: 'css-loader',
            },
            {loader: 'postcss-loader',
              options: { config: { path: 'postcss.config.js' } }
            },
            {loader: 'less-loader'}
          ]
      },
      {
        test: /\.pug$/,
        exclude: /node_modules/,
        use:  [
            { loader: 'pug-loader',
              options: {
                javascriptEnabled: true
                }
            }
        ]
      }
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './dist'),
    publicPath: './'
  },
  devServer: {
    overlay: true,
    stats: 'errors-only'
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: false,
      template: './src/modules/fsd-slider.pug',
      filename: 'index.html',
      chunks: ['app']
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunks: ['app']
    }),
  ]
}