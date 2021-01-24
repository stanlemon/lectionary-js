const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const env = process.env.NODE_ENV;
const publicPath = process.env.PUBLIC_PATH || "/";
const isProduction = env === "production";

module.exports = {
  mode: env || "development",
  devtool: isProduction ? "source-map" : "inline-source-map",
  entry: ["./app/App.jsx"],
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath,
  },
  devServer: {
    hot: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.([j|t]s)x?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  resolve: {
    // Enable webpack to find files without these extensions
    extensions: [".jsx", ".js"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      minify: false,
      template: path.resolve(__dirname, "app", "index.html"),
    }),
    new webpack.DefinePlugin({
      PUBLIC_PATH: JSON.stringify(publicPath),
    }),
  ],
};
