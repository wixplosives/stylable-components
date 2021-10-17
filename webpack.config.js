// @ts-check

const { StylableWebpackPlugin } = require('@stylable/webpack-plugin');

/** @type import('webpack').Configuration */
module.exports = {
  devtool: 'source-map',
  context: __dirname,
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        loader: 'source-map-loader',
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset',
      },
    ],
  },
  plugins: [
    new StylableWebpackPlugin({
      extractMode: 'entries',
      filename: '[name].css',
    }),
  ],
};
