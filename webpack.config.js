const path = require("path");

module.exports = {
  entry: {
    TypeWriter: "./typewriter.js",
  },
  mode: "production",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "typewriter.min.js",
  },
  plugins: [],
};
