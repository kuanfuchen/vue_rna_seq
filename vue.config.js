const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  // transpileDependencies: true,
  publicPath: './',
  // publicPath:"./",
  // runtimeCompiler: true,
  // devServer: {
  //   proxy:{
  //     '/api':{
  //       target:'http://localhost:8080',
  //       ws:true,
  //       changeOrigin:true,
  //       pathRewrite:{
  //         '^/api':'data'
  //       }
  //     }
  //   }
  // //   watchOptions: {
  // //     ignored: ['node_modules', 'public'],
  // //   }
  // },
  chainWebpack: config => {
    // 配置 raw-loader
    config.module
      .rule('txt')
      // .test(/\.txt$/)
      .test(/\.(txt|tsv)$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end();
  }
})

