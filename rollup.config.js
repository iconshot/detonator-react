const resolve = require("@rollup/plugin-node-resolve");
const { babel } = require("@rollup/plugin-babel");
const typescript = require("rollup-plugin-typescript2");
const commonjs = require("@rollup/plugin-commonjs");

const package = require("./package.json");

module.exports = {
  input: "./index.js",
  output: [{ file: "dist/index.js", format: "es" }],
  external: Object.keys(package.peerDependencies),
  plugins: [
    resolve(),
    typescript(),
    babel(),
    commonjs({ include: /node_modules/, requireReturnsDefault: "auto" }),
  ],
};
