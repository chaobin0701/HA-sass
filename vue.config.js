"use strict";
const path = require("path");
const defaultSettings = require("./src/settings.js");

function resolve(dir) {
  return path.join(__dirname, dir);
}

const name = defaultSettings.title || "vue Admin Template"; // page title

const port = process.env.port || process.env.npm_config_port || 9528; // dev port

let cdn = { css: [], js: [] };
let externals = {};
const isProd = process.env.NODE_ENV === 'production' // 判断是否是生产环境
if (isProd) {
  // 只有生产环境才去排除
  cdn = {
    css: [
      // element-ui css
      "https://unpkg.com/element-ui/lib/theme-chalk/index.css", // 样式表
    ],
    js: [
      // vue must at first!
      "https://unpkg.com/vue/dist/vue.js", // vuejs
      // element-ui js
      "https://unpkg.com/element-ui/lib/index.js", // elementUI
      "https://cdn.jsdelivr.net/npm/xlsx@0.16.6/dist/jszip.min.js",
      "https://cdn.jsdelivr.net/npm/xlsx@0.16.6/dist/xlsx.full.min.js",
    ],
  };
  externals = {
    vue: "Vue",
    "element-ui": "ELEMENT",
    xlsx: "XLSX",
  };
}
module.exports = {
  publicPath: "/",
  outputDir: "dist",
  assetsDir: "static",
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    // 代理跨域的配置
    proxy: {
      "/api": {
        target: "http://ihrm-java.itheima.net/", // 跨域请求的地址,
        changeOrigin: true, // 只有这个值为true的情况下 才表示开启跨域
      },
    },
  },

  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        "@": resolve("src"),
      },
    },
    externals,
  },
  chainWebpack(config) {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin("preload").tap(() => [
      {
        rel: "preload",
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: "initial",
      },
    ]);
    // 注入cdn变量
    config.plugin("html").tap((args) => {
      args[0].cdn = cdn
      return args
    });
    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete("prefetch");

    // set svg-sprite-loader
    config.module.rule("svg").exclude.add(resolve("src/icons")).end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();

    config.when(process.env.NODE_ENV !== "development", (config) => {
      config
        .plugin("ScriptExtHtmlWebpackPlugin")
        .after("html")
        .use("script-ext-html-webpack-plugin", [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/,
          },
        ])
        .end();
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial", // only package third parties that are initially dependent
          },
          elementUI: {
            name: "chunk-elementUI", // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/, // in order to adapt to cnpm
          },
          commons: {
            name: "chunk-commons",
            test: resolve("src/components"), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      });
      // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
      config.optimization.runtimeChunk("single");
    });
  },
};
