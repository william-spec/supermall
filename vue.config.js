module.exports = {
  publicPath: './',   //所有的资源都会被链接为相对路径，这样打出来的包可以被部署在任意路径，相当于静态资源的目录
  outputDir: 'dist',  //默认就是dist
  devServer: {
    port: 8889,   //打开的端口号
    open: true    //运行后自动打开浏览器
  }
}