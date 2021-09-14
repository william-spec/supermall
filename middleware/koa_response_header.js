module.exports = async (context, next) => {
  const contentType = 'application/json; charset=utf-8';
  context.set('Content-Type', contentType);
  context.set('Access-Control-Allow-Origin', '*');
  context.set('Access-Control-Allow-Methods', '*');
  await next();
}