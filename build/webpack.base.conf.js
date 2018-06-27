'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')
const chalk = require('chalk')
//assets-webpack-plugin 需要安装依赖包 npm install assets-webpack-plugin --save-dev
const AssetsPlugin = require('assets-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})


let assetsPublicPath = config.dev.assetsPublicPath;
switch (process.env.NODE_ENV) {
  case 'production':
    assetsPublicPath = config.build.assetsPublicPath + "product/";
    break;
  case 'testing':
    assetsPublicPath = config.build.assetsPublicPath + "qa/";
    break;
  case 'stage':
    assetsPublicPath = config.build.assetsPublicPath + "stage/";
    break;
  default:
    assetsPublicPath = config.dev.assetsPublicPath;
    break;
}


module.exports = {
  context: path.resolve(__dirname, '../'),
  //设置多文件入口
  entry: utils.entries(),
  // 不打包的文件，key 为应用的第三方库的名称，value为在项目中起的别名
  externals: {
    jquery: "jQuery",
    vue: "Vue",
    vuex: "Vuex",
    axios: "axios",
    moment: "moment",
    bootstrap: "bootstrap"
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  plugins: [
    new AssetsPlugin({
      filename: 'webpack.assets.js',
      path: path.join(__dirname, '../dist'),
      processOutput: function (assets) {
        const fileMaps = JSON.stringify(assets);
        return fileMaps;
      }
    }),
    function () {
      this.plugin("done", function (stats) {
        if (stats.compilation.errors && stats.compilation.errors.length) {
          console.log(stats.compilation.errors);
          process.exit(1);
        }
      });
    }
  ]
}
