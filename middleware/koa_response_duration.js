//计算服务器消耗时长
module.exports = async (context, next) => {
  const start = Date.now();
  await next();
  const end = Date.now();
  const duration = end - start;
  context.set('My-Response-Time', duration + 'ms');
}