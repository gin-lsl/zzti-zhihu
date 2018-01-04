import * as Debug from 'debug';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as Router from 'koa-router';
import routes from './routes';
import * as Cors from '@koa/cors';
import { mongo } from './config/MongoConnection';
import { NextCallback } from './types/index';
import { RequestResultUtil, ErrorCodeEnum } from './apiStatus/index';

const debug = Debug('zzti-zhihu:app');

const cors = Cors({
  allowHeaders: '*',
  allowMethods: '*'
});

// 连接MongoDB数据库
mongo();

const app = new Koa();
const router = new Router();

// 处理全局错误
app.use(async (ctx: Koa.Context, next: NextCallback) => {
  try {
    await next();
  } catch (error) {
    debug('未知错误: %O', error);
    ctx.body = RequestResultUtil.createError(ErrorCodeEnum.UNDEFINED_ERROR);
  }
});

// 跨域
app.use(cors);

// 请求体解析
app.use(bodyParser());

// 路由
app.use(routes.routes());

// 启动服务器
app.listen(3000, () => {
  debug('server listening 3000');
});
