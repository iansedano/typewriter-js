import { getBabelOutputPlugin } from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import path from "path";
import analyze from "rollup-plugin-analyzer";
import gzipPlugin from "rollup-plugin-gzip";
import includePaths from "rollup-plugin-includepaths";
import typescript from "@rollup/plugin-typescript";

const INCLUDED_FILE_EXTENSIONS = [".js", ".ts"];
const JS_ROOT = "./src";
const INPUT_FILE = "index.ts";
const NAME = "typewriter";

const inputFilePath = path.join(JS_ROOT, INPUT_FILE);
const isProduction = process.env.NODE_ENV === "production";
const includePathOptions = {
  paths: [JS_ROOT],
  extensions: INCLUDED_FILE_EXTENSIONS,
};

const outputPlugins = [
  isProduction && terser(),
  isProduction && gzipPlugin(),
].filter(Boolean);

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: inputFilePath,
  treeshake: "recommended",
  plugins: [
    includePaths(includePathOptions),
    typescript({ tsconfig: "./tsconfig.json" }),
    !isProduction && analyze({ summaryOnly: true }),
  ],
  output: [
    {
      file: `dist/${NAME}-babel-iife.js`,
      format: "iife",
      plugins: [
        ...outputPlugins,
        getBabelOutputPlugin({
          presets: ["@babel/preset-env"],
          allowAllFormats: true,
        }),
      ],
      sourcemap: true,
      name: NAME[0].toUpperCase() + NAME.slice(1),
    },
    {
      file: `dist/${NAME}-babel.mjs`,
      format: "es",
      plugins: [
        ...outputPlugins,
        getBabelOutputPlugin({
          presets: ["@babel/preset-env"],
        }),
      ],
      sourcemap: true,
    },
    {
      file: `dist/${NAME}-iife.js`,
      format: "iife",
      plugins: outputPlugins,
      sourcemap: true,
      name: NAME[0].toUpperCase() + NAME.slice(1),
    },
    {
      file: `dist/${NAME}.mjs`,
      format: "es",
      plugins: outputPlugins,
      sourcemap: true,
    },
  ],
};

export default config;
