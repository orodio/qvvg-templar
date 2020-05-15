import minify from "rollup-plugin-babel-minify"

export default [
  {
    input: "src/templar.js",
    output: [
      {
        file: "dist/templar.cjs.js",
        format: "cjs",
      },
      {
        file: "dist/templar.js",
        format: "esm",
      },
    ],
  },
  {
    input: "src/templar.js",
    plugins: [minify({comments: false})],
    output: {
      file: "dist/templar.min.js",
      format: "esm",
    },
  },
]
