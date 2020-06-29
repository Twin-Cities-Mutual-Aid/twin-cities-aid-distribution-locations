module.exports = {
  plugins: ["@snowpack/plugin-babel", "@snowpack/plugin-webpack", "@snowpack/plugin-dotenv"],
  install: [
    "list.js/dist/list.min.js"
  ],
  buildOptions: {
    baseUrl: "/"
  },
  scripts: {
    "build:js,jsx": "@snowpack/plugin-babel",
    "mount:public": "mount public --to /",
    "mount:list": "mount web_modules/list.js/dist --to /js",
    "mount:web_modules": "mount web_modules",
    "mount:src": "mount src --to /_dist_",
    "bundle:*": "@snowpack/plugin-webpack"
  },
  installOptions: {
    rollup: {
      plugins: [
        require('rollup-plugin-node-polyfills')()
      ]
    }
  }
}