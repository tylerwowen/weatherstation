/**
 * Created by tylero on 3/25/17.
 */
module.exports = {
  entry: './public/javascripts/index.js',
  output: {
    path: __dirname + '/dist/public/javascripts',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  },
  devtool: "source-map"
};
