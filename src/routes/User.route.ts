import { Context } from 'koa';
import * as Debug from 'debug';
import * as Router from 'koa-router';
import { UserController } from '../controllers/index';
import { verifyObjectIdMiddleware } from '../middleware/index';
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
router.get('/:id', verifyObjectIdMiddleware, UserController.get);

router.post('/signin', UserController.signIn);
router.post('/signon', UserController.signOn);
router.post('/follow/:id', verifyObjectIdMiddleware, UserController.verifyJwt, UserController.follow);
router.post('/cancel-follow/:id', verifyObjectIdMiddleware, UserController.verifyJwt, UserController.cancelFollow);

export default router;
