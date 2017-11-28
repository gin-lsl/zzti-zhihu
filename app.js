const Koa = require('koa');
const router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const debug = require('debug')('zzti-zhihu:app');

const app = new Koa();

app.use(bodyParser());

app.use(async (ctx, next) => {
  debug('调用前');
  await next();
  debug('返回数据: %O', ctx.request.body);
  ctx.body = {
    success: true,
    msg: '成功'
  }
});

app.listen(3000, () => {
  console.log('Server listening on 3000');
});
