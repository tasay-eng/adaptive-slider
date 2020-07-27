const path = require('path')
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
module.exports = {
  entry: {
    app: './src/app.ts'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './docs'),
    publicPath: './'
  },
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: './docs',
    hot: true,
    stats: 'errors-only',
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.ts?$/,
        use: ['ts-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
            {loader: 'style-loader',
            },
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
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.SourceMapDevToolPlugin({}),
    new webpack.HotModuleReplacementPlugin(),
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