import * as Debug from 'debug';
const debug = Debug('zzti-zhihu:app');
import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';

const app = new Koa();
const router = new Router();

app.use(bodyParser());

app.use(async (ctx, next) => {
  debug('进入处理');
  debug('body: %O', ctx.request.body);
  await next();
  ctx.body = {
    success: true,
    msg: '成功'
  };
});

app.listen(3000, () => {
  console.log('server listening 3000');
});
