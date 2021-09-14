// 处理业务逻辑中间件，读取某个json文件的数据

const path = require('path')
const fileUtils = require('../utils/file_utils')

module.exports = async (context, next) => {
  const url = context.request.url
  let filePath = url.replace('/api', '')
  filePath = `../data${filePath}`
  filePath = path.join(__dirname, filePath)

  try {
    const result = await fileUtils.getFileJsonData(filePath)
    context.response.body = result;
  } catch (error) {
    const errorMsg = {
      message: '读取文件内容失败,资源不存在',
      status: '404'
    }
    console.log('请求失败：',errorMsg);
    context.response.body = JSON.stringify(errorMsg)
  }
  
  await next()
}