const path = require('path');
const webpack = require('webpack');
require('dotenv').config({ path: './.env' }); 

const appDirectory = path.resolve(__dirname, './');

const { TamaguiPlugin } = require('tamagui-loader');

module.exports = {
  mode: 'development', // todo: make this read from .env
  entry: [
    // load any web API polyfills
    // path.resolve(appDirectory, 'polyfills-web.js'),
    // your web-specific entry file
    path.resolve(appDirectory, '/src/index.tsx')
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        // Add every directory that needs to be compiled by Babel during the build.
        include: [
          path.resolve(appDirectory, 'index.tsx'),
          path.resolve(appDirectory, 'src'),
          path.resolve(appDirectory, 'node_modules/react-native-uncompiled'),
            /node_modules(.*[/\\])+react\//,
            /node_modules(.*[/\\])+react-native/,
            /node_modules(.*[/\\])+react-freeze/,
            /node_modules(.*[/\\])+@react-native/,
            /node_modules(.*[/\\])+@react-navigation/,
            /node_modules(.*[/\\])+@react-native-community/,
            /node_modules(.*[/\\])+@expo/,
        ],
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: [
              //'@babel/preset-env',
              '@babel/preset-react'
            ],
            // Re-write paths to import only the modules needed by the app
            plugins: ['react-native-web'],
          }
        }
      },
      {
        test: /\.(gif|jpe?g|png|svg)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name].[ext]',
            esModule: false,
          }
        }
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.tsx?$/,
        loader: 'esbuild-loader',
        options: {
          loader: "tsx",
          tsconfig: 'tsconfig.webpack.json'
        }
      },
      { test: /\.([cm]?ts|tsx)$/, loader: "ts-loader" },
      /*{
        test: /\.[jt]sx?$/,
        // you'll likely want to adjust this helper function,
        // but it serves as a decent start that you can copy/paste from
        exclude: path => shouldExclude(path, __dirname, tamaguiOptions),
        use: [
          // optionally thread-loader for significantly faster compile!
          'thread-loader',

          // works nicely alongside esbuild
          {
            loader: 'esbuild-loader',
          },

          {
            loader: 'tamagui-loader',
            options: tamaguiOptions,
          },
        ]
      }*/
    ]
  },

  resolve: {
    // This will only alias the exact import "react-native"
    alias: {
      //'react-native$': 'react-native-web'
      //'react-native': path.join(__dirname, 'node_modules/react-native'),
    },
    // If you're working on a multi-platform React Native app, web-specific
    // module implementations should be written in files using the extension
    // `.web.js`.
    extensions: [ '.web.js', '.js', '.tsx', '.ts' ],
    extensionAlias: {
      ".js": [".js", ".ts"],
      ".cjs": [".cjs", ".cts"],
      ".mjs": [".mjs", ".mts"]
     },
  },
  plugins: [
    new webpack.ProvidePlugin({
      //process: "process/browser",
    }),
    new webpack.DefinePlugin({
      'process': JSON.stringify(true),
      'process.env': {

      },
      "__DEV__": true
    }),
    new TamaguiPlugin({
      config: './tamagui.config.ts',
      components: ['tamagui'],
      importsWhitelist: ['constants.js', 'colors.js'],
      logTimings: true,
      disableExtraction: process.env.NODE_ENV === 'development',
    }),
  ],
  output: {
    filename: 'bundle.web.js',
    path: path.resolve(appDirectory, '../public/dist')
  },
}