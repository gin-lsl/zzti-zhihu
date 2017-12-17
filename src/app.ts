import * as Debug from 'debug';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as Router from 'koa-router';
import routes from './routes';
import * as Cors from '@koa/cors';
import { mongo } from './config/MongoConnection';
const debug = Debug('zzti-zhihu:app');
const cors = Cors({
  allowHeaders: '*',
  allowMethods: '*'
});

mongo();

const app = new Koa();
const router = new Router();

app.use(cors);

app.use(bodyParser());

app.use(async (ctx, next) => {
  debug('进入处理');
  debug('body: %O', ctx.request.body);
  await next();
  // ctx.body = {
  //   success: true,
  //   msg: '成功'
  // };
});

// router.use('/users', userRouter.routes());

// app.use(router.routes());
app.use(routes.routes());

app.listen(3000, () => {
  console.log('server listening 3000');
});
