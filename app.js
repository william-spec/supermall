const Koa = require('koa');
const app = new Koa();
const https = require('https')
const fs = require('fs')
const sslify = require('koa-sslify').default
const duration = require('./middleware/koa_response_duration');
const header = require('./middleware/koa_response_header');
const data = require('./middleware/koa_response_data');


app.use(duration);
app.use(header);
app.use(data);
//使用http方式
app.listen(8888, () => {console.log('启动成功，访问"localhost:8888"');})

//使用https 

//app.use(sslify())   //可以强制将http转化成https

//注意证书时效问题 
//由于该后端需要放在服务器上运行，所以共享服务器的域名或ip地址，并且ssl证书只能绑定一个域名或者ip地址，所以此处需要使用与服务器相同的SSL证书
//当该后端运行于非使用该SSL服务器下时，会提示https无效，因为SSL证书只能绑定一个域名或ip地址，被绑定在使用该SSL的服务器上
// let options = {
//   key: fs.readFileSync('./sslCertification/private.key'),  //私钥文件路径
//   cert: fs.readFileSync('./sslCertification/certificateAndca_bundle.crt')  //证书文件路径
// };
// https.createServer(options, app.callback()).listen(8888, () => {
//   console.log(`server running success at 8888`)
// });