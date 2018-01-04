import { Context } from 'koa';
import * as Debug from 'debug';
import * as Router from 'koa-router';
import { UserController } from '../controllers/UserController';
const router = new Router();
const debug = Debug('zzti-zhihu:routes:user');

const index = async (ctx: Context, next: () => Promise<any>) => {
  debug('用户首页');
  await next();
  ctx.body = {
    success: true,
    msg: '测试消息'
  };
};

/**
 * 登录
 *
 * @param ctx 上下文
 * @param next 中间件
 */
const login = async (ctx: Context, next: () => Promise<any>) => {

  await next();
};

/**
 * 注册
 *
 * @param ctx 上下文
 * @param next 中间件
 */
const logon = async (ctx: Context, next: () => Promise<any>) => {
  await next();
};

router.get('/active', UserController.activeAccount);
router.get('/testjwt', UserController.verifyJwt, async (ctx, next) => {
  ctx.body = ctx.state;
});
router.get('/:id', UserController.get);

router.post('/login', UserController.login);
router.post('/logon', UserController.logon);
router.post('/follow/:id', UserController.verifyJwt, UserController.follow);
router.post('/cancel-follow/:id', UserController.verifyJwt, UserController.cancelFollow);

export default router;
