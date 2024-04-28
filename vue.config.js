const path = require("path");
const { defineConfig } = require("@vue/cli-service");
const ImageminPlugin = require("imagemin-webpack-plugin").default;
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const AutoImport = require("unplugin-auto-import/webpack");
const Components = require('unplugin-vue-components/webpack')
const {ElementPlusResolver} = require('unplugin-vue-components/resolvers')
const Icons = require('unplugin-icons/webpack')
const IconsResolver = require('unplugin-icons/resolver')

const mode = process.env.NODE_ENV || "development";
const devMode = mode === "development";
const target = devMode ? "web" : "browserslist";
const devtool = devMode ? "source-map" : undefined;

module.exports = defineConfig({
  publicPath: "/rol-shop/",
  transpileDependencies: true,
  devServer: {
    port: 8000,
    hot: true,
    allowedHosts: "all",
  },
  configureWebpack: {
    output: {
      path: path.resolve(__dirname, "dist"),
    },
    plugins: [
      require("unplugin-vue-components/webpack").default({
        /* options */
      }),
      require("unplugin-auto-import/webpack").default({
        /* options */
      }),
      require("unplugin-icons/webpack").default({
        /* options */
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(woff2?|ttf|eot)(\?v=\w+)?$/,
          type: "asset/resource",
          generator: {
            filename: "assets/fonts/[name][ext][query]",
          },
        },
        {
          test: /\.(jpe?g|png|webp|gif|svg)$/i,
          use: [
            {
              loader: "image-webpack-loader",
              options: {
                mozjpeg: {
                  progressive: true,
                },
                // optipng.enabled: false will disable optipng
                optipng: {
                  enabled: false,
                },
                pngquant: {
                  quality: [0.65, 0.9],
                  speed: 4,
                },
                gifsicle: {
                  interlaced: false,
                },
                // the webp option will enable WEBP
                webp: {
                  quality: 75,
                },
              },
            },
          ],
          type: "asset/resource",
          generator: {
            filename: "assets/img/[name][ext]",
          },
        },
      ],
    },
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "~@/style/var.scss";`,
      },
    },
  },
});
