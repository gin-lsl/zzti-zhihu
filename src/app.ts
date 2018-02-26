import * as Debug from 'debug';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as Router from 'koa-router';
import * as Cors from '@koa/cors';
import * as KoaSend from 'koa-send';
import routes from './routes';
import { mongo, AppConfig } from './config/index';
import { NextCallback } from './types/index';
import { RequestResultUtil, ErrorCodeEnum } from './apiStatus/index';

const debug = Debug('zzti-zhihu:app');

// 跨域配置
const cors = Cors({
  origin: '*',
  allowMethods: '*',
  allowHeaders: ['content-type', 'authorization', '*'],
});

// 连接MongoDB数据库
mongo();

const app = new Koa();
const router = new Router();

// 打印日志
app.use(async (ctx: Koa.Context, next: NextCallback) => {
  debug('Resolve Request: ', ctx.path);
  await next();
});

// 处理全局错误
app.use(async (ctx: Koa.Context, next: NextCallback) => {
  try {
    await next();
  } catch (error) {
    debug('UNDEFINED ERROR: %O', error);
    ctx.body = RequestResultUtil.createError(ErrorCodeEnum.UNDEFINED_ERROR);
  }
});

// 跨域
app.use(cors);

// 静态资源
// app.use(async (ctx) => {
//   await KoaSend(ctx, ctx.path, {
//     root: AppConfig.STATIC_PATH,
//   });
// });

// 请求体解析
app.use(bodyParser());

// 路由
app.use(routes.routes());

// 启动服务器
app.listen(3000, () => {
  console.log('server listening 3000');
});
