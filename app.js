const Koa = require('koa');
const app = new Koa();
const duration = require('./middleware/koa_response_duration');
const header = require('./middleware/koa_response_header');
const data = require('./middleware/koa_response_data');
app.use(duration);
app.use(header);
app.use(data);
app.listen(8888, () => {console.log('启动成功，访问"localhost:8888"');})