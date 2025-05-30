const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
require('dotenv').config(); // Loads .env into process.env

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    entry: './src/index.jsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
      publicPath: '/',
      clean: true // This replaces the rm -rf dist command
    },
    optimization: {
      minimize: isProduction
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-react']
            }
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public/index.html'),
        filename: 'index.html',
        inject: true
      }),
      new CopyPlugin({
        patterns: [
          { 
            from: 'public',
            to: '.',
            globOptions: {
              ignore: ['**/index.html']
            }
          }
        ]
      }),
      new webpack.DefinePlugin({
        'process.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL),
        'process.env.SUPABASE_KEY': JSON.stringify(process.env.SUPABASE_KEY),
      })
    ],
    resolve: {
      extensions: ['.js', '.jsx']
    },
    devServer: {
      static: {
        directory: path.join(__dirname, '/'),
      },
      port: 3001,
      hot: false,
      liveReload: false,
      historyApiFallback: true,
      proxy: {
        '/flags': {
          target: 'https://flagcdn.com',
          changeOrigin: true,
          pathRewrite: {
            '^/flags': ''
          }
        }
      }
    }
  };
};
