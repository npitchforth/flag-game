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
        'process.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL || ''),
        'process.env.SUPABASE_KEY': JSON.stringify(process.env.SUPABASE_KEY || ''),
        'process.env.FIREBASE_API_KEY': JSON.stringify(process.env.FIREBASE_API_KEY || ''),
        'process.env.FIREBASE_AUTH_DOMAIN': JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN || ''),
        'process.env.FIREBASE_PROJECT_ID': JSON.stringify(process.env.FIREBASE_PROJECT_ID || ''),
        'process.env.FIREBASE_STORAGE_BUCKET': JSON.stringify(process.env.FIREBASE_STORAGE_BUCKET || ''),
        'process.env.FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(process.env.FIREBASE_MESSAGING_SENDER_ID || ''),
        'process.env.FIREBASE_APP_ID': JSON.stringify(process.env.FIREBASE_APP_ID || ''),
        'process.env.FIREBASE_MEASUREMENT_ID': JSON.stringify(process.env.FIREBASE_MEASUREMENT_ID || ''),
      })
    ],
    resolve: {
      extensions: ['.js', '.jsx']
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      compress: true,
      port: 3000,
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
    },
    // Add fallbacks for Node.js modules that might not be available in the browser
    resolve: {
      extensions: ['.js', '.jsx'],
      fallback: {
        "fs": false,
        "path": require.resolve("path-browserify"),
        "os": false
      }
    }
  };
};
