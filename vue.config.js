const CompressionWebpackPlugin = require('compression-webpack-plugin')


module.exports = {
  publicPath: './',   //所有的资源都会被链接为相对路径，这样打出来的包可以被部署在任意路径，相当于静态资源的目录
  productionSourceMap: false,
  devServer: {
    port: 8889,   //打开的端口号
    open: true,    //运行后自动打开浏览器
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      return {
        mode: 'production',
        optimization: {
          splitChunks: {
            minSize: 2 * 1024,   //小于该大小的不进行分割
            maxSize: 0,   //最大大小没有上线
            minChunks: 1,   //至少被引用一次才被分割
            cacheGroups: {
              vendors: {
                name: 'vendors',
                test: /[\\/]node_modules[\\/]/,
                priority: -10,
                chunks: 'initial'
              },
              common: {
                name: 'common',
                minChunks: 2,
                priority: -20,
                chunks: 'initial',
                reuseExistingChunk: true
              }
            }
          },
        },
        plugins: [
          new CompressionWebpackPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.(js|json|css|jp?eg|png)$/,
            // 当资源大于该值时进行压缩
            threshold: 0,
            // 压缩率小于这个值的资源会被压缩，默认为 0.8
            // minRatio: 0.8,
            minRatio: 1,
            // 删除源文件, 配合webpack-bundle-analyzer时不能删除源文件，且需要配置静态服务器
            deleteOriginalAssets: true
          }),
        ],
        
      }
    }
  },
  
}