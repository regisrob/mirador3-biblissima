const path = require('path');
const webpack = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

//module.exports = {
const baseConfig = mode => ({
  entry: './src/index.js',
  module: {
   rules: [
     {
       test: /\.jsx?$/,
       exclude: /node_modules/,
       loader: "babel-loader"
     },
     {
       test: /\.css$/,
       use: [
         'style-loader',
         'css-loader',
       ],
     },
   ],
  },
  output: {
    filename: 'index.min.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
  },
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /@blueprintjs\/(core|icons)/, // ignore optional UI framework dependencies
    }),
  ],
  resolve: {
    alias: {
      '@material-ui/core': path.resolve('./', 'node_modules', '@material-ui/core'),
      '@material-ui/styles': path.resolve('./', 'node_modules', '@material-ui/styles'),
      react: path.resolve('./', 'node_modules', 'react'),
      'react-dom': path.resolve('./', 'node_modules', 'react-dom'),
    },
    extensions: [".jsx", ".js"]
  }
});

module.exports = (env, options) => {
  const isProduction = options.mode === 'production';
  const config = baseConfig(options.mode);

  if (isProduction) {
    return {
      ...config,
      devtool: 'source-map',
      mode: 'production',
      plugins: [
        ...(config.plugins || []),
        new webpack.optimize.LimitChunkCountPlugin({
          maxChunks: 1,
        }),
      ],
    };
  }

  return {
    ...config,
    devServer: {
      contentBase: './demo',
      hot: true,
      port: 4444,
    },
    devtool: 'eval-source-map',
    mode: 'development',
    plugins: [
      ...(config.plugins || []),
      new ReactRefreshWebpackPlugin(),
    ],
  };
};
