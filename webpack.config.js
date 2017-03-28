/**
 * Created by tylero on 3/25/17.
 */
let path = require('path');

module.exports = {
  entry: ['whatwg-fetch', './public/javascripts/index.js'],
  output: {
    path: path.resolve(__dirname, './dist/javascripts'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|api|bin)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  devtool: "source-map"
};
