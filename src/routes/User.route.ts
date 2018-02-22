import { Context } from 'koa';
import * as Debug from 'debug';
import * as Router from 'koa-router';
import { UserController } from '../controllers/index';
import { verifyObjectIdMiddleware } from '../middleware/index';
const router = new Router();
const debug = Debug('zzti-zhihu:routes:user');

router.get('/active', UserController.activeAccount);
router.get('/follow/:id', verifyObjectIdMiddleware, UserController.verifyJwt, UserController.follow);
router.get('/cancel-follow/:id', verifyObjectIdMiddleware, UserController.verifyJwt, UserController.cancelFollow);
// router.get('/testjwt', UserController.verifyJwt, async (ctx, next) => {
//   ctx.body = ctx.state;
// });
router.get('/:id', verifyObjectIdMiddleware, UserController.get);

router.post('/signin', UserController.signIn);
router.post('/signon', UserController.signOn);
router.post('/init', UserController.initUser);
router.post('/modify', UserController.verifyJwt, UserController.modifyUser);

export default router;
