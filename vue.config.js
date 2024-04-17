const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  // transpileDependencies: true,
  publicPath: './',
  // publicPath:"./",
  // runtimeCompiler: true,
  // devServer: {
  //   watchOptions: {
  //     ignored: ['node_modules', 'public'],
  //   }
  // },
  chainWebpack: config => {
    // 配置 raw-loader
    config.module
      .rule('txt')
      .test(/\.txt$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end();
  }
})

