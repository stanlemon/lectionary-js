import webpack from "webpack";
import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";

const env = process.env.NODE_ENV;
const publicPath = process.env.PUBLIC_PATH || "/";
const isProduction = env === "production";

export default {
  mode: env || "development",
  devtool: isProduction ? "source-map" : "eval-source-map",
  entry: ["./app/App.jsx"],
  output: {
    path: path.resolve("./", "dist"),
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
      {
        test: /\.(jpg|png)$/,
        use: {
          loader: "url-loader",
        },
      },
    ],
  },
  resolve: {
    // Enable webpack to find files without these extensions
    extensions: [".jsx", ".js"],
  },
  plugins: [
    new webpack.DefinePlugin({
      PUBLIC_PATH: JSON.stringify(publicPath),
    }),
    new HtmlWebpackPlugin({
      minify: false,
      publicPath,
      filename: "index.html",
      template: path.resolve("./", "app", "index.html"),
    }),
    new HtmlWebpackPlugin({
      minify: false,
      inject: false,
      publicPath,
      filename: "404.html",
      template: path.resolve("./", "app", "404.html"),
    }),
  ],
};
