const Koa = require('koa')
const Router = require('@koa/router');
const app = new Koa()
const router = new Router();
// const COS = require('cos-nodejs-sdk-v5')
// const config = require('./config')
const { getBucketList } = require('./cosTools')

// const cos = new COS({
//   SecretId: config.SecretId,
//   SecretKey: config.SecretKey
// })

// app.use(async ctx => {
//   ctx.body = 'Hello World';
// });
router.get('/bucket-list', async (ctx, next) => {
  // const data = await cos.getService()
  // ctx.body = data
  // cos.getService(function (err, data) {
  //   console.log(data && data.Buckets);
  // });
  // return new Promise((resolve, reject) => {
  //   cos.getService(function (err, data) {
  //     if (err) { reject(() => { return err }) }
  //     else { resolve(() => {return data }) }
  //   })
  // })
  let data = await getBucketList()
  console.log(data)
  ctx.body = data
});

// cos.getService(function (err, data) {
//   console.log(data && data.Buckets);
// });

app
  .use(router.routes())
  .use(router.allowedMethods());

console.log('koa start...')
app.listen(3000);