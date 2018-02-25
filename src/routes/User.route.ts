import { Context } from 'koa';
import * as Debug from 'debug';
import * as Router from 'koa-router';
import { UserController } from '../controllers/index';
import { verifyObjectIdMiddleware } from '../middleware/index';
import * as path from 'path';
import * as KoaMulter from 'koa-multer';
import { rename } from 'fs';
import { AppConfig } from '../config/index';
const router = new Router();
const debug = Debug('zzti-zhihu:routes:user');
import * as uuidv4 from 'uuid/v4';

const upload = KoaMulter({
  storage: KoaMulter.diskStorage({
    destination: (req, file, callback) => {
      callback(null, AppConfig.USER_AVATAR_PATH);
    },
    filename: (req, file, callback) => {
      callback(null, uuidv4().replace(/-/g, '') + file.originalname);
    }
  })
});

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
router.post('/modify-avatar', UserController.verifyJwt, upload.single('avatar'), UserController.modifyAvatar);

export default router;
