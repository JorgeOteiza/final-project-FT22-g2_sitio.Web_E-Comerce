const webpack = require('webpack');
const path = require('path');
const os = require('os');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  cache: {
    type: 'filesystem',
    cacheDirectory: path.join(
      process.env.LOCALAPPDATA || os.tmpdir(),
      'el-rincon-del-vino',
      'webpack-cache'
    ),
    buildDependencies: {
      config: [__filename]
    }
  },
  entry: [
    './src/front/js/index.js'
  ],
  output: {
    filename: 'bundle.js',
    chunkFilename: '[name].[contenthash:8].js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/'
  },
  module: {
    rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader']
        },
        {
          test: /\.(css|scss)$/, use: [{
              loader: MiniCssExtractPlugin.loader
          }, {
              loader: "css-loader" // translates CSS into CommonJS
          }]
        }, //css only files
        {
          test: /\.(png|svg|jpg|gif|jpeg|webp)$/, use: {
            loader: 'file-loader',
            options: { name: '[name].[ext]' }
          }
        }, //for images
        {
          test: /\.(woff2?|ttf|eot)(\?.*)?$/i,
          type: 'asset/resource',
          generator: { filename: 'fonts/[name][ext]' }
        }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  plugins: [
    new HtmlWebpackPlugin({
        favicon: '4geeks.ico',
        template: 'template.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'styles.[contenthash:8].css',
      chunkFilename: '[name].[contenthash:8].css'
    }),
    new Dotenv({ safe: './.env.frontend.example', systemvars: true })
  ]
};
